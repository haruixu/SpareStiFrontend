<template>
    <div class="flex flex-col items-center justify-start min-h-screen px-4 text-center">
        <div class="mb-20">
            <div
                class="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-16"
                style="height: 530px; min-height: 500px; min-width: 400px; max-width: 400px"
            >
                <template v-if="!skipped && !accepted">
                    <div class="mb-6 w-full text-left">
                        <label for="savings-goal" class="block text-xl font-bold mb-2"
                        >Jeg vil spare til:</label
                        >
                        <input
                            type="text"
                            id="savings-goal"
                            v-model="savingsGoal"
                            :class="{
                                'border-[var(--green)]': savingsGoal.valueOf(),
                                'border-gray-300': !savingsGoal.valueOf()
                            }"
                            class="border-2 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-xl"
                            placeholder=""
                        />
                    </div>
                    <div class="mb-8 w-full flex items-center">
                        <label for="amount" class="shrink-0 text-xl font-bold mr-2"
                        >Jeg vil spare:</label
                        >
                        <input
                            type="text"
                            id="amount"
                            v-model="rawAmount"
                            :class="{
                                'border-[var(--green)]': rawAmount.valueOf(),
                                'border-gray-300': !rawAmount.valueOf()
                            }"
                            class="border-2 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-xl mr-2 block w-full"
                            placeholder=""
                            min="0"
                        />
                        <span class="shrink-0 text-xl font-bold">kr</span>
                    </div>
                    <div class="w-full px-4 py-2">
                        <img src="@/assets/coins.png" alt="Savings" class="mx-auto w-36 h-32" />
                    </div>
                    <div class="flex justify-between w-full mt-4 space-x-2">
                        <button
                            class="bg-[var(--green)] border-4 border-[var(--green)] hover:brightness-90 active:brightness-75 font-bold rounded-lg py-2 px-10 text-lg"
                            @click="skip"
                        >
                            Skip
                        </button>
                        <button
                            :class="[
                                'border-4 font-bold rounded-lg py-2 px-10 text-lg transition-all',
                                canAccept
                                    ? 'bg-[var(--green)] hover:brightness-90 active:brightness-75'
                                    : 'opacity-60 bg-gray-300 cursor-not-allowed'
                            ]"
                            :disabled="!canAccept"
                            @click="accept"
                        >
                            Godta
                        </button>
                    </div>
                </template>
                <template v-else>
                    <div
                        class="flex justify-start items-center h-full min-h-[400px] min-w-[400px] max-w-[400px]"
                    >
                        <div class="text-4xl font-bold">{{ acceptedMessage }}</div>
                    </div>
                </template>
            </div>
        </div>
        <ContinueButtonComponent
            :disabled="!skipped && !accepted"
            @click="onButtonClick"
            class="px-10 py-3 text-lg font-bold self-end mb-80 mt-[-10px]"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

const savingsGoal = ref('')
const rawAmount = ref('')
const skipped = ref(false)
const accepted = ref(false)

const validateAmount = () => {
    const validPattern = /^(\d+)?(,\d*)?$/
    if (!validPattern.test(rawAmount.value)) {
        rawAmount.value = rawAmount.value.slice(0, -1)
    } else if (rawAmount.value.includes(',')) {
        rawAmount.value = rawAmount.value.replace(/,+/g, ',')
    }
}

const checkNegative = () => {
    const numericValue = parseFloat(rawAmount.value.replace(',', '.'))
    if (numericValue < 0) {
        rawAmount.value = ''
    }
}

watch(rawAmount, validateAmount)
watch(() => parseFloat(rawAmount.value.replace(',', '.')), checkNegative)

const canAccept = computed(() => savingsGoal.value.trim() !== '' && rawAmount.value.trim() !== '')

const skip = () => {
    skipped.value = true
    acceptedMessage.value = 'Du kan opprette sparemål senere'
}

const accept = () => {
    if (canAccept.value) {
        accepted.value = true
        acceptedMessage.value = 'Du har fått ditt første sparemål!'
    }
}

const onButtonClick = () => {
    if (skipped.value || accepted.value) {
        router.push('/forsteSpareutfordring')
    }
}

const acceptedMessage = ref('')

watchEffect(() => {
    if (accepted.value) {
        acceptedMessage.value = 'Du har fått ditt første sparemål!'
    } else if (skipped.value) {
        acceptedMessage.value = 'Du kan opprette sparemål senere'
    }
})
</script>
