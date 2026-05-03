<template>
    <div class="dash">
        <Topbar />
        <div class="layout">
            <Sidebar v-if="auth.user?.approved" />
            <main class="content">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import TopBar from './Topbar.vue'
import Sidebar from './Sidebar.vue'

const auth = useAuthStore()
const refreshing = ref(false)

const refreshUser = async () => {
    refreshing.value = true
    await auth.fetchUser()
    refreshing.value = false
}

let pollInterval = null
onMounted(() => {
    pollInterval = setInterval(() => {
        if (!auth.user?.approved) refreshUser()
        else clearInterval(pollInterval)
    }, 10000)
})

onUnmounted(() => clearInterval(pollInterval))

const initials = computed(() => {
    const u = auth.user
    return u ? `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() : '?'
})
</script>
<style scoped>
.dash { min-height: 100vh; background: #f4f6fb; }
.layout { display: flex; }
.content { flex: 1; padding: 2rem; max-width: 900px; }
</style>