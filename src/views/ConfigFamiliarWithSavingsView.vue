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
    router.push('/konfigurasjonSteg3')
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 class="text-4xl font-bold mb-16 lg:mb-20">Hvor kjent er du med sparing fra før?</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-14 mb-20">
            <div
                class="box"
                :class="{ active: selectedOption === 'litt' }"
                @click="selectOption('litt')"
            >
                <img
                    src="@/assets/nose.png"
                    alt="Litt kjent"
                    class="object-contain h-1/3 sm:h-1/3"
                />
                <p class="text-lg font-bold mt-2">Litt kjent</p>
            </div>
            <div
                class="box"
                :class="{ active: selectedOption === 'noe' }"
                @click="selectOption('noe')"
            >
                <img
                    src="@/assets/head.png"
                    alt="Noe kjent"
                    class="object-contain h-1/3 sm:h-1/3"
                />
                <p class="text-lg font-bold mt-2">Noe kjent</p>
            </div>
            <div
                class="box"
                :class="{ active: selectedOption === 'godt' }"
                @click="selectOption('godt')"
            >
                <img
                    src="@/assets/pig.png"
                    alt="Godt kjent"
                    class="object-contain h-1/3 sm:h-1/3"
                />
                <p class="text-lg font-bold mt-2">Godt kjent</p>
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl self-end"
        ></ContinueButtonComponent>
    </div>
</template>

<style scoped>
.box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.3s;
    background-color: white;
    border: 1px solid var(--black);
}

.box:hover {
    border-color: var(--green);
}

.box.active {
    border: 3px solid var(--green);
}
</style>
