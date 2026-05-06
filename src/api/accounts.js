import api from './axios'

export const getMyAccounts = () => api.get('/accounts')
