import { defineStore } from 'pinia'
import * as accountsApi from '../api/accounts'

export const useAccountStore = defineStore('accounts', {
    state: () => ({
        accounts: [],
        loading: false,
        error: null,

        searchResults: [],
        searchLoading: false,
        searchError: null,
        searched: false,
    }),

    getters: {
        totalBalance: (state) =>
            state.accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0),
    },

    actions: {
        async fetchAccounts() {
            this.loading = true
            this.error = null
            try {
                const res = await accountsApi.getMyAccounts()
                const data = res.data
                this.accounts = Array.isArray(data) ? data : (data.content ?? [])
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to load accounts'
            } finally {
                this.loading = false
            }
        },

        async searchCustomers(firstName, lastName) {
            this.searchLoading = true
            this.searchError = null
            this.searched = false
            this.searchResults = []
            try {
                const res = await accountsApi.searchCustomersByName(firstName, lastName)
                const data = res.data
                this.searchResults = Array.isArray(data) ? data : (data.content ?? [])
                this.searched = true
            } catch (err) {
                this.searchError = err.response?.data?.message || 'Search failed'
            } finally {
                this.searchLoading = false
            }
        },

        clearSearch() {
            this.searchResults = []
            this.searchError = null
            this.searched = false
        },
    },
})
