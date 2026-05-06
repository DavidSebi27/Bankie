<template>
  <div>
    <div class="transactions-header">
      <p class="transactions-title">
        {{ store.totalElements }} transaction{{ store.totalElements !== 1 ? 's' : '' }} total
      </p>
      <button class="refresh-btn" :disabled="store.loading" @click="store.fetch()">
        <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': store.loading }" />
        Refresh
      </button>
    </div>

    <div v-if="store.loading && !store.items.length" class="state-box">
      <Loader2 class="state-icon spin" />
      <p class="state-title">Loading transactions…</p>
    </div>

    <div v-else-if="store.error" class="state-box">
      <AlertCircle class="state-icon state-icon-error" />
      <p class="state-title">{{ store.error }}</p>
      <button class="refresh-btn" @click="store.fetch()">Retry</button>
    </div>

    <div v-else-if="!store.items.length" class="state-box">
      <Inbox class="state-icon" />
      <p class="state-title">No transactions yet</p>
      <p class="state-sub">Transactions will appear here once they're recorded.</p>
    </div>

    <template v-else>
      <div class="table-wrap">
        <table class="tx-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th class="num">Amount</th>
              <th>Timestamp</th>
              <th>Initiated by</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in store.items" :key="t.id">
              <td>
                <span class="type-badge" :class="`type-${t.type.toLowerCase()}`">
                  <component :is="typeIcon(t.type)" class="type-icon" />
                  {{ t.type }}
                </span>
              </td>
              <td class="iban">{{ t.fromIban || '—' }}</td>
              <td class="iban">{{ t.toIban || '—' }}</td>
              <td class="num amount">€{{ t.amount }}</td>
              <td class="timestamp">{{ formatTimestamp(t.timestamp) }}</td>
              <td>{{ t.initiatedByName || (t.initiatedById ? `User #${t.initiatedById}` : '—') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pager">
        <p class="pager-info">
          Page {{ store.page + 1 }} of {{ store.totalPages }}
        </p>
        <div class="pager-controls">
          <button class="page-btn" :disabled="store.first || store.loading" @click="store.goToPage(store.page - 1)">
            <ChevronLeft class="page-icon" /> Previous
          </button>
          <button class="page-btn" :disabled="store.last || store.loading" @click="store.goToPage(store.page + 1)">
            Next <ChevronRight class="page-icon" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {
  RefreshCw, Loader2, Inbox, AlertCircle,
  ChevronLeft, ChevronRight,
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight,
} from 'lucide-vue-next'
import { useTransactionStore } from '../../stores/transactionStore'

const store = useTransactionStore()

const typeIcon = (type) => {
  if (type === 'DEPOSIT')    return ArrowDownLeft
  if (type === 'WITHDRAWAL') return ArrowUpRight
  return ArrowLeftRight
}

const formatTimestamp = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<style scoped src="../../assets/styles/employee/TransactionsTable.css" />
