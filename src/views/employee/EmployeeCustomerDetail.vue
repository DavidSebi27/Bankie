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
import { computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ArrowLeft, Hash, Phone, Loader2, UserX,
} from 'lucide-vue-next'
import { useEmployeeStore }    from '../../stores/employeeStore'
import { useTransactionsList } from '../../composables/useTransactionsList'
import { getCustomerTransactions } from '../../api/transactions'
import EmployeeSidebar    from '../../components/employee/EmployeeSidebar.vue'
import TransactionsTable  from '../../components/employee/TransactionsTable.vue'

const route         = useRoute()
const employeeStore = useEmployeeStore()

const customerId = computed(() => route.params.id)

const customer = computed(() =>
  employeeStore.customers.find(u => String(u.id) === String(customerId.value))
)

const initials = computed(() => {
  const u = customer.value
  if (!u) return '?'
  return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()
})

const fetcher = (params) => getCustomerTransactions(customerId.value, params)

const {
  items, page, totalPages, totalElements, first, last,
  loading, error, fetch, goToPage, reset,
} = useTransactionsList(fetcher)

onMounted(() => {
  if (!employeeStore.users.length) employeeStore.fetchUsers()
  fetch()
})

watch(customerId, () => {
  reset()
  fetch()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeCustomerDetail.css" />
