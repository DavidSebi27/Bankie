import api from './axios'

export const getMyAccounts = () => api.get('/accounts')

export const searchCustomersByName = (firstName, lastName) =>
  api.get('/accounts/search', { params: { firstName, lastName } })
