<template>
  <div class="page">
    <div class="card">
      <div class="orb orb-1" />
      <div class="orb orb-2" />

      <div class="icon-ring">
        <LockKeyhole class="lock-icon" />
      </div>

      <span class="error-code">401 · Unauthorized</span>

      <h1 class="title">Access denied</h1>
      <p class="desc">
        You don't have permission to view this page. Please log in with
        an account that has the right access level.
      </p>

      <div class="actions">
        <RouterLink to="/dashboard">
          <button class="btn-primary">Go to dashboard</button>
        </RouterLink>

        <div class="divider">
          <div class="divider-line" />
          <span class="divider-text">or</span>
          <div class="divider-line" />
        </div>

        <button class="btn-ghost" @click="handleSwitch">
          Log in with a different account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { LockKeyhole } from 'lucide-vue-next'

const auth   = useAuthStore()
const router = useRouter()

const handleSwitch = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - 60px); /* accounts for the sticky topbar */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f4f6fb;
}

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 48px 44px;
  width: 100%;
  max-width: 480px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Background orbs — same technique as balance card / pending card */
.orb { position: absolute; border-radius: 50%; pointer-events: none; }
.orb-1 {
  top: -70px; right: -70px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(83,58,253,0.07), transparent 70%);
}
.orb-2 {
  bottom: -50px; left: -50px;
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(234,34,97,0.06), transparent 70%);
}

/* Lock icon */
.icon-ring {
  width: 72px; height: 72px; border-radius: 20px;
  background: #fff0f5;
  border: 1px solid var(--color-border-magenta);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px;
  position: relative; z-index: 1;
}
.lock-icon { width: 28px; height: 28px; color: var(--color-ruby); }

/* 401 badge */
.error-code {
  display: inline-block;
  font-size: 11px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--color-ruby);
  background: #fff0f5;
  border: 1px solid var(--color-border-magenta);
  padding: 3px 10px; border-radius: 20px;
  margin-bottom: 16px;
  position: relative; z-index: 1;
}

.title {
  font-size: 1.75rem; font-weight: 300;
  color: var(--color-heading);
  letter-spacing: -0.64px;
  margin-bottom: 10px;
  position: relative; z-index: 1;
}

.desc {
  font-size: 14px; color: var(--color-body);
  line-height: 1.65; max-width: 340px;
  margin: 0 auto 32px;
  position: relative; z-index: 1;
}

/* Actions */
.actions {
  display: flex; flex-direction: column; gap: 10px;
  position: relative; z-index: 1;
}

.btn-primary {
  width: 100%; padding: 11px 24px; border-radius: 8px;
  background: var(--color-primary); color: white;
  font-size: 13px; font-weight: 500;
  border: none; cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--color-primary-hover); }

.btn-ghost {
  width: 100%; padding: 11px 24px; border-radius: 8px;
  background: transparent; color: var(--color-label);
  font-size: 13px; font-weight: 500;
  border: 1px solid var(--color-border); cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost:hover {
  border-color: var(--color-border-purple);
  background: #fafaff;
  color: var(--color-primary);
}

.divider {
  display: flex; align-items: center; gap: 12px;
}
.divider-line { flex: 1; height: 1px; background: var(--color-border); }
.divider-text { font-size: 11px; color: var(--color-body); }
</style>