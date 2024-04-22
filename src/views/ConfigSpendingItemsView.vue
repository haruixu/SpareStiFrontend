<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 sm:px-2 text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Hva bruker du mye penger på?</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="flex flex-col items-center bg-white rounded-lg p-8 shadow-lg md:w-96">
                <div
                    v-for="buttonText in ['Kaffe', 'Snus', 'Kantina']"
                    :key="buttonText"
                    class="w-full my-4"
                >
                    <button
                        :class="[
                            'w-full h-11 rounded-md text-xl font-bold',
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

            <div class="flex flex-col items-center bg-white rounded-lg p-8 shadow-lg md:w-96">
                <div v-for="(option, index) in options" :key="`input-${index}`" class="w-full my-4">
                    <input
                        v-model="option.name"
                        :class="[
                            'w-full h-11 px-3 rounded-md text-xl focus:outline-none transition-colors',
                            option.name
                                ? 'border-2 border-[var(--green)]'
                                : 'border-2 border-gray-300'
                        ]"
                        type="text"
                        placeholder="Annet ..."
                    />
                </div>
            </div>
        </div>
        <div class="w-full text-right mb-3 mt-14">
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

interface Option {
    name: string
}

const options = ref<Option[]>([{ name: '' }, { name: '' }, { name: '' }])
const selectedOptions = ref<string[]>([])

const toggleOption = (option: string) => {
    const index = selectedOptions.value.indexOf(option)
    if (index === -1) {
        selectedOptions.value.push(option)
    } else {
        selectedOptions.value.splice(index, 1)
    }
}

const isFormValid = computed(() => {
    return (
        selectedOptions.value.length > 0 ||
        options.value.some((option) => option.name.trim() !== '')
    )
})

const onButtonClick = () => {
    if (isFormValid.value) {
        router.push('/konfigurasjonSteg4')
    }
}
</script>
