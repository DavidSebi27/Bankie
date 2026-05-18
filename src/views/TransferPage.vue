<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar />
      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">Transfer</h2>
          <p class="text-caption text-body">Send money to another account</p>
        </div>

        <div class="search-card">
          <p class="section-label">Search by customer name</p>
          <div class="search-row">
            <input v-model="firstName" class="search-input" placeholder="First name" @keyup.enter="search" />
            <input v-model="lastName" class="search-input" placeholder="Last name" @keyup.enter="search" />
            <button class="search-btn" :disabled="!canSearch || accountStore.searchLoading" @click="search">
              <Loader2 v-if="accountStore.searchLoading" class="btn-icon spin" />
              <Search v-else class="btn-icon" />
              Search
            </button>
          </div>
        </div>

        <div v-if="ownAccounts.length > 1" class="search-card">
          <p class="section-label">Or transfer between my accounts</p>
          <div class="results-list">
            <div
              v-for="account in ownAccounts"
              :key="account.iban"
              class="result-card"
              :class="{ 'result-card--selected': selectedRecipientIban === account.iban && selectedRecipientName === 'My ' + account.type }"
              @click="selectRecipient(account.iban, 'My ' + account.type)"
            >
              <div class="result-icon-wrap">
                <PiggyBank v-if="account.type === 'SAVINGS'" class="result-icon" />
                <Wallet v-else class="result-icon" />
              </div>
              <div class="result-details">
                <p class="result-name">My {{ account.type.charAt(0) + account.type.slice(1).toLowerCase() }} account</p>
                <div class="iban-row">
                  <span class="iban-text">{{ formatIban(account.iban) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search loading -->
        <div v-if="accountStore.searchLoading" class="state-box">
          <Loader2 class="state-icon state-spin" />
          <p class="state-title">Searching…</p>
        </div>

        <!-- Search error -->
        <div v-else-if="accountStore.searchError" class="state-box">
          <AlertCircle class="state-icon" />
          <p class="state-title">Search failed</p>
          <p class="state-sub">{{ accountStore.searchError }}</p>
        </div>

        <!-- No results -->
        <div v-else-if="accountStore.searched && !accountStore.searchResults.length" class="state-box">
          <UserX class="state-icon" />
          <p class="state-title">No customers found</p>
          <p class="state-sub">Try a different first or last name.</p>
        </div>

        <!-- Search results -->
        <div v-else-if="accountStore.searchResults.length" class="results-list">
          <p class="section-label">Results ({{ accountStore.searchResults.length }})</p>
          <div
            v-for="(result, i) in accountStore.searchResults"
            :key="i"
            class="result-card"
            :class="{ 'result-card--selected': selectedRecipientIban === result.iban }"
            @click="selectRecipient(result.iban, result.firstName + ' ' + result.lastName)"
          >
            <div class="result-icon-wrap">
              <User class="result-icon" />
            </div>
            <div class="result-details">
              <p class="result-name">{{ result.firstName }} {{ result.lastName }}</p>
              <div class="iban-row">
                <span class="iban-text">{{ formatIban(result.iban) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedRecipientIban" class="search-card">
          <p class="section-label">Transfer details</p>

          <div class="transfer-form">
            <div class="form-group">
              <label class="form-label">From account</label>
              <select v-model="fromIban" class="search-input">
                <option disabled value="">Select your account</option>
                <option
                  v-for="account in ownAccounts"
                  :key="account.iban"
                  :value="account.iban"
                  :disabled="account.iban === selectedRecipientIban"
                >
                  {{ account.type.charAt(0) + account.type.slice(1).toLowerCase() }} — {{ formatIban(account.iban) }} ({{ formatCurrency(account.balance) }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">To</label>
              <input class="search-input" :value="formatIban(selectedRecipientIban)" readonly />
              <span class="form-hint">{{ selectedRecipientName }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Amount (EUR)</label>
              <input
                v-model="amount"
                type="number"
                min="0.01"
                step="0.01"
                class="search-input"
                placeholder="0.00"
              />
            </div>

            <div v-if="transferError" class="state-box state-box--inline">
              <AlertCircle class="state-icon state-icon--small" />
              <p class="state-sub">{{ transferError }}</p>
            </div>

            <div v-if="transferSuccess" class="state-box state-box--inline state-box--success">
              <CheckCircle class="state-icon state-icon--small" />
              <p class="state-sub">Transfer sent successfully!</p>
            </div>

            <div class="search-row">
              <button class="search-btn" :disabled="!canTransfer || transferLoading" @click="submitTransfer">
                <Loader2 v-if="transferLoading" class="btn-icon spin" />
                <Send v-else class="btn-icon" />
                Send
              </button>
              <button class="search-btn search-btn--ghost" @click="resetTransfer">Cancel</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search, Loader2, AlertCircle, User, UserX, Send, CheckCircle, PiggyBank, Wallet
} from 'lucide-vue-next'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useAccountStore } from '../stores/accountStore'
import { useAuthStore } from '../stores/authStore'
import { createTransfer } from '../api/transactions'
import { formatIban, formatCurrency } from '../composables/format'

const accountStore = useAccountStore()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')

const selectedRecipientIban = ref('')
const selectedRecipientName = ref('')
const fromIban = ref('')
const amount = ref('')
const transferLoading = ref(false)
const transferError = ref('')
const transferSuccess = ref(false)

const ownAccounts = computed(() => accountStore.accounts)

const canSearch = computed(() => firstName.value.trim() && lastName.value.trim())
const canTransfer = computed(() =>
  fromIban.value &&
  selectedRecipientIban.value &&
  fromIban.value !== selectedRecipientIban.value &&
  Number(amount.value) > 0
)

onMounted(() => accountStore.fetchAccounts())

async function search() {
  if (!canSearch.value) return
  resetTransfer()
  await accountStore.searchCustomers(firstName.value.trim(), lastName.value.trim())
}

function selectRecipient(iban, name) {
  selectedRecipientIban.value = iban
  selectedRecipientName.value = name
  fromIban.value = ''
  amount.value = ''
  transferError.value = ''
  transferSuccess.value = false
}

function resetTransfer() {
  selectedRecipientIban.value = ''
  selectedRecipientName.value = ''
  fromIban.value = ''
  amount.value = ''
  transferError.value = ''
  transferSuccess.value = false
}

async function submitTransfer() {
  if (!canTransfer.value) return
  transferLoading.value = true
  transferError.value = ''
  transferSuccess.value = false

  try {
    await createTransfer({
      fromIban: fromIban.value,
      toIban: selectedRecipientIban.value,
      amount: Number(amount.value)
    })
    transferSuccess.value = true
    amount.value = ''
    await accountStore.fetchAccounts()
  } catch (err) {
    transferError.value = err.response?.data?.message || 'Transfer failed. Please try again.'
  } finally {
    transferLoading.value = false
  }
}
</script>

<style scoped src="../assets/styles/views/TransferPage.css" />
