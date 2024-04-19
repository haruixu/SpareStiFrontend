<template>
    <button class="continue-button">Fortsett</button>
</template>

<script setup lang="ts"></script>

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
</style>
