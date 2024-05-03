<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'
import CardChallenge from '@/components/CardChallenge.vue'
import PageControl from '@/components/PageControl.vue'

const router = useRouter()

const currentPageActive = ref(0)
const totalPagesActive = ref(1)
const currentPageCompleted = ref(0)
const totalPagesCompleted = ref(1)

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
</script>

<template>
    <h1 class="font-bold text-center">Dine utfordringer</h1>
    <div class="flex flex-col gap-5 items-center">
        <div class="flex flex-row gap-5">
            <button class="primary" @click="router.push({ name: 'new-challenge' })">
                Opprett en ny utfordring
            </button>
        </div>

        <h2 class="font-bold">Aktive utfordringer🚀</h2>
        <div class="flex flex-row justify-center gap-10 flex-wrap">
            <CardChallenge
                v-for="challenge in activeChallenges"
                :key="challenge.id"
                :challenge-instance="challenge"
            />
            <p v-if="!activeChallenges">Du har ingen aktive spareutfordringer😢</p>
        </div>
        <PageControl
            :currentPage="currentPageActive"
            :on-page-change="getActiveChallenges"
            :totalPages="totalPagesActive"
        />

        <h2 class="font-bold">Fullførte utfordringer💯</h2>
        <div class="flex flex-row justify-center gap-10 flex-wrap">
            <CardChallenge
                class="border-2 border-slate-200 hover:bg-slate-50"
                v-for="challenge in completedChallenges"
                :key="challenge.id"
                :challenge-instance="challenge"
            />
            <p v-if="!completedChallenges">Du har ingen fullførte spareutfordringer😢</p>
        </div>
        <PageControl
            :currentPage="currentPageCompleted"
            :on-page-change="getCompletedChallenges"
            :totalPages="totalPagesCompleted"
        />
    </div>
</template>

<style scoped></style>
