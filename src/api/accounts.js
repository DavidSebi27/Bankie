import api from './axios'

export const getMyAccounts = () => api.get('/accounts')

export const getAccountsByCustomer = (customerId) =>
  api.get('/accounts', { params: { customerId } })          

export const searchCustomersByName = (firstName, lastName) =>
  api.get('/accounts/search', { params: { firstName, lastName } })

export const verifyRecipient = (iban, firstName, lastName) =>
  api.get('/accounts/verify-recipient', { params: { iban, firstName, lastName } })

export const approveCustomer = (customerId, absoluteLimit, dailyTransferLimit) =>
  api.post(`/accounts/customers/${customerId}/approve`, { absoluteLimit, dailyTransferLimit })

export const closeAccount = (iban) =>
  api.patch(`/accounts/${iban}/close`)

export const updateAbsoluteLimit = (iban, absoluteLimit) =>
  api.patch(`/accounts/${iban}/absolute-limit`, { absoluteLimit })

export const updateDailyLimit = (iban, dailyTransferLimit) =>
  api.patch(`/accounts/${iban}/daily-limit`, { dailyTransferLimit })