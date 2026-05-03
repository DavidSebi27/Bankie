<template>
  <BaseCard>
    <div class="panel-header">
      <h3 class="panel-title">My cards</h3>
      <RouterLink to="/cards" class="panel-link">Manage</RouterLink>
    </div>

    <div class="cards-list">
      <div v-for="card in cards" :key="card.id" class="card-item">
        <div class="card-chip" :style="{ background: card.gradient }">
          {{ card.network }}
        </div>
        <div class="card-info">
          <p class="card-name">{{ card.name }}</p>
          <p class="card-number">•••• •••• •••• {{ card.last4 }}</p>
        </div>
        <div class="card-limit">
          <span class="card-limit-label">Limit</span>
          <span class="card-limit-value">{{ formatCurrency(card.limit) }}</span>
        </div>
      </div>
    </div>

    <div class="utilization">
      <p class="util-label">Credit utilization</p>
      <div class="util-bar">
        <div class="util-fill" :style="{ width: utilizationPct + '%' }" />
      </div>
      <div class="util-meta">
        <span>{{ formatCurrency(creditUsed) }} used</span>
        <span class="util-pct">{{ utilizationPct }}%</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../../ui/BaseCard.vue'

const props = defineProps({
  cards:      { type: Array,  default: () => [] },
  creditUsed: { type: Number, default: 0 }
})

const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

const utilizationPct = computed(() => {
  const total = props.cards.reduce((s, c) => s + c.limit, 0)
  return total > 0 ? Math.round((props.creditUsed / total) * 100) : 0
})
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

.card-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}
.card-item:last-child { border-bottom: none; }

.card-chip {
  width: 44px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
  color: white; flex-shrink: 0;
}
.card-info { flex: 1; }
.card-name   { font-size: 13px; font-weight: 500; color: var(--color-label); }
.card-number { font-size: 11px; color: var(--color-body); font-family: monospace; }

.card-limit { text-align: right; }
.card-limit-label { display: block; font-size: 11px; color: var(--color-body); }
.card-limit-value { font-size: 13px; font-weight: 500; color: var(--color-label); }

.utilization {
  margin-top: 1rem; padding-top: 14px;
  border-top: 1px solid var(--color-border);
}
.util-label { font-size: 12px; color: var(--color-body); margin-bottom: 6px; }
.util-bar {
  height: 6px; background: var(--color-border);
  border-radius: 3px; overflow: hidden;
}
.util-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 3px;
  transition: width 0.4s ease;
}
.util-meta {
  display: flex; justify-content: space-between; margin-top: 5px;
}
.util-meta span { font-size: 11px; color: var(--color-body); }
.util-pct { color: var(--color-primary) !important; font-weight: 500 !important; }
</style>