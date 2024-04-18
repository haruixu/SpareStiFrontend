<script setup lang="ts">
import { ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import '@/assets/base.css'
import router from '@/router'

const selectedOption = ref<string | null>(null)

const selectOption = (option: string) => {
    selectedOption.value = option
}

const onButtonClick = () => {
    if (selectedOption.value) {
        console.log(`Proceeding with the selected option: ${selectedOption.value}`)
    } else {
        console.log('No option selected.')
    }
    router.push('/konfigurasjonSteg3');
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 class="text-4xl font-bold mb-16 lg:mb-20">Hva bruker du mye penger på?</h1>
        <div class="flex flex-col gap-4 mb-6">
            <div
                class="box"
                :class="{ active: selectedOption === 'snus' }"
                @click="selectOption('snus')"
            >
                <p class="text-lg font-bold mt-2">Snus</p>
            </div>
            <div
                class="box"
                :class="{ active: selectedOption === 'kaffe' }"
                @click="selectOption('kaffe')"
            >
                <p class="text-lg font-bold mt-2">Kaffe</p>
            </div>
            <div
                class="box"
                :class="{ active: selectedOption === 'Kantina' }"
                @click="selectOption('Kantina')"
            >
                <p class="text-lg font-bold mt-2">Kantina</p>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl font-bold self-end"
        ></ContinueButtonComponent
        >
    </div>
</template>

<style scoped>
.box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 70px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.3s;
    background-color: white;
    border: 1px solid var(--black);
    margin: 0 auto 20px;
}

.box:hover {
    border-color: var(--green);
}

.box.active {
    border: 3px solid var(--green);
}
</style>
