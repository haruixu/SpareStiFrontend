import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
    const defaultUser: User = {
        username: 'Username'
    }

    const user = ref<User>(defaultUser)

    async function register(username: string, password: string) {
        try {
            const response = await axios.post(`http://localhost:8080/auth/register`, {
                username: username,
                password: password
            })

            if (response.status === 200) {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                user.value.username = username
            }
        } catch (error) {
            console.error('Failed to register:', error)
        }
    }

    async function login(username: string, password: string) {
        try {
            const response = await axios.post(`http://localhost:8080/auth/login`, {
                username: username,
                password: password
            })

            console.log(response)

            if (response.status === 200) {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                user.value.username = username
            }
        } catch (error) {
            console.error('Failed to login:', error)
        }
    }

    return {
        login,
        register
    }
})
