<template>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 class="font-bold mb-4">{{ title }}</h2>
            <p class="mb-4">{{ message }}</p>

            <slot name="input"></slot>

            <div class="flex flex-col justify-center items-center gap-3 mt-3 w-full">
                <slot name="buttons"></slot>
            </div>

            <div class="flex justify-center mt-4">
                <button
                    @click="closeModal"
                    class="font-bold py-2 px-4 w-1/2 bg-white border-2 border-[#f7da7c] hover:bg-[#f7da7c]"
                    aria-label="close"
                >
                    Lukk
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    title: String,
    message: String,
    isModalOpen: Boolean,
})

const emits = defineEmits(['update:isModalOpen'])

function closeModal() {
    emits('update:isModalOpen', false)
}
</script>
