<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import router from '@/router'
import type { Challenge } from '@/types/challenge'

const props = defineProps({
    challengeInstance: {
        type: Object as PropType<Challenge>,
        default: () => ({
            id: 0,
            title: 'Challenge title',
            saved: 0,
            target: 1000,
            description: 'challenge Description',
            due: '2021-12-31'
        })
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

const challengeInstance = props.challengeInstance
const displayDate = computed(() => challengeInstance.due?.slice(0, 16).split('T').join(' '))

const handleCardClick = () => {
    router.push({ name: 'view-challenge', params: { id: challengeInstance.id } })
}
</script>

<template>
    <div
        :class="{ 'bg-green-200 cursor-default': props.isCompleted }"
        class="border-2 border-black rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer w-52 overflow-hidden"
        @click="handleCardClick"
    >
        <h3 class="my-0 mx-6">{{ challengeInstance.title }}</h3>
        <p>{{ challengeInstance.saved }}kr / {{ challengeInstance.target }}kr</p>
        <ProgressBar :completion="challengeInstance.completion" />
        <p>{{ displayDate }}</p>
    </div>
</template>

<style scoped></style>
