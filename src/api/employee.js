import api from './axios'

export const getUsers = () => api.get('/users')


export const getCustomers = (status) =>
  api.get('/customers', { params: status ? { status } : {} })