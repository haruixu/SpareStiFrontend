<script lang="ts" setup>
import { ref } from 'vue'

const username = ref<string>('')
const password = ref<string>('')

const emit = defineEmits(['submit'])

const submitForm = () => {
    emit('submit', { username: username.value, password: password.value })
}
</script>

<template>
    <div class="flex flex-col justify-center gap-5 mx-10">
        <div class="flex flex-col">
            <p class="mx-5">Brukernavn</p>
            <input v-model="username" placeholder="Skriv inn brukernavn" type="text" />
        </div>
        <div class="flex flex-col">
            <p class="mx-5">Passord</p>
            <input v-model="password" placeholder="Skriv inn passord" type="password" />
        </div>
        <button @click="submitForm">Logg inn</button>
    </div>
</template>

<style scoped></style>
