import { defineStore } from 'pinia'
import type { Goal } from '@/types/goal'
import { ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'

export const useGoalStore = defineStore('goal', () => {
    const goals = ref<Goal[]>([])
    const getUserGoals = async () => {
        try {
            const response = await authInterceptor('/users/me/challenges')
            if (response.data && response.data.content) {
                goals.value = response.data.content
                console.log(response.data.content)
                console.log('Fetched Goals:', goals.value)
            } else {
                goals.value = []
                console.error('No goal content found:', response.data)
            }
        } catch (error) {
            console.error('Error fetching challenges:', error)
            goals.value = [] // Ensure challenges is always an array
        }
    }
    return {
        goals,
        getUserGoals
    }
})
