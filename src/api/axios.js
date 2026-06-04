import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Global 401 handler — covers the deploy-invalidation case (every active
// JWT becomes invalid on backend restart) and any plain "token expired"
// flow. Only fires when there *was* a token, so a wrong-credentials
// 401 on /auth/login still surfaces normally to the login form.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status      = error.response?.status
        const hadToken    = !!localStorage.getItem('token')
        const onAtmKiosk  = window.location.pathname === '/atm'
        const onLogin     = ['/login', '/employee/login'].includes(window.location.pathname)

        if (status === 401 && hadToken && !onAtmKiosk && !onLogin) {
            // Lazy import to dodge the axios ↔ authStore module cycle.
            const { useAuthStore } = await import('../stores/authStore')
            useAuthStore().logout()
            // Hard navigation — resets in-flight state, sidesteps the router
            // guard's "no token → /login" branch reliably.
            window.location.assign('/login')
        }

        return Promise.reject(error)
    }
)

export default api
