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
          <p class="section-label">Recipient details</p>

          <div class="form-group">
            <label class="form-label">IBAN</label>
            <input
              v-model="ibanInput"
              class="search-input"
              placeholder="NL00 BANK 0000 0000 00"
              autocomplete="off"
              @keyup.enter="verify"
            />
          </div>

          <div class="search-row">
            <div class="form-group" style="flex: 1">
              <label class="form-label">First name</label>
              <input v-model="firstName" class="search-input" placeholder="First name" @keyup.enter="verify" />
            </div>
            <div class="form-group" style="flex: 1">
              <label class="form-label">Last name</label>
              <input v-model="lastName" class="search-input" placeholder="Last name" @keyup.enter="verify" />
            </div>
          </div>

          <p class="form-hint" style="margin-top: 8px">
            We'll confirm the IBAN belongs to the name you entered before sending.
          </p>

          <div v-if="verifyError" class="state-box state-box--inline" style="margin-top: 12px">
            <AlertCircle class="state-icon state-icon--small" />
            <p class="state-sub">{{ verifyError }}</p>
          </div>

          <div class="search-row" style="margin-top: 12px">
            <button class="search-btn" :disabled="!canVerify || verifyLoading" @click="verify">
              <Loader2 v-if="verifyLoading" class="btn-icon spin" />
              <ArrowRight v-else class="btn-icon" />
              Continue
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
              <span class="form-hint">
                <CheckCircle class="form-hint-icon" />
                Verified: {{ selectedRecipientName }}
              </span>
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
  Loader2, AlertCircle, Send, CheckCircle, PiggyBank, Wallet, ArrowRight,
} from 'lucide-vue-next'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useAccountStore } from '../stores/accountStore'
import { createTransfer } from '../api/transactions'
import { verifyRecipient } from '../api/accounts'
import { formatIban, formatCurrency } from '../composables/format'

const accountStore = useAccountStore()

const ibanInput = ref('')
const firstName = ref('')
const lastName = ref('')
const verifyLoading = ref(false)
const verifyError = ref('')
const selectedRecipientIban = ref('')
const selectedRecipientName = ref('')
const fromIban = ref('')
const amount = ref('')
const transferLoading = ref(false)
const transferError = ref('')
const transferSuccess = ref(false)

const ownAccounts = computed(() => accountStore.accounts)

const canVerify = computed(() =>
  ibanInput.value.trim() && firstName.value.trim() && lastName.value.trim()
)
const canTransfer = computed(() =>
  fromIban.value &&
  selectedRecipientIban.value &&
  fromIban.value !== selectedRecipientIban.value &&
  Number(amount.value) > 0
)

onMounted(() => accountStore.fetchAccounts())

async function verify() {
  if (!canVerify.value) return
  const iban = ibanInput.value.replace(/\s/g, '').toUpperCase()

  verifyLoading.value = true
  verifyError.value = ''
  resetTransfer()

  try {
    const { data } = await verifyRecipient(iban, firstName.value.trim(), lastName.value.trim())
    selectRecipient(data.iban, `${data.firstName} ${data.lastName}`)
  } catch (err) {
    // Backend collapses all failure modes (wrong IBAN, wrong name, closed account)
    // into a 404 so we don't reveal which one was wrong.
    verifyError.value = err.response?.status === 404
      ? "We couldn't verify this recipient. Check the IBAN and the name on the account."
      : (err.response?.data?.message || 'Could not verify the recipient. Please try again.')
  } finally {
    verifyLoading.value = false
  }
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
