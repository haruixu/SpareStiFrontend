<script setup lang="ts">
import { ref } from 'vue';
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue';
import '@/assets/base.css';
import router from '@/router';

interface Option {
    name: string;
    selected: boolean;
}

const options = ref<Option[]>([
    { name: 'Snus', selected: false },
    { name: 'Kaffe', selected: false },
    { name: 'Kantina', selected: false }
]);

const toggleOption = (index: number) => {
    options.value[index].selected = !options.value[index].selected;
};

const onButtonClick = () => {
    const selectedOptions = options.value.filter(option => option.selected);
    if (selectedOptions.length >= 1 && selectedOptions.length <= 3) {
        const selectedOptionNames = selectedOptions.map(option => option.name);
        router.push('/konfigurasjonSteg4');
    } else {
        console.error('Please select between 1 and 3 options.');
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 class="text-4xl font-bold mb-16 lg:mb-20">Hva bruker du mye penger på?</h1>
        <div class="flex flex-col gap-4 mb-6">
            <div v-for="(option, index) in options" :key="index" class="box" @click="toggleOption(index)" :class="{ 'active': option.selected }">
                <p class="text-lg font-bold mt-2">{{ option.name }}</p>
                <input type="checkbox" v-model="option.selected" class="hidden">
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

.box input[type="checkbox"] {
    display: none;
}
</style>
