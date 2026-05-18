<template>
    <BaseCard>
        <div class="panel-header">
            <h3 class="panel-title">My cards</h3>
            <RouterLink to="/accounts" class="panel-link">Manage</RouterLink>
        </div>

        <div class="cards-list">
            <div v-for="card in cards" :key="card.id" class="card-item">
                <div class="card-chip" :style="{ background: card.gradient }">
                    {{ card.network }}
                </div>
                <div class="card-info">
                    <p class="card-name">{{ card.name }}</p>
                    <p class="card-number">{{ formatIban(card.iban) }}</p>
                </div>
                <div class="card-limit">
                    <span class="card-limit-label">Balance</span>
                    <span class="card-limit-value">{{ formatCurrency(card.balance) }}</span>
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
    cards: { type: Array, default: () => [] },
})

import { formatCurrency, formatIban } from '../../../composables/format'

const utilizationPct = computed(() => {
    const total = props.cards.reduce((s, c) => s + c.limit, 0)
    return total > 0 ? Math.round((props.creditUsed / total) * 100) : 0
})
</script>

<style scoped src="../../../assets/styles/dashboard/sections/MyCards.css" />