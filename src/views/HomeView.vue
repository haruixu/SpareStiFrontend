<template>
    <div class="flex flex-col items-center max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
        <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/4 md:pl-1 mt-10">
            <img
                v-if="newSpeechAvailable"
                alt="Varsel"
                class="jump scale-x-[-1] w-1/12 h-1/12 ml-52 cursor-pointer z-10"
                src="@/assets/varsel.png"
            />
            <div class="flex items-center">
                <a @click="openInteractiveSpare" class="hover:bg-transparent z-20">
                    <img
                        alt="Spare"
                        class="scale-x-[-1] md:h-5/6 md:w-5/6 w-2/3 h-2/3 cursor-pointer ml-14 md:ml-10"
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
        :isModalOpen="isModalOpen"
        class="opacity-0 h-0 w-0 md:opacity-100 md:h-auto md:w-auto"
    ></InteractiveSpare>
    <div class="fixed bottom-5 left-5">
        <div @click="openHelp" class="hover:cursor-pointer">
            <img alt="Hjelp" class="w-1/12" src="@/assets/hjelp.png" />
        </div>
    </div>
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
import router from '@/router'

const showModal = ref(true)

const goalStore = useGoalStore()
const challengeStore = useChallengeStore()
const isModalOpen = ref(false)
const speech = ref<string[]>([])
const newSpeechAvailable = ref(false)

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

const openInteractiveSpare = () => {
    // Check if there's new speech available before opening the modal.
    if (newSpeechAvailable.value) {
        isModalOpen.value = true // Open the modal
        newSpeechAvailable.value = false // Reset the flag since the speech will now be displayed
    }
}
const openHelp = () => {
    speech.value = [
        'Heisann, jeg er Spare!',
        'Jeg skal hjelpe deg med å spare penger.',
        'Du kan legge til sparemål og spareutfordringer!',
        'Sammen kan vi spare penger og nå dine mål!'
    ]
    isModalOpen.value = true
}
</script>

<style>
@keyframes jump {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.jump {
    animation: jump 0.6s infinite ease-in-out;
}
</style>
