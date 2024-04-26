<template>
    <div class="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Hva bruker du mye penger på?</h1>
        <div class="flex flex-wrap justify-center gap-8 mb-8">
            <div
                class="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg w-full md:w-[45%]"
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
                class="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg w-full md:w-[45%]"
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
        <div class="w-full text-right mb-0 mt-0" style="position: relative; top: -92px; right: 8px">
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
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'
import { useUserConfigStore } from '@/stores/userConfigStore'

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

    userConfigStore.challengeTypeConfigs = [...predefinedChallengeTypes, ...customChallengeTypes]
    router.push({ name: 'configurations4' })
}
</script>
