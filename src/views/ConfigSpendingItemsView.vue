<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5">
        <h1 class="text-2xl font-bold sm:text-4xl">Hva bruker du mye penger på?</h1>

        <div class="flex flex-wrap justify-center gap-8">
            <div
                class="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 gap-8"
            >
                <button
                    v-for="buttonText in [
                        'Kaffe',
                        'Snus',
                        'Kantina',
                        'Sigaretter',
                        'Transport',
                        'Klær'
                    ]"
                    :key="buttonText"
                    :class="[
                        'w-64 h-11 rounded-md text-xl font-bold',
                        selectedOptions.includes(buttonText)
                            ? 'border-2 border-[var(--green)]'
                            : 'border-2 border-gray-300'
                    ]"
                    style="background: transparent"
                    @click="toggleOption(buttonText)"
                >
                    {{ buttonText }}
                </button>
            </div>
            <div
                class="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 gap-8"
            >
                <input
                    v-for="(option, index) in customOptions"
                    :key="`custom-${index}`"
                    v-model="customOptions[index]"
                    :class="[
                        'w-64 h-11 px-3 rounded-md text-xl focus:outline-none transition-colors border-2',
                        customOptions[index].trim() !== ''
                            ? 'border-[var(--green)]'
                            : 'border-gray-300'
                    ]"
                    :placeholder="'Annet ' + ' ...'"
                    type="text"
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
                        'Her kan du velge hva du bruker mye penger på, slik at vi kan hjelpe deg med å spare penger! 💸',
                        'Hvis du ikke finner noe som passer, kan du skrive inn egne kategorier i \'Annet ...\' feltet',
                        'Du må minst velge en kategori!'
                    ]"
                    class="w-60"
                ></SpareComponent>
                <p class="text-xs animate-bounce">Trykk på meg for hjelp ❗️</p>
            </div>
            <div class="flex flex-col">
                <p>Husk at du kan endre dette senere!</p>
                <ContinueButtonComponent
                    :disabled="!isFormValid"
                    class="px-10 py-3 text-2xl"
                    @click="onButtonClick"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'
import { useUserConfigStore } from '@/stores/userConfigStore'
import SpareComponent from '@/components/SpareComponent.vue'

const userConfigStore = useUserConfigStore()
const selectedOptions = ref<string[]>([])
const customOptions = ref(['', '', '', '', '', ''])

const toggleOption = (option: string) => {
    const index = selectedOptions.value.indexOf(option)
    if (index === -1) {
        selectedOptions.value.push(option)
    } else {
        selectedOptions.value.splice(index, 1)
    }
}

const isFormValid = computed(() => {
    const predefinedSelected = selectedOptions.value.length > 0
    const customFilled = customOptions.value.some((option) => option.trim() !== '')
    const allOptions = [
        ...selectedOptions.value,
        ...customOptions.value.filter((option) => option.trim() !== '')
    ]
    const uniqueOptions = new Set(allOptions)
    const hasDuplicates = uniqueOptions.size < allOptions.length
    return (predefinedSelected || customFilled) && !hasDuplicates
})

const onButtonClick = () => {
    if (!isFormValid.value) {
        console.error('Form is not valid')
        return
    }

    const predefinedChallengeTypes = selectedOptions.value.map((option) => ({
        type: option,
        specificAmount: 0,
        generalAmount: 0
    }))

    const customChallengeTypes = customOptions.value
        .filter((option) => option.trim() !== '')
        .map((option) => ({
            type: option,
            specificAmount: 0,
            generalAmount: 0
        }))

    for (const challengeType of predefinedChallengeTypes.concat(customChallengeTypes)) {
        userConfigStore.addChallengeTypeConfig(
            challengeType.type,
            challengeType.specificAmount,
            challengeType.generalAmount
        )
    }

    router.push({ name: 'configurations4' })
}
</script>
