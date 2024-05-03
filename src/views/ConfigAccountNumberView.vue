<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5">
        <h1 class="text-2xl font-bold sm:text-4xl">
            Legg til kontonummer for sparekonto og brukskonto
        </h1>
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
        <div class="flex flex-row flex-wrap justify-center gap-x-52 gap-y-5">
            <div class="flex flex-col">
                <SpareComponent
                    :direction="'right'"
                    :imageDirection="'right'"
                    :png-size="10"
                    :speech="[
                        'Her skriver du inn kontonummer for sparekonto og brukskonto. 🪩',
                        'Sparekonto er kontoen du vil legge alle dine oppsparte penger på!',
                        'Brukskonto er kontoen du ønsker at pangene skal gå ut fra',
                        'Du kan endre dette senere hvis du ønsker det!'
                    ]"
                    class="w-60"
                ></SpareComponent>
                <p class="text-xs animate-bounce">Trykk på meg for hjelp ❗️</p>
            </div>
            <p class="mt-10">Husk at du kan endre dette senere!</p>
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
