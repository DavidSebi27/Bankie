<template>
  <div class="min-h-screen bg-bg text-body">

    <nav v-if="route.meta.layout !== 'auth'" class="p-4 border-b border-default bg-white">
      <div class="max-w-[1080px] mx-auto flex justify-between">
        <h1>Bankie</h1>
      </div>
      <button 
            @click="handleLogout" 
            class="text-primary hover:text-red-500 transition-colors"
          >
            Logout
          </button>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
