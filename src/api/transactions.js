import api from './axios'

export const getTransactions = (params) => api.get('/transactions', { params })
