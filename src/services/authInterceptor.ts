import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

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
            const username = localStorage.getItem('spareStiUsername')

            if (!username) {
                useUserStore().logout()
            } else {
                await router.push({ name: 'login-bio', params: { username: username } })
            }
        }
        return Promise.reject(error)
    }
)

export default authInterceptor
