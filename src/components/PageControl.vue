<script lang="ts" setup>
defineProps({
    currentPage: {
        type: Number,
        default: 1
    },
    totalPages: {
        type: Number,
        default: 1
    },
    onPageChange: {
        type: Function,
        default: () => {}
    }
})
</script>

<template>
    <div class="flex justify-center gap-4">
        <button :disabled="currentPage === 1" @click="onPageChange(currentPage - 1)">
            Previous
        </button>
        <p>{{ currentPage }} / {{ totalPages }}</p>
        <button :disabled="currentPage === totalPages" @click="onPageChange(currentPage + 1)">
            Next
        </button>
    </div>
</template>

<style scoped></style>
