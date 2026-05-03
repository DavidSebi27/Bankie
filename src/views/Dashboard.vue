<template>
  <DashboardLayout>
    <PendingState v-if="!auth.user?.approved && !auth.initialized" />
    <DashboardHome v-else/>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import PendingState from '../components/dashboard/PendingState.vue'
import DashboardHome from '../components/dashboard/DashboardHome.vue'
import { useAuthStore } from '../stores/authStore'
const auth = useAuthStore()
</script>