<template>
  <BaseCard>
    <div class="panel-header">
      <h3 class="panel-title">Recent transactions</h3>
      <RouterLink to="/transactions" class="panel-link">View all</RouterLink>
    </div>

    <div class="tx-list">
      <div v-if="!transactions.length" class="tx-empty">No transactions yet.</div>
      <div v-for="tx in transactions" :key="tx.id" class="tx-item">
        <div class="tx-icon">
          <component :is="txIcon(tx.type)" class="tx-icon-svg" />
        </div>
        <div class="tx-info">
          <p class="tx-name">{{ txLabel(tx.type) }}</p>
          <p class="tx-date">{{ formatTimestamp(tx.timestamp) }}</p>
        </div>
        <span class="tx-amount" :class="isIncoming(tx) ? 'credit' : 'debit'">
          {{ isIncoming(tx) ? '+' : '−' }} {{ formatCurrency(tx.amount) }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import BaseCard from '../../ui/BaseCard.vue'
import { useAccountStore } from '../../../stores/accountStore'
import { formatCurrency } from '../../../composables/format'

defineProps({
  transactions: { type: Array, default: () => [] }
})

const accountStore = useAccountStore()
const ownIbans = computed(() => new Set(accountStore.accounts.map(a => a.iban)))

function isIncoming(tx) {
  if (tx.type === 'DEPOSIT') return true
  if (tx.type === 'WITHDRAWAL') return false
  return ownIbans.value.has(tx.toIban)
}

const txIcon = (type) => ({ TRANSFER: ArrowLeftRight, DEPOSIT: ArrowDownLeft, WITHDRAWAL: ArrowUpRight })[type] ?? ArrowLeftRight
const txLabel = (type) => ({ TRANSFER: 'Transfer', DEPOSIT: 'Deposit', WITHDRAWAL: 'Withdrawal' })[type] ?? type

function formatTimestamp(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}
</script>

<style scoped src="../../../assets/styles/dashboard/sections/RecentTransactions.css" />
