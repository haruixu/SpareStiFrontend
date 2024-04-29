import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'
import router from '@/router'

const authInterceptor = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
})

authInterceptor.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

authInterceptor.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true
            sessionStorage.removeItem('accessToken')

            const loginToken = localStorage.getItem('loginToken')
            axios
                .post('/auth/loginToken', null, {
                    headers: {
                        Authorization: `Bearer ${loginToken}`
                    }
                })
                .then((response) => {
                    router.push({ name: 'login-bio', params: { username: response.data.username } })
                })
                .catch(() => {
                    localStorage.removeItem('loginToken')
                    router.push({ name: 'login' })

                    Promise.reject(error)
                })
        }

        return Promise.reject(error)
    }
)

export default authInterceptor
