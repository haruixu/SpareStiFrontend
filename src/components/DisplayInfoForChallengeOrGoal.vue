<template>
    <button @click="display" class="bg-transparent relative p-0 hover:bg-transparent">
        <img src="@/assets/infoIcon.png" alt="i" class="max-h-4 max-w-4 ml-1" />
    </button>
    <div
        v-if="displayInfoCard"
        class="w-[40vh] h-[20vh]md:w-60 md:h-40 group z-50 bg-opacity-50 overflow-hidden absolute mt-8 md:mt-4 md:mr-0 flex flex-col justify-evenly text-wrap"
    >
        <div
            class="flex flex-col justify-around w-3/4 md:w-full h-[80%] py-2 px-4 md:py-0 bg-white rounded-2xl border-4 border-green-300 overflow-auto"
        >
            <p class="text-base md:text-lg text-wrap text-bold">{{ title.toUpperCase() }}</p>
            <p class="text-xs md:text-sm text-wrap mb-2">Beskrivelse: {{ description }}</p>
            <p v-if="completion !== 100" class="text-xs md:text-sm text-nowrap text-green-800">
                Utløper om:
            </p>
            <Countdown
                v-if="completion !== 100 && screenSize > 763"
                class="flex flex-row"
                countdownSize="1.3rem"
                labelSize=".8rem"
                mainColor="white"
                secondFlipColor="white"
                mainFlipBackgroundColor="#30ab0e"
                secondFlipBackgroundColor="#9af781"
                :labels="{ days: 'dager', hours: 'timer', minutes: 'min', seconds: 'sek' }"
                :deadlineISO="deadline"
            ></Countdown>
            <Countdown
                v-else-if="completion !== 100 && screenSize <= 763"
                class="flex flex-row"
                countdownSize="1.0rem"
                labelSize=".6rem"
                mainColor="white"
                secondFlipColor="white"
                mainFlipBackgroundColor="#30ab0e"
                secondFlipBackgroundColor="#9af781"
                :labels="{ days: 'dager', hours: 'timer', minutes: 'min', seconds: 'sek' }"
                :deadlineISO="deadline"
            ></Countdown>
            <p class="text-nowrap text-xs md:text.sm" v-else>
                Utfordring fullført.<br />
                Totalt spart: {{ amountSaved }}kr
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import { onUnmounted, ref } from 'vue'
// @ts-ignore
import { Countdown } from 'vue3-flip-countdown'

interface Props {
    challenge: Challenge | null | undefined
    goal: Goal | null | undefined
    isChallenge: boolean
}
const props = defineProps<Props>()

// Challenge or goal data
const description = ref<string>(
    props.isChallenge ? props.challenge!.description : props.goal!.description
)
const title = ref<string>(props.isChallenge ? props.challenge!.title : props.goal!.title)
const amountSaved = ref<number>(props.isChallenge ? props.challenge!.saved : props.goal!.saved)
const completion = ref<number>(
    props.isChallenge ? props.challenge?.completion ?? 0 : props.goal?.completion ?? 0
)
const deadline = ref<string>(props.isChallenge ? props.challenge!.due : props.goal!.due)

const displayInfoCard = ref(false)

// Display the info card
const display = () => {
    displayInfoCard.value = !displayInfoCard.value
}

const screenSize = ref<number>(window.innerWidth)

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowSizeChange)
})

// Update the screen size
const handleWindowSizeChange = () => {
    screenSize.value = window.innerWidth
}
</script>
