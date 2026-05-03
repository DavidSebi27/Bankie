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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-vue-next'

const auth   = useAuthStore()
const router = useRouter()

const menuOpen = ref(false)

const initials = computed(() => {
  const u = auth.user
  if (!u) return '?'
  return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()
})

const handleLogout = () => {
  menuOpen.value = false
  auth.logout()
  router.push('/login')
}

const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el._clickOutside)
  }
}
</script>

<style scoped>
.topbar {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: -0.64px;
  color: var(--color-heading);
}
.logo span { color: var(--color-primary); }

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

/* ── Notification button ── */
.notif-btn {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; position: relative; transition: border-color 0.2s;
}
.notif-btn:hover { border-color: var(--color-border-purple); }
.notif-bell { width: 16px; height: 16px; color: var(--color-body); }
.notif-dot {
  position: absolute; top: 7px; right: 7px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--color-ruby);
  border: 1.5px solid white;
}

/* ── Avatar + chevron ── */
.avatar-wrap {
  display: flex; align-items: center; gap: 6px;
  cursor: pointer; user-select: none;
}
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 500; color: white;
}
.chevron {
  width: 14px; height: 14px; color: var(--color-body);
  transition: transform 0.2s;
}
.chevron-open { transform: rotate(180deg); }

/* ── Dropdown ── */
.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 200;
}

.dropdown-header {
  padding: 14px 16px 12px;
}
.dropdown-name {
  font-size: 13px; font-weight: 500; color: var(--color-heading);
}
.dropdown-email {
  font-size: 11px; color: var(--color-body); margin-top: 2px;
}

.dropdown-divider {
  height: 1px; background: var(--color-border);
}

.dropdown-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px;
  font-size: 13px; color: var(--color-label);
  text-decoration: none; background: none;
  border: none; width: 100%; text-align: left;
  cursor: pointer; transition: background 0.15s;
}
.dropdown-item:hover { background: #f4f6fb; color: var(--color-heading); }
.dropdown-item-danger { color: var(--color-ruby); }
.dropdown-item-danger:hover { background: #fff0f5; color: var(--color-ruby); }
.dropdown-icon { width: 15px; height: 15px; opacity: 0.8; flex-shrink: 0; }

/* ── Transition ── */
.menu-enter-active, .menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>