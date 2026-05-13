<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar />
      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">Transactions</h2>
          <p class="text-caption text-body">Your full transaction history</p>
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
          <p class="state-title">No transactions yet</p>
          <p class="state-sub">Your transactions will appear here.</p>
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
import { computed, onMounted } from 'vue'
import {
  Loader2, AlertCircle, ArrowLeftRight,
  ArrowDownLeft, ArrowUpRight,
  ChevronLeft, ChevronRight,
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
</script>

<style scoped src="../assets/styles/views/TransactionsPage.css" />
