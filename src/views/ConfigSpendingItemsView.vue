<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 class="mb-3 text-2xl font-bold sm:text-4xl mt-0 md:mt-7">Hva bruker du mye penger på?</h1>
        <p class="text-sm mb-8 md:mb-10">Hvis du ikke finner noe som passer, kan du skrive inn egne kategorier i "Annet ..." feltet</p>
      <div class="md:absolute fixed bottom-3 md:bottom-40 left-2 w-28 h-28 md:w-40 md:h-40 lg:w-52 lg:h-52 ml-4">
        <p class="md:text-sm text-xs font-bold mb-3 animate-bounce invisible sm:visible">Trykk på meg for hjelp ❗️</p>
            <SpareComponent
                :speech="[
                    'Her kan du velge hva du bruker mye penger på, slik at vi kan hjelpe deg med å spare penger! 💸',
                    'Hvis du ikke finner noe som passer, kan du skrive inn egne kategorier i \'Annet ...\' feltet',
                    'Du må minst velge en kategori!',
                    'Du kan redigere dette senere!'
                ]"
                :png-size="10"
                :direction="'right'"
                :imageDirection="'right'"
            ></SpareComponent>
        </div>
        <div class="flex flex-wrap justify-center gap-8 mb-8">
            <div
                class="flex flex-col items-center justify-center bg-white rounded-lg sm:p-8 shadow-lg sm:w-full md:w-[45%]"
            >
                <div
                    v-for="buttonText in [
                        'Kaffe',
                        'Snus',
                        'Kantina',
                        'Sigaretter',
                        'Transport',
                        'Klær'
                    ]"
                    :key="buttonText"
                    class="w-full my-4"
                >
                    <button
                        :class="[
                            'w-full md:w-64 h-11 rounded-md text-xl font-bold',
                            selectedOptions.includes(buttonText)
                                ? 'border-2 border-[var(--green)]'
                                : 'border-2 border-gray-300'
                        ]"
                        @click="toggleOption(buttonText)"
                        style="background: transparent"
                    >
                        {{ buttonText }}
                    </button>
                </div>
            </div>
            <div
                class="flex flex-col items-center justify-center bg-white rounded-lg sm:p-8 shadow-lg sm:w-full md:w-[45%]"
            >
                <div
                    v-for="(option, index) in customOptions"
                    :key="`custom-${index}`"
                    class="w-full my-4"
                >
                    <input
                        v-model="customOptions[index]"
                        :class="[
                            'w-full md:w-64 h-11 px-3 rounded-md text-xl focus:outline-none transition-colors border-2',
                            customOptions[index].trim() !== ''
                                ? 'border-[var(--green)]'
                                : 'border-gray-300'
                        ]"
                        type="text"
                        :placeholder="'Annet ' + ' ...'"
                    />
                </div>
            </div>
        </div>
      <p class="mb-1">Husk at du kan endre dette senere!</p>
        <div class="w-full text-right">
            <ContinueButtonComponent
                @click="onButtonClick"
                :disabled="!isFormValid"
                class="px-10 py-3 text-2xl font-bold mt-36 mr-4 sm:mb-12 sm:mt-10"
            ></ContinueButtonComponent>
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
    return predefinedSelected || customFilled
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
