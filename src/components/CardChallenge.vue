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
            saved: 500,
            target: 1000,
            description: 'challenge Description',
            due: '2021-12-31'
        })
    }
})

const challengeInstance = props.challengeInstance

const editChallenge = () =>
    router.push({ name: 'edit-challenge', params: { id: challengeInstance.id } })
const displayDate = computed(() => challengeInstance.due?.slice(0, 16).split('T').join(' '))
</script>

<template>
    <div
        class="border-2 border-black rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer"
        @click="editChallenge"
    >
        <h2 class="m-0">{{ challengeInstance.title }}</h2>
        <p>{{ challengeInstance.saved }}kr / {{ challengeInstance.target }}kr</p>
        <ProgressBar :completion="challengeInstance.completion" />
        <p>{{ displayDate }}</p>
    </div>
</template>

<style scoped></style>
