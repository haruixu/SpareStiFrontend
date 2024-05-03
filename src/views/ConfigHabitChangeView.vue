<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5">
        <h1 class="text-2xl font-bold sm:text-4xl">
            Hvor store vaneedringer er du villig til å gjøre?
        </h1>
        <div class="grid grid-cols-1 gap-8 sm:gap-14 md:grid-cols-3">
            <button
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'litt',
                    'border-gray-300 border-2': selectedOption !== 'litt'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('litt')"
            >
                <img src="@/assets/litt.png" alt="Thumbs down emoji" class="h-12 sm:h-1/3" />
                <span class="mt-2 text-md sm:text-lg font-bold">Litt</span>
            </button>
            <button
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'passe',
                    'border-gray-300 border-2': selectedOption !== 'passe'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('passe')"
            >
                <img src="@/assets/passe.png" alt="A little bit emoji" class="h-12 sm:h-1/3" />
                <span class="mt-2 text-md sm:text-lg font-bold">Passe</span>
            </button>
            <button
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'store',
                    'border-gray-300 border-2': selectedOption !== 'store'
                }"
                class="flex flex-col items-center justify-center w-32 h-32 p-2 sm:w-60 sm:h-60 transition-colors rounded-lg cursor-pointer hover:border-[var(--green)]"
                @click="selectOption('store')"
            >
                <img src="@/assets/store.png" alt="Thumbs up emoji" class="h-12 sm:h-1/3" />
                <span class="mt-2 text-md sm:text-lg font-bold">Store</span>
            </button>
        </div>
        <div class="flex flex-row flex-wrap justify-center gap-x-52 gap-y-5">
            <div class="flex flex-col">
                <SpareComponent
                    :direction="'right'"
                    :imageDirection="'right'"
                    :png-size="10"
                    :speech="[
                        'Her kan du velge hvor mye innsats du er villig til å legge inn for å endre vanene dine! 📚'
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

// Set motivation value based on selected option
const selectOption = (option: string) => {
    selectedOption.value = option
    let motivationValue = ''

    switch (option) {
        case 'litt':
            motivationValue = 'VERY_LOW'
            break
        case 'passe':
            motivationValue = 'MEDIUM'
            break
        case 'store':
            motivationValue = 'VERY_HIGH'
            break
    }

    userConfigStore.setMotivation(motivationValue)
}

// Navigates to the next configuration view if an option is selected
const onButtonClick = () => {
    if (selectedOption.value) {
        router.push({ name: 'configurations2' })
    } else {
        console.error('No option selected')
    }
}
</script>
