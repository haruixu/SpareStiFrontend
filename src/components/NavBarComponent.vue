<template>
    <nav v-if="showNavBar" class="flex justify-center items-center mt-10 text-xl w-full">
        <div>
            <img
                src="../assets/sparesti2.png"
                alt="logo"
                class="absolute left-0 top-8 w-48 h-15 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-90"
                @click="goToHome"
            />
            <div
                class="absolute left-6 top-24 flex-1 sm:flex justify-start items-center"
            >
                <div class="flex md:left-80 md:top-20 right-28 top-20 items-center">
                    <img src="../assets/coins.png" alt="streak" class="w-8 h-8" />
                    <p class="font-bold">Streak</p>
                </div>
            </div>
        </div>
        <div class="navcontainer flex space-x-10 justify-center">
            <router-link to="/hjem" class="nav-link" active-class="border-b-2">🏠Hjem</router-link>
            <router-link to="/sparemaal" class="nav-link" active-class="border-b-2">🎯Sparemål</router-link>
            <router-link to="/spareutfordringer" class="nav-link" active-class="border-b-2">💰Spareutfordringer</router-link>
            <router-link to="/profil" class="nav-link" active-class="border-b-2">🤭Profil"</router-link>
            <router-link to="/konfigurasjonSteg1" class="nav-link" active-class="border-b-2">🛠️Konfigurasjon</router-link>
            <button
                @click="logout"
                class="hidden sm:flex absolute right-10 py-2 px-6 rounded-full focus:outline-none focus:ring focus:ring-black-300"
            >
                Logg ut
            </button>
        </div>
        <button class="hamburger-menu sm:hidden absolute right-10 top-10" @click="toggleMenu">
            <p>☰</p>
        </button>
    </nav>

    <div
        v-if="menuOpen"
        class="sm:hidden flex flex-col bg-gray-100 w-full mt-10 top-0 z-50 rounded-xl"
    >
        <router-link to="/hjem" @click="menuOpen = false">🏠Hjem</router-link>
        <router-link to="/sparemaal" @click="menuOpen = false">🎯Sparemål</router-link>
        <router-link to="/spareutfordringer" @click="menuOpen = false"
            >💰Spareutfordringer</router-link
        >
        <router-link to="/profil" @click="menuOpen = false">🤭Profil</router-link>
        <router-link to="/konfigurasjonSteg1" @click="menuOpen = false"
            >🛠️Konfigurasjon</router-link
        >
        <button
            @click="logout"
            class="py-2 px-6 mx-auto rounded-full focus:outline-none focus:ring focus:ring-black-300 bg-transparent"
        >
            Logg ut
        </button>
    </div>

    <main>
        <RouterView />
    </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const windowWidth = ref(window.innerWidth)
const menuOpen = ref(false)

const showNavBar = computed(() => {
    return (
        route.path == '/hjem' ||
        route.path == '/sparemaal' ||
        route.path == '/spareutfordringer' ||
        route.path == '/profil' ||
        route.path == '/konfigurasjonSteg1'
    )
})

const logout = () => {
    router.push('/login')
    menuOpen.value = false
}

const goToHome = () => {
    router.push('/hjem')
    menuOpen.value = false
}

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
}

onMounted(() => {
    const updateWindowWidth = () => {
        windowWidth.value = window.innerWidth
    }
    window.addEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
@media (max-width: 1150px) {
    .hamburger-menu {
        display: block;
        cursor: pointer;
    }
    .navcontainer {
        display: none;
    }

}


</style>
