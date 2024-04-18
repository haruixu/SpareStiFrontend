<script setup lang="ts">
import FormLogin from '@/components/FormLogin.vue'
import FormRegister from '@/components/FormRegister.vue'
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'

const userStore = useUserStore()

const isLogin = ref<boolean>(true)

function register(username: string, password: string) {
    userStore.register(username, password)
}

function login(username: string, password: string) {
    userStore.login(username, password)
}
</script>

<template>
    <div class="grid grid-cols-2 gap-10">
        <div class="border-2 border-black flex items-center">
            <h1>Dette er et bilde</h1>
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row gap-5 justify-center">
                <h3 :class="{ selected: isLogin }" @click="isLogin = true">Logg inn</h3>
                <h3 :class="{ selected: !isLogin }" @click="isLogin = false">Registrer deg</h3>
            </div>
            <FormLogin v-if="isLogin" @submit="login" />
            <FormRegister v-else @submit="register" />
        </div>
    </div>
</template>

<style scoped>
.selected {
    border-bottom: 2px solid black;
}
</style>
