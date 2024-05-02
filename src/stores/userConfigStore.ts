import { ref } from 'vue'
import { defineStore } from 'pinia'
import authInterceptor from '@/services/authInterceptor'
import { AxiosError } from 'axios'
import type { ChallengeConfig } from '@/types/challengeConfig'
import router from '@/router'

export const useUserConfigStore = defineStore('userConfig', () => {
    const challengeConfig = ref<ChallengeConfig>({
        experience: '',
        motivation: '',
        challengeTypeConfigs: []
    })

    const savingAccount = ref({
        accountType: 'SAVING',
        accNumber: 0,
        balance: 0
    })

    const spendingAccount = ref({
        accountType: 'SPENDING',
        accNumber: 0,
        balance: 0
    })

    const errorMessage = ref<string>('')

    const setExperience = (value: string) => {
        challengeConfig.value.experience = value
    }

    const setMotivation = (value: string) => {
        challengeConfig.value.motivation = value
    }

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

    const setAccount = (type: 'SAVING' | 'SPENDING', accNumber: number) => {
        if (type === 'SAVING') {
            savingAccount.value.accNumber = accNumber
        } else {
            spendingAccount.value.accNumber = accNumber
        }
    }

    const createConfig = () => {
        authInterceptor
            .post('/accounts', savingAccount.value)
            .then(() => authInterceptor.post('/accounts', spendingAccount.value))
            .then(() => authInterceptor.post('/config/challenge', challengeConfig.value))
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
