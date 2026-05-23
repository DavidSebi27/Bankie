<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar />
      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">Transactions</h2>
          <p class="text-caption text-body">Your full transaction history</p>
        </div>

        <div class="filter-panel">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">From</label>
              <input type="date" v-model="localFilters.startDate" class="filter-input" />
            </div>
            <div class="filter-group">
              <label class="filter-label">To</label>
              <input type="date" v-model="localFilters.endDate" class="filter-input" />
            </div>
            <div class="filter-group">
              <label class="filter-label">Type</label>
              <select v-model="localFilters.type" class="filter-select filter-select-full">
                <option value="">All</option>
                <option value="TRANSFER">Transfer</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Min Amount</label>
              <input
                type="number"
                v-model="localFilters.minAmount"
                class="filter-input filter-num"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div class="filter-group">
              <label class="filter-label">Max Amount</label>
              <input
                type="number"
                v-model="localFilters.maxAmount"
                class="filter-input filter-num"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div class="filter-group filter-group-iban">
              <label class="filter-label">IBAN</label>
              <input
                type="text"
                v-model="localFilters.iban"
                class="filter-input"
                placeholder="NL00 BANK 0000 0000 00"
                @keyup.enter="applyFilters"
              />
            </div>
          </div>
          <div class="filter-actions">
            <button
              v-if="hasLocal || store.hasActiveFilters"
              class="filter-btn-reset"
              @click="resetFilters"
            >
              <X class="filter-icon" /> Reset
            </button>
            <button class="filter-btn-apply" @click="applyFilters" :disabled="store.loading">
              <SlidersHorizontal class="filter-icon" /> Apply
            </button>
          </div>
        </div>

        <div v-if="store.loading" class="state-box">
          <Loader2 class="state-icon state-spin" />
          <p class="state-title">Loading transactions…</p>
        </div>

        <div v-else-if="store.error" class="state-box">
          <AlertCircle class="state-icon" />
          <p class="state-title">Could not load transactions</p>
          <p class="state-sub">{{ store.error }}</p>
        </div>

        <div v-else-if="!store.transactions.length" class="state-box">
          <ArrowLeftRight class="state-icon" />
          <p class="state-title">No transactions found</p>
          <p class="state-sub">Try adjusting your filters or check back later.</p>
        </div>

        <div v-else class="tx-list">
          <div v-for="tx in store.transactions" :key="tx.id" class="tx-card">
            <div class="tx-icon-wrap" :class="iconClass(tx.type)">
              <component :is="txIcon(tx.type)" class="tx-type-icon" />
            </div>

            <div class="tx-details">
              <p class="tx-type">{{ txLabel(tx.type) }}</p>
              <template v-if="tx.type === 'TRANSFER'">
                <div class="tx-parties">
                  <div class="tx-party">
                    <span class="tx-party-name">{{ tx.fromName }}</span>
                    <span class="tx-party-iban">{{ formatIban(tx.fromIban) }}</span>
                  </div>
                  <span class="tx-party-sep">→</span>
                  <div class="tx-party">
                    <span class="tx-party-name">{{ tx.toName }}</span>
                    <span class="tx-party-iban">{{ formatIban(tx.toIban) }}</span>
                  </div>
                </div>
              </template>
              <p v-else class="tx-names">{{ tx.fromName }} · {{ tx.toName }}</p>
              <p class="tx-time">{{ formatTimestamp(tx.timestamp) }}</p>
            </div>

            <div class="tx-amount-wrap">
              <span class="tx-amount" :class="isIncoming(tx) ? 'incoming' : 'outgoing'">
                {{ isIncoming(tx) ? '+' : '−' }} {{ formatCurrency(tx.amount) }}
              </span>
              <span class="tx-currency">{{ tx.currency }}</span>
            </div>
          </div>
        </div>

        <div v-if="store.totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="store.isFirstPage" @click="store.prevPage()">
            <ChevronLeft class="page-icon" /> Prev
          </button>
          <span class="page-info">Page {{ store.page + 1 }} of {{ store.totalPages }}</span>
          <button class="page-btn" :disabled="store.isLastPage" @click="store.nextPage()">
            Next <ChevronRight class="page-icon" />
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import {
  Loader2, AlertCircle, ArrowLeftRight,
  ArrowDownLeft, ArrowUpRight,
  ChevronLeft, ChevronRight,
  SlidersHorizontal, X,
} from 'lucide-vue-next'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useTransactionStore } from '../stores/transactionStore'
import { useAccountStore } from '../stores/accountStore'
import { formatCurrency, formatIban } from '../composables/format'

const store = useTransactionStore()
const accountStore = useAccountStore()

onMounted(async () => {
  if (!accountStore.accounts.length) await accountStore.fetchAccounts()
  await store.fetchTransactions(0)
})

const ownIbans = computed(() => new Set(accountStore.accounts.map(a => a.iban)))

function isIncoming(tx) {
  if (tx.type === 'DEPOSIT') return true
  if (tx.type === 'WITHDRAWAL') return false
  return ownIbans.value.has(tx.toIban)
}

const txIcon = (type) => ({ TRANSFER: ArrowLeftRight, DEPOSIT: ArrowDownLeft, WITHDRAWAL: ArrowUpRight })[type] ?? ArrowLeftRight
const iconClass = (type) => ({ TRANSFER: 'icon-transfer', DEPOSIT: 'icon-deposit', WITHDRAWAL: 'icon-withdrawal' })[type] ?? 'icon-transfer'
const txLabel = (type) => ({ TRANSFER: 'Transfer', DEPOSIT: 'Deposit', WITHDRAWAL: 'Withdrawal' })[type] ?? type

function formatTimestamp(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

const localFilters = reactive({ ...store.filters })

const hasLocal = computed(() =>
  !!(localFilters.startDate || localFilters.endDate ||
     localFilters.type ||
     localFilters.minAmount !== '' || localFilters.maxAmount !== '' ||
     localFilters.iban))

function applyFilters() {
  store.applyFilters({ ...localFilters })
}

function resetFilters() {
  Object.assign(localFilters, { startDate: '', endDate: '', type: '', minAmount: '', maxAmount: '', iban: '' })
  store.resetFilters()
}

onUnmounted(() => store.resetFilters())
</script>

<style scoped src="../assets/styles/views/TransactionsPage.css" />
