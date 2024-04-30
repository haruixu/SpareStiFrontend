<template>
    <button
        :class="{ 'opacity-60 cursor-not-allowed': disabled }"
        :disabled="disabled"
        @click="handleClick"
        class="p-3 px-20 text-lg rounded-lg cursor-pointer transition-all font-bold bg-[var(--green)] hover:brightness-90 active:brightness-75"
    >
        Fortsett
    </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

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
