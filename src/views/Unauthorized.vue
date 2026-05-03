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

<style scoped src="../assets/styles/views/Unauthorized.css" />