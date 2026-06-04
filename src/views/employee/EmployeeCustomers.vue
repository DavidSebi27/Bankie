<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="store.pendingUsers.length" />

      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">Customers</h2>
          <p class="text-caption text-body">Browse customers to view their transaction history.</p>
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
          <button class="refresh-btn" :disabled="loading" @click="refresh">
            <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': loading }" />
            Refresh
          </button>
        </div>

        <div class="filter-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="filter-tab"
            :class="{ active: activeTab === tab.value }"
            @click="setTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="loading" class="state-box">
          <Loader2 class="state-icon spin" />
          <p class="state-title">Loading customers…</p>
        </div>

        <div v-else-if="error" class="state-box">
          <AlertCircle class="state-icon state-icon-error" />
          <p class="state-title">{{ error }}</p>
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
            <span
              class="status-badge"
              :class="activeTab === 'all-closed' ? 'badge-closed' : user.approved ? 'badge-approved' : 'badge-pending'"
            >
              {{ activeTab === 'all-closed' ? 'All accounts closed' : user.approved ? 'Approved' : 'Pending' }}
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
import { Search, RefreshCw, Loader2, AlertCircle, Users, Hash, Phone, ChevronRight } from 'lucide-vue-next'
import { useEmployeeStore } from '../../stores/employeeStore'
import { getCustomers } from '../../api/accounts'
import EmployeeSidebar from '../../components/employee/EmployeeSidebar.vue'

const store     = useEmployeeStore()
const query     = ref('')
const activeTab = ref('all')
const loading   = ref(false)
const error     = ref('')
const list      = ref([])

const tabs = [
  { value: 'all',         label: 'All customers' },
  { value: 'no-accounts', label: 'No accounts yet' },
  { value: 'all-closed',  label: 'All accounts closed' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return list.value
  return list.value.filter(u => {
    const haystack = `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''} ${u.bsn ?? ''}`.toLowerCase()
    return haystack.includes(q)
  })
})

const initials = (u) => `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()

async function setTab(tab) {
  activeTab.value = tab
  query.value     = ''
  loading.value   = true
  error.value     = ''
  try {
    const statusParam = tab === 'all' ? undefined : tab
    const res = await getCustomers(statusParam)
    list.value = res.data.content ?? res.data
  } catch {
    error.value = 'Failed to load customers.'
  } finally {
    loading.value = false
  }
}

async function refresh() {
  await setTab(activeTab.value)
}

onMounted(() => {
  setTab('all')
  if (!store.users.length) store.fetchUsers()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeCustomers.css" />