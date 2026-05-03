import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

export function useUserInitials() {
  const auth = useAuthStore()
  const initials = computed(() => {
    const u = auth.user
    if (!u) return '?'
    return `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()
  })
  return { initials }
}
