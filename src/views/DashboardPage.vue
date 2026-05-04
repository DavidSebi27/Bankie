<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar v-if="auth.user?.approved" :pending-count="pendingCount" />

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

        <QuickActions />

        <StatsGrid :income="stats.income" :expenses="stats.expenses" :savings-rate="stats.savingsRate" />

        <div class="bottom-grid">
          <RecentTransactions :transactions="recentTransactions" />
          <MyCards :cards="myCards" :credit-used="creditUsed" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useApprovalPolling } from '../composables/useApprovalPolling'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import DashboardPending from '../components/dashboard/DashboardPending.vue'
import BalanceCard from '../components/dashboard/sections/BalanceCard.vue'
import QuickActions from '../components/dashboard/sections/QuickActions.vue'
import StatsGrid from '../components/dashboard/sections/StatsGrid.vue'
import RecentTransactions from '../components/dashboard/sections/RecentTransactions.vue'
import MyCards from '../components/dashboard/sections/MyCards.vue'

const auth = useAuthStore()
const { refreshing, refreshUser } = useApprovalPolling()

const pendingCount = 4
const totalBalance = 24831.5
const accounts = [{ id: 1 }, { id: 2 }, { id: 3 }]
const stats = { income: 5240, expenses: 2847, savingsRate: 45.6 }
const creditUsed = 3400

const recentTransactions = [
  { id: 1, emoji: '🛒', name: 'Albert Heijn', date: 'Today, 09:14', type: 'debit', amount: 43.20 },
  { id: 2, emoji: '💼', name: 'Salary — Acme', date: 'Yesterday, 08:00', type: 'credit', amount: 3500 },
  { id: 3, emoji: '🍕', name: 'Takeaway.com', date: 'Apr 30, 19:45', type: 'debit', amount: 28.50 },
  { id: 4, emoji: '🎵', name: 'Spotify', date: 'Apr 29, 00:00', type: 'debit', amount: 10.99 },
]

const myCards = [
  { id: 1, name: 'Main Debit', network: 'VISA', last4: '4821', limit: 5000, gradient: 'linear-gradient(135deg,#533afd,#2e2b8c)' },
  { id: 2, name: 'Credit Card', network: 'MC', last4: '1093', limit: 10000, gradient: 'linear-gradient(135deg,#ea2261,#f96bee)' },
  { id: 3, name: 'Savings Card', network: 'VISA', last4: '7742', limit: 2000, gradient: 'linear-gradient(135deg,#1c1e54,#533afd)' },
]
</script>

<style scoped src="../assets/styles/views/DashboardPage.css" />