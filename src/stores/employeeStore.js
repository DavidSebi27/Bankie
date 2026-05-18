import { defineStore } from 'pinia'
import * as employeeApi from '../api/employee'

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        users:       [],
        loading:     false,
        approvingId: null,
        error:       null,
    }),

    getters: {
        customers: (state) =>
            Array.isArray(state.users) ? state.users.filter(u => u.role === 'CUSTOMER') : [],
        pendingUsers: (state) =>
            Array.isArray(state.users)
                ? state.users.filter(u => u.role === 'CUSTOMER' && !u.approved)
                : [],
    },

    actions: {
        async fetchUsers() {
            this.loading = true
            this.error   = null
            try {
                const res  = await employeeApi.getUsers()
                const data = res.data
                // Handle both plain array and Spring Boot Page wrapper { content: [...] }
                this.users = Array.isArray(data) ? data : (data.content ?? [])
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to load users'
            } finally {
                this.loading = false
            }
        },
    },
})
