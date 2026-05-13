import api from './axios'

export const getTransactions = (page = 0) =>
  api.get('/transactions', { params: { page } })
