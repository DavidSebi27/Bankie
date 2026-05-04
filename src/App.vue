<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import AppTopbar from './components/layout/AppTopbar.vue'

const auth = useAuthStore()

onMounted(() => {
  if (auth.token && !auth.initialized) {
    auth.fetchUser()
  }
})
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-bg text-body">
    <AppTopbar v-if="auth.token" />
    <router-view />
  </div>
</template>
