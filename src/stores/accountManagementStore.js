import { defineStore } from 'pinia'
import {
    getAccountsByCustomer,
    closeAccount,
    updateAbsoluteLimit,
    updateDailyLimit,
    approveCustomer,
} from '../api/accounts'

export const useAccountManagementStore = defineStore('accountManagement', {
    state: () => ({
        accounts: [],
        accountsLoading: false,
        accountsError: null,

        limitForms: {},

        accountActionMsg: '',
        accountActionError: '',

        approveForm: {
            absoluteLimit: 0,
            dailyTransferLimit: 1000,
        },
        approveValidationError: '',
        approving: false,
        approveError: '',
        approveSuccess: '',
    }),

    actions: {
        async fetchAccounts(customerId) {
            this.accountsLoading = true
            this.accountsError = null
            this.accounts = []
            try {
                const res = await getAccountsByCustomer(customerId)
                const data = res.data
                this.accounts = Array.isArray(data) ? data : (data.content ?? [])
                this.limitForms = {}
                this.accounts.forEach(acc => {
                    this.limitForms[acc.iban] = {
                        absoluteLimit: acc.absoluteLimit ?? 0,
                        dailyLimit: acc.dailyTransferLimit ?? 1000,
                    }
                })
            } catch (err) {
                this.accountsError = err.response?.data?.message || 'Failed to load accounts'
            } finally {
                this.accountsLoading = false
            }
        },

        async handleClose(iban, customerId) {
            this.accountActionMsg = ''
            this.accountActionError = ''
            try {
                await closeAccount(iban)
                this.accountActionMsg = `Account ${iban} closed successfully.`
                await this.fetchAccounts(customerId)
            } catch (err) {
                this.accountActionError = err.response?.data?.message || 'Failed to close account'
            }
        },

        async handleAbsoluteLimit(iban, customerId) {
            this.accountActionMsg = ''
            this.accountActionError = ''
            try {
                await updateAbsoluteLimit(iban, this.limitForms[iban].absoluteLimit)
                this.accountActionMsg = 'Absolute limit updated.'
                await this.fetchAccounts(customerId)
            } catch (err) {
                this.accountActionError = err.response?.data?.message || 'Failed to update limit'
            }
        },

        async handleDailyLimit(iban, customerId) {
            this.accountActionMsg = ''
            this.accountActionError = ''
            try {
                await updateDailyLimit(iban, this.limitForms[iban].dailyLimit)
                this.accountActionMsg = 'Daily limit updated.'
                await this.fetchAccounts(customerId)
            } catch (err) {
                this.accountActionError = err.response?.data?.message || 'Failed to update limit'
            }
        },

        async handleApprove(customerId, onSuccess) {
            this.approveValidationError = ''
            this.approveError = ''
            this.approveSuccess = ''

            if (this.approveForm.absoluteLimit > 0) {
                this.approveValidationError = 'Absolute limit must be zero or negative.'
                return
            }
            if (this.approveForm.dailyTransferLimit < 0) {
                this.approveValidationError = 'Daily transfer limit must be zero or positive.'
                return
            }

            this.approving = true
            try {
                await approveCustomer(
                    customerId,
                    this.approveForm.absoluteLimit,
                    this.approveForm.dailyTransferLimit
                )
                this.approveSuccess = 'Customer approved and accounts created.'
                if (onSuccess) await onSuccess()
                await this.fetchAccounts(customerId)
            } catch (err) {
                this.approveError = err.response?.data?.message || 'Failed to approve customer'
            } finally {
                this.approving = false
            }
        },
    },
})