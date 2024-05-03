import { defineStore } from 'pinia'
import type { Goal } from '@/types/goal'
import { ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'

export const useGoalStore = defineStore('goal', () => {
    // Reactive state to hold the list of goals
    const goals = ref<Goal[]>([])

    // Reactive state to hold the priority goal
    const priorityGoal = ref<Goal | null>(null)

    // Function to fetch goals for the current user
    const getUserGoals = async () => {
        try {
            const response = await authInterceptor('/goals')
            if (response.data && response.data.content) {
                goals.value = response.data.content // Update goals state with fetched data

                // Iterate through goals to find the priority goal
                for (const goal of goals.value) {
                    if (goal.priority === 1) {
                        priorityGoal.value = goal
                        break
                    } else {
                        priorityGoal.value = null
                    }
                }
            } else {
                goals.value = []
                console.error('No goal content found:', response.data)
            }
        } catch (error) {
            console.error('Error fetching challenges:', error)
            goals.value = [] // Ensure challenges is always an array
        }
    }

    // Function to edit a user goal
    const editUserGoal = async (goal: Goal) => {
        if (!goal || goal.id === null) {
            console.error('Invalid goal or goal ID.')
            return
        }

        try {
            const response = await authInterceptor.put(`/goals/${goal.id}`, goal)
            if (response.data) {
                const index = goals.value.findIndex((g) => g.id === goal.id)
                if (index !== -1) {
                    goals.value[index] = { ...goals.value[index], ...response.data }
                }
            } else {
                console.error('No goal content found in response data')
            }
        } catch (error) {
            console.error('Error updating goal:', error)
        }
    }

    // Return reactive states and functions to be used by components
    return {
        goals,
        priorityGoal,
        getUserGoals,
        editUserGoal
    }
})
