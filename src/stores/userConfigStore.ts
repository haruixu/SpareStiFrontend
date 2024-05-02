import { ref } from 'vue'
import { defineStore } from 'pinia'
import authInterceptor from '@/services/authInterceptor'
import { AxiosError } from 'axios'

export const useUserConfigStore = defineStore('userConfig', () => {
    const role = ref('USER')
    const experience = ref('')
    const motivation = ref('')
    const challengeTypeConfigs = ref(
        [] as {
            type: string
            specificAmount: number
            generalAmount: number
        }[]
    )
    const accounts = ref({
        savings: '',
        spending: ''
    })
    const errorMessage = ref<string>('')

    const setExperience = (value: string) => {
        experience.value = value
    }

    const setMotivation = (value: string) => {
        motivation.value = value
    }

    const addChallengeTypeConfig = (
        type: string,
        specificAmount: number,
        generalAmount: number
    ) => {
        challengeTypeConfigs.value.push({ type, specificAmount, generalAmount })
    }

    const postAccount = async (
        accountType: 'SAVING' | 'SPENDING',
        accNumber: string,
        balance: number
    ) => {
        const payload = {
            accountType,
            accNumber,
            balance
        }
        await authInterceptor.post('/accounts', payload).catch((error) => {
            const axiosError = error as AxiosError
            errorMessage.value =
                (axiosError.response?.data as string) || 'An error occurred while posting account'
            console.error('Error posting account:', errorMessage.value)
        })
    }

    const postUserConfig = async () => {
        const payload = {
            experience: experience.value,
            motivation: motivation.value,
            challengeTypeConfigs: Array.from(challengeTypeConfigs.value)
        }
        await authInterceptor.post('/config/challenge', payload).catch((error) => {
            const axiosError = error as AxiosError
            errorMessage.value =
                (axiosError.response?.data as string) ||
                'An error occurred while updating configuration'
            console.error('Error updating configuration:', errorMessage.value)
        })
    }

    return {
        role,
        experience,
        motivation,
        challengeTypeConfigs,
        accounts,
        errorMessage,
        setExperience,
        setMotivation,
        addChallengeTypeConfig,
        postAccount,
        postUserConfig
    }
})
