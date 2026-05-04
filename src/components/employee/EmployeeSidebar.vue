<template>
  <aside class="sidebar">
    <nav>
      <div class="nav-section">
        <p class="nav-label">Management</p>
        <RouterLink to="/employee/dashboard" class="nav-item" active-class="active">
          <ClipboardList class="nav-icon" /> Pending Approvals
          <span v-if="pendingCount" class="nav-badge">{{ pendingCount }}</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ClipboardList } from 'lucide-vue-next'

defineProps({
  pendingCount: { type: Number, default: 0 }
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeSidebar.css" />
