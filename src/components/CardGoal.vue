<script lang="ts" setup>
import type { Goal } from '@/types/goal'
import { computed, type PropType, reactive } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import router from '@/router'

const props = defineProps({
    goalInstance: {
        type: Object as PropType<Goal>,
        default: () => ({
            id: 0,
            title: 'Goal Title',
            saved: 500,
            target: 1000,
            completion: 50,
            description: 'Goal Description',
            priority: 0,
            createdOn: '2021-01-01',
            due: '2021-12-31'
        })
    }
})

const goalInstance = reactive(props.goalInstance)

const editGoal = () => router.push({ name: 'edit-goal', params: { id: goalInstance.id } })
const displayDate = computed(() => goalInstance.due?.slice(0, 16).split('T').join(' '))
</script>

<template>
    <div
        class="border-2 border-black rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer"
        @click="editGoal"
    >
        <h2 class="m-0">{{ goalInstance.title }}</h2>
        <p>{{ goalInstance.saved }}kr / {{ goalInstance.target }}kr</p>
        <ProgressBar :completion="goalInstance.completion" />
        <p>{{ displayDate }}</p>
    </div>
</template>

<style scoped></style>
