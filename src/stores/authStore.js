import { defineStore } from 'pinia'
import * as authApi from '../api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        role: null,
        loading: false,
        error: null
    }),

    actions: {
        async login(credentials) {
            this.loading = true
            this.error = null

            try {
                const res = await authApi.login(credentials)

                this.token = res.data.token
                this.role = res.data.role

                localStorage.setItem('token', this.token)

                return true
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed'
                return false
            } finally {
                this.loading = false
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
            localStorage.removeItem('token')
        }
    }
})