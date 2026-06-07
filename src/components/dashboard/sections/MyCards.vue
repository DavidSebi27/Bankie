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
    </BaseCard>
</template>

<script setup>
import BaseCard from '../../ui/BaseCard.vue'
import { formatCurrency, formatIban } from '../../../composables/format'

const props = defineProps({
    cards: { type: Array, default: () => [] },
})
</script>

<style scoped src="../../../assets/styles/dashboard/sections/MyCards.css" />