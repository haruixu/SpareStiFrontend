<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center relative">
        <h1 class="mb-8 text-2xl font-bold sm:mb-16 sm:text-4xl">
            Hvor mye bruker du per kjøp på ...
        </h1>
        <div class="w-full flex justify-center">
            <div :class="[showSecondBox ? 'md:grid md:grid-cols-2 md:gap-4 sm:gap-8 mb-6' : '']">
                <div
                    v-if="showFirstBox"
                    class="flex flex-col items-center bg-white rounded-lg p-4 sm:p-8 shadow-lg"
                    :class="showSecondBox ? 'w-full' : 'w-full md:w-1/2 mx-auto'"
                    :style="{ minWidth: '400px', maxWidth: '400px' }"
                >
                    <div
                        v-for="(option, index) in firstBoxOptions"
                        :key="`first-option-${index}`"
                        class="w-full my-4"
                    >
                        <div class="flex justify-between items-center">
                            <p class="text-xl font-bold mr-4">{{ option.type }}</p>
                            <div class="flex items-center w-2/3">
                                <input
                                    v-model="amounts[index]"
                                    @input="filterAmount(index, $event)"
                                    class="h-11 px-3 rounded-md text-lg focus:outline-none border-2 w-full"
                                    :class="{
                                        'border-gray-300': !amounts[index],
                                        'border-[var(--green)]': amounts[index]
                                    }"
                                />
                                <p class="text-xl font-bold ml-2">kr</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="showSecondBox"
                    class="flex flex-col items-center bg-white rounded-lg p-4 sm:p-8 shadow-lg"
                    :class="showSecondBox ? 'w-full' : 'w-full md:w-1/2 mx-auto'"
                    :style="{ minWidth: '400px', maxWidth: '400px' }"
                >
                    <div
                        v-for="(option, index) in secondBoxOptions"
                        :key="`second-option-${index}`"
                        class="w-full my-4"
                    >
                        <div class="flex justify-between items-center">
                            <p class="text-xl font-bold mr-4">{{ option.type }}</p>
                            <div class="flex items-center w-2/3">
                                <input
                                    v-model="amounts[index + firstBoxOptions.length]"
                                    @input="filterAmount(index + firstBoxOptions.length, $event)"
                                    class="h-11 px-3 rounded-md text-lg focus:outline-none border-2 w-full"
                                    :class="{
                                        'border-gray-300': !amounts[index + firstBoxOptions.length],
                                        'border-[var(--green)]':
                                            amounts[index + firstBoxOptions.length]
                                    }"
                                />
                                <p class="text-xl font-bold ml-2">kr</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full text-right">
            <ContinueButtonComponent
                @click="onButtonClick"
                :disabled="!isAllAmountsFilled"
                class="px-10 py-3 text-2xl font-bold mb-20 mt-10 sm:mb-12 sm:mt-10"
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

const options = ref(userConfigStore.challengeTypeConfigs)
const amounts = ref(options.value.map(() => ''))

const isAllAmountsFilled = computed(() => amounts.value.every((amount) => amount.trim() !== ''))

const onButtonClick = () => {
    options.value.forEach((option, index) => {
        userConfigStore.challengeTypeConfigs[index].specificAmount =
            parseFloat(amounts.value[index]) || 0
    })
    router.push({ name: 'configurations5' })
}

const filterAmount = (index: number, event: Event) => {
    const input = event.target as HTMLInputElement
    let filteredValue = input.value.replace(/[^\d,]/g, '')
    filteredValue = filteredValue.replace(/(,.*?),/g, '$1').replace(/,+/g, ',')
    amounts.value[index] = filteredValue
}

const firstBoxOptions = computed(() => options.value.slice(0, 6))
const secondBoxOptions = computed(() => (options.value.length > 6 ? options.value.slice(6) : []))

const showFirstBox = computed(() => options.value.length > 0)
const showSecondBox = computed(() => options.value.length > 6)
</script>
