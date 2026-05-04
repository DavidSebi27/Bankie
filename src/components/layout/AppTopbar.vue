<template>
  <div class="topbar">
    <h1 class="logo">Banki<span>e</span></h1>

    <div class="topbar-right">
      <button class="notif-btn" aria-label="Notifications">
        <Bell class="notif-bell" />
        <span class="notif-dot" />
      </button>

      <div class="avatar-wrap" @click="menuOpen = !menuOpen">
        <div class="avatar">{{ initials }}</div>
        <ChevronDown class="chevron" :class="{ 'chevron-open': menuOpen }" />
      </div>

      <Transition name="menu">
        <div v-if="menuOpen" class="dropdown" v-click-outside="() => menuOpen = false">
          <div class="dropdown-header">
            <p class="dropdown-name">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
            <p class="dropdown-email">{{ auth.user?.email }}</p>
          </div>
          <div class="dropdown-divider" />
          <RouterLink to="/profile" class="dropdown-item" @click="menuOpen = false">
            <User class="dropdown-icon" /> Profile
          </RouterLink>
          <RouterLink to="/settings" class="dropdown-item" @click="menuOpen = false">
            <Settings class="dropdown-icon" /> Settings
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useUserInitials } from '../../composables/useUserInitials'
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const menuOpen = ref(false)
const { initials } = useUserInitials()

const handleLogout = () => {
  menuOpen.value = false
  auth.logout()
  router.push('/login')
}
</script>

<style scoped src="../../assets/styles/layout/AppTopbar.css" />
