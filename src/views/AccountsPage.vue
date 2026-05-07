<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar />
      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">My Accounts</h2>
          <p class="text-caption text-body">Your balances and IBAN numbers</p>
        </div>

        <div class="summary-card">
          <p class="summary-label">Combined Balance</p>
          <p class="summary-amount">{{ formatCurrency(store.totalBalance) }}</p>
          <p class="summary-meta">Across {{ store.accounts.length }} account{{ store.accounts.length !== 1 ? 's' : '' }}</p>
        </div>

        <p class="section-label">Individual Accounts</p>

        <div v-if="store.loading" class="state-box">
          <Loader2 class="state-icon state-spin" />
          <p class="state-title">Loading accounts…</p>
        </div>

        <div v-else-if="store.error" class="state-box">
          <AlertCircle class="state-icon" />
          <p class="state-title">Could not load accounts</p>
          <p class="state-sub">{{ store.error }}</p>
        </div>

        <div v-else-if="!store.accounts.length" class="state-box">
          <Wallet class="state-icon" />
          <p class="state-title">No accounts found</p>
          <p class="state-sub">Your accounts will appear here once set up.</p>
        </div>

        <div v-else class="accounts-list">
          <div v-for="account in store.accounts" :key="account.id" class="account-card">

            <div class="account-icon-wrap" :class="iconClass(account.type)">
              <component :is="accountIcon(account.type)" class="account-icon" />
            </div>

            <div class="account-details">
              <p class="account-id">{{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
              <p class="account-type">{{ accountLabel(account.type) }}</p>
              <div class="iban-row">
                <span class="iban-text">{{ formatIban(account.iban) }}</span>
                <button
                  class="copy-btn"
                  :class="{ copied: copiedId === account.id }"
                  :title="copiedId === account.id ? 'Copied!' : 'Copy IBAN'"
                  @click="copyIban(account.iban, account.id)"
                >
                  <CopyCheck v-if="copiedId === account.id" class="copy-icon" />
                  <Copy v-else class="copy-icon" />
                </button>
              </div>
            </div>

            <div class="account-balance">
              <p class="balance-amount">{{ formatCurrency(account.balance) }}</p>
              <p class="balance-currency">{{ account.currency ?? 'EUR' }}</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Wallet, PiggyBank, Loader2, AlertCircle, Copy, CopyCheck } from 'lucide-vue-next'
import { useAccountStore }  from '../stores/accountStore'
import { useAuthStore }  from '../stores/authStore'
import { formatCurrency, formatIban } from '../composables/format'
import { accountLabel } from '../composables/accountLabel'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'

const store = useAccountStore()
const authStore = useAuthStore()
onMounted(() => store.fetchAccounts())

const copiedId = ref(null)

const accountIcon = (type) =>
  type === 'SAVINGS' ? PiggyBank : Wallet

const iconClass = (type) =>
  type === 'SAVINGS' ? 'icon-savings' : 'icon-checking'

const copyIban = async (iban, id) => {
  await navigator.clipboard.writeText(iban?.replace(/\s/g, '') ?? '')
  copiedId.value = id
  setTimeout(() => { copiedId.value = null }, 2000)
}
</script>

<style scoped src="../assets/styles/views/AccountsPage.css" />
