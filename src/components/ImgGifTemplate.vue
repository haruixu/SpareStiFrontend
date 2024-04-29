<template>
    <img
        v-if="index % 6 === modValue"
        :src="url"
        alt="could not load"
        class="h-32 w-32 border-2 rounded-lg border-stale-400"
    />
</template>

<script setup lang="ts">
interface Props {
    url: string
    index: number
    modValue: number
}

defineProps<Props>()
</script>
