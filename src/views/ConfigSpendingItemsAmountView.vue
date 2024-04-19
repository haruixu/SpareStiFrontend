<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Hvor mye penger per kjøp bruker du på ...</h1>
        <div class="flex flex-col gap-2 mb-6">
            <div
                v-for="(option, index) in options"
                :key="index"
                :class="{
                    'border-[var(--green)] border-4': option.amount !== null && option.amount >= 0,
                    'border-gray-300 border-2': !(option.amount !== null && option.amount >= 0)
                }"
                class="flex justify-between items-center w-72 p-2 cursor-pointer transition-colors bg-white rounded-lg my-4"
            >
                <p class="text-xl font-bold">{{ option.name }}</p>
                <div class="flex items-center">
                    <input
                        type="number"
                        v-model="option.amount"
                        class="w-20 h-10 p-1 rounded-md text-right text-lg"
                        placeholder="Beløp"
                        min="0"
                    />
                    <p class="ml-2 font-bold">kr</p>
                </div>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl self-end mt-12 mb-0"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'

interface Option {
    name: string
    amount: number | null
}

const options = ref<Option[]>([
    { name: 'Snus', amount: null },
    { name: 'Kaffe', amount: null },
    { name: 'Kantina', amount: null }
])

const onButtonClick = () => {}
</script>
