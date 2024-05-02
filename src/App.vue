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
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon')
    )
})

const showSti = computed(() => {
    return !(
        route.path == '/' ||
        route.path == '/registrer' ||
        route.path == '/logginn' ||
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon') ||
        route.path == '/hjem' ||
        route.path == '/profil'
    )
})

const backgroundImageStyle = computed(() => {
    if (showSti.value) {
        return {
            backgroundImage: "url('src/assets/sti.png')"
        }
    } else {
        return {
            backgroundImage: "none"
        }
    }
})

</script>

<template>
    <div
        class="min-h-screen bg-left-bottom bg-phone md:bg-pc bg-no-repeat" 
        :style="backgroundImageStyle">
      <NavBarComponent v-if="showNavBar" />
  
      <main class="mb-10 ">
          <RouterView />
      </main>
    </div>
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