<script setup lang="ts">
import NavBarComponent from '@/components/NavBarComponent.vue'
</script>

<template>
    <NavBarComponent />
</template>

<style>
nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}
</style>
