import { defineStore } from 'pinia'
import * as authApi from '../api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: null,
        loading: false,
        initialized: false,
        error: null,
        user: {
            approved: false
        }
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
                localStorage.setItem('token', this.token)
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
                this.user = { ...user, approved: user.approved }
            } catch (err) {
                this.error = 'Failed to fetch user data'
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
            localStorage.removeItem('token')
        }
    }
})