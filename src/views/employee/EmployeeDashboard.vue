<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="store.pendingUsers.length" />

      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">
            Good morning, {{ auth.user?.firstName }}
          </h2>
          <p class="text-caption text-body">Customers waiting for account approval</p>
        </div>

        <PendingApprovals />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore }    from '../../stores/authStore'
import { useEmployeeStore } from '../../stores/employeeStore'
import EmployeeSidebar  from '../../components/employee/EmployeeSidebar.vue'
import PendingApprovals from '../../components/employee/PendingApprovals.vue'

const auth  = useAuthStore()
const store = useEmployeeStore()

onMounted(() => store.fetchUsers())
</script>

<style scoped src="../../assets/styles/employee/EmployeeDashboard.css" />
