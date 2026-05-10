<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="store.pendingUsers.length" />

      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">
            Customers
          </h2>
          <p class="text-caption text-body">
            Browse customers to view their transaction history.
          </p>
        </div>

        <div class="customers-header">
          <div class="search-wrap">
            <Search class="search-icon" />
            <input
              v-model="query"
              class="search-input"
              type="search"
              placeholder="Search by name, email, or BSN…"
            />
          </div>
          <button class="refresh-btn" :disabled="store.loading" @click="store.fetchUsers()">
            <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': store.loading }" />
            Refresh
          </button>
        </div>

        <div v-if="store.loading && !store.users.length" class="state-box">
          <Loader2 class="state-icon spin" />
          <p class="state-title">Loading customers…</p>
        </div>

        <div v-else-if="store.error" class="state-box">
          <AlertCircle class="state-icon state-icon-error" />
          <p class="state-title">{{ store.error }}</p>
        </div>

        <div v-else-if="!filtered.length" class="state-box">
          <Users class="state-icon" />
          <p class="state-title">{{ query ? 'No matching customers' : 'No customers yet' }}</p>
          <p v-if="query" class="state-sub">Try a different search term.</p>
        </div>

        <div v-else class="customers-list">
          <RouterLink
            v-for="user in filtered"
            :key="user.id"
            :to="`/employee/customers/${user.id}`"
            class="customer-card"
          >
            <div class="user-avatar">{{ initials(user) }}</div>

            <div class="user-info">
              <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
              <p class="user-email">{{ user.email }}</p>
              <div class="user-meta">
                <span v-if="user.bsn" class="meta-item">
                  <Hash class="meta-icon" /> {{ user.bsn }}
                </span>
                <span v-if="user.phoneNumber" class="meta-item">
                  <Phone class="meta-icon" /> {{ user.phoneNumber }}
                </span>
              </div>
            </div>

            <span class="status-badge" :class="user.approved ? 'badge-approved' : 'badge-pending'">
              {{ user.approved ? 'Approved' : 'Pending' }}
            </span>

            <ChevronRight class="chevron" />
          </RouterLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Search, RefreshCw, Loader2, AlertCircle, Users, Hash, Phone, ChevronRight,
} from 'lucide-vue-next'
import { useEmployeeStore } from '../../stores/employeeStore'
import EmployeeSidebar from '../../components/employee/EmployeeSidebar.vue'

const store = useEmployeeStore()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return store.customers
  return store.customers.filter(u => {
    const haystack = `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''} ${u.bsn ?? ''}`.toLowerCase()
    return haystack.includes(q)
  })
})

const initials = (u) =>
  `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()

onMounted(() => {
  if (!store.users.length) store.fetchUsers()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeCustomers.css" />
