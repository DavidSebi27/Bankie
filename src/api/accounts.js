import api from './axios'

export const getMyAccounts = () => api.get('/me/accounts')
