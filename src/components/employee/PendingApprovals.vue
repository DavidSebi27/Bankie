<template>
  <div>
    <div class="approvals-header">
      <p class="approvals-title">
        {{ store.pendingUsers.length }} request{{ store.pendingUsers.length !== 1 ? 's' : '' }} pending
      </p>
      <button class="refresh-btn" :disabled="store.loading" @click="store.fetchUsers()">
        <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': store.loading }" />
        Refresh
      </button>
    </div>

    <div v-if="store.loading && !store.users.length" class="state-box">
      <Loader2 class="state-icon spin" />
      <p class="state-title">Loading requests…</p>
    </div>

    <div v-else-if="!store.pendingUsers.length" class="state-box">
      <CheckCircle class="state-icon state-icon-success" />
      <p class="state-title">All caught up</p>
      <p class="state-sub">No pending approval requests right now.</p>
    </div>

    <div v-else class="requests-list">
      <div v-for="user in store.pendingUsers" :key="user.id" class="request-card">
        <div class="user-avatar">{{ initials(user) }}</div>

        <div class="user-info">
          <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="user-email">{{ user.email }}</p>
          <div class="user-meta">
            <span class="meta-item">
              <Hash class="meta-icon" /> {{ user.bsn }}
            </span>
            <span class="meta-item">
              <Phone class="meta-icon" /> {{ user.phoneNumber }}
            </span>
          </div>
        </div>

        <span class="status-badge">Pending</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RefreshCw, Loader2, CheckCircle, Hash, Phone } from 'lucide-vue-next'
import { useEmployeeStore } from '../../stores/employeeStore'

const store = useEmployeeStore()

const initials = (user) =>
  `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
</script>

<style scoped src="../../assets/styles/employee/PendingApprovals.css" />
