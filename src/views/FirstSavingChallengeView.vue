<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div class="mb-20">
            <div
                class="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-16"
                style="height: 500px; min-height: 500px; min-width: 400px; max-width: 400px;"
            >
                <template v-if="!skipped && !accepted">
                    <div class="mb-6 w-full text-left">
                        <label for="savings-goal" class="block text-4xl font-bold mb-2">Spareutfordring</label>
                    </div>
                    <div class="flex flex-col w-full mb-4">
                        <button
                            v-for="buttonText in buttonOptions"
                            :key="buttonText"
                            :class="[
                            'mb-4 text-xl font-bold w-full rounded-lg py-3 px-4',
                            selectedOptions.includes(buttonText)
                                ? 'bg-transparent border-2 border-[var(--green)]'
                                : 'bg-transparent border-2 border-gray-300'
                        ]"
                            @click="toggleOption(buttonText)"
                        >
                            {{ buttonText }}
                        </button>
                    </div>
                    <div class="flex justify-between w-full mt-auto space-x-2">
                        <button
                            class="bg-[var(--green)] border 4 border-[var(--green)] hover:brightness-90 active:brightness-75 font-bold rounded-lg py-2 px-10 text-lg"
                            @click="skip"
                        >
                            Skip
                        </button>
                        <button
                            :class="[
        'border-4 font-bold rounded-lg py-2 px-10 text-lg transition-all',
        { 'bg-[var(--green)] hover:brightness-90 active:brightness-75': selectedOptions.length > 0 },
        { 'opacity-60 bg-[rgba(149,227,93,0.6)] cursor-not-allowed': selectedOptions.length === 0 }
    ]"
                            :disabled="selectedOptions.length === 0"
                            @click="accept"
                        >
                            Godta
                        </button>
                    </div>
                </template>
                <template v-else>
                    <div class="flex justify-center items-center h-full">
                        <div class="text-4xl font-bold">{{ acceptedMessage }}</div>
                    </div>
                </template>
            </div>
        </div>
        <ContinueButtonComponent
            :disabled="!skipped && !accepted"
            @click="onButtonClick"
            class="px-10 py-3 text-2xl font-bold self-end mb-32 mt-[-11px]"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'
import { ref, watchEffect } from 'vue'

const buttonOptions = ref(['Ikke kjøpe kaffe', 'Ikke kjøpe snus', 'Ikke kjøpe mat i kantina'])
const selectedOptions = ref<string[]>([])
const skipped = ref(false)
const accepted = ref(false)

const toggleOption = (option: string) => {
    const index = selectedOptions.value.indexOf(option)
    if (index === -1) {
        selectedOptions.value.push(option)
    } else {
        selectedOptions.value.splice(index, 1)
    }
}

const onButtonClick = () => {
    router.push('/')
}

const skip = () => {
    skipped.value = true
}

const accept = () => {
    accepted.value = true
}

const acceptedMessage = ref("Du kan opprette spareutfordringer senere")

watchEffect(() => {
    if (accepted.value) {
        acceptedMessage.value = "Du har fått din første spareutfordring!"
    } else if (skipped.value) {
        acceptedMessage.value = "Du kan opprette spareutfordringer senere"
    }
})
</script>
