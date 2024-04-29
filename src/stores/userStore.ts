import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import router from '@/router'
import type { AxiosError } from 'axios'
import axios from 'axios'
import authInterceptor from "@/services/authInterceptor";
import type {Streak} from "@/types/streak";

export const useUserStore = defineStore('user', () => {
    const defaultUser: User = {
        firstname: 'Firstname',
        lastname: 'Lastname',
        username: 'Username'
    }

    const user = ref<User>(defaultUser)
    const errorMessage = ref<string>('')
    const streak = ref<Streak>()

    const register = async (
        firstname: string,
        lastname: string,
        email: string,
        username: string,
        password: string
    ) => {
        await axios
            .post(`http://localhost:8080/auth/register`, {
                firstName: firstname, //TODO rename all instances of firstname to firstName
                lastName: lastname,
                email: email,
                username: username,
                password: password
            })
            .then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)

                user.value.firstname = firstname
                user.value.lastname = lastname
                user.value.username = username

                router.push({ name: 'configurations1' })
            })
            .catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
            })
    }

    const login = async (username: string, password: string) => {
        await axios
            .post(`http://localhost:8080/auth/login`, {
                username: username,
                password: password
            })
            .then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)

                user.value.firstname = response.data.firstName
                user.value.lastname = response.data.lastName
                user.value.username = response.data.username

                router.push({ name: 'home' })
            })
            .catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
            })
    }

    const logout = () => {
        console.log('Logging out')
        sessionStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        user.value = defaultUser
        router.push({ name: 'login' })
    }
    const getUserStreak = async () => {
        try {
            const response = await authInterceptor('/profile/streak')
            if (response.data) {
                streak.value = response.data
                console.log('Fetched Challenges:', streak.value)
            } else {
                streak.value = undefined;
                console.error('No challenge content found:', response.data)
            }
        } catch (error) {
            console.error('Error fetching challenges:', error)
            streak.value = undefined // Ensure challenges is always an array
        }
    }

    return {
        register,
        login,
        logout,
        errorMessage,
        getUserStreak,
        streak,
    }
})
