import { defineStore } from 'pinia'
import * as accountsApi from '../api/accounts'

export const useAccountStore = defineStore('accounts', {
    state: () => ({
        accounts: [],
        loading:  false,
        error:    null,
    }),

    getters: {
        totalBalance: (state) =>
            state.accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0),
    },

    actions: {
        async fetchAccounts() {
            this.loading = true
            this.error   = null
            try {
                const res  = await accountsApi.getMyAccounts()
                const data = res.data
                this.accounts = Array.isArray(data) ? data : (data.content ?? [])
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to load accounts'
            } finally {
                this.loading = false
            }
        },
    },
})
