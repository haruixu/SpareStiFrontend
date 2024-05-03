<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5">
        <h1 class="text-2xl font-bold sm:text-4xl">Hvor kjent er du med sparing fra før?</h1>
        <div class="grid grid-cols-1 gap-8 sm:gap-14 md:grid-cols-3">
            <button
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'litt',
                    'border-gray-300 border-2': selectedOption !== 'litt'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('litt')"
            >
                <img src="@/assets/nose.png" alt="Pig nose" class="h-12 sm:h-1/3" />
                <span class="mt-2 text-lg font-bold">Litt kjent</span>
            </button>
            <button
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'noe',
                    'border-gray-300 border-2': selectedOption !== 'noe'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('noe')"
            >
                <img src="@/assets/head.png" alt="Pig face" class="h-12 sm:h-1/3" />
                <span class="mt-2 text-lg font-bold">Noe kjent</span>
            </button>
            <button
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'godt',
                    'border-gray-300 border-2': selectedOption !== 'godt'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('godt')"
            >
                <img src="@/assets/pig.png" alt="Whole pig" class="h-12 sm:h-1/3" />
                <span class="mt-2 text-lg font-bold">Godt kjent</span>
            </button>
        </div>
        <div class="flex flex-row flex-wrap justify-center gap-x-52 gap-y-5">
            <div class="flex flex-col">
                <SpareComponent
                    :direction="'right'"
                    :imageDirection="'right'"
                    :png-size="10"
                    :speech="[
                        'Her kan du fylle inn hvor kjent du er med sparing fra før, slik at vi kan hjelpe deg på best mulig måte! 💡'
                    ]"
                    class="w-60"
                ></SpareComponent>
                <p class="text-xs animate-bounce">Trykk på meg for hjelp ❗️</p>
            </div>
            <div class="flex flex-col">
                <p>Husk at du kan endre dette senere!</p>
                <ContinueButtonComponent
                    :disabled="selectedOption === null"
                    class="px-10 py-3 text-2xl"
                    @click="onButtonClick"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'
import { useUserConfigStore } from '@/stores/userConfigStore'
import SpareComponent from '@/components/SpareComponent.vue'

const selectedOption = ref<string | null>(null)
const userConfigStore = useUserConfigStore()

const selectOption = (option: string) => {
    selectedOption.value = option
    let experienceValue = ''

    switch (option) {
        case 'litt':
            experienceValue = 'VERY_LOW'
            break
        case 'noe':
            experienceValue = 'MEDIUM'
            break
        case 'godt':
            experienceValue = 'VERY_HIGH'
            break
    }

    userConfigStore.setExperience(experienceValue)
}

const onButtonClick = () => {
    if (selectedOption.value) {
        router.push({ name: 'configurations3' })
    } else {
        console.error('No option selected')
    }
}
</script>
