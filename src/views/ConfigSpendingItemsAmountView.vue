<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import '@/assets/base.css'

interface Option {
    name: string
    amount: number | null
}

const options: Option[] = [
    { name: 'Snus', amount: null },
    { name: 'Kaffe', amount: null },
    { name: 'Kantina', amount: null }
]

const onButtonClick = () => {
    console.log('Options with amounts:', options)
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 class="text-4xl font-bold mb-16 lg:mb-20">Hvor mye penger per kjøp bruker du på ...</h1>
        <div class="flex flex-col gap-4 mb-6">
            <div class="option-container" v-for="(option, index) in options" :key="index">
                <p class="option-text">{{ option.name }}</p>
                <div class="flex items-center">
                    <input
                        type="number"
                        v-model="option.amount"
                        class="amount-input"
                        placeholder="Beløp"
                        min="0"
                    />
                    <p class="currency">kr</p>
                </div>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl self-end"
        ></ContinueButtonComponent>
    </div>
</template>

<style scoped>
.option-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.3s;
    background-color: white;
    border: 1px solid var(--black);
    margin: 0 auto 28px;
}

.option-text {
    font-size: 1.5rem;
    font-weight: bold;
}

.amount-input {
    width: 80px;
    height: 40px;
    padding: 5px;
    border: 1px solid var(--black);
    border-radius: 5px;
}

.currency {
    margin-left: 5px;
    font-weight: bold;
}
</style>
