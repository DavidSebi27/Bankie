import { defineStore } from 'pinia'
import * as transactionsApi from '../api/transactions'

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        loading: false,
        error: null,
        page: 0,
        totalPages: 0,
        totalElements: 0,
        filters: { startDate: '', endDate: '', type: '', minAmount: '', maxAmount: '', iban: '' },
    }),

    getters: {
        recentFive: (state) => state.transactions.slice(0, 5),
        isFirstPage: (state) => state.page === 0,
        isLastPage: (state) => state.page >= state.totalPages - 1,
        hasActiveFilters: (state) =>
            !!(state.filters.startDate || state.filters.endDate ||
               state.filters.type ||
               state.filters.minAmount !== '' || state.filters.maxAmount !== '' ||
               state.filters.iban),
    },

    actions: {
        async fetchTransactions(page = 0) {
            this.loading = true
            this.error = null
            try {
                const f = this.filters
                const params = { page }
                if (f.startDate)        params.start     = f.startDate + 'T00:00:00'
                if (f.endDate)          params.end       = f.endDate   + 'T23:59:59'
                if (f.type)             params.type      = f.type
                if (f.minAmount !== '') params.minAmount = f.minAmount
                if (f.maxAmount !== '') params.maxAmount = f.maxAmount
                if (f.iban)             params.iban      = f.iban.replace(/\s/g, '')

                const res = await transactionsApi.getTransactions(params)
                const data = res.data
                this.transactions  = data.content       ?? []
                this.page          = data.number        ?? 0
                this.totalPages    = data.totalPages    ?? 0
                this.totalElements = data.totalElements ?? 0
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to load transactions'
            } finally {
                this.loading = false
            }
        },

        async applyFilters(filters) {
            this.filters = { ...filters }
            await this.fetchTransactions(0)
        },

        async resetFilters() {
            this.filters = { startDate: '', endDate: '', type: '', minAmount: '', maxAmount: '', iban: '' }
            await this.fetchTransactions(0)
        },

        async nextPage() {
            if (!this.isLastPage) await this.fetchTransactions(this.page + 1)
        },

        async prevPage() {
            if (!this.isFirstPage) await this.fetchTransactions(this.page - 1)
        },
    },
})
