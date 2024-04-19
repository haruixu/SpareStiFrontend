<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-16 text-4xl font-bold lg:mb-20">Hva bruker du mye penger på?</h1>
        <div class="flex flex-col gap-8 mb-6">
            <div
                v-for="(option, index) in options"
                :key="index"
                class="flex flex-col items-center justify-center w-72 h-18 p-2.5 cursor-pointer transition-colors bg-white rounded-lg"
                :class="{
                    'border-[var(--green)] border-4': option.selected,
                    'border-gray-300 border-2': !option.selected
                }"
                @click="toggleOption(index)"
            >
                <p class="text-lg font-bold mt-2">{{ option.name }}</p>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl self-end mt-16 mb-0"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

interface Option {
    name: string
    selected: boolean
}

const options = ref<Option[]>([
    { name: 'Snus', selected: false },
    { name: 'Kaffe', selected: false },
    { name: 'Kantina', selected: false }
])

const toggleOption = (index: number) => {
    options.value[index].selected = !options.value[index].selected
}

const onButtonClick = () => {
    const selectedOptions = options.value.filter((option) => option.selected)
    if (selectedOptions.length <= 3) {
        const selectedOptionNames = selectedOptions.map((option) => option.name)
        router.push('/konfigurasjonSteg4')
    } else {
        console.error('Please select between 1 and 3 options.')
    }
}
</script>
