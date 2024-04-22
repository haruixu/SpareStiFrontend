<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const showRouterView = computed(() => route.path !== '/')
import NavBarComponent from '@/components/NavBarComponent.vue'
</script>

<template>
    <NavBarComponent />
</template>
