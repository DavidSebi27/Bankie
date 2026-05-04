<template>
    <aside class="sidebar">
        <nav>
            <div class="nav-section">
                <p class="nav-label">Main</p>
                <RouterLink to="/dashboard" class="nav-item" active-class="active">
                    <LayoutDashboard class="nav-icon" /> Dashboard
                </RouterLink>
                <RouterLink to="/accounts" class="nav-item" active-class="active">
                    <Wallet class="nav-icon" /> Accounts
                </RouterLink>
                <RouterLink to="/transactions" class="nav-item" active-class="active">
                    <ArrowLeftRight class="nav-icon" /> Transactions
                    <span v-if="pendingCount" class="nav-badge">{{ pendingCount }}</span>
                </RouterLink>
                <RouterLink to="/transfer" class="nav-item" active-class="active">
                    <Send class="nav-icon" /> Transfer
                </RouterLink>
            </div>

            <div class="nav-section">
                <p class="nav-label">More</p>
                <RouterLink to="/cards" class="nav-item" active-class="active">
                    <CreditCard class="nav-icon" /> Cards
                </RouterLink>
                <RouterLink to="/savings" class="nav-item" active-class="active">
                    <PiggyBank class="nav-icon" /> Savings
                </RouterLink>
                <RouterLink to="/profile" class="nav-item" active-class="active">
                    <User class="nav-icon" /> Profile
                </RouterLink>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import {
    LayoutDashboard, Wallet, ArrowLeftRight,
    Send, CreditCard, PiggyBank, User
} from 'lucide-vue-next'

defineProps({
    pendingCount: { type: Number, default: 0 }
})
</script>

<style scoped src="../../assets/styles/dashboard/DashboardSidebar.css" />