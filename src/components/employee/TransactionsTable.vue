<template>
  <div>
    <div class="transactions-header">
      <p class="transactions-title">
        {{ totalElements }} transaction{{ totalElements !== 1 ? 's' : '' }}{{ titleSuffix ? ` ${titleSuffix}` : '' }}
      </p>
      <button class="refresh-btn" :disabled="loading" @click="$emit('refresh')">
        <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': loading }" />
        Refresh
      </button>
    </div>

    <div v-if="loading && !items.length" class="state-box">
      <Loader2 class="state-icon spin" />
      <p class="state-title">Loading transactions…</p>
    </div>

    <div v-else-if="error" class="state-box">
      <AlertCircle class="state-icon state-icon-error" />
      <p class="state-title">{{ error }}</p>
      <button class="refresh-btn" @click="$emit('refresh')">Retry</button>
    </div>

    <div v-else-if="!items.length" class="state-box">
      <Inbox class="state-icon" />
      <p class="state-title">{{ emptyTitle }}</p>
      <p class="state-sub">{{ emptySubtitle }}</p>
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
            <tr v-for="t in items" :key="t.id">
              <td>
                <span class="type-badge" :class="`type-${t.type.toLowerCase()}`">
                  <component :is="typeIcon(t.type)" class="type-icon" />
                  {{ t.type }}
                </span>
              </td>
              <td class="iban">{{ t.fromIban || cashLabel(t.type, 'from') }}</td>
              <td class="iban">{{ t.toIban || cashLabel(t.type, 'to') }}</td>
              <td class="num amount">€{{ t.amount }}</td>
              <td class="timestamp">{{ formatTimestamp(t.timestamp) }}</td>
              <td>{{ t.initiatedByName || (t.initiatedById ? `User #${t.initiatedById}` : '—') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pager">
        <p class="pager-info">
          Page {{ page + 1 }} of {{ totalPages }}
        </p>
        <div class="pager-controls">
          <button class="page-btn" :disabled="first || loading" @click="$emit('go-to-page', page - 1)">
            <ChevronLeft class="page-icon" /> Previous
          </button>
          <button class="page-btn" :disabled="last || loading" @click="$emit('go-to-page', page + 1)">
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
import { formatTimestamp } from '../../composables/format'

defineProps({
  items:         { type: Array,   default: () => [] },
  page:          { type: Number,  default: 0 },
  totalPages:    { type: Number,  default: 0 },
  totalElements: { type: Number,  default: 0 },
  first:         { type: Boolean, default: true },
  last:          { type: Boolean, default: true },
  loading:       { type: Boolean, default: false },
  error:         { type: String,  default: null },
  emptyTitle:    { type: String,  default: 'No transactions to show' },
  emptySubtitle: { type: String,  default: 'Nothing to display here yet.' },
  titleSuffix:   { type: String,  default: '' },
})

defineEmits(['refresh', 'go-to-page'])

const typeIcon = (type) => {
  if (type === 'DEPOSIT')    return ArrowDownLeft
  if (type === 'WITHDRAWAL') return ArrowUpRight
  return ArrowLeftRight
}

const cashLabel = (type, side) => {
  if (type === 'DEPOSIT' && side === 'from')  return 'Cash'
  if (type === 'WITHDRAWAL' && side === 'to') return 'Cash'
  return '—'
}

</script>

<style scoped src="../../assets/styles/employee/TransactionsTable.css" />
