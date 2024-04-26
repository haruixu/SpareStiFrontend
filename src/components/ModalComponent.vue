<template>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 md:-mt-5 md:-mb-5"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 class="title font-bold mb-4">{{ title }}</h2>
            <p class="message mb-4">{{ message }}</p>

            <slot name="input"></slot>

            <div class="buttons flex flex-col justify-center items-center gap-3 mt-3 w-full">
                <slot name="buttons"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title: String,
    message: String,
    isModalOpen: Boolean
})
</script>
