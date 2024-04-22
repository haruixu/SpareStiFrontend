<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const showRouterView = computed(() => route.path !== '/')
</script>

<template>
    <nav v-if="showRouterView">
        <RouterLink to="/hjem">Hjem</RouterLink>
        <RouterLink to="/sparemaal">Sparemål</RouterLink>
        <RouterLink to="/spareutfordringer">Spareutfordringer</RouterLink>
        <RouterLink to="/profil">Profil</RouterLink>
        <RouterLink to="/konfigurasjonSteg1">Konfigurasjon</RouterLink>
    </nav>

    <main>
        <div>
            <RouterView />
        </div>
    </main>
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
