<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar v-if="auth.user?.approved"/>

      <DashboardPending v-if="!auth.user?.approved" :first-name="auth.user?.firstName" :refreshing="refreshing"
        @refresh="refreshUser" />

      <main v-else class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">
            Hello, {{ auth.user?.firstName }}
          </h2>
          <p class="text-caption text-body">Here's your financial overview for today</p>
        </div>

        <BalanceCard :total-balance="totalBalance" :account-count="accounts.length" />

        <div class="bottom-grid">
          <RecentTransactions :transactions="recentTransactions" />
          <MyCards :cards="myCards" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore }        from '../stores/authStore'
import { useAccountStore }     from '../stores/accountStore'
import { useTransactionStore } from '../stores/transactionStore'
import { useApprovalPolling } from '../composables/useApprovalPolling'
import { accountLabel } from '../composables/accountLabel'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardPending from '../components/dashboard/DashboardPending.vue'
import BalanceCard from '../components/dashboard/sections/BalanceCard.vue'
import RecentTransactions from '../components/dashboard/sections/RecentTransactions.vue'
import MyCards from '../components/dashboard/sections/MyCards.vue'

const auth             = useAuthStore()
const accountStore     = useAccountStore()
const transactionStore = useTransactionStore()
const { refreshing, refreshUser } = useApprovalPolling()

onMounted(() => {
  accountStore.fetchAccounts()
  transactionStore.fetchRecent()
})

const totalBalance = computed(() => accountStore.totalBalance)
const accounts     = computed(() => accountStore.accounts)

const recentTransactions = computed(() => transactionStore.recentFive)

const GRADIENTS = [
  'linear-gradient(135deg,#533afd,#2e2b8c)',
  'linear-gradient(135deg,#ea2261,#f96bee)',
  'linear-gradient(135deg,#1c1e54,#533afd)',
]

const myCards = computed(() =>
  accountStore.accounts.map((a, i) => ({
    id:       a.id,
    name:     accountLabel(a.type),
    network:  'VISA',
    iban:     a.iban,
    balance:  a.balance,
    gradient: GRADIENTS[i % GRADIENTS.length],
  }))
)
</script>

<style scoped src="../assets/styles/views/DashboardPage.css" />