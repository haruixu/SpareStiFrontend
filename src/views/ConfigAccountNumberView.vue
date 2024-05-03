<template>
    <div
        class="flex flex-col items-center justify-center min-h-screen md:pt-10 pt-4 pb-24 text-center"
    >
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">
            Legg til kontonummer for sparekonto og brukskonto
        </h1>
        <div class="absolute bottom-0 md:bottom-40 left-0 w-40 h-40 md:w-52 md:h-52 ml-4">
            <p class="text-sm font-bold mb-3 animate-bounce">Trykk på meg for hjelp ❗️</p>
            <SpareComponent
                :speech="[
                    'Her skriver du inn kontonummer for sparekonto og brukskonto. 🪩',
                    'Sparekonto er kontoen du vil legge alle dine oppsparte penger på!',
                    'Brukskonto er kontoen du ønsker at pangene skal gå ut fra',
                    'Du kan endre dette senere hvis du ønsker det!'
                ]"
                :png-size="10"
                :direction="'right'"
                :imageDirection="'right'"
            ></SpareComponent>
        </div>
        <div
            class="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg w-full md:w-[45%]"
        >
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
                <label for="spendingAccount" class="block text-lg font-bold mb-2">Brukskonto</label>
                <input
                    id="spendingAccount"
                    v-model="spendingAccount"
                    @input="restrictToNumbers($event as InputEvent, 'spending')"
                    @focus="removeFormatting('spending')"
                    @blur="applyFormatting('spending')"
                    class="w-full h-11 px-3 rounded-md text-xl focus:outline-none transition-colors border-2 border-gray-300"
                    type="text"
                    placeholder="Skriv inn ditt kontonummer..."
                />
            </div>
        </div>
        <p class="mt-10">Husk at du kan endre dette senere!</p>
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
import { computed, ref } from 'vue'
import { useUserConfigStore } from '@/stores/userConfigStore'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import SpareComponent from '@/components/SpareComponent.vue'

const MAX_DIGITS = 11
const userConfigStore = useUserConfigStore()

const spendingAccount = ref('')
const savingsAccount = ref('')

const isFormValid = computed(() => {
    return (
        spendingAccount.value.replace(/\./g, '').length === MAX_DIGITS &&
        savingsAccount.value.replace(/\./g, '').length === MAX_DIGITS
    )
})

async function onButtonClick() {
    const savingAccountNumber = parseInt(savingsAccount.value.replace(/\./g, ''))
    const spendingAccountNumber = parseInt(spendingAccount.value.replace(/\./g, ''))

    userConfigStore.setAccount('SAVING', savingAccountNumber)
    userConfigStore.setAccount('SPENDING', spendingAccountNumber)

    await userConfigStore.createConfig()
}

function restrictToNumbers(event: InputEvent, type: string) {
    const inputValue = (event.target as HTMLInputElement)?.value
    if (inputValue !== undefined) {
        const sanitizedValue = inputValue.replace(/\D/g, '')
        const truncatedValue = sanitizedValue.slice(0, MAX_DIGITS)
        if (type === 'spending') {
            spendingAccount.value = truncatedValue
        } else {
            savingsAccount.value = truncatedValue
        }
    }
}

function applyFormatting(type: string) {
    if (type === 'spending') {
        spendingAccount.value = formatAccount(spendingAccount.value)
    } else {
        savingsAccount.value = formatAccount(savingsAccount.value)
    }
}

function removeFormatting(type: string) {
    if (type === 'spending') {
        spendingAccount.value = removeFormat(spendingAccount.value)
    } else {
        savingsAccount.value = removeFormat(savingsAccount.value)
    }
}

function formatAccount(value: string): string {
    return value.replace(/\D/g, '').replace(/^(.{4})(.{2})(.*)$/, '$1.$2.$3')
}

function removeFormat(value: string): string {
    return value.replace(/\./g, '')
}
</script>
