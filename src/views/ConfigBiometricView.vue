<template>
    <div class="flex flex-col justify-center items-center w-full gap-5 m-5">
        <h1>Alternativ innlogging</h1>
        <h3>Vil du legge til alternativ innlogging som biometrisk autentisering?</h3>
        <div class="flex flex-row justify-center gap-10">
            <img alt="bioAuthTouch" class="w-40 h-40" src="@/assets/bioAuthTouch.png" />
            <img alt="bioAuthFace" class="w-40 h-40" src="@/assets/bioAuthFace.png" />
        </div>
        <div class="flex flex-col gap-5">
            <button @click="bioRegister">Legg til nå!</button>
            <button @click="router.push({ name: 'configurations1' })">Jeg gjør det senere</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const userStore = useUserStore()

// Function to register biometric authentication
const bioRegister = async () => {
    await userStore.bioRegister()
    await router.push({ name: 'configurations1' })
}
</script>

<style scoped></style>
