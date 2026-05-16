import { defineStore } from 'pinia'
import * as authApi from '../api/auth'

const readUser = () => {
    try {
        const raw = localStorage.getItem('user')
        return raw ? JSON.parse(raw) : { approved: false }
    } catch {
        return { approved: false }
    }
}

const persistSession = ({ token, role, user }) => {
    if (token != null) localStorage.setItem('token', token)
    if (role  != null) localStorage.setItem('role',  role)
    if (user  != null) localStorage.setItem('user',  JSON.stringify(user))
}

const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role:  localStorage.getItem('role')  || null,
        loading: false,
        initialized: false,
        error: null,
        user: readUser(),
    }),

    actions: {
        async login(credentials) {
            this.loading = true
            this.error = null

            try {
                const res = await authApi.login(credentials)

                this.token = res.data.token
                this.role = res.data.role
                this.user = { ...res.data.user, approved: res.data.approved }
                persistSession({ token: this.token, role: this.role, user: this.user })
                await this.fetchUser()
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed'
                return false
            } finally {
                this.loading = false
            }
        },
        async fetchUser() {
            try {
                const user = await authApi.fetchUser()
                this.user = user
                if (user.role) this.role = user.role
                persistSession({ user, role: user.role })
            } catch (err) {
                if (err.response?.status === 401) {
                    // Token is invalid — drop the session so the user gets the login screen
                    // instead of being stuck in an "authorized-but-no-role" loop.
                    this.logout()
                } else {
                    this.error = 'Failed to fetch user data'
                }
            } finally {
                this.initialized = true
            }
        },

        async register(data) {
            this.loading = true
            this.error = null

            try {
                await authApi.register(data)
                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Register failed'
                return false
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.token = null
            this.role = null
            this.user = null
            this.initialized = false
            clearSession()
        }
    }
})
