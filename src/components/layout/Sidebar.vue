<template>
    <aside v-if="auth.user?.approved" class="sidebar">
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
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()

const pendingCount = 4
</script>

<style scoped>
.sidebar {
    width: 220px;
    min-height: calc(100vh - 60px);
    background: var(--color-bg);
    border-right: 1px solid var(--color-border);
    padding: 1.5rem 0.75rem;
    flex-shrink: 0;
}

.nav-section {
    margin-bottom: 1.5rem;
}

.nav-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.8px;
    color: var(--color-body);
    padding: 0 0.75rem;
    margin-bottom: 6px;
    text-transform: uppercase;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: var(--color-label);
    text-decoration: none;
    transition: all 0.15s;
}

.nav-item:hover {
    background: #f4f6fb;
    color: var(--color-heading);
}

.nav-item.active {
    background: #eeeeff;
    color: var(--color-primary);
    font-weight: 500;
}

.nav-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
    flex-shrink: 0;
}

.nav-item.active .nav-icon {
    opacity: 1;
}

.nav-badge {
    margin-left: auto;
    background: var(--color-ruby);
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 10px;
}
</style>