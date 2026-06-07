import api from './axios'

export const login = (data) => {
    return api.post('/auth/login', data)
}
export const register = (data) => {
    return api.post('/auth/register', data)
}
export const updateMe = (data) => {
    // Backend only accepts { email?, phoneNumber? } — strip anything else
    // defensively so a stray firstName/bsn/etc. can't sneak through.
    const body = {}
    if (data?.email != null)       body.email       = data.email
    if (data?.phoneNumber != null) body.phoneNumber = data.phoneNumber
    return api.patch('/users/me', body)
}

export const fetchUser = async () => {
    const res = await api.get('/users/me')
    return res.data
}