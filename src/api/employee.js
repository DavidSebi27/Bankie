import api from './axios'

export const getUsers = () => api.get('/users')
export const getCustomersWithoutAccounts = () => api.get('/accounts/customers/without-accounts')
export const getCustomersWithAllAccountsClosed = () => api.get('/accounts/customers/all-accounts-closed')