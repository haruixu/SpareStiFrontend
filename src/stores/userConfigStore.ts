import { ref } from 'vue'
import { defineStore } from 'pinia'
import authInterceptor from '@/services/authInterceptor'
import { AxiosError } from 'axios'
import type { ChallengeConfig } from '@/types/challengeConfig'
import router from '@/router'

export const useUserConfigStore = defineStore('userConfig', () => {

    // Reactive state to hold the challenge configuration
    const challengeConfig = ref<ChallengeConfig>({
        experience: '',
        motivation: '',
        challengeTypeConfigs: []
    })

    // Reactive state to hold the saving account information
    const savingAccount = ref({
        accountType: 'SAVING',
        accNumber: 0,
        balance: 0
    })

    // Reactive state to hold the spending account information
    const spendingAccount = ref({
        accountType: 'SPENDING',
        accNumber: 0,
        balance: 0
    })

    const errorMessage = ref<string>('')

    // Function to set experience in the challenge configuration
    const setExperience = (value: string) => {
        challengeConfig.value.experience = value
    }

    // Function to set motivation in the challenge configuration
    const setMotivation = (value: string) => {
        challengeConfig.value.motivation = value
    }

    // Function to add challenge type configuration
    const addChallengeTypeConfig = (
        type: string,
        specificAmount: number,
        generalAmount: number
    ) => {
        challengeConfig.value.challengeTypeConfigs.push({
            type: type,
            specificAmount: specificAmount,
            generalAmount: generalAmount
        })
    }

    // Function to set account information
    const setAccount = (type: 'SAVING' | 'SPENDING', accNumber: number) => {
        if (type === 'SAVING') {
            savingAccount.value.accNumber = accNumber
        } else {
            spendingAccount.value.accNumber = accNumber
        }
    }

    // Function to create user configuration
    const createConfig = () => {
        authInterceptor
            // Create saving account
            .post('/accounts', savingAccount.value)
            // Create spending account
            .then(() => authInterceptor.post('/accounts', spendingAccount.value))
            // Create challenge configuration
            .then(() => authInterceptor.post('/config/challenge', challengeConfig.value))
            // Navigate to home page after configuration creation
            .then(() => {
                resetConfig()
                return router.push({ name: 'home', query: { firstLogin: 'true' } })
            })
            .catch((error: AxiosError) => {
                console.error(error)
                resetConfig()
                return router.push({ name: 'configurations1' })
            })
    }

    // Function to reset configuration states
    const resetConfig = () => {
        challengeConfig.value = {
            experience: '',
            motivation: '',
            challengeTypeConfigs: []
        }
        savingAccount.value = {
            accountType: 'SAVING',
            accNumber: 0,
            balance: 0
        }
        spendingAccount.value = {
            accountType: 'SPENDING',
            accNumber: 0,
            balance: 0
        }
    }

    // Return reactive states and functions to be used by components
    return {
        challengeConfig,
        errorMessage,
        setExperience,
        setMotivation,
        setAccount,
        addChallengeTypeConfig,
        createConfig
    }
})
