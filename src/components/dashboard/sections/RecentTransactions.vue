<template>
  <BaseCard>
    <div class="panel-header">
      <h3 class="panel-title">Recent transactions</h3>
      <RouterLink to="/transactions" class="panel-link">View all</RouterLink>
    </div>

    <div class="tx-list">
      <div v-for="tx in transactions" :key="tx.id" class="tx-item">
        <div class="tx-icon">{{ tx.emoji }}</div>
        <div class="tx-info">
          <p class="tx-name">{{ tx.name }}</p>
          <p class="tx-date">{{ tx.date }}</p>
        </div>
        <span class="tx-amount" :class="tx.type">
          {{ tx.type === 'credit' ? '+' : '−' }} {{ formatCurrency(tx.amount) }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '../../ui/BaseCard.vue'

defineProps({
  transactions: { type: Array, default: () => [] }
})

const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
</script>

<style scoped src="../../../assets/styles/dashboard/sections/RecentTransactions.css" />