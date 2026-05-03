import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

export function useApprovalPolling(intervalMs = 10_000) {
  const auth = useAuthStore()
  const refreshing = ref(false)
  let pollInterval = null

  const refreshUser = async () => {
    refreshing.value = true
    await auth.fetchUser()
    refreshing.value = false
  }

  onMounted(() => {
    pollInterval = setInterval(() => {
      if (!auth.user?.approved) refreshUser()
      else clearInterval(pollInterval)
    }, intervalMs)
  })

  onUnmounted(() => clearInterval(pollInterval))

  return { refreshing, refreshUser }
}
