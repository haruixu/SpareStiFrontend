<script lang="ts" setup>
import { ref } from 'vue'

const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)

const emit = defineEmits(['submit'])

const submitForm = () => {
    emit('submit', username.value, password.value)
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}
</script>

<template>
    <div class="flex flex-col justify-center gap-5 mx-10">
        <div class="flex flex-col">
            <p class="mx-4">Brukernavn</p>
            <input v-model="username" placeholder="Skriv inn brukernavn" type="text" />
        </div>
        <div class="flex flex-col">
            <p class="mx-4">Passord</p>
            <div class="relative">
                <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full"
                    placeholder="Skriv inn passord"
                />
                <button class="absolute right-0 top-1 bg-transparent" @click="toggleShowPassword">
                    {{ showPassword ? '🔓' : '🔒' }}
                </button>
            </div>
        </div>
        <button @click="submitForm">Logg inn</button>
    </div>
</template>

<style scoped></style>
