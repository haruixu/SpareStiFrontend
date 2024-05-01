<script setup lang="ts">
import NavBarComponent from '@/components/NavBarComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import HelpComponent from "@/components/HelpComponent.vue";

const route = useRoute()

const showNavBar = computed(() => {
    return !(
        route.path == '/' ||
        route.path == '/registrer' ||
        route.path == '/logginn' ||
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon')
    )
})

const showHelp = computed(() => {
    return !(
        route.path == '/registrer' ||
        route.path == '/logginn' ||
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon')
    )
})

const helpMessages = computed(() => {
    let messages = []

    if (route.path == '/home') {
        messages.push(['Trykk på meg for å se hva jeg har å si!']);
  }

    return messages
})
</script>

<template>
    <NavBarComponent v-if="showNavBar" />

    <main class="mb-10">
        <RouterView />
        <HelpComponent v-if="showHelp" :speech="helpMessages" />
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
