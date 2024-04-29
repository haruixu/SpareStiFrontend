<template>
    <div class="flex flex-col items-center max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
        <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/4 md:pl-10">
            <div class="flex items-center">
                <img v-if="speech.length > 0" alt="Varsel"
                     class="scale-x-[-1] md:h-1/6 md:w-1/6 w-1/6 h-1/6 cursor-pointer"
                     src="@/assets/varsel.png"
                />
                <a @click="openInteractiveSpare" class="hover:bg-transparent">
                    <img alt="Spare"
                         class="scale-x-[-1] md:h-5/6 md:w-5/6 w-2/3 h-2/3 cursor-pointer"
                         src="@/assets/spare.png"
                    />
                </a>
            </div>
            <div class="flex flex-row gap-2 items-center mx-auto my-4 md:flex-col md:gap-4 md:m-8">
                <ButtonAddGoalOrChallenge :buttonText="'Legg til sparemål'" :type="'goal'" />
                <ButtonAddGoalOrChallenge
                    :buttonText="'Legg til spareutfordring'"
                    :type="'challenge'"
                />
            </div>
        </div>
        <savings-path :challenges="challenges" :goal="goal"></savings-path>
    </div>
    <InteractiveSpare
        :speech="speech"
        :direction="'right'"
        :pngSize="15"
        :is-modal-open="isModalOpen"
        class="opacity-0 h-0 w-0 md:opacity-100 md:h-auto md:w-auto"
    ></InteractiveSpare>
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

const goalStore = useGoalStore()
const challengeStore = useChallengeStore()
const isModalOpen = ref(false)

const challenges = ref<Challenge[]>([])
const goals = ref<Goal[]>([])

const goal = ref<Goal | null | undefined>(null)

onMounted(async () => {
    await goalStore.getUserGoals()
    await challengeStore.getUserChallenges()
    challenges.value = challengeStore.challenges
    goals.value = goalStore.goals
    goal.value = goals.value[0]
})

// Speech array for InteractiveSpare component
const speechArray = [
    'Hei, jeg er Spare!',
    'Jeg skal hjelpe deg med å spare penger.',
    'Klikk på meg for å høre mer.'
]

const speech = ref(speechArray)

const openInteractiveSpare = () => {
    isModalOpen.value = true
    console.log('Modal opened')
}
</script>
