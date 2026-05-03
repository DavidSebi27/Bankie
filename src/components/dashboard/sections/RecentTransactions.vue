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

<style scoped>
.panel-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.panel-title { font-size: 14px; font-weight: 500; color: var(--color-heading); }
.panel-link  { font-size: 12px; color: var(--color-primary); text-decoration: none; }
.panel-link:hover { text-decoration: underline; }

.tx-item {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--color-border);
}
.tx-item:last-child { border-bottom: none; }

.tx-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: #f0f4ff;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.tx-info { flex: 1; }
.tx-name { font-size: 13px; font-weight: 500; color: var(--color-label); }
.tx-date { font-size: 11px; color: var(--color-body); margin-top: 1px; }

.tx-amount { font-size: 13px; font-weight: 500; }
.tx-amount.debit  { color: #a32d2d; }
.tx-amount.credit { color: var(--color-success-text); }
</style>