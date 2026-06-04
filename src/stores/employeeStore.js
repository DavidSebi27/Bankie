import { defineStore } from 'pinia'
import { getUsers } from '../api/employee'

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    users:   [],
    loading: false,
    error:   null,
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
        const res  = await getUsers()
        const data = res.data
        this.users = Array.isArray(data) ? data : (data.content ?? [])
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load users'
      } finally {
        this.loading = false
      }
    },
  },
})