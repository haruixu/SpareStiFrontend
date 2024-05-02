<script lang="ts" setup>
defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    onPageChange: {
        type: Function,
        default: () => {}
    }
})
</script>

<template>
    <div v-if="totalPages > 0" class="flex justify-center gap-4">
        <button
            class="primary"
            :disabled="currentPage === 0"
            @click="onPageChange(currentPage - 1)"
        >
            Forrige
        </button>
        <p>{{ currentPage + 1 }} / {{ totalPages }}</p>
        <button
            class="primary"
            :disabled="currentPage === totalPages - 1"
            @click="onPageChange(currentPage + 1)"
        >
            Neste
        </button>
    </div>
</template>

<style scoped></style>
