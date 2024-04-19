<script setup lang="ts">
import FormLogin from '@/components/FormLogin.vue'
import FormRegister from '@/components/FormRegister.vue'
import { ref } from 'vue'

const isLogin = ref<boolean>(true)
</script>

<template>
    <div class="flex flex-col items-center gap-5 justify-center sm:flex-row">
        <div class="border-2 border-black flex items-center">
            <h1>Dette er et bilde</h1>
            <button class="border border-black">Test</button>
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row gap-5 justify-center">
                <h3 :class="{ selected: isLogin }" @click="isLogin = true">Logg inn</h3>
                <h3 :class="{ selected: !isLogin }" @click="isLogin = false">Registrer deg</h3>
            </div>
            <FormLogin v-if="isLogin" />
            <FormRegister v-else />
        </div>
    </div>
</template>

<style scoped>
.selected {
    border-bottom: 2px solid black;
}
</style>
