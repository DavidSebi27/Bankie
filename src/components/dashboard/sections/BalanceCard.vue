<template>
  <div class="balance-card">
    <p class="balance-label">Total Balance</p>
    <p class="balance-amount">{{ formatCurrency(totalBalance) }}</p>
    <p class="balance-meta">Across {{ accountCount }} accounts · Updated just now</p>
    <div class="balance-actions">
      <RouterLink to="/transfer">
        <button class="bal-btn bal-btn-primary">Send Money</button>
      </RouterLink>
      <button class="bal-btn bal-btn-ghost">Add Funds</button>
      <button class="bal-btn bal-btn-ghost">View IBAN</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalBalance:  { type: Number, default: 0 },
  accountCount:  { type: Number, default: 0 }
})

const formatCurrency = (n) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
</script>

<style scoped>
.balance-card {
  background: linear-gradient(135deg, #1c1e54 0%, #2e2b8c 50%, #533afd 100%);
  border-radius: 16px;
  padding: 28px 32px;
  color: white;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}
.balance-card::before {
  content: ''; position: absolute;
  top: -60px; right: -60px;
  width: 220px; height: 220px; border-radius: 50%;
  background: rgba(249, 107, 238, 0.15);
  pointer-events: none;
}

.balance-label {
  font-size: 12px; letter-spacing: 0.8px;
  opacity: 0.65; text-transform: uppercase;
}
.balance-amount {
  font-size: 2.75rem; font-weight: 300;
  letter-spacing: -1.4px; margin: 8px 0 4px;
}
.balance-meta { font-size: 13px; opacity: 0.6; }

.balance-actions {
  display: flex; gap: 10px;
  margin-top: 1.5rem;
  position: relative; z-index: 1;
}
.bal-btn {
  padding: 9px 20px; border-radius: 8px;
  font-size: 13px; font-weight: 500;
  cursor: pointer; border: none; transition: all 0.15s;
}
.bal-btn-primary { background: white; color: var(--color-primary); }
.bal-btn-primary:hover { background: #f0eeff; }
.bal-btn-ghost {
  background: rgba(255,255,255,0.12); color: white;
  border: 1px solid rgba(255,255,255,0.2);
}
.bal-btn-ghost:hover { background: rgba(255,255,255,0.2); }
</style>