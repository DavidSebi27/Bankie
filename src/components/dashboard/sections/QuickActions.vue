<template>
  <div class="quick-actions">
    <button v-for="action in actions" :key="action.label" class="qa-item" @click="action.handler">
      <div class="qa-dot" :style="{ background: action.bg }">
        <component :is="action.icon" class="qa-icon" :style="{ color: action.color }" />
      </div>
      <span class="qa-label">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { Send, Download, CreditCard, Plus } from 'lucide-vue-next'

const props = defineProps({
  actions: {
    type: Array,
    default: () => [
      { label: 'Transfer', bg: '#eeeeff', color: '#533afd', icon: Send, handler: () => { } },
      { label: 'Request', bg: '#e8fdf0', color: '#15be53', icon: Download, handler: () => { } },
      { label: 'Pay Bill', bg: '#fff0f5', color: '#ea2261', icon: CreditCard, handler: () => { } },
      { label: 'Top Up', bg: '#fdf4e8', color: '#9b6829', icon: Plus, handler: () => { } },
    ]
  }
})
</script>

<style scoped src="../../../assets/styles/dashboard/sections/QuickActions.css" />