<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-5">
        <h1 class="text-2xl font-bold sm:text-4xl">Hvor mye bruker du per uke på ...</h1>
        <div class="w-full flex justify-center">
            <div class="flex flex-col items-center bg-white rounded-lg p-4 shadow-lg">
                <div
                    v-for="(option, index) in options"
                    :key="`first-option-${index}`"
                    class="my-4 flex flex-row items-center self-end"
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
                        'Her skal du skrive inn hvor mye du bruker per uke på ulike kategorier. 🗓️',
                        'Hvis du kjøper kaffe hver dag, kan du skrive inn hvor mye du bruker på kaffe per uke.'
                    ]"
                    class="w-60"
                ></SpareComponent>
                <p class="text-xs animate-bounce">Trykk på meg for hjelp ❗️</p>
            </div>
            <div class="flex flex-col">
                <p>Husk at du kan endre dette senere!</p>
                <ContinueButtonComponent
                    :disabled="!isAllAmountsFilled"
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
</script>
