<script setup>
import { useRoute } from 'vue-router'

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