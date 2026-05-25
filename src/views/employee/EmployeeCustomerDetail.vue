<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="employeeStore.pendingUsers.length" />

      <main class="content">
        <RouterLink to="/employee/customers" class="back-link">
          <ArrowLeft class="back-icon" /> Back to customers
        </RouterLink>

        <!-- Confirmation Modal -->
        <div v-if="confirmModal.visible" class="modal-overlay" @click.self="confirmModal.visible = false">
          <div class="modal-box">
            <h3 class="modal-title">Close Account</h3>
            <p class="modal-body">
              Are you sure you want to close <strong>{{ confirmModal.iban }}</strong>?
              This cannot be undone.
            </p>
            <div class="modal-actions">
              <button class="btn-confirm-close" @click="confirmClose">Yes, close it</button>
              <button class="btn-cancel-modal" @click="confirmModal.visible = false">Cancel</button>
            </div>
          </div>
        </div>

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

          <!-- Approve -->
          <div v-if="!customer.approved" class="section-header">
            <h3 class="section-title">Approve Customer</h3>
            <p class="section-sub">Creates a checking and savings account for this customer.</p>
            <div class="limits-form">
              <label>Absolute Limit</label>
              <input v-model.number="accountMgmt.approveForm.absoluteLimit" type="number" placeholder="e.g. 0 or -500" />
              <label>Daily Transfer Limit</label>
              <input v-model.number="accountMgmt.approveForm.dailyTransferLimit" type="number" placeholder="e.g. 1000" />
              <p v-if="accountMgmt.approveValidationError" class="error-msg">{{ accountMgmt.approveValidationError }}</p>
              <button class="btn-approve" :disabled="accountMgmt.approving" @click="accountMgmt.handleApprove(customerId, employeeStore.fetchUsers)">
                {{ accountMgmt.approving ? 'Approving…' : 'Approve & Create Accounts' }}
              </button>
              <p v-if="accountMgmt.approveError" class="error-msg">{{ accountMgmt.approveError }}</p>
              <p v-if="accountMgmt.approveSuccess" class="success-msg">{{ accountMgmt.approveSuccess }}</p>
            </div>
          </div>

          <!-- Accounts -->
          <div v-if="customer.approved" class="section-header">
            <h3 class="section-title">Accounts</h3>
            <p class="section-sub">Manage this customer's accounts.</p>

            <div v-if="accountMgmt.accountsLoading" class="state-box">
              <Loader2 class="state-icon spin" />
            </div>

            <div v-else-if="accountMgmt.accountsError" class="state-box">
              <p class="state-title error-msg">{{ accountMgmt.accountsError }}</p>
            </div>

            <div v-else-if="accountMgmt.accounts.length === 0" class="state-box">
              <p class="state-title">No accounts found.</p>
            </div>

            <div v-else class="accounts-list">
              <div v-for="acc in accountMgmt.accounts" :key="acc.iban" class="account-row">
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
                  <div class="inline-action">
                    <input v-model.number="accountMgmt.limitForms[acc.iban].absoluteLimit" type="number" placeholder="Absolute limit" />
                    <button @click="accountMgmt.handleAbsoluteLimit(acc.iban, customerId)">Set</button>
                  </div>
                  <div class="inline-action">
                    <input v-model.number="accountMgmt.limitForms[acc.iban].dailyLimit" type="number" placeholder="Daily limit" />
                    <button @click="accountMgmt.handleDailyLimit(acc.iban, customerId)">Set</button>
                  </div>
                  <button v-if="acc.status !== 'CLOSED'" class="btn-close" @click="requestClose(acc.iban)">
                    Close Account
                  </button>
                  <span v-else class="badge-closed">Closed</span>
                </div>
              </div>
            </div>
            <p v-if="accountMgmt.accountActionMsg" class="success-msg">{{ accountMgmt.accountActionMsg }}</p>
            <p v-if="accountMgmt.accountActionError" class="error-msg">{{ accountMgmt.accountActionError }}</p>
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
            @refresh="fetchTransactions()"
            @go-to-page="goToPage"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, Hash, Phone, Loader2, UserX } from 'lucide-vue-next'
import { useEmployeeStore } from '../../stores/employeeStore'
import { useAccountManagementStore } from '../../stores/accountManagementStore'
import { useTransactionsList } from '../../composables/useTransactionsList'
import { getCustomerTransactions } from '../../api/transactions'
import EmployeeSidebar from '../../components/employee/EmployeeSidebar.vue'
import TransactionsTable from '../../components/employee/TransactionsTable.vue'

const route         = useRoute()
const employeeStore = useEmployeeStore()
const accountMgmt   = useAccountManagementStore()
const customerId    = computed(() => route.params.id)

const customer = computed(() =>
  employeeStore.customers.find(u => String(u.id) === String(customerId.value))
)

const initials = computed(() => {
  const u = customer.value
  if (!u) return '?'
  return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()
})

const confirmModal = reactive({ visible: false, iban: null })

function requestClose(iban) {
  confirmModal.iban = iban
  confirmModal.visible = true
}

function confirmClose() {
  confirmModal.visible = false
  accountMgmt.handleClose(confirmModal.iban, customerId.value)
}

const fetcher = (params) => getCustomerTransactions(customerId.value, params)
const { items, page, totalPages, totalElements, first, last, loading, error, fetch: fetchTransactions, goToPage, reset } = useTransactionsList(fetcher)

onMounted(() => {
  if (!employeeStore.users.length) employeeStore.fetchUsers()
  fetchTransactions()
  accountMgmt.fetchAccounts(customerId.value)
})

watch(customerId, () => {
  reset()
  fetchTransactions()
  accountMgmt.fetchAccounts(customerId.value)
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeCustomerDetail.css" />