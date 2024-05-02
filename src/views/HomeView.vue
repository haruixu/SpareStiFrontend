<template>
    <div class="flex flex-col items-center max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
        <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/4 md:pl-1 mt-10">
          <SpareComponent
              :speech="speech"
              :show="showWelcome"
              :png-size="12"
              :direction="'right'"
              :imageDirection="'right'"
              class="mt-24"
          ></SpareComponent>
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
        <savings-path v-if="isMounted" :challenges="challenges" :goal="goal"></savings-path>
    </div>
    <GeneratedChallengesModal v-show="showModal" @update:showModal="showModal = $event" />
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import ButtonAddGoalOrChallenge from '@/components/ButtonAddGoalOrChallenge.vue'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import { useGoalStore } from '@/stores/goalStore'
import { useChallengeStore } from '@/stores/challengeStore'
import SavingsPath from '@/components/SavingsPath.vue'
import router from '@/router'
import GeneratedChallengesModal from '@/components/GeneratedChallengesModal.vue'

const showModal = ref(false)

const goalStore = useGoalStore()
const challengeStore = useChallengeStore()
const isModalOpen = ref(false)
const speech = ref<string[]>([])
const showWelcome = ref<boolean>(false)

const challenges = ref<Challenge[]>([])
const goal = ref<Goal | null | undefined>(null)
const isMounted = ref(false)

onMounted(async () => {
    await goalStore.getUserGoals()
    await challengeStore.getUserChallenges()
    challenges.value = challengeStore.challenges
    goal.value = goalStore.priorityGoal
    const lastModalShow = localStorage.getItem('lastModalShow')
    if (!lastModalShow || Date.now() - Number(lastModalShow) >= 24 * 60 * 60 * 1000) {
      showModal.value = true
    }
    firstLoggedInSpeech()
    SpareSpeech();
    isMounted.value = true
})



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

const SpareSpeech = () => {
  speech.value = [
    'Hei! Jeg er sparegrisen, Spare!',
    'Valkommen til SpareSti 👑',
    'Du kan trykke på meg for å høre hva jeg har å si 🐷'
  ]
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
