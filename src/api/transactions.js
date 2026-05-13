import api from './axios'

export const getTransactions = (params) =>
    api.get('/transactions', { params })

export const getCustomerTransactions = (customerId, params) =>
    api.get(`/customers/${customerId}/transactions`, { params })

export const createTransfer = (body) =>
    api.post('/transactions', body)
