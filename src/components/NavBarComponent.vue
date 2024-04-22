<template>
    <nav class="flex space-x-12 justify-center mt-1 text-xl">
        <img src="../assets/logo.svg" alt="logo" class="w-12 h-12 absolute top-6 left-8" />
        <router-link to="/">🏠Hjem</router-link>
        <router-link to="/sparemaal">🎯Sparemål</router-link>
        <router-link to="/spareutfordringer">💰Spareutfordringer</router-link>
        <router-link to="/profil">🤭Profil</router-link>
        <router-link to="/konfigurasjonSteg1">🛠️Konfigurasjon</router-link>
        <img src="../assets/coins.png" alt="streak" class="w-10 h-10" />

        <button @click="logout" class="py-2 px-6 absolute top-8 right-20 rounded-full focus:outline-none focus:ring focus:ring-black-300"
        >Logg ut</button>
    </nav>

    <main>
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const logout = () => {
    console.log('logging out')
}
</script>
