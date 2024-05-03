<script lang="ts" setup>
import type { Goal } from '@/types/goal'
import { computed, type PropType } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import router from '@/router'

const props = defineProps({
    goalInstance: {
        type: Object as PropType<Goal>,
        required: true
    },
    isClickable: {
        type: Boolean,
        default: true
    }
})

const goalInstance = props.goalInstance
const displayDate = computed(() => goalInstance.due?.slice(0, 16).split('T').join(' '))
const isCompleted = computed(() => goalInstance.completedOn != null)

const handleCardClick = () => {
    if (props.isClickable) {
        router.push({ name: 'view-goal', params: { id: goalInstance.id } })
    }
}
</script>

<template>
    <div
        :class="{ 'cursor-default': isCompleted }"
        class="border-2 border-lime-400 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer w-52 overflow-hidden transition-transform duration-100 ease-in-out hover:scale-105 hover:opacity-90"
        @click="handleCardClick"
    >
        <h3 class="my-0 mx-6">{{ goalInstance.title }}</h3>
        <p>{{ goalInstance.saved }}kr / {{ goalInstance.target }}kr</p>
        <ProgressBar :completion="goalInstance.completion" />
        <p>{{ displayDate }}</p>
    </div>
</template>

<style scoped></style>
