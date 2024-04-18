<template>
    <button class="continue-button" @click="onClick">
        Fortsett
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ContinueButtonComponent',
    emits: {
        click: (event: Event) => true
    },
    setup(props, { emit }) {
        const onClick = (event: Event) => {
            emit('click', event);
        };

        return {
            onClick
        };
    }
});
</script>

<style scoped>
.continue-button {
    padding: 0.7rem 5rem;
    font-size: 1.125rem;
    border-radius: 0.7rem;
    cursor: pointer;
    transition: background-color 0.3s, filter 0.3s;
    font-weight: bold;
    color: var(--black);
    background-color: var(--green);
}

.continue-button:hover {
    filter: brightness(90%);
}

.continue-button:active {
    filter: brightness(75%);
}
</style>
