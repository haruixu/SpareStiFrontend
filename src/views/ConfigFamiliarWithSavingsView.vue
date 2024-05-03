<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-8 md:mb-16 mt-2 text-2xl font-bold sm:text-4xl">
            Hvor kjent er du med sparing fra før?
        </h1>
        <div
            class="absolute bottom-4 md:bottom-40 left-2 w-28 h-28 md:w-40 md:h-40 lg:w-52 lg:h-52 ml-4"
        >
            <p class="md:text-sm text-xs font-bold mb-3 animate-bounce invisible sm:visible">
                Trykk på meg for hjelp ❗️
            </p>
            <SpareComponent
                :speech="[
                    'Her kan du fylle inn hvor kjent du er med sparing fra før, slik at vi kan hjelpe deg på best mulig måte! 💡',
                    'Hvis du er usikker, velg det alternativet som passer best. Du kan endre dette senere!'
                ]"
                :png-size="10"
                :direction="'right'"
                :imageDirection="'right'"
            ></SpareComponent>
        </div>
        <div class="grid grid-cols-1 gap-8 mb-2 sm:gap-10 sm:mb-12 md:grid-cols-3">
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'litt',
                    'border-gray-300 border-2': selectedOption !== 'litt'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('litt')"
            >
                <img src="@/assets/nose.png" alt="Pig nose" class="h-12 sm:h-1/3" />
                <p class="mt-2 text-lg font-bold">Litt kjent</p>
            </div>
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'noe',
                    'border-gray-300 border-2': selectedOption !== 'noe'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('noe')"
            >
                <img src="@/assets/head.png" alt="Pig face" class="h-12 sm:h-1/3" />
                <p class="mt-2 text-lg font-bold">Noe kjent</p>
            </div>
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'godt',
                    'border-gray-300 border-2': selectedOption !== 'godt'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('godt')"
            >
                <img src="@/assets/pig.png" alt="Whole pig" class="h-12 sm:h-1/3" />
                <p class="mt-2 text-lg font-bold">Godt kjent</p>
            </div>
        </div>
        <p class="mb-4 md:mb-10">Husk at du kan endre dette senere!</p>
        <ContinueButtonComponent
            :disabled="selectedOption === null"
            @click="onButtonClick"
            class="md:px-10 px-8 md:py-3 py-2 text-2xl self-end"
        ></ContinueButtonComponent>
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

// Set experience value based on selected option
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

// Navigate to next configuration page if option is selected
const onButtonClick = () => {
    if (selectedOption.value) {
        router.push({ name: 'configurations3' })
    } else {
        console.error('No option selected')
    }
}
</script>
