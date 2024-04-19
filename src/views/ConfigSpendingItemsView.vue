<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 class="mb-8 lg:mb-24 text-4xl font-bold">Hva bruker du mye penger på?</h1>
        <div class="flex flex-col gap-14 mb-8">
            <div v-for="(option, index) in options" :key="index" class="w-80">
                <input
                    v-model="option.name"
                    @input="updateBorder(index)"
                    class="w-full h-10 p-1 rounded-md text-lg focus:outline-none transition-colors"
                    :class="
                        option.name ? 'border-4 border-[var(--green)]' : 'border-2 border-gray-300'
                    "
                    type="text"
                    :placeholder="'Kaffe, snus, kantina, ...'"
                />
            </div>
        </div>
        <ContinueButtonComponent
            @click="onButtonClick"
            :disabled="!isValid"
            :style="{
                opacity: !isValid ? '0.6' : '1',
                cursor: !isValid ? 'not-allowed' : 'pointer'
            }"
            class="px-10 py-3 text-2xl font-bold self-end mt-14 mb-0"
        ></ContinueButtonComponent>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'
import router from '@/router'

interface Option {
    name: string
}

const options = ref<Option[]>([{ name: '' }, { name: '' }, { name: '' }])

const updateBorder = (index: number) => {}

const isValid = computed(() => {
    return options.value.every((option) => option.name.trim() !== '')
})

const onButtonClick = () => {
    if (isValid.value) {
        const optionNames = options.value.map((option) => option.name)
        router.push('/konfigurasjonSteg4')
    } else {
        console.error('Please enter all option names.')
    }
}
</script>
