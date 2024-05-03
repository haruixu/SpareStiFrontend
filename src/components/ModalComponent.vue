<template>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 class="title font-bold mb-4">{{ title }}</h2>
            <p class="message mb-4" v-html="message"></p>

            <slot />

            <div class="buttons flex flex-row justify-center items-center gap-3 mt-3 w-full">
                <slot name="buttons"></slot>
                <button v-if="closeButton" class="button primary" @click="$emit('close')">
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
    isModalOpen: {
        type: Boolean,
        default: true,
        required: false
    },
    closeButton: {
        type: Boolean,
        default: false,
        required: false
    }
})
</script>
