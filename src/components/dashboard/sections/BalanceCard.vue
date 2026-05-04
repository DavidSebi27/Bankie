<template>
  <div class="balance-card">
    <p class="balance-label">Total Balance</p>
    <p class="balance-amount">{{ formatCurrency(totalBalance) }}</p>
    <p class="balance-meta">Across {{ accountCount }} accounts · Updated just now</p>
    <div class="balance-actions">
      <RouterLink to="/transfer">
        <button class="bal-btn bal-btn-primary">Send Money</button>
      </RouterLink>
      <button class="bal-btn bal-btn-ghost">Add Funds</button>
      <button class="bal-btn bal-btn-ghost">View IBAN</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalBalance: { type: Number, default: 0 },
  accountCount: { type: Number, default: 0 }
})

const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
</script>

<style scoped src="../../../assets/styles/dashboard/sections/BalanceCard.css" />