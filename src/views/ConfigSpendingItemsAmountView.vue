<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5">
        <h1 class="text-2xl font-bold sm:text-4xl">Hvor mye bruker du per kjøp på ...</h1>
        <div class="w-full flex justify-center">
            <div class="flex flex-col items-center bg-white rounded-lg p-4 shadow-lg">
                <div
                    v-for="(option, index) in options"
                    :key="`first-option-${index}`"
                    class="my-4 flex flex-row justify-between items-center"
                >
                    <p class="text-xl font-bold mr-4 text-wrap">{{ option.type }}</p>
                    <div class="flex flex-row self-end items-center">
                        <input
                            v-model="amounts[index]"
                            :class="{
                                'border-gray-300': !amounts[index],
                                'border-[var(--green)]': amounts[index]
                            }"
                            class="h-11 px-3 rounded-md text-lg focus:outline-none border-2 w-32"
                            @input="filterAmount(index, $event)"
                        />
                        <p class="text-xl font-bold ml-2">kr</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-row flex-wrap justify-center gap-x-52 gap-y-5">
            <div class="flex flex-col">
                <SpareComponent
                    :direction="'right'"
                    :imageDirection="'right'"
                    :png-size="10"
                    :speech="[
                        'Her kan du skrive inn hvor mye penger du bruker per kjøp på ulike ting. 🍔',
                        'For eksempel koster en kopp kaffe ☕️ kanskje 30 kr, mens en kinobillett 🎟️ koster 100 kr.'
                    ]"
                    class="w-60"
                ></SpareComponent>
                <p class="text-xs">Trykk på meg for hjelp ❗️</p>
            </div>
            <ContinueButtonComponent
                :disabled="!isAllAmountsFilled"
                class="px-10 py-3 text-2xl self-end"
                @click="onButtonClick"
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

const onButtonClick = () => {
    options.value.forEach((option, index) => {
        userConfigStore.challengeConfig.challengeTypeConfigs[index].specificAmount =
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
</script>
