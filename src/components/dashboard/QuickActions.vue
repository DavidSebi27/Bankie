<template>
  <div class="quick-actions">
    <button v-for="a in quickActions" :key="a.label" class="qa-item">
      <component :is="a.icon" />
      <span>{{ a.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { Send, Download, CreditCard, Plus } from 'lucide-vue-next'

const quickActions = [
  { label: 'Transfer', bg: '#eeeeff', color: '#533afd', icon: Send, handler: () => {} },
  { label: 'Request', bg: '#e8fdf0', color: '#15be53', icon: Download, handler: () => {} },
  { label: 'Pay Bill', bg: '#fff0f5', color: '#ea2261', icon: CreditCard, handler: () => {} },
  { label: 'Top Up',  bg: '#fdf4e8', color: '#9b6829', icon: Plus, handler: () => {} },
]
</script>

<style scoped>
.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 1.5rem; }
.qa-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 14px 8px; background: var(--color-bg);
  border: 1px solid var(--color-border); border-radius: 10px;
  cursor: pointer; transition: all 0.15s;
}
.qa-item:hover { border-color: var(--color-border-purple); background: #fafaff; }
.qa-dot { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.qa-label { font-size: 11px; color: var(--color-label); font-weight: 500; }
</style>