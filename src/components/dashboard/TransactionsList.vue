<template>
  <div v-for="tx in transactions" :key="tx.id" class="tx-item">
    <component :is="getIcon(tx.type)" class="tx-icon" />
    <div>
      <p>{{ tx.name }}</p>
      <p>{{ tx.date }}</p>
    </div>
  </div>
</template>
<script setup>
import { ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'

defineProps({
  transactions: Array
})

const getIcon = (type) => {
  return type === 'credit' ? ArrowDownLeft : ArrowUpRight
}
</script>
<style scoped>
.tx-item { display: flex; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--color-border); }
.tx-item:last-child { border-bottom: none; }
.tx-icon { width: 36px; height: 36px; border-radius: 10px; background: #f0f4ff; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.tx-info { flex: 1; }
.tx-name { font-size: 13px; font-weight: 500; color: var(--color-label); }
.tx-date { font-size: 11px; color: var(--color-body); margin-top: 1px; }
.tx-amount { font-size: 13px; font-weight: 500; }
.tx-amount.debit  { color: #a32d2d; }
.tx-amount.credit { color: var(--color-success-text); }
</style>
