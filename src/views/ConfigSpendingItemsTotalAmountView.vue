<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center relative">
        <h1 class="mb-2 text-2xl font-bold sm:text-4xl">Hvor mye bruker du per uke på ...</h1>
        <p class="text-sm mb-8 md:mb-10">
            Her kan du skrive inn hvor mye du bruker per uke på ulike kategorier
        </p>
        <div class="absolute bottom-0 md:bottom-40 left-0 w-40 h-40 md:w-52 md:h-52 ml-4">
            <p class="text-sm font-bold mb-3 animate-bounce">Trykk på meg for hjelp ❗️</p>
            <SpareComponent
                :speech="[
                    'Her skal du skrive inn hvor mye du bruker per uke på ulike kategorier. 🗓️',
                    'Hvis du kjøper kaffe hver dag, kan du skrive inn hvor mye du bruker på kaffe per uke.',
                    'Du kan redigere dette senere!'
                ]"
                :png-size="10"
                :direction="'right'"
                :imageDirection="'right'"
            ></SpareComponent>
        </div>
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
        <p class="mt-10">Husk at du kan endre dette senere!</p>
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
import SpareComponent from '@/components/SpareComponent.vue'

const userConfigStore = useUserConfigStore()

const options = ref(userConfigStore.challengeConfig.challengeTypeConfigs)
const amounts = ref(options.value.map(() => ''))

const isAllAmountsFilled = computed(() => amounts.value.every((amount) => amount.trim() !== ''))

// Update the general amount for each challenge type
const onButtonClick = async () => {
    options.value.forEach((option, index) => {
        userConfigStore.challengeConfig.challengeTypeConfigs[index].generalAmount =
            parseFloat(amounts.value[index]) || 0
    })

    await router.push({ name: 'configurations6' })
}

// Filter the input to only allow numbers and commas
const filterAmount = (index: number, event: Event) => {
    const input = event.target as HTMLInputElement
    let filteredValue = input.value.replace(/[^\d,]/g, '')
    filteredValue = filteredValue.replace(/(,.*?),/g, '$1').replace(/,+/g, ',')
    amounts.value[index] = filteredValue
}

// Split the options into two boxes
const firstBoxOptions = computed(() => options.value.slice(0, 6))
const secondBoxOptions = computed(() => (options.value.length > 6 ? options.value.slice(6) : []))

// Show the second box if there are more than 6 options
const showFirstBox = computed(() => options.value.length > 0)
const showSecondBox = computed(() => options.value.length > 6)
</script>
