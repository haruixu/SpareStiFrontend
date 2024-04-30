<template>
    <div class="flex flex-col items-center absolute">
        <span class="text-sm text-bold">STREAK</span>
        <button
            @mouseover="display"
            @mouseleave="hide"
            class="cursor-pointer bg-transparent hover:bg-transparent hover:scale-150"
        >
            <img src="@/assets/pengesekkStreak.png" alt="streak" class="mx-auto w-6 h-6 md:w-12 md:h-12" />
        </button>

        <div
            v-if="displayStreakCard"
            class="w-[30vh] h-[20vh] md:w-auto md:h-auto group z-50 bg-opacity-50 overflow-hidden absolute left-0 top-14 md:top-20 flex flex-col justify-evenly text-wrap"
        >
            <div
                class="flex flex-col justify-evenly w-full h-full py-2 px-4 md:py-0 bg-white rounded-2xl border-4 border-green-300"
            >
                <span class="text-xs md:text-2xl font-bold text-black"
                    >{{ currentStreak
                    }}{{
                        currentStreak === 1 ? ' utfodring fullført' : ' utfodringer fullført'
                    }}
                    streak</span
                >
                <p class="text-black text-xs md:text-1xl md:font-bold">
                    {{
                        currentStreak! > 0
                            ? 'Bra jobba du har fullført ' + currentStreak + ' utfordringer på rad!'
                            : 'Du har ikke fullført en utfordring det siste. Fullfør en nå for å starte en streak!'
                    }}
                </p>
                <Countdown
                    v-if="screenSize > 768 && currentStreak! > 0"
                    class="flex flex-row"
                    countdownSize="1rem"
                    labelSize=".5rem"
                    mainColor="white"
                    secondFlipColor="white"
                    mainFlipBackgroundColor="#30ab0e"
                    secondFlipBackgroundColor="#9af781"
                    :labels="{ days: 'dager', hours: 'timer', minutes: 'min', seconds: 'sek' }"
                    :deadlineISO="deadline"
                ></Countdown>
                <!-- Row component with horizontal padding and auto margins for centering -->
                <div
                    class="flex flex-row items-center mx-auto h-20 w-4/5 md:w-full bg-black-400 gap-4"
                >
                    <div class="flex flex-1 overflow-x-auto">
                        <div v-for="index in 6" :key="index" class="min-w-max mx-auto">
                            <div class="flex flex-col justify-around items-center">
                                <span class="text-black text-xs md:text-1xl font-bold">{{
                                    currentStreak! - ((currentStreak! % 7) - index)
                                }}</span>
                                <!-- Conditional rendering for streak images -->
                                <img
                                    v-if="index - 1 < currentStreak! % 7"
                                    src="@/assets/pengesekkStreak.png"
                                    alt="challenge completed"
                                    class="max-h-6 max-w-6 md:max-h-10 md:max-w-10"
                                />
                                <img
                                    v-else
                                    src="@/assets/pengesekkStreak.png"
                                    alt="challenge not completed"
                                    class="max-h-6 max-w-6 md:max-h-10 md:max-w-10 grayscale"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
// @ts-ignore
import { Countdown } from 'vue3-flip-countdown'

const userStore = useUserStore()
const currentStreak = ref<number>()
const streakStart = ref<string>()
const deadline = ref<string>()
onMounted(async () => {
    await userStore.getUserStreak()
    if (userStore.streak) {
        currentStreak.value = userStore.streak?.streak
        streakStart.value = userStore.streak?.streakStart
        deadline.value = userStore.streak?.streakStart
    }
    console.log('Streak:', currentStreak.value)
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleWindowSizeChange)
    }
    handleWindowSizeChange()
})

const screenSize = ref<number>(window.innerWidth)

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowSizeChange)
})
const handleWindowSizeChange = () => {
    screenSize.value = window.innerWidth
}

watch(
    () => currentStreak.value,
    (newStreak, oldStreak) => {
        if (newStreak !== oldStreak) {
            currentStreak.value = newStreak
            console.log('Updated Steak:', currentStreak)
        }
    },
    { immediate: true }
)

const displayStreakCard = ref(false)

const display = () => {
    displayStreakCard.value = true
}

const hide = () => {
    displayStreakCard.value = false
}
</script>
