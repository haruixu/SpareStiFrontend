<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-16 text-4xl font-bold lg:mb-20">
            Hvor store vaneedringer er du villig til å gjøre?
        </h1>
        <div class="grid grid-cols-1 gap-14 mb-20 md:grid-cols-3">
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'litt',
                    'border-gray-300 border-2': selectedOption !== 'litt'
                }"
                class="flex flex-col items-center justify-center w-64 h-64 p-2.5 cursor-pointer transition-colors rounded-lg hover:border-[var(--green)]"
                @click="selectOption('litt')"
            >
                <img src="@/assets/litt.png" alt="litt" class="object-contain h-1/3" />
                <p class="text-lg font-bold mt-2">Litt</p>
            </div>
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'passe',
                    'border-gray-300 border-2': selectedOption !== 'passe'
                }"
                class="flex flex-col items-center justify-center w-64 h-64 p-2.5 cursor-pointer transition-colors rounded-lg hover:border-[var(--green)]"
                @click="selectOption('passe')"
            >
                <img src="@/assets/passe.png" alt="passe" class="object-contain h-1/3" />
                <p class="text-lg font-bold mt-2">Passe</p>
            </div>
            <div
                :class="{
                    'border-[var(--green)] border-4': selectedOption === 'store',
                    'border-gray-300 border-2': selectedOption !== 'store'
                }"
                class="flex flex-col items-center justify-center w-64 h-64 p-2.5 cursor-pointer transition-colors rounded-lg hover:border-[var(--green)]"
                @click="selectOption('store')"
            >
                <img src="@/assets/store.png" alt="store" class="object-contain h-1/3" />
                <p class="text-lg font-bold mt-2">Store</p>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl font-bold self-end"
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
    router.push('/konfigurasjonSteg2')
}
</script>