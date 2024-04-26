<script lang="ts" setup>
import CardGoal from '@/components/CardGoal.vue'

import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Goal } from '@/types/goal'
import draggable from 'vuedraggable'
import PageControl from '@/components/PageControl.vue'

const router = useRouter()

const currentPage = ref(0)
const totalPages = ref(1)

const activeGoals = ref<Goal[]>([])
const completedGoals = ref<Goal[]>([])

onMounted(async () => {
    await authInterceptor('/users/me/goals/active')
        .then((response) => {
            activeGoals.value = response.data
        })
        .catch((error) => {
            console.error(error)
        })

    await authInterceptor(`/users/me/goals/completed?page=${currentPage.value}&size=5`)
        .then((response) => {
            currentPage.value = response.data.number
            totalPages.value = response.data.totalPages
            completedGoals.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
})

const updatePage = async (page: number) => {
    await authInterceptor(`/users/me/goals/completed?page=${page}&size=5`)
        .then((response) => {
            currentPage.value = response.data.number
            totalPages.value = response.data.totalPages
            completedGoals.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
}

watch(activeGoals, (newGoals) => {
    console.log(newGoals)
})
</script>

<template>
    <div class="flex flex-col gap-5 items-center">
        <h1 class="font-bold m-0">Dine sparemål</h1>
        <button @click="router.push({ name: 'new-goal' })">Opprett et nytt sparemål</button>
        <h2 class="font-bold m-0">Aktive sparemål</h2>
        <p v-if="activeGoals.length === 0">Du har ingen aktive sparemål</p>
        <draggable
            v-else
            v-model="activeGoals"
            class="flex flex-row flex-wrap justify-center gap-10"
            item-key="id"
        >
            <template #item="{ element, index }">
                <CardGoal :key="index" :goal-instance="element" />
            </template>
        </draggable>
        <button
            :disabled="activeGoals.length === 0"
            @click="router.push({ name: 'edit-goal', params: { id: 1 } })"
        >
            Rediger rekkefølge
        </button>
        <h2 class="font-bold m-0">Fullførte sparemål</h2>
        <p v-if="completedGoals.length === 0">Du har ingen fullførte sparemål</p>
        <div v-else class="flex flex-row flex-wrap justify-center gap-10">
            <CardGoal v-for="goal in completedGoals" :key="goal.id" :goal-instance="goal" />
        </div>
        <PageControl
            :current-page="currentPage"
            :on-page-change="updatePage"
            :total-pages="totalPages"
        />
    </div>
</template>

<style scoped></style>
