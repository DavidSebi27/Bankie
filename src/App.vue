<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const auth = useAuthStore()

onMounted(() => {
    if (auth.token) {
        auth.fetchUser()
    } else {
        auth.initialized = true
    }
})
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-bg text-body">

    <nav v-if="route.meta.layout !== 'auth'" class="p-4 border-b border-default bg-white">
      <div class="max-w-[1080px] mx-auto flex justify-between">
        <h1>Bankie</h1>
      </div>
    </nav>

    <router-view />
  </div>
</template>
