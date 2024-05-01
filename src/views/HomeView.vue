<template>
    <div class="flex flex-col items-center max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
        <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/4 md:pl-10">
            <InteractiveSpare
                :speech="speech"
                :direction="'right'"
                :pngSize="15"
                class="opacity-0 h-0 w-0 md:opacity-100 md:h-auto md:w-auto md:mx-auto md:my-20"
            ></InteractiveSpare>
            <div class="flex flex-row gap-2 items-center mx-auto my-4 md:flex-col md:gap-4 md:m-8">
                <ButtonAddGoalOrChallenge :buttonText="'Legg til sparemål'" :type="'goal'" />
                <ButtonAddGoalOrChallenge
                    :buttonText="'Legg til spareutfordring'"
                    :type="'challenge'"
                />
                <ButtonAddGoalOrChallenge
                    :buttonText="'Generer spareutfordring'"
                    :type="'generatedChallenge'"
                    :showModal="showModal"
                    @click="showModal = true"
                    @update:showModal="showModal = $event"
                />
            </div>
        </div>
        <savings-path :challenges="challenges" :goal="goal"></savings-path>
    </div>
    <GeneratedChallengesModal v-show="showModal" @update:showModal="showModal = $event" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import ButtonAddGoalOrChallenge from '@/components/ButtonAddGoalOrChallenge.vue'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import { useGoalStore } from '@/stores/goalStore'
import { useChallengeStore } from '@/stores/challengeStore'
import SavingsPath from '@/components/SavingsPath.vue'
import GeneratedChallengesModal from '@/components/GeneratedChallengesModal.vue'

const showModal = ref(false)

const goalStore = useGoalStore()
const challengeStore = useChallengeStore()

const challenges = ref<Challenge[]>([])
const goals = ref<Goal[]>([])

const goal = ref<Goal | null | undefined>(null)

onMounted(async () => {
    await goalStore.getUserGoals()
    await challengeStore.getUserChallenges()
    challenges.value = challengeStore.challenges
    goals.value = goalStore.goals
    goal.value = goals.value[0]
    console.log('Goals:', goals.value)

    const lastModalShow = localStorage.getItem('lastModalShow')
    if (!lastModalShow || Date.now() - Number(lastModalShow) >= 24 * 60 * 60 * 1000) {
        showModal.value = true
    }
})

// Define your speech array
const speechArray = [
    'Hei! Jeg er Sparemannen.',
    'Jeg hjelper deg med å spare penger.',
    'Klikk på meg for å høre mer.'
]

const speech = ref(speechArray)
</script>
