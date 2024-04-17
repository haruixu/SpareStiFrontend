<script setup lang="ts">
import LoginView from '@/components/FormLogin.vue'

function login(payload: { username: string; password: string }) {
    console.log(payload.username, payload.password)
}
</script>

<template>
    <div class="grid grid-rows-2 gap-10">
        <div class="flex flex-col">
            <div class="flex flex-row gap-5 justify-center">
                <h3>Logg inn</h3>
                <h3>Registrer deg</h3>
            </div>
            <LoginView @submit="login" />
        </div>
        <div class="border-2 border-black flex items-center">
            <h1>Dette er et bilde</h1>
        </div>
    </div>
</template>
