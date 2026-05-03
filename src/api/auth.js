import api from './axios'

export const login = (data) => {
    return api.post('/auth/login', data)
}
export const register = (data) => {
    return api.post('/auth/register', data)
}

export const fetchUser = async () => {
    const res = await api.get('/users/me')
    return res.data
    console.log('Fetched user data:', res.data) // Debugging line
}