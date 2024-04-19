<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-16 text-4xl font-bold lg:mb-20">Hvor kjent er du med sparing fra før?</h1>
        <div class="grid grid-cols-1 gap-14 mb-20 md:grid-cols-3">
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'litt',
                    'border-gray-300 border-2': selectedOption !== 'litt'
                }"
                class="flex flex-col items-center justify-center w-64 h-64 p-2.5 cursor-pointer transition-colors rounded-lg hover:border-[var(--green)]-500"
                @click="selectOption('litt')"
            >
                <img src="@/assets/nose.png" alt="Pig nose" class="h-16 md:h-20" />
                <p class="mt-2 text-lg font-bold">Litt kjent</p>
            </div>
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'noe',
                    'border-gray-300 border-2': selectedOption !== 'noe'
                }"
                class="flex flex-col items-center justify-center w-64 h-64 p-2.5 cursor-pointer transition-colors rounded-lg hover:border-[var(--green)]"
                @click="selectOption('noe')"
            >
                <img src="@/assets/head.png" alt="Pig face" class="h-16 md:h-20" />
                <p class="mt-2 text-lg font-bold">Noe kjent</p>
            </div>
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'godt',
                    'border-gray-300 border-2': selectedOption !== 'godt'
                }"
                class="flex flex-col items-center justify-center w-64 h-64 p-2.5 cursor-pointer transition-colors rounded-lg hover:border-[var(--green)]"
                @click="selectOption('godt')"
            >
                <img src="@/assets/pig.png" alt="Whole pig" class="h-16 md:h-20" />
                <p class="mt-2 text-lg font-bold">Godt kjent</p>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            :disabled="selectedOption === null"
            :style="{
                opacity: selectedOption === null ? '0.6' : '1',
                cursor: selectedOption === null ? 'not-allowed' : 'pointer'
            }"
            class="px-10 py-3 text-2xl self-end"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

const selectedOption = ref<string | null>(null)

const selectOption = (option: string) => {
    selectedOption.value = option
}

const onButtonClick = () => {
    router.push('/konfigurasjonSteg3')
}
</script>
