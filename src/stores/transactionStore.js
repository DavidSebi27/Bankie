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
    }),

    getters: {
        recentFive: (state) => state.transactions.slice(0, 5),
        isFirstPage: (state) => state.page === 0,
        isLastPage: (state) => state.page >= state.totalPages - 1,
    },

    actions: {
        async fetchTransactions(page = 0) {
            this.loading = true
            this.error = null
            try {
                const res = await transactionsApi.getTransactions(page)
                const data = res.data
                this.transactions = data.content ?? []
                this.page = data.number ?? 0
                this.totalPages = data.totalPages ?? 0
                this.totalElements = data.totalElements ?? 0
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to load transactions'
            } finally {
                this.loading = false
            }
        },

        async nextPage() {
            if (!this.isLastPage) await this.fetchTransactions(this.page + 1)
        },

        async prevPage() {
            if (!this.isFirstPage) await this.fetchTransactions(this.page - 1)
        },
    },
})
