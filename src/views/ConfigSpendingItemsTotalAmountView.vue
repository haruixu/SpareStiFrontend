<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-8 lg:mb-12 text-4xl font-bold">Hvor mye bruker du totalt per uke på ...</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div class="flex flex-col items-center bg-white rounded-lg p-8 shadow-lg w-full">
                <div
                    v-for="(option, index) in options.slice(0, 6)"
                    :key="`option-${index}`"
                    class="w-full my-4"
                >
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold mr-4">{{ option.type }}</p>
                        <div class="flex items-center w-2/3">
                            <input
                                type="text"
                                v-model="amounts[index]"
                                @input="($event) => filterAmount(index, $event)"
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
            <div class="flex flex-col items-center bg-white rounded-lg p-8 shadow-lg w-full">
                <div
                    v-for="(option, index) in options.slice(6, 12)"
                    :key="`option-${index}`"
                    class="w-full my-4"
                >
                    <div class="flex justify-between items-center">
                        <p class="text-xl font-bold mr-4">{{ option.type }}</p>
                        <div class="flex items-center w-2/3">
                            <input
                                type="text"
                                v-model="amounts[index + 6]"
                                @input="($event) => filterAmount(index + 6, $event)"
                                class="h-11 px-3 rounded-md text-lg focus:outline-none border-2 w-full"
                                :class="{
                                    'border-gray-300': !amounts[index + 6],
                                    'border-[var(--green)]': amounts[index + 6]
                                }"
                            />
                            <p class="text-xl font-bold ml-2">kr</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="absolute bottom-24 right-4">
            <ContinueButtonComponent
                @click="onButtonClick"
                :disabled="!isAllAmountsFilled"
                class="px-10 py-3 text-2xl font-bold mb-4"
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

const onButtonClick = async () => {
    options.value.forEach((option, index) => {
        userConfigStore.challengeTypeConfigs[index].generalAmount =
            parseFloat(amounts.value[index]) || 0
    })

    await userConfigStore.postUserConfig()
    router.push('/hjem')
}

const filterAmount = (index: number, event: Event) => {
    const input = event.target as HTMLInputElement
    let filteredValue = input.value.replace(/[^\d,]/g, '')
    filteredValue = filteredValue.replace(/(,.*?),/g, '$1').replace(/,+/g, ',')
    amounts.value[index] = filteredValue
}
</script>
