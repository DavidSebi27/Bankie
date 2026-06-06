import api from './axios'

export const getMyAccounts = () => api.get('/accounts')

export const searchCustomersByName = (firstName, lastName) =>
  api.get('/accounts/search', { params: { firstName, lastName } })

export const verifyRecipient = (iban, firstName, lastName) =>
  api.get('/accounts/verify-recipient', { params: { iban, firstName, lastName } })

export const getCustomers = (status) =>
  api.get('/customers', { params: status ? { status } : {} })

export const getAccountsByCustomer = (customerId) =>
  api.get(`/customers/${customerId}/accounts`)

export const approveCustomer = (customerId, absoluteLimit, dailyTransferLimit) =>
  api.post(`/customers/${customerId}/approve`, { absoluteLimit, dailyTransferLimit })

export const closeAccount = (iban) =>
  api.patch(`/accounts/${iban}/close`)

export const updateLimits = (iban, limits) =>
  api.patch(`/accounts/${iban}/limits`, limits)