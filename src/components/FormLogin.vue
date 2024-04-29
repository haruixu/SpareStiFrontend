<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import ModalComponent from '@/components/ModalComponent.vue'
import axios from 'axios'

const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')
const isModalOpen = ref<boolean>(false)
const resetEmail = ref<string>('')
const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/

const userStore = useUserStore()

const isEmailValid = computed(() => emailRegex.test(resetEmail.value))

const submitForm = () => {
    userStore.login(username.value, password.value)
}

const bioLogin = () => {
    userStore.bioLogin(username.value)
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

const openForgotPasswordModal = (event: MouseEvent) => {
    event.preventDefault()
    isModalOpen.value = true
}

const submitReset = async () => {
    await axios.post('http://localhost:8080/forgotPassword/changePasswordRequest', {
        email: resetEmail.value
    })

    resetEmail.value = ''
    isModalOpen.value = false
}

const closeModal = () => {
    resetEmail.value = ''
    isModalOpen.value = false
}

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
            <p class="mx-4">Brukernavn</p>
            <input
                v-model="username"
                name="username"
                placeholder="Skriv inn brukernavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <p class="mx-4">Passord</p>
            <div class="relative">
                <input
                    name="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full"
                    placeholder="Skriv inn passord"
                />
                <button
                    class="absolute right-0 top-1 bg-transparent hover:bg-transparent"
                    @click="toggleShowPassword"
                >
                    {{ showPassword ? '🔓' : '🔒' }}
                </button>
                <a
                    @click="openForgotPasswordModal"
                    class="transition-none absolute right-3 top-10 hover:underline hover:bg-transparent text-[#ef9691] hover:transition-none hover:p-0 cursor-pointer"
                    >Glemt passord?</a
                >
            </div>
        </div>
        <div class="flex flex-row gap-5">
            <button
                name="submit"
                :disabled="'' == username.valueOf() || '' == password.valueOf()"
                class="grow-0"
                @click="submitForm"
            >
                Logg inn
            </button>
            <p>{{ errorMessage }}</p>
            <button @click="bioLogin">biologin</button>
        </div>
    </div>
    <modal-component
        :title="'Glemt passord'"
        :message="'Vennligst skriv inn e-posten din for å endre passordet.'"
        :is-modal-open="isModalOpen"
        @close="isModalOpen = false"
    >
        <template v-slot:input>
            <input
                type="email"
                v-model="resetEmail"
                class="border border-gray-300 p-2 w-full mb-7"
                placeholder="Skriv e-postadressen din her"
            />
        </template>
        <template v-slot:buttons>
            <button
                :disabled="!isEmailValid"
                @click="submitReset"
                class="active-button font-bold py-2 px-4 w-1/2 border-2 disabled:border-transparent"
            >
                Send mail
            </button>
            <button
                @click="closeModal"
                class="active-button font-bold py-2 px-4 w-1/2 border-2 disabled:border-transparent"
            >
                Lukk
            </button>
        </template>
    </modal-component>
</template>
