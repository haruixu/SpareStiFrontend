<template>
    <button class="continue-button" @click="onClick">Fortsett</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ContinueButtonComponent',
    emits: {
        click: (event: Event) => true
    },
    setup(props, { emit }) {
        const onClick = (event: Event) => {
            emit('click', event)
        }

        return {
            onClick
        }
    }
})
</script>

<style>
.continue-button {
    @apply p-3 px-20 text-lg rounded-lg cursor-pointer transition-all font-bold
    text-black bg-[var(--green)] hover:brightness-90 active:brightness-75;
}
</style>
