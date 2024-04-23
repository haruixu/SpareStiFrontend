<script lang="ts" setup>
import { ref } from 'vue'

defineProps({
    message: String
})

const show = ref(false)

const toggleShow = () => {
    show.value = !show.value
}
</script>

<template>
    <div class="relative">
        <div
            class="cursor-pointer"
            tabindex="0"
            @mouseleave="show = false"
            @mouseover="show = true"
            @keydown.space.prevent="toggleShow"
            @keydown.enter.prevent="toggleShow"
        >
            (?)
        </div>
        <div
            v-if="show"
            class="absolute -inset-x-36 z-10 p-2 mt-2 w-40 text-sm bg-gray-100 rounded shadow-lg"
        >
            {{ message }}
        </div>
    </div>
</template>

<style scoped></style>
