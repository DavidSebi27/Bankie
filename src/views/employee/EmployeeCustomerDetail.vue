<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="employeeStore.pendingUsers.length" />

      <main class="content">
        <RouterLink to="/employee/customers" class="back-link">
          <ArrowLeft class="back-icon" /> Back to customers
        </RouterLink>

        <div v-if="!customer && employeeStore.loading" class="state-box">
          <Loader2 class="state-icon spin" />
          <p class="state-title">Loading customer…</p>
        </div>

        <div v-else-if="!customer" class="state-box">
          <UserX class="state-icon" />
          <p class="state-title">Customer not available</p>
          <p class="state-sub">This customer is not visible to you.</p>
        </div>

        <template v-else>
          <div class="customer-card">
            <div class="user-avatar">{{ initials }}</div>
            <div class="customer-meta">
              <h2 class="customer-name">{{ customer.firstName }} {{ customer.lastName }}</h2>
              <p class="customer-email">{{ customer.email }}</p>

              <div class="meta-grid">
                <div v-if="customer.bsn" class="meta-line">
                  <Hash class="meta-icon" />
                  <span class="meta-key">BSN</span>
                  <span class="meta-val">{{ customer.bsn }}</span>
                </div>
                <div v-if="customer.phoneNumber" class="meta-line">
                  <Phone class="meta-icon" />
                  <span class="meta-key">Phone</span>
                  <span class="meta-val">{{ customer.phoneNumber }}</span>
                </div>
              </div>
            </div>
            <span class="status-badge" :class="customer.approved ? 'badge-approved' : 'badge-pending'">
              {{ customer.approved ? 'Approved' : 'Pending' }}
            </span>
          </div>

          <!-- Approve customer (only shown if not yet approved) -->
          <div v-if="!customer.approved" class="section-header">
            <h3 class="section-title">Approve Customer</h3>
            <p class="section-sub">Creates a checking and savings account for this customer.</p>
            <div class="limits-form">
              <label>Absolute Limit</label>
              <input v-model.number="approveForm.absoluteLimit" type="number" placeholder="e.g. 0" />
              <label>Daily Transfer Limit</label>
              <input v-model.number="approveForm.dailyTransferLimit" type="number" placeholder="e.g. 1000" />
              <button class="btn-approve" :disabled="approving" @click="handleApprove">
                {{ approving ? 'Approving…' : 'Approve & Create Accounts' }}
              </button>
              <p v-if="approveError" class="error-msg">{{ approveError }}</p>
              <p v-if="approveSuccess" class="success-msg">{{ approveSuccess }}</p>
            </div>
          </div>

          <!-- Accounts list with close / limit actions -->
          <div v-if="customer.approved" class="section-header">
            <h3 class="section-title">Accounts</h3>
            <p class="section-sub">Manage this customer's accounts.</p>

            <div v-if="accountsLoading" class="state-box">
              <Loader2 class="state-icon spin" />
            </div>

            <div v-else-if="accounts.length === 0" class="state-box">
              <p class="state-title">No accounts found.</p>
            </div>

            <div v-else class="accounts-list">
              <div v-for="acc in accounts" :key="acc.iban" class="account-row">
                <div class="account-info">
                  <p class="account-iban">{{ acc.iban }}</p>
                  <p class="account-type">{{ acc.type }} — {{ acc.status }}</p>
                  <p class="account-balance">Balance: €{{ acc.balance }}</p>
                  <p class="account-limits">
                    Absolute limit: €{{ acc.absoluteLimit }} &nbsp;|&nbsp;
                    Daily limit: €{{ acc.dailyTransferLimit }}
                  </p>
                </div>

                <div class="account-actions">
                  <!-- Set absolute limit -->
                  <div class="inline-action">
                    <input v-model.number="limitForms[acc.iban].absoluteLimit" type="number" placeholder="Absolute limit" />
                    <button @click="handleAbsoluteLimit(acc.iban)">Set</button>
                  </div>

                  <!-- Set daily limit -->
                  <div class="inline-action">
                    <input v-model.number="limitForms[acc.iban].dailyLimit" type="number" placeholder="Daily limit" />
                    <button @click="handleDailyLimit(acc.iban)">Set</button>
                  </div>

                  <!-- Close account -->
                  <button
                    v-if="acc.status !== 'CLOSED'"
                    class="btn-close"
                    @click="handleClose(acc.iban)"
                  >
                    Close Account
                  </button>
                  <span v-else class="badge-closed">Closed</span>
                </div>
              </div>
            </div>
            <p v-if="accountActionMsg" class="success-msg">{{ accountActionMsg }}</p>
            <p v-if="accountActionError" class="error-msg">{{ accountActionError }}</p>
          </div>

          <div class="section-header">
            <h3 class="section-title">Transactions</h3>
            <p class="section-sub">All transactions where this customer's IBAN is the source or destination.</p>
          </div>

          <TransactionsTable
            :items="items"
            :page="page"
            :total-pages="totalPages"
            :total-elements="totalElements"
            :first="first"
            :last="last"
            :loading="loading"
            :error="error"
            empty-title="No transactions to show"
            empty-subtitle="This customer has no visible transaction history."
            @refresh="fetch()"
            @go-to-page="goToPage"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, Hash, Phone, Loader2, UserX } from 'lucide-vue-next'
import { useEmployeeStore } from '../../stores/employeeStore'
import { useTransactionsList } from '../../composables/useTransactionsList'
import { getCustomerTransactions } from '../../api/transactions'
import { approveCustomer, closeAccount, updateAbsoluteLimit, updateDailyLimit } from '../../api/accounts'
import EmployeeSidebar from '../../components/employee/EmployeeSidebar.vue'
import TransactionsTable from '../../components/employee/TransactionsTable.vue'
import api from '../../api/axios'

const route         = useRoute()
const employeeStore = useEmployeeStore()
const customerId    = computed(() => route.params.id)

const customer = computed(() =>
  employeeStore.customers.find(u => String(u.id) === String(customerId.value))
)

const initials = computed(() => {
  const u = customer.value
  if (!u) return '?'
  return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()
})

// Approve
const approveForm    = reactive({ absoluteLimit: 0, dailyTransferLimit: 1000 })
const approving      = ref(false)
const approveError   = ref('')
const approveSuccess = ref('')

async function handleApprove() {
  approving.value    = true
  approveError.value = ''
  approveSuccess.value = ''
  try {
    await approveCustomer(customerId.value, approveForm.absoluteLimit, approveForm.dailyTransferLimit)
    approveSuccess.value = 'Customer approved and accounts created!'
    await employeeStore.fetchUsers()
    await fetchAccounts()
  } catch (e) {
    approveError.value = e.response?.data?.message || 'Failed to approve customer'
  } finally {
    approving.value = false
  }
}

// Accounts
const accounts        = ref([])
const accountsLoading = ref(false)
const limitForms      = reactive({})
const accountActionMsg   = ref('')
const accountActionError = ref('')

async function fetchAccounts() {
  if (!customer.value?.approved) return
  accountsLoading.value = true
  try {
    const res = await api.get('/accounts', { params: { size: 100 } })
    const all = res.data.content ?? res.data
    accounts.value = all.filter(a => String(a.userId) === String(customerId.value))
    accounts.value.forEach(a => {
      if (!limitForms[a.iban]) {
        limitForms[a.iban] = { absoluteLimit: a.absoluteLimit, dailyLimit: a.dailyTransferLimit }
      }
    })
  } finally {
    accountsLoading.value = false
  }
}

async function handleClose(iban) {
  accountActionMsg.value   = ''
  accountActionError.value = ''
  try {
    await closeAccount(iban)
    accountActionMsg.value = `Account ${iban} closed.`
    await fetchAccounts()
  } catch (e) {
    accountActionError.value = e.response?.data?.message || 'Failed to close account'
  }
}

async function handleAbsoluteLimit(iban) {
  accountActionMsg.value   = ''
  accountActionError.value = ''
  try {
    await updateAbsoluteLimit(iban, limitForms[iban].absoluteLimit)
    accountActionMsg.value = `Absolute limit updated for ${iban}.`
    await fetchAccounts()
  } catch (e) {
    accountActionError.value = e.response?.data?.message || 'Failed to update limit'
  }
}

async function handleDailyLimit(iban) {
  accountActionMsg.value   = ''
  accountActionError.value = ''
  try {
    await updateDailyLimit(iban, limitForms[iban].dailyLimit)
    accountActionMsg.value = `Daily limit updated for ${iban}.`
    await fetchAccounts()
  } catch (e) {
    accountActionError.value = e.response?.data?.message || 'Failed to update limit'
  }
}

// Transactions
const fetcher = (params) => getCustomerTransactions(customerId.value, params)
const { items, page, totalPages, totalElements, first, last, loading, error, fetch, goToPage, reset } = useTransactionsList(fetcher)

onMounted(() => {
  if (!employeeStore.users.length) employeeStore.fetchUsers()
  fetch()
  fetchAccounts()
})

watch(customerId, () => {
  reset()
  fetch()
  fetchAccounts()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeCustomerDetail.css" />