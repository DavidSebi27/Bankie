import api from './axios'

export const getTransactions = (params = {}) =>
  api.get('/transactions', { params })

export const getCustomerTransactions = (customerId, params) =>
    api.get('/transactions', { params: { ...params, customerId } })

export const createTransfer = (body) =>
    api.post('/transactions', body)

export const deposit = (body) =>
    api.post('/transactions/deposit', body)

export const withdraw = (body) =>
    api.post('/transactions/withdraw', body)
