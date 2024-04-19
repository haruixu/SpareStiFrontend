<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const firstname = ref<string>('')
const lastname = ref<string>('')
const email = ref<string>('')
const username = ref<string>('')
const password = ref<string>('')
const confirm = ref<string>('')

const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')

const userStore = useUserStore()

const submitForm = () => {
    userStore.register(firstname.value, lastname.value, email.value, username.value, password.value)
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

const isEmailValid = computed(() => {
    return /\S+@\S+\.\S+/.test(email.value)
})

const isFormInvalid = computed(() => {
    return (
        '' == firstname.value ||
        '' == lastname.value ||
        '' == email.value ||
        !isEmailValid.value ||
        '' == username.value ||
        '' == password.value ||
        '' == confirm.value ||
        password.value != confirm.value
    )
})

watch(
    () => userStore.errorMessage,
    (newValue: string) => {
        errorMessage.value = newValue
    }
)
</script>

<template>
    <div class="flex flex-col justify-center gap-5 w-full">
        <div class="flex flex-col">
            <p class="mx-4">Fornavn*</p>
            <input
                v-model="firstname"
                :class="{ 'bg-green-100': '' !== firstname.valueOf() }"
                class="bg-red-100"
                name="firstname"
                placeholder="Skriv inn fornavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <p class="mx-4">Etternavn*</p>
            <input
                v-model="lastname"
                :class="{ 'bg-green-100': '' !== lastname.valueOf() }"
                class="bg-red-100"
                name="lastname"
                placeholder="Skriv inn etternavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <p class="mx-4">E-post*</p>
            <input
                v-model="email"
                :class="{ 'bg-green-100': isEmailValid }"
                class="bg-red-100"
                name="email"
                placeholder="Skriv inn e-post"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <p class="mx-4">Brukernavn*</p>
            <input
                v-model="username"
                name="username"
                placeholder="Skriv inn brukernavn"
                type="text"
                :class="{ 'bg-green-100': '' !== username.valueOf() }"
                class="bg-red-100"
            />
        </div>
        <div class="flex flex-col">
            <p class="mx-4">Passord*</p>
            <div class="relative">
                <input
                    name="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Skriv inn passord"
                    class="w-full"
                />
                <button class="absolute right-0 top-1 bg-transparent" @click="toggleShowPassword">
                    {{ showPassword ? '🔓' : '🔒' }}
                </button>
            </div>
            <input
                v-model="confirm"
                :class="{ 'bg-green-100': password == confirm && '' !== confirm.valueOf() }"
                class="mt-2 bg-red-100"
                name="confirm"
                placeholder="Bekreft passord"
                type="password"
            />
        </div>
        <div class="flex flex-row gap-5">
            <button :disabled="isFormInvalid" class="grow-0" @click="submitForm">
                Registrer deg
            </button>
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped></style>
