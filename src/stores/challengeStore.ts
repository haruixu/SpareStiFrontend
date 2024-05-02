// store/challengeStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'

export const useChallengeStore = defineStore('challenge', () => {
    const challenges = ref<Challenge[]>([])

    const getUserChallenges = async () => {
        try {
            const response = await authInterceptor('/challenges')
            if (response.data && response.data.content) {
                challenges.value = response.data.content
            } else {
                challenges.value = []
                console.error('No challenge content found:', response.data)
            }
        } catch (error) {
            console.error('Error fetching challenges:', error)
            challenges.value = [] // Ensure challenges is always an array
        }
    }

    // Assuming 'challenges' is a reactive state in your store that holds the list of challenges
    const editUserChallenge = async (challenge: Challenge) => {
        try {
            const response = await authInterceptor.put(`/challenges/${challenge.id}`, challenge)
            if (response.data) {
                // Update local challenge state to reflect changes
                const index = challenges.value.findIndex((c) => c.id === challenge.id)
                if (index !== -1) {
                    challenges.value[index] = { ...challenges.value[index], ...response.data }
                    console.log('Updated Challenge:', response.data)
                    return challenges.value[index]
                }
            } else {
                console.error('No challenge content found in response data')
                return null
            }
        } catch (error) {
            console.error('Error updating challenge:', error)
            return null
        }
    }
    const completeUserChallenge = async (challenge: Challenge) => {
        try {
            const response = await authInterceptor.put(
                `/challenges/${challenge.id}/complete`,
                challenge
            )
            if (response.data) {
                // Update local challenge state to reflect changes
                const index = challenges.value.findIndex((c) => c.id === challenge.id)
                if (index !== -1) {
                    challenges.value[index] = { ...challenges.value[index], ...response.data }
                    console.log('Updated Challenge:', response.data)
                    console.log('Challenge Completed store:', challenges.value[index])
                    return challenges.value[index]
                }
            } else {
                console.error('No challenge content found in response data')
                return null
            }
        } catch (error) {
            console.error('Error updating challenge:', error)
            return null
        }
    }

    return {
        challenges,
        getUserChallenges,
        editUserChallenge,
        completeUserChallenge
    }
})
