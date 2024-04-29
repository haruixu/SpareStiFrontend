import { defineStore } from 'pinia'
import { ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import axios, { AxiosError } from 'axios'

export const useUserConfigStore = defineStore('userConfig', {
    state: () => ({
        role: 'USER',
        experience: 'VERY_HIGH',
        motivation: 'VERY_HIGH',
        challengeTypeConfigs: [] as {
            type: string
            specificAmount: number
            generalAmount: number
        }[],
        errorMessage: ref<string>('')
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
        postUserConfig() {
            const payload = {
                experience: this.experience,
                motivation: this.motivation,
                challengeTypeConfigs: Array.from(this.challengeTypeConfigs)
            }

            authInterceptor
                .post('/config/challenge', payload)
                .then((response) => {
                    console.log('Success:', response.data)
                })
                .catch((error) => {
                    const axiosError = error as AxiosError
                    if (axiosError.response && axiosError.response.data) {
                        const errorData = axiosError.response.data as { message: string }
                        this.errorMessage = errorData.message || 'An error occurred'
                    } else {
                        this.errorMessage = 'An unexpected error occurred'
                    }
                    console.error('Axios error:', this.errorMessage)
                })
        }
    }
})
