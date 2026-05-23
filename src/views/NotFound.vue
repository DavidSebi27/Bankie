<template>
  <div class="page">
    <div class="card">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="icon-ring">
        <SearchX class="lock-icon" />
      </div>
      <span class="error-code">404 · Not Found</span>
      <h1 class="title">Page not found</h1>
      <p class="desc">
        The page you're looking for doesn't exist or has been moved.
        Double-check the URL or head back to your dashboard.
      </p>
      <div class="actions">
        <RouterLink :to="homePath">
          <button class="btn-primary">Go to dashboard</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { SearchX } from 'lucide-vue-next'

const auth = useAuthStore()

// Send the user to wherever "home" is for their session.
const homePath = computed(() => {
  if (!auth.token) return '/login'
  return auth.role === 'EMPLOYEE' ? '/employee/dashboard' : '/dashboard'
})
</script>

<style scoped src="../assets/styles/views/NotFound.css" />
