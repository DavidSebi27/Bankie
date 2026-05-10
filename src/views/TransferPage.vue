<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar />
      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">Transfer</h2>
          <p class="text-caption text-body">Find a customer's IBAN by name</p>
        </div>

        <div class="search-card">
          <p class="section-label">Search by customer name</p>
          <div class="search-row">
            <input v-model="firstName" class="search-input" placeholder="First name" @keyup.enter="search" />
            <input v-model="lastName" class="search-input" placeholder="Last name" @keyup.enter="search" />
            <button class="search-btn" :disabled="!canSearch || store.searchLoading" @click="search">
              <Loader2 v-if="store.searchLoading" class="btn-icon spin" />
              <Search v-else class="btn-icon" />
              Search
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="store.searchLoading" class="state-box">
          <Loader2 class="state-icon state-spin" />
          <p class="state-title">Searching…</p>
        </div>

        <!-- Error -->
        <div v-else-if="store.searchError" class="state-box">
          <AlertCircle class="state-icon" />
          <p class="state-title">Search failed</p>
          <p class="state-sub">{{ store.searchError }}</p>
        </div>

        <!-- No results -->
        <div v-else-if="store.searched && !store.searchResults.length" class="state-box">
          <UserX class="state-icon" />
          <p class="state-title">No customers found</p>
          <p class="state-sub">Try a different first or last name.</p>
        </div>

        <!-- Results -->
        <div v-else-if="store.searchResults.length" class="results-list">
          <p class="section-label">Results ({{ store.searchResults.length }})</p>
          <div v-for="(result, i) in store.searchResults" :key="i" class="result-card">
            <div class="result-icon-wrap">
              <User class="result-icon" />
            </div>
            <div class="result-details">
              <p class="result-name">{{ result.firstName }} {{ result.lastName }}</p>
              <div class="iban-row">
                <span class="iban-text">{{ formatIban(result.iban) }}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search, Loader2, AlertCircle, User, UserX, Copy, CopyCheck
} from 'lucide-vue-next'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useAccountStore } from '../stores/accountStore'
import { formatIban } from '../composables/format'

const store = useAccountStore()
const firstName = ref('')
const lastName = ref('')
const copiedIdx = ref(null)

const canSearch = computed(() => firstName.value.trim() && lastName.value.trim())

async function search() {
  if (!canSearch.value) return
  await store.searchCustomers(firstName.value.trim(), lastName.value.trim())
}
</script>

<style scoped src="../assets/styles/views/TransferPage.css" />
