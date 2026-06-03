import { defineStore } from 'pinia'
import {
  approveCustomer,
  closeAccount,
  updateAbsoluteLimit,
  updateDailyLimit,
  getAccountsByCustomer,
} from '../api/accounts'

export const useAccountManagementStore = defineStore('accountManagement', {
  state: () => ({
    accounts: [],
    accountsLoading: false,
    accountsError: null,
    accountActionMsg: null,
    accountActionError: null,
    limitForms: {},

    approveForm: { absoluteLimit: 0, dailyTransferLimit: 1000 },
    approving: false,
    approveError: null,
    approveSuccess: null,
    approveValidationError: null,
  }),

  actions: {
    validateApproveForm() {
      if (this.approveForm.absoluteLimit === '' || this.approveForm.dailyTransferLimit === '') {
        return 'Both fields are required.'
      }
      if (this.approveForm.dailyTransferLimit <= 0) {
        return 'Daily transfer limit must be a positive number.'
      }
      if (this.approveForm.absoluteLimit > 0) {
        return 'Absolute limit must be zero or negative.'
      }
      return null
    },

    async fetchAccounts(customerId) {
      this.accountsLoading = true
      this.accountsError   = null
      this.accounts        = []
      try {
        const res = await getAccountsByCustomer(customerId)
        const all = res.data.content ?? res.data
        this.accounts = all
        all.forEach(a => {
          if (!this.limitForms[a.iban]) {
            this.limitForms[a.iban] = { absoluteLimit: a.absoluteLimit, dailyLimit: a.dailyTransferLimit }
          }
        })
      } catch (err) {
        this.accountsError = err.response?.data?.message || 'Failed to load accounts'
      } finally {
        this.accountsLoading = false
      }
    },

    async handleApprove(customerId, onSuccess) {
      this.approveValidationError = null
      this.approveError           = null
      this.approveSuccess         = null

      const error = this.validateApproveForm()
      if (error) { this.approveValidationError = error; return }

      this.approving = true
      try {
        await approveCustomer(customerId, this.approveForm.absoluteLimit, this.approveForm.dailyTransferLimit)
        this.approveSuccess = 'Customer approved and accounts created!'
        if (onSuccess) await onSuccess()
        await this.fetchAccounts(customerId)
      } catch (err) {
        this.approveError = err.response?.data?.message || 'Failed to approve customer'
      } finally {
        this.approving = false
      }
    },

    async handleClose(iban, customerId) {
      this.accountActionMsg   = null
      this.accountActionError = null
      try {
        await closeAccount(iban)
        this.accountActionMsg = `Account ${iban} closed.`
        await this.fetchAccounts(customerId)
      } catch (err) {
        this.accountActionError = err.response?.data?.message || 'Failed to close account'
      }
    },

    async handleAbsoluteLimit(iban, customerId) {
      this.accountActionMsg   = null
      this.accountActionError = null
      try {
        await updateAbsoluteLimit(iban, this.limitForms[iban].absoluteLimit)
        this.accountActionMsg = `Absolute limit updated for ${iban}.`
        await this.fetchAccounts(customerId)
      } catch (err) {
        this.accountActionError = err.response?.data?.message || 'Failed to update limit'
      }
    },

    async handleDailyLimit(iban, customerId) {
      this.accountActionMsg   = null
      this.accountActionError = null
      try {
        await updateDailyLimit(iban, this.limitForms[iban].dailyLimit)
        this.accountActionMsg = `Daily limit updated for ${iban}.`
        await this.fetchAccounts(customerId)
      } catch (err) {
        this.accountActionError = err.response?.data?.message || 'Failed to update limit'
      }
    },
  },
})