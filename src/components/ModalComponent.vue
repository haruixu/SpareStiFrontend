<template>
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 class="font-bold mb-4">{{ title }}</h2>
            <p class="mb-4">{{ message }}</p>
            <input v-if="showInput"
                   :type="typeValue"
                   v-model="inputValue"
                   @input="$emit('update:inputValue', inputValue)"
                   class="border border-gray-300 p-2 w-full"
                   :placeholder="inputPlaceholder"
            />
            <div class="flex flex-col justify-center items-center gap-3 mt-3 w-full">
                <button v-if="showButton"
                        :disabled="!isInputValid"
                        @click="buttonAction && buttonAction!()"
                        class="active-button font-bold py-2 px-4 w-1/2 hover:bg-[#f7da7c] border-2 border-[#f7da7c] disabled:border-transparent">
                        {{ button1 }}
                </button>
                <button @click="closeModal"
                        class="font-bold py-2 px-4 w-1/2 bg-white border-2 border-[#f7da7c] hover:bg-[#f7da7c]"
                        aria-label="close">
                        Lukk
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
    title: String,
    message: String,
    button1: String,
    isModalOpen: Boolean,
    buttonAction: {
        type: Function,
        default: () => {}
    },
    showButton: Boolean,
    showInput: Boolean,
    typeValue: String,
    inputPlaceholder: String,
    isInputValid: Boolean
});

const emits = defineEmits(['update:isModalOpen', 'update:inputValue']);
const inputValue = ref('');

function closeModal() {
    inputValue.value = '';
    emits('update:isModalOpen', false);
}
</script>