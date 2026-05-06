<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="employeeStore.pendingUsers.length" />

      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">
            Transactions
          </h2>
          <p class="text-caption text-body">
            All transactions across the system — ATM, customer-initiated, and employee-initiated.
          </p>
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
          empty-title="No transactions yet"
          empty-subtitle="Transactions will appear here once they're recorded."
          title-suffix="total"
          @refresh="fetch()"
          @go-to-page="goToPage"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEmployeeStore }    from '../../stores/employeeStore'
import { useTransactionsList } from '../../composables/useTransactionsList'
import { getTransactions }     from '../../api/transactions'
import EmployeeSidebar    from '../../components/employee/EmployeeSidebar.vue'
import TransactionsTable  from '../../components/employee/TransactionsTable.vue'

const employeeStore = useEmployeeStore()

const {
  items, page, totalPages, totalElements, first, last,
  loading, error, fetch, goToPage,
} = useTransactionsList(getTransactions)

onMounted(() => {
  fetch()
  if (!employeeStore.users.length) employeeStore.fetchUsers()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeTransactions.css" />
