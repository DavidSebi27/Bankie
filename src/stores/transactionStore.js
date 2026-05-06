import { defineStore } from 'pinia'
import * as transactionsApi from '../api/transactions'

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        items:         [],
        page:          0,
        size:          20,
        sort:          'timestamp,desc',
        totalElements: 0,
        totalPages:    0,
        first:         true,
        last:          true,
        loading:       false,
        error:         null,
        notFound:      false,
    }),

    actions: {
        async fetch() {
            this.loading  = true
            this.error    = null
            this.notFound = false

            try {
                const res = await transactionsApi.getTransactions({
                    page: this.page,
                    size: this.size,
                    sort: this.sort,
                })

                this.items         = res.data.content
                this.totalElements = res.data.totalElements
                this.totalPages    = res.data.totalPages
                this.first         = res.data.first
                this.last          = res.data.last
            } catch (err) {
                const status = err.response?.status
                if (status === 404) {
                    this.notFound = true
                } else {
                    this.error = err.response?.data?.message || 'Failed to load transactions'
                }
            } finally {
                this.loading = false
            }
        },

        goToPage(page) {
            if (page < 0 || (this.totalPages > 0 && page >= this.totalPages)) return
            this.page = page
            return this.fetch()
        },

        reset() {
            this.items         = []
            this.page          = 0
            this.totalElements = 0
            this.totalPages    = 0
            this.first         = true
            this.last          = true
            this.error         = null
            this.notFound      = false
        },
    },
})
