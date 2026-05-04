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
  income: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  savingsRate: { type: Number, default: 0 }
})

const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
</script>

<style scoped src="../../../assets/styles/dashboard/sections/StatsGrid.css" />