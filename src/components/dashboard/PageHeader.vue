<template>
    <div v-if="!auth.user?.approved" class="page-header">
        <h2 class="text-heading-section font-light tracking-section">
            Welcome, {{ auth.user?.firstName }}
        </h2>
        <p class="text-caption text-body">Your account is being set up</p>
    </div>
    <div v-else class="page-header">
        <h2 class="text-heading-section font-light tracking-section">
            Good morning, {{ auth.user?.firstName }}
        </h2>
        <p class="text-caption text-body">Here's your financial overview for today</p>
    </div>
</template>
<script setup>
import { useAuthStore } from '../../stores/authStore'
const auth = useAuthStore()
</script>
<style scoped>
.page-header { margin-bottom: 1.75rem; }
</style>