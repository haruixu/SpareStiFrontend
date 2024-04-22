<template>
    <button
        class="continue-button"
        :class="{ 'opacity-60 cursor-not-allowed': disabled }"
        :disabled="disabled"
        @click="handleClick"
    >
        Fortsett
    </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    disabled: Boolean
})

const emit = defineEmits(['click'])

const handleClick = () => {
    if (!props.disabled) {
        emit('click')
    }
}
</script>

<style scoped>
.continue-button {
    @apply p-3 px-20 text-lg rounded-lg cursor-pointer transition-all font-bold;
    color: black;
    background-color: var(--green);
}

.continue-button:hover {
    filter: brightness(90%);
}

.continue-button:active {
    filter: brightness(75%);
}

.continue-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>
