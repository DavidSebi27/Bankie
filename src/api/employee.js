import api from './axios'

export const getUsers = (params = {}) => api.get('/users', { params })
export const getCustomersWithoutAccounts = () => api.get('/users', { params: { status: 'no-accounts' } })
export const getCustomersWithAllAccountsClosed = () => api.get('/users', { params: { status: 'all-closed' } })