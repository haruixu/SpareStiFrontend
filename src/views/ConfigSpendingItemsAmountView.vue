<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Hvor mye bruker du per kjøp på ...</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div class="flex flex-col items-center bg-white rounded-lg p-8 shadow-lg w-100">
                <div
                    v-for="(option, index) in options.slice(0, 3)"
                    :key="index"
                    class="w-full my-4"
                >
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold mr-4">{{ option.name }}</p>
                        <div class="flex items-center w-2/3">
                            <input
                                type="text"
                                v-model="option.amount"
                                @input="($event) => filterAmount(index, $event)"
                                class="h-11 px-3 rounded-md text-lg focus:outline-none border-2 w-full"
                                :class="{
                                    'border-gray-300': option.amount === '',
                                    'border-[var(--green)]': option.amount !== ''
                                }"
                            />
                            <p class="text-xl font-bold ml-2">kr</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center bg-white rounded-lg p-8 shadow-lg w-100">
                <div
                    v-for="(option, index) in options.slice(3, 6)"
                    :key="index"
                    class="w-full my-4"
                >
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold mr-4">{{ option.name }}</p>
                        <div class="flex items-center w-2/3">
                            <input
                                type="text"
                                v-model="option.amount"
                                @input="($event) => filterAmount(index + 3, $event)"
                                class="h-11 px-3 rounded-md text-lg focus:outline-none border-2 w-full"
                                :class="{
                                    'border-gray-300': option.amount === '',
                                    'border-[var(--green)]': option.amount !== ''
                                }"
                            />
                            <p class="text-xl font-bold ml-2">kr</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full text-right mb-3 mt-16">
            <ContinueButtonComponent
                @click="onButtonClick"
                :disabled="options.some((option) => option.amount === '')"
                class="px-10 py-3 text-2xl font-bold mb-4"
            ></ContinueButtonComponent>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

interface Option {
    name: string
    amount: string
}

const options = ref<Option[]>([
    { name: 'Snus', amount: '' },
    { name: 'Kaffe', amount: '' },
    { name: 'Kantina', amount: '' },
    { name: 'Annet', amount: '' },
    { name: 'Annet', amount: '' },
    { name: 'Annet', amount: '' }
])

const onButtonClick = () => {
    router.push('/konfigurasjonSteg5')
}

const filterAmount = (index: number, event: Event) => {
    const input = event.target as HTMLInputElement
    let filteredValue = input.value.replace(/[^\d,]/g, '')
    if (filteredValue.includes(',')) {
        filteredValue = filteredValue.replace(/,+/g, ',')
        const firstCommaIndex = filteredValue.indexOf(',')
        filteredValue =
            filteredValue.slice(0, firstCommaIndex + 1) +
            filteredValue.slice(firstCommaIndex + 1).replace(/,/g, '')
    }
    options.value[index].amount = filteredValue
}
</script>
