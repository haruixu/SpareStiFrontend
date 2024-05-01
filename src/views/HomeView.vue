<template>
    <div class="flex flex-col items-center max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
        <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/4 md:pl-1 mt-10">
            <SpareComponent
                :speech="speech"
                :png-size="15"
                :direction="'left'"
                :imageDirection="'right'"
            ></SpareComponent>
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
    <HelpComponent
        :speech="helpSpeech"
        @openHelp="openHelp"
    ></HelpComponent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ButtonAddGoalOrChallenge from '@/components/ButtonAddGoalOrChallenge.vue'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import { useGoalStore } from '@/stores/goalStore'
import { useChallengeStore } from '@/stores/challengeStore'
import SavingsPath from '@/components/SavingsPath.vue'
import router from '@/router'
import SpareComponent from "@/components/SpareComponent.vue";
import HelpComponent from "@/components/HelpComponent.vue";

const goalStore = useGoalStore()
const challengeStore = useChallengeStore()
const isModalOpen = ref(false)
const speech = ref<string[]>([])
const helpSpeech = ref<string[]>([])

const challenges = ref<Challenge[]>([])
const goals = ref<Goal[]>([])

const goal = ref<Goal | null | undefined>(null)

onMounted(async () => {
    await goalStore.getUserGoals()
    await challengeStore.getUserChallenges()
    challenges.value = challengeStore.challenges
    goals.value = goalStore.goals
    goal.value = goals.value[0]
    firstLoggedInSpeech()
})

// Check if the user is logging in for the first time, and display the first login speech
const firstLoggedInSpeech = () => {
    const isFirstLogin = router.currentRoute.value.query.firstLogin === 'true'
    if (isFirstLogin) {
        speech.value = [
            'Hei, jeg er Spare!',
            'Jeg skal hjelpe deg med å spare penger.',
            'Du får varsel når jeg har noe å si!'
        ]
        isModalOpen.value = true
        router.replace({ name: 'home', query: { firstLogin: 'false' } })
    }
}
const openHelp = () => {
  helpSpeech.value = [
        'Heisann, jeg er Spare!',
        'Jeg skal hjelpe deg med å spare penger.',
        'Du kan legge til sparemål og spareutfordringer!',
        'Sammen kan vi spare penger og nå dine mål!'
    ]
}
</script>