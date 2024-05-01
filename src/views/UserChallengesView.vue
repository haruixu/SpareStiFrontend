<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'
import CardChallenge from '@/components/CardChallenge.vue'
import PageControl from '@/components/PageControl.vue'
import HelpComponent from "@/components/HelpComponent.vue";

const router = useRouter()

const currentPageActive = ref(0)
const totalPagesActive = ref(1)
const currentPageCompleted = ref(0)
const totalPagesCompleted = ref(1)
const helpSpeech = ref<string[]>([])

const activeChallenges = ref<Challenge[]>([])
const completedChallenges = ref<Challenge[]>([])

const getActiveChallenges = async (newPage: number) => {
    await authInterceptor(`/challenges/active?page=${newPage}&size=5`)
        .then((response) => {
            currentPageActive.value = response.data.number
            totalPagesActive.value = response.data.totalPages
            activeChallenges.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
}

const getCompletedChallenges = async (newPage: number) => {
    await authInterceptor(`/challenges/completed?page=${newPage}&size=5`)
        .then((response) => {
            currentPageCompleted.value = response.data.number
            totalPagesCompleted.value = response.data.totalPages
            completedChallenges.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
}

onMounted(async () => {
    await getActiveChallenges(currentPageActive.value)
    await getCompletedChallenges(currentPageActive.value)
})

const openHelp = () => {
  helpSpeech.value = [
    'Du har kommet til spareutfordringene dine 💰',
    'En spareutfordring er en måte å bli kvitt dårlige vaner, samtidig spare penger for å nå dine mål ✨',
    'Du kan opprette en ny utfordring ved å trykke på "Opprett en ny utfordring"',
    'Du kan også endre rekkefølgen på utfordringene dine ved å trykke på "Endre rekkefølge".',
    'Når du har fullført en utfordring, vil den dukke opp under "Fullførte utfordringer".',
    'Lykke til med utfordringene dine 🏆'
  ]
}
</script>

<template>
    <h1 class="font-bold text-center">Dine utfordringer</h1>
    <div class="flex flex-col gap-5 items-center">
        <div class="flex flex-row gap-5">
            <button @click="router.push({ name: 'new-challenge' })">
                Opprett en ny utfordring
            </button>
        </div>

        <h2 class="font-bold">Aktive utfordringer</h2>
        <div class="flex flex-row justify-center gap-10 flex-wrap">
            <CardChallenge
                v-for="challenge in activeChallenges"
                :key="challenge.id"
                :challenge-instance="challenge"
            />
        </div>
        <PageControl
            :currentPage="currentPageActive"
            :on-page-change="getActiveChallenges"
            :totalPages="totalPagesActive"
        />

        <h2 class="font-bold">Fullførte utfordringer</h2>
        <div class="flex flex-row justify-center gap-10 flex-wrap">
            <CardChallenge
                v-for="challenge in completedChallenges"
                :key="challenge.id"
                :challenge-instance="challenge"
            />
        </div>
        <PageControl
            :currentPage="currentPageCompleted"
            :on-page-change="getCompletedChallenges"
            :totalPages="totalPagesCompleted"
        />
    </div>
  <HelpComponent :speech="helpSpeech" @openHelp="openHelp"></HelpComponent>
</template>

<style scoped></style>
