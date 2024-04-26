<script lang="ts" setup>
import CardGoal from '@/components/CardGoal.vue'

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { Goal } from '@/types/goal'
import draggable from 'vuedraggable'
import PageControl from '@/components/PageControl.vue'

const router = useRouter()

const currentPage = ref(0)
const totalPages = ref(1)

const activeGoals = ref<Goal[]>([])
const completedGoals = ref<Goal[]>([])

const isDraggable = ref(false)

onMounted(async () => {
    await authInterceptor('/goals/active')
        .then((response) => {
            activeGoals.value = response.data
            activeGoals.value.sort((a, b) => (a.priority || 0) - (b.priority || 0))
        })
        .catch((error) => {
            console.error(error)
        })

    await updatePage(0)
})

const updatePage = async (page: number) => {
    await authInterceptor(`/goals/completed?page=${page}&size=5`)
        .then((response) => {
            currentPage.value = response.data.number
            totalPages.value = response.data.totalPages
            completedGoals.value = response.data.content
        })
        .catch((error) => {
            console.error(error)
        })
}

const changeOrder = async () => {
    if (isDraggable.value) {
        const priorities = activeGoals.value.map((goal) => goal.id)
        await authInterceptor.put('/goals', priorities).catch((error) => {
            console.error(error)
        })
        isDraggable.value = false
        await updatePage(currentPage.value)
    } else {
        isDraggable.value = true
    }
}
</script>

<template>
    <div class="flex flex-col gap-5 items-center">
        <h1 class="font-bold m-0">Dine sparemål</h1>
        <button @click="router.push({ name: 'new-goal' })">Opprett et nytt sparemål</button>
        <h2 class="font-thin m-0">Aktive sparemål</h2>
        <p v-if="activeGoals.length === 0">Du har ingen aktive sparemål</p>
        <draggable
            v-else
            v-model="activeGoals"
            class="flex flex-row flex-wrap justify-center gap-10"
            item-key="id"
            :disabled="!isDraggable"
        >
            <template #item="{ element, index }">
                <CardGoal
                    :key="index"
                    :class="[
                        { 'cursor-move shadow-xl -translate-y-2 duration-300': isDraggable },
                        { 'border-4 border-green-500': index === 0 }
                    ]"
                    :goal-instance="element"
                    :is-clickable="!isDraggable"
                />
            </template>
        </draggable>
        <button :disabled="activeGoals.length === 0" @click="changeOrder()">
            {{ isDraggable ? 'Lagre rekkefølge' : 'Endre rekkefølge' }}
        </button>
        <h2 class="font-thin m-0">Fullførte sparemål</h2>
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
