import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import axios, { AxiosError } from 'axios'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
    const defaultUser: User = {
        firstname: 'Firstname',
        lastname: 'Lastname',
        username: 'Username'
    }

    const user = ref<User>(defaultUser)
    const errorMessage = ref<string>('')

    async function register(
        firstname: string,
        lastname: string,
        email: string,
        username: string,
        password: string
    ) {
        try {
            const response = await axios.post(`http://localhost:8080/auth/register`, {
                firstName: firstname, //TODO rename all instances of firstname to firstName
                lastName: lastname,
                email: email,
                username: username,
                password: password
            })

            sessionStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)

            user.value.firstname = firstname
            user.value.lastname = lastname
            user.value.username = username

            await router.push('/')
        } catch (error) {
            const axiosError = error as AxiosError
            errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
        }
    }

    async function login(username: string, password: string) {
        try {
            const response = await axios.post(`http://localhost:8080/auth/login`, {
                username: username,
                password: password
            })

            console.log(response)

            sessionStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            user.value.username = username
            await router.push('/konfigurasjonSteg1')
        } catch (error) {
            const axiosError = error as AxiosError
            errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
        }
    }

    return {
        login,
        register,
        errorMessage
    }
})
