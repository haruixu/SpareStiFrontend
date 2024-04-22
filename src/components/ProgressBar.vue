<script lang="ts" setup>
defineProps({
    completion: Number
})
</script>

<template>
    <div class="w-full bg-gray-200 rounded-full overflow-hidden">
        <div :style="{ width: completion + '%' }" class="bg-green-500 h-2 rounded-full"></div>
    </div>
</template>

<style scoped></style>
