<template>
    <div class="flex flex-col items-center max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
        <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/3 md:pl-1 mt-0">
            <SpareComponent
                :speech="speech"
                :show="showWelcome"
                :png-size="12"
                :direction="'right'"
                :imageDirection="'right'"
                class="my-0 md:ml-5"
            ></SpareComponent>
            <div
                class="flex flex-col gap-2 items-center mx-auto mt-4 mb-20 md:gap-4 md:m-0 md:ml-4 w-full"
            >
                <h3
                    v-text="'Du har spart ' + profile?.savedAmount + ' kr totalt!💫'"
                    class="font-bold"
                />
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
        <savings-path
            v-if="isMounted"
            :challenges="challenges"
            :goal="goal"
            @complete-challenge="handleCompletedChallenge"
            :key="refreshSavingPath"
        >
        </savings-path>
    </div>
    <GeneratedChallengesModal
        v-show="showModal"
        @update:showModal="showModal = $event"
        @update-challenges="handleUpdateChallenges"
    />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ButtonAddGoalOrChallenge from '@/components/ButtonAddGoalOrChallenge.vue'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import type { Profile } from '@/types/profile'
import { useGoalStore } from '@/stores/goalStore'
import { useChallengeStore } from '@/stores/challengeStore'
import SavingsPath from '@/components/SavingsPath.vue'
import router from '@/router'
import GeneratedChallengesModal from '@/components/GeneratedChallengesModal.vue'
import SpareComponent from '@/components/SpareComponent.vue'
import authInterceptor from '@/services/authInterceptor'

const showModal = ref(false)
const profile = ref<Profile>()
const refreshSavingPath = ref(0)

const goalStore = useGoalStore()
const challengeStore = useChallengeStore()
const speech = ref<string[]>([])

const challenges = ref<Challenge[]>([])
const showWelcome = ref<boolean>(false)

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
    SpareSpeech()
    updateUser()
    console.log(challenges.value)

    isMounted.value = true
})

const updateUser = async () => {
    authInterceptor('/profile')
        .then((response) => {
            profile.value = response.data
        })
        .catch((error) => {
            return console.log(error)
        })
}

const firstLoggedInSpeech = () => {
    const isFirstLogin = router.currentRoute.value.query.firstLogin === 'true'
    if (isFirstLogin) {
        showWelcome.value = true
        speech.value.push('Hei, jeg er Spare!')
        speech.value.push('Jeg skal hjelpe deg med å spare penger.')
        speech.value.push('Trykk på meg for å høre hva jeg har å si 🐷')
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

const handleCompletedChallenge = async () => {
    updateUser()
}

const handleUpdateChallenges = async (newChallenges: Challenge[]) => {
    challenges.value = newChallenges
    console.log(challenges.value)
    refreshSavingPath.value++
}
</script>
