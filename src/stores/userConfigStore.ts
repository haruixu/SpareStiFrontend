import { defineStore } from 'pinia'
import authInterceptor from '@/services/authInterceptor'
import axios from 'axios'

export const useUserConfigStore = defineStore('userConfig', {
    state: () => ({
        role: 'USER',
        experience: 'VERY_HIGH',
        motivation: 'VERY_HIGH',
        challengeTypeConfigs: [] as {
            type: string
            specificAmount: number
            generalAmount: number
        }[]
    }),
    actions: {
        setExperience(value: string) {
            this.experience = value
        },
        setMotivation(value: string) {
            this.motivation = value
        },
        addChallengeTypeConfig(type: string, specificAmount: number, generalAmount: number) {
            this.challengeTypeConfigs.push({ type, specificAmount, generalAmount })
        },
        async postUserConfig() {
            const payload = {
                experience: this.experience,
                motivation: this.motivation,
                challengeTypeConfigs: Array.from(this.challengeTypeConfigs)
            }

            try {
                const response = await authInterceptor.post('/users/me/config/challenge', payload)
                console.log('Success:', response.data)
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error('Axios error:', error.response?.data || error.message)
                } else {
                    console.error('An unexpected error occurred:', error)
                }
            }
        }
    }
})
