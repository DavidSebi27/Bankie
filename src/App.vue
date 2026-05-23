<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAuthStore } from './stores/authStore'
import api from './api/axios'
import AppTopbar from './components/layout/AppTopbar.vue'

const auth = useAuthStore()
const route = useRoute()

// Cold-start handling — backend sleeps on Render free tier and can take
// up to ~2 min to wake. Fire an unauth'd /actuator/health on mount and
// show a banner if the response is slow.
const wakingUp = ref(false)
const SHOW_BANNER_AFTER_MS = 3000

const warmupBackend = () => {
  const timer = setTimeout(() => { wakingUp.value = true }, SHOW_BANNER_AFTER_MS)
  api.get('/actuator/health')
    .finally(() => {
      clearTimeout(timer)
      wakingUp.value = false
    })
}

onMounted(() => {
  warmupBackend()
  if (auth.token && !auth.initialized) {
    auth.fetchUser()
  }
})
</script>

<template>
  <div class="min-h-screen bg-bg text-body">
    <div v-if="wakingUp" class="wakeup-banner">
      <span class="wakeup-spinner" />
      <span class="wakeup-text">
        Waking up the server &mdash; this can take up to two minutes on first load.
      </span>
    </div>

    <AppTopbar v-if="auth.token && !route.meta.hideTopbar" />
    <router-view />
  </div>
</template>

<style scoped>
.wakeup-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  background: #eeeeff;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px solid var(--color-border-soft-purple);
  position: sticky;
  top: 0;
  z-index: 50;
}

.wakeup-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border-purple);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
