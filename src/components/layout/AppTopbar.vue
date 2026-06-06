<template>
  <div class="topbar">
    <h1 class="logo">Banki<span>e</span></h1>

    <div class="topbar-right">
      <RouterLink v-if="auth.role === 'CUSTOMER' && auth.user?.approved" to="/atm" class="atm-link">
        <Banknote class="atm-icon" />
        <span>ATM</span>
      </RouterLink>

      <button class="notif-btn" aria-label="Notifications">
        <Bell class="notif-bell" />
        <span class="notif-dot" />
      </button>

      <div class="avatar-wrap" @click="menuOpen = !menuOpen">
        <div class="avatar">
          <span v-if="initials">{{ initials }}</span>
          <User v-else class="avatar-fallback-icon" />
        </div>
        <ChevronDown class="chevron" :class="{ 'chevron-open': menuOpen }" />
      </div>

      <Transition name="menu">
        <div v-if="menuOpen" class="dropdown" v-click-outside="() => menuOpen = false">
          <div class="dropdown-header">
            <p class="dropdown-name">{{ displayName }}</p>
            <p v-if="auth.user?.email" class="dropdown-email">{{ auth.user.email }}</p>
          </div>
          <div class="dropdown-divider" />
          <RouterLink
            v-if="auth.role !== 'CUSTOMER' || auth.user?.approved"
            to="/profile" class="dropdown-item" @click="menuOpen = false">
            <User class="dropdown-icon" /> Profile
          </RouterLink>
          <div class="dropdown-divider" />
          <button class="dropdown-item dropdown-item-danger" @click="handleLogout">
            <LogOut class="dropdown-icon" /> Logout
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useUserInitials } from '../../composables/useUserInitials'
import { Bell, ChevronDown, User, Settings, LogOut, Banknote } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const menuOpen = ref(false)
const { initials } = useUserInitials()

const displayName = computed(() => {
  const u = auth.user
  const full = `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim()
  return full || u?.email || 'New user'
})

const handleLogout = () => {
  menuOpen.value = false
  auth.logout()
  router.push('/login')
}
</script>

<style scoped src="../../assets/styles/layout/AppTopbar.css" />
