import { defineStore } from 'pinia'
import * as transactionsApi from '../api/transactions'

const EMPTY_FILTERS = Object.freeze({
    startDate: '', endDate: '', type: '', minAmount: '', maxAmount: '', iban: '',
})

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        loading: false,
        error: null,
        page: 0,
        totalPages: 0,
        totalElements: 0,
        filters: { ...EMPTY_FILTERS },
    }),

    getters: {
        recentFive: (state) => state.transactions.slice(0, 5),
        isFirstPage: (state) => state.page === 0,
        isLastPage: (state) => state.page >= state.totalPages - 1,
        hasActiveFilters: (state) => Object.values(state.filters).some(v => v !== ''),
    },

    actions: {
        async _load(params) {
            this.loading = true
            this.error = null
            try {
                const { data } = await transactionsApi.getTransactions(params)
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

        // Translate current filter state into API query params.
        _filterParams() {
            const f = this.filters
            const params = {}
            if (f.startDate)        params.start     = `${f.startDate}T00:00:00`
            if (f.endDate)          params.end       = `${f.endDate}T23:59:59`
            if (f.type)             params.type      = f.type
            if (f.minAmount !== '') params.minAmount = f.minAmount
            if (f.maxAmount !== '') params.maxAmount = f.maxAmount
            if (f.iban)             params.iban      = f.iban.replace(/\s/g, '')
            return params
        },

        // Paginated list, respects current filters. Used by /transactions.
        fetchTransactions(page = 0) {
            return this._load({ page, ...this._filterParams() })
        },

        // Small unfiltered list. Used by the dashboard widget.
        fetchRecent(size = 5) {
            return this._load({ page: 0, size })
        },

        applyFilters(filters) {
            this.filters = { ...filters }
            return this.fetchTransactions(0)
        },

        resetFilters() {
            this.filters = { ...EMPTY_FILTERS }
            return this.fetchTransactions(0)
        },

        nextPage() {
            if (this.isLastPage) return
            return this.fetchTransactions(this.page + 1)
        },

        prevPage() {
            if (this.isFirstPage) return
            return this.fetchTransactions(this.page - 1)
        },
    },
})
