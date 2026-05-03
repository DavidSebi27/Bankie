<template>
    <div>
        <PageHeader />

        <BalanceCard :total="totalBalance" :accounts="accounts.length" />

        <QuickActions :actions="quickActions" />

        <StatsGrid :stats="stats" />

        <div class="bottom-grid">
            <TransactionsList :transactions="recentTransactions" />
            <CardsPanel :cards="myCards" />
        </div>
    </div>
</template>
<script setup>
import PageHeader from './PageHeader.vue'
import BalanceCard from './BalanceCard.vue'
import QuickActions from './QuickActions.vue'
import StatsGrid from './StatsGrid.vue'
import TransactionsList from './TransactionsList.vue'
import CardsPanel from './CardsPanel.vue'
import { computed } from 'vue'

const props = defineProps({
    accounts: Array,
    transactions: Array
})

const formatCurrency = (n) =>
    new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(n)

const totalBalance = 24831.5
</script>
<style scoped>
.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
</style>