<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Hvor mye bruker du per kjøp på ...</h1>
        <div class="flex flex-col gap-2 mb-6">
            <div
                v-for="(option, index) in options"
                :key="index"
                class="flex items-center w-80 p-2 cursor-pointer transition-colors bg-white rounded-lg my-4"
            >
                <div class="flex flex-1 justify-start">
                    <p class="text-2xl font-bold">{{ option.name }}</p>
                </div>
                <div class="flex flex-1 items-center justify-end">
                    <input
                        type="text"
                        v-model="option.amount"
                        @input="($event) => filterAmount(index, $event)"
                        class="h-10 px-2 w-2/3 rounded-md text-right text-lg focus:outline-none"
                        :class="{
                            'border-2 border-gray-300': option.amount === '',
                            'border-4 border-[var(--green)]': option.amount !== ''
                        }"
                    />
                    <p class="text-2xl font-bold ml-2">kr</p>
                </div>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            :disabled="options.some((option) => option.amount === '')"
            :style="{
                opacity: options.some((option) => option.amount === '') ? '0.6' : '1',
                cursor: options.some((option) => option.amount === '') ? 'not-allowed' : 'pointer',
                filter: options.some((option) => option.amount === '')
                    ? 'brightness(90%)'
                    : 'brightness(100%)'
            }"
            class="px-10 py-3 text-2xl self-end mt-16 mb-0"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

interface Option {
    name: string
    amount: string
}

const options = ref<Option[]>([
    { name: 'Snus', amount: '' },
    { name: 'Kaffe', amount: '' },
    { name: 'Kantina', amount: '' }
])

const onButtonClick = () => {
    router.push('/konfigurasjonSteg5')
}

const filterAmount = (index: number, event: Event) => {
    const input = event.target as HTMLInputElement
    options.value[index].amount = input.value.replace(/[^\d,]/g, '')
}
</script>
