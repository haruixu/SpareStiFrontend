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
        <button :disabled="currentPage === 0" @click="onPageChange(currentPage - 1)">
            Previous
        </button>
        <p>{{ currentPage + 1 }} / {{ totalPages }}</p>
        <button :disabled="currentPage === totalPages - 1" @click="onPageChange(currentPage + 1)">
            Next
        </button>
    </div>
</template>

<style scoped>
button:disabled:hover {
    background-color: #cbcbcb;
}
</style>
