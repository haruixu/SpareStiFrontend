<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <nav>
        <RouterLink to="/">Hjem</RouterLink>
        <RouterLink to="/sparemaal">Sparemål</RouterLink>
        <RouterLink to="/spareutfordringer">Spareutfordringer</RouterLink>
        <RouterLink to="/profil">Profil</RouterLink>
        <RouterLink to="/konfigurasjon">Konfigurasjon</RouterLink>
    </nav>

    <main>
        <RouterView />
    </main>
</template>

<style scoped>
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
