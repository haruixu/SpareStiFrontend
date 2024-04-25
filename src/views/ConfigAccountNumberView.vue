<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Legg til kontonummer for sparekonto og brukskonto</h1>
        <div class="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg w-full md:w-[45%]">
            <div class="w-full mb-4">
                <label for="savingsAccount" class="block text-lg font-bold mb-2">Sparekonto</label>
                <input
                    id="savingsAccount"
                    v-model="savingsAccount"
                    @input="restrictToNumbers($event as InputEvent, 'savings')"
                    @focus="removeFormatting('savings')"
                    @blur="applyFormatting('savings')"
                    class="w-full h-11 px-3 rounded-md text-xl focus:outline-none transition-colors border-2 border-gray-300"
                    type="text"
                    placeholder="Skriv inn ditt kontonummer..."
                />
            </div>
            <div class="w-full mb-4">
                <label for="checkingAccount" class="block text-lg font-bold mb-2">Brukskonto</label>
                <input
                    id="checkingAccount"
                    v-model="checkingAccount"
                    @input="restrictToNumbers($event as InputEvent, 'checking')"
                    @focus="removeFormatting('checking')"
                    @blur="applyFormatting('checking')"
                    class="w-full h-11 px-3 rounded-md text-xl focus:outline-none transition-colors border-2 border-gray-300"
                    type="text"
                    placeholder="Skriv inn ditt kontonummer..."
                />
            </div>
        </div>
        <div class="absolute bottom-36 right-2">
            <ContinueButtonComponent
                @click="onButtonClick"
                :disabled="!isFormValid"
                class="px-10 py-3 text-2xl font-bold mb-4 mr-2"
            ></ContinueButtonComponent>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

const MAX_DIGITS = 11;

const checkingAccount = ref('')
const savingsAccount = ref('')

const isFormValid = computed(() => {
    return checkingAccount.value.replace(/\./g, '').length === MAX_DIGITS &&
        savingsAccount.value.replace(/\./g, '').length === MAX_DIGITS;
})

const onButtonClick = () => {
    router.push({ name: 'home' });
}

function restrictToNumbers(event: InputEvent, type: string) {
    const inputValue = (event.target as HTMLInputElement)?.value; // Use optional chaining to access value
    if (inputValue !== undefined) {
        const sanitizedValue = inputValue.replace(/\D/g, ''); // Replace non-digit characters with empty string
        const truncatedValue = sanitizedValue.slice(0, MAX_DIGITS); // Limit to MAX_DIGITS
        if (type === 'checking') {
            checkingAccount.value = truncatedValue;
        } else {
            savingsAccount.value = truncatedValue;
        }
    }
}

function applyFormatting(type: string) {
    if (type === 'checking') {
        checkingAccount.value = formatAccount(checkingAccount.value);
    } else {
        savingsAccount.value = formatAccount(savingsAccount.value);
    }
}

function removeFormatting(type: string) {
    if (type === 'checking') {
        checkingAccount.value = removeFormat(checkingAccount.value);
    } else {
        savingsAccount.value = removeFormat(savingsAccount.value);
    }
}

function formatAccount(value: string): string {
    return value.replace(/\D/g, '').replace(/^(.{4})(.{2})(.*)$/, '$1.$2.$3');
}

function removeFormat(value: string): string {
    return value.replace(/\./g, '');
}
</script>
