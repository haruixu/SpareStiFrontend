<script setup lang="ts">
import NavBarComponent from '@/components/NavBarComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const showNavBar = computed(() => {
    return !(
        route.path == '/' ||
        route.path == '/registrer' ||
        route.path == '/logginn' ||
        route.path == '/forgotPassword'
    )
})
</script>

<template>
    <NavBarComponent v-if="showNavBar" />

    <main>
        <RouterView />
    </main>
</template>
