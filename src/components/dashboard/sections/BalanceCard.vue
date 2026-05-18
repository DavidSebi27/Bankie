<template>
  <div class="balance-card">
    <p class="balance-label">Total Balance</p>
    <p class="balance-amount">{{ formatCurrency(totalBalance) }}</p>
    <p class="balance-meta">Across {{ accountCount }} accounts · Updated just now</p>
    <div class="balance-actions">
      <RouterLink to="/transfer">
        <button class="bal-btn bal-btn-primary">Send Money</button>
      </RouterLink>
      <RouterLink to="/atm">
        <button class="bal-btn bal-btn-ghost">Add Funds</button>
      </RouterLink>
      <RouterLink to="/accounts">
        <button class="bal-btn bal-btn-ghost">View IBAN</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalBalance: { type: Number, default: 0 },
  accountCount: { type: Number, default: 0 }
})

import { formatCurrency } from '../../../composables/format'
</script>

<style scoped src="../../../assets/styles/dashboard/sections/BalanceCard.css" />
