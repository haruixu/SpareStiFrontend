<script lang="ts" setup>
import CardGoal from '@/components/CardGoal.vue'

import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Goal } from '@/types/goal'
import draggable from 'vuedraggable'

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

watch(goals, (newGoals) => {
    console.log(newGoals)
})
</script>

<template>
    <h1 class="font-bold text-center">Dine sparemål</h1>
    <div class="flex flex-col gap-5 items-center">
        <draggable
            v-model="goals"
            class="flex flex-col justify-center gap-10 sm:flex-row"
            item-key="id"
        >
            <template #item="{ element, index }">
                <CardGoal :key="index" :goal-instance="element" />
            </template>
        </draggable>
        <div class="flex flex-row gap-5">
            <button @click="router.push({ name: 'new-goal' })">Opprett et nytt sparemål</button>
            <button @click="router.push({ name: 'edit-goal', params: { id: 1 } })">
                Rediger rekkefølge
            </button>
        </div>
    </div>
</template>

<style scoped></style>
