<template>
  <div class="stats-grid">
    <BaseCard class="stat-card">
      <div class="stat-header">
        <div class="stat-icon bg-success-soft">
          <TrendingUp class="icon text-success" />
        </div>
        <span class="stat-trend trend-up">↑ 12%</span>
      </div>
      <p class="stat-label">Income this month</p>
      <p class="stat-value">{{ formatCurrency(income) }}</p>
    </BaseCard>

    <BaseCard class="stat-card">
      <div class="stat-header">
        <div class="stat-icon bg-ruby-soft">
          <TrendingDown class="icon text-ruby" />
        </div>
        <span class="stat-trend trend-down">↑ 8%</span>
      </div>
      <p class="stat-label">Expenses this month</p>
      <p class="stat-value">{{ formatCurrency(expenses) }}</p>
    </BaseCard>

    <BaseCard class="stat-card">
      <div class="stat-header">
        <div class="stat-icon bg-primary-soft">
          <Percent class="icon text-primary" />
        </div>
        <span class="stat-trend trend-up">↑ 3%</span>
      </div>
      <p class="stat-label">Savings rate</p>
      <p class="stat-value">{{ savingsRate }}%</p>
    </BaseCard>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown, Percent } from 'lucide-vue-next'
import BaseCard from '../../ui/BaseCard.vue'

defineProps({
  income:      { type: Number, default: 0 },
  expenses:    { type: Number, default: 0 },
  savingsRate: { type: Number, default: 0 }
})

const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card { padding: 18px 20px !important; }

.stat-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.stat-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.bg-success-soft { background: #e8fdf0; }
.bg-ruby-soft    { background: #fff0f5; }
.bg-primary-soft { background: #eeeeff; }

.icon { width: 16px; height: 16px; }
.text-success { color: var(--color-success); }
.text-ruby    { color: var(--color-ruby); }
.text-primary { color: var(--color-primary); }

.stat-trend {
  font-size: 11px; font-weight: 500;
  padding: 2px 8px; border-radius: 6px;
}
.trend-up   { color: var(--color-success-text); background: #e8fdf0; }
.trend-down { color: #a32d2d; background: #fff0f5; }

.stat-label {
  font-size: 12px; color: var(--color-body); margin-bottom: 4px;
}
.stat-value {
  font-size: 1.4rem; font-weight: 300;
  color: var(--color-heading); letter-spacing: -0.5px;
}
</style>