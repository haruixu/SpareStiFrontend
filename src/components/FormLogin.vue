<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import ToolTip from '@/components/ToolTip.vue'

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

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

const openForgotPasswordModal = (event: MouseEvent) => {
    event.preventDefault()
    isModalOpen.value = true
}

const submitReset = () => {
    // TODO: Implement logic for sending reset email
    closeModal()
}

const closeModal = () => {
    resetEmail.value = '';
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
                <button class="absolute right-0 top-1 bg-transparent" @click="toggleShowPassword">
                    {{ showPassword ? '🔓' : '🔒' }}
                </button>
                <a @click="openForgotPasswordModal" class=" absolute right-3 top-10 hover:underline hover:bg-transparent">Glemt passord?</a>
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
        </div>
    </div>
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 class="font-bold mb-4">Glemt passord</h2>
            <p class="mb-4">Vennligst skriv inn e-posten din for å endre passordet.</p>
            <ToolTip
                :message="'Must include a valid format with \'@\' and a domain, only letters, numbers, and special characters (_ + & * -) allowed.'"
                class="absolute top-0 left-80"
            />
            <div class="mb-4">
                <input
                    type="email"
                    v-model="resetEmail"
                    placeholder="Din e-post"
                    class="border border-gray-300 p-2 w-full"
                    :class="{ 'opacity-50': isEmailValid }">
            </div>
            <div class="flex flex-col justify-center items-center gap-3 pt-3">
                <button
                    @click="submitReset"
                    class="font-bold py-2 px-4 w-1/2 hover:bg-white border-2 hover:border-[#f7da7c]"
                    :disabled="!isEmailValid">
                    Send mail
                </button>
                <button @click="closeModal" class="font-bold py-2 px-4 w-1/2 bg-white border-2 border-[#f7da7c] hover:bg-[#f7da7c]">
                    Lukk
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
