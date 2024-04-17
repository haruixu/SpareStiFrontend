<script setup lang="ts">
import startPageFirst from '@/assets/background/startpage_first.png';
import startPageSecond from '@/assets/background/startpage_second.png';
import startPageThird from '@/assets/background/startpage_third.png';
</script>

<template>
    <div class="h-screen w-full bg-cover bg-center m-0 p-0" :style="{ backgroundImage: `url(${startPageFirst})` }"></div>
    <div class="h-screen w-full bg-cover bg-center m-0 p-0" :style="{ backgroundImage: `url(${startPageSecond})` }"></div>
    <div class="h-screen w-full bg-cover bg-center m-0 p-0" :style="{ backgroundImage: `url(${startPageThird})` }"></div>
</template>

<style scoped>
html, body {
  @apply m-0;
}
.h-screen {
  @apply p-0;
}
</style>

