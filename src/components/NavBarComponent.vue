<template>
    <nav class="flex justify-between items-center min-h-32 text-xl w-full px-3 my-0">
        <div>
            <router-link to="/hjem" @click="hamburgerOpen = false">
                <img
                    alt="logo"
                    class="w-40 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-90"
                    src="@/assets/spareSti.png"
                />
            </router-link>

            <div class="flex flex-row justify-center">
                <img alt="streak" class="w-8 h-8" src="@/assets/streakFlame.png" />
                <p class="font-bold">Streak</p>
            </div>
        </div>
        <div v-if="!isHamburger" class="flex flex-row gap-10">
            <router-link active-class="border-b-2" to="/hjem">🏠Hjem</router-link>
            <router-link active-class="border-b-2" to="/sparemaal">🎯Sparemål</router-link>
            <router-link active-class="border-b-2" to="/spareutfordringer"
                >💰Spareutfordringer</router-link
            >
            <router-link active-class="border-b-2" to="/profil">🤭Profil</router-link>
        </div>

        <div v-if="!isHamburger" class="flex justify-center w-40">
            <button class="focus:ring focus:ring-black-300" @click="logout">Logg ut</button>
        </div>
        <button v-if="isHamburger" @click="toggleMenu">☰</button>
    </nav>

    <div v-if="hamburgerOpen" class="flex flex-col bg-white border border-slate-300 z-50">
        <router-link to="/hjem" @click="hamburgerOpen = false">🏠Hjem</router-link>
        <router-link to="/sparemaal" @click="hamburgerOpen = false">🎯Sparemål</router-link>
        <router-link to="/spareutfordringer" @click="hamburgerOpen = false"
            >💰Spareutfordringer</router-link
        >
        <router-link to="/profil" @click="hamburgerOpen = false">🤭Profil</router-link>
        <button class="focus:ring focus:ring-black-300 bg-transparent" @click="logout">
            Logg ut
        </button>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const windowWidth = ref(window.innerWidth)
const hamburgerOpen = ref(false)
const isHamburger = ref(false)

const logout = () => {
    userStore.logout()
}

const toggleMenu = () => {
    hamburgerOpen.value = !hamburgerOpen.value
}

const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
    if (windowWidth.value < 1150) {
        isHamburger.value = true
    } else {
        isHamburger.value = false
        hamburgerOpen.value = false
    }
}

onMounted(() => {
    window.addEventListener('resize', updateWindowWidth)
    updateWindowWidth()
})
</script>

<style scoped></style>