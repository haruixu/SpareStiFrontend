<script setup lang="ts">
import { ref, watch } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

const savingsGoal = ref('')
const rawAmount = ref('')

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

const onButtonClick = () => {
    router.push('/home')
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div class="mb-20">
            <div
                class="flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-16"
                style="width: 400px; height: 400px"
            >
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
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            class="px-10 py-3 text-2xl font-bold self-end"
        ></ContinueButtonComponent>
    </div>
</template>
