import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

// Returns up-to-2-letter initials from the best available data, or '' if nothing
// usable. Empty string is the signal to render a fallback icon in the avatar.
export function useUserInitials() {
  const auth = useAuthStore()

  const initials = computed(() => {
    const u = auth.user
    if (!u) return ''

    const first = u.firstName?.trim()?.[0]
    const last  = u.lastName?.trim()?.[0]
    if (first && last) return (first + last).toUpperCase()
    if (first)         return first.toUpperCase()
    if (last)          return last.toUpperCase()

    // Last resort: use the first letter of the email's local part.
    const emailLetter = u.email?.trim()?.[0]
    return emailLetter ? emailLetter.toUpperCase() : ''
  })

  return { initials }
}
