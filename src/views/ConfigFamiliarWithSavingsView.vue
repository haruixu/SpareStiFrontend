<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-16 text-4xl font-bold lg:mb-20">Hvor kjent er du med sparing fra før?</h1>
        <div class="grid grid-cols-1 gap-14 mb-20 md:grid-cols-3">
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'litt',
                    'border-gray-300 border-2': selectedOption !== 'litt'
                }"
                class="flex flex-col items-center justify-center w-40 h-40 p-2 sm:w-64 sm:h-64 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
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
                class="flex flex-col items-center justify-center w-40 h-40 p-2 sm:w-64 sm:h-64 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
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
                class="flex flex-col items-center justify-center w-40 h-40 p-2 sm:w-64 sm:h-64 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('godt')"
            >
                <img src="@/assets/pig.png" alt="Whole pig" class="h-12 sm:h-1/3" />
                <p class="mt-2 text-lg font-bold">Godt kjent</p>
            </div>
        </div>
        <ContinueButtonComponent
            :disabled="selectedOption === null"
            @click="onButtonClick"
            class="px-10 py-3 text-2xl self-end mb-4 mt-0"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'
import { useUserConfigStore } from '@/stores/userConfigStore'

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
        default:
            experienceValue = 'VERY_LOW'
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
