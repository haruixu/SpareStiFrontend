<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import draggable from 'vuedraggable'
import type { Challenge } from '@/types/challenge'
import CardChallenge from '@/components/CardChallenge.vue'

const router = useRouter()

const currentPage = ref(1)
const totalPages = ref(1)

const challenges = ref<Challenge[]>([])

onMounted(async () => {
    await authInterceptor('/users/me/challenges')
        .then((response) => {
            currentPage.value = response.data.currentPage
            totalPages.value = response.data.totalPages
            challenges.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
})

watch(challenges, (newChallenges) => {
    console.log(newChallenges)
})
</script>

<template>
    <h1 class="font-bold text-center">Dine utfordringer</h1>
    <div class="flex flex-col gap-5 items-center">
        <draggable
            v-model="challenges"
            class="flex flex-col justify-center gap-10 sm:flex-row"
            item-key="id"
        >
            <template #item="{ element, index }">
                <CardChallenge :key="index" :challenge-instance="element" />
            </template>
        </draggable>
        <div class="flex flex-row gap-5">
            <button @click="router.push({ name: 'new-challenge' })">
                Opprett en ny utfordring
            </button>
            <button @click="router.push({ name: 'edit-challenge', params: { id: 1 } })">
                Rediger rekkefølge
            </button>
        </div>
    </div>
</template>

<style scoped></style>
