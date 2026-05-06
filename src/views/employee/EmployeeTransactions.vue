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

        <div v-if="store.notFound" class="not-found">
          <h3>Page not found</h3>
          <p>The page you're looking for doesn't exist.</p>
        </div>

        <TransactionsTable v-else />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEmployeeStore }    from '../../stores/employeeStore'
import { useTransactionStore } from '../../stores/transactionStore'
import EmployeeSidebar    from '../../components/employee/EmployeeSidebar.vue'
import TransactionsTable  from '../../components/employee/TransactionsTable.vue'

const employeeStore = useEmployeeStore()
const store         = useTransactionStore()

onMounted(() => {
  store.fetch()
  if (!employeeStore.users.length) employeeStore.fetchUsers()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeTransactions.css" />
