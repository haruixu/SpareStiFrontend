<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const username = route.params.username as string

// Function to remove bio credential from local storage
const removeBioCredential = () => {
    useUserStore().logout()
}

// Function to login with biometric
const bioLogin = () => {
    useUserStore().bioLogin(username)
}
</script>

<template>
    <div class="flex flex-col items-center h-screen gap-5 my-10">
        <h1>Hei {{ username }}, velkommen tilbake!💥</h1>
        <button class="primary" @click="bioLogin">Biometrisk login</button>
        <p>Ikke deg? Eller funker ikke biometrisk innlogging?</p>
        <button class="primary" @click="removeBioCredential">
            Logg inn med brukernavn og passord
        </button>
    </div>
</template>

<style scoped></style>
