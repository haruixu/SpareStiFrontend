<script lang="ts" setup>
import CardGoal from '@/components/CardGoal.vue'

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Goal } from '@/types/goal'

const router = useRouter()

const currentPage = ref(1)
const totalPages = ref(1)

const goals = ref<Goal[]>([])

onMounted(async () => {
    await authInterceptor('/users/me/goals')
        .then((response) => {
            currentPage.value = response.data.currentPage
            totalPages.value = response.data.totalPages
            goals.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
})
</script>

<template>
    <h1 class="font-bold text-center">Dine sparemål</h1>
    <div class="flex flex-col gap-5 items-center">
        <div class="flex flex-col justify-center gap-10 sm:flex-row">
            <CardGoal v-for="(goal, index) in goals" :key="index" :goal-instance="goal" />
        </div>
        <button @click="router.push('/sparemaal/ny')">Opprett et nytt sparemål</button>
    </div>
</template>

<style scoped></style>
