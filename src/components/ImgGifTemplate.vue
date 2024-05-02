<template>
    <div class="hover:scale-110 flex justify-center items-center">
        <img
            v-if="index % 6 === modValue"
            :src="url"
            alt="could not load"
            class="min-w-24 w-full h-auto min-h-24 max-w-32 max-h-32 md:min-h-32 md:max-h-44 md:min-w-32 md:max-w-44 border-2 rounded-lg border-stale-400 shadow-md shadow-black"
        />
    </div>
</template>

<script setup lang="ts">
interface Props {
    url: string
    index: number
    modValue: number
}

defineProps<Props>()
</script>
