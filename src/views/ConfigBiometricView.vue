<template>
    <div class="flex flex-col justify-center items-center w-full gap-5 m-5">
        <h1>Alternativ innlogging</h1>
        <h3>Vil du legge til alternativ innlogging som biometrisk autentisering?</h3>
        <div class="flex flex-row justify-center gap-5">
            <img alt="bioAuthTouch" class="w-40 h-40" src="@/assets/bioAuthTouch.png" />
            <img alt="bioAuthFace" class="w-40 h-40" src="@/assets/bioAuthFace.png" />
        </div>
        <div class="flex flex-col gap-6">
            <button class="font-bold mt-10" @click="bioRegister">Legg til nå!</button>
            <button class="font-bold" @click="router.push({ name: 'configurations1' })">
                Jeg gjør det senere
            </button>
        </div>
        <p v-if="bioError" class="text-red-500">Noe gikk galt, prøv igjen senere</p>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import router from '@/router'
import { ref } from 'vue'

const userStore = useUserStore()

const bioError = ref<boolean>(false)

const bioRegister = async () => {
    const result = await userStore.bioRegister()

    if (result === true) {
        await router.push({ name: 'configurations1' })
    } else if (result === false) {
        bioError.value = true
    }
}
</script>

<style scoped></style>
