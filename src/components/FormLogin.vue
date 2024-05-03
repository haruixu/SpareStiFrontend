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
const isSendingEmail = ref(false)
const successMessage = ref<string | null>(null)
const modalErrorMessage = ref<string | null>(null)

const submitForm = () => {
    userStore.login(username.value, password.value)
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

// Reset password
const submitReset = async () => {
    isSendingEmail.value = true

    await axios
        .post('http://localhost:8080/forgotPassword/changePasswordRequest', {
            email: resetEmail.value
        })
        .then(() => {
            successMessage.value =
                'E-posten er sendt. Vennligst sjekk innboksen din for instrukser. OBS: E-posten kan havne i spam-mappen'
        })
        .catch((error) => {
            console.error(error)
            modalErrorMessage.value = 'Noe gikk galt. Vennligst prøv igjen.'
        })

    isSendingEmail.value = false
}

// Close modal and reset values
const closeModal = () => {
    isModalOpen.value = false
    isSendingEmail.value = false
    modalErrorMessage.value = null
    resetEmail.value = ''
    successMessage.value = null
}

// Watch for error messages
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
                    class="absolute right-0 top-1 bg-transparent hover:bg-transparent mr-4 mt-1"
                    @click="toggleShowPassword"
                >
                    {{ showPassword ? '🔓' : '🔒' }}
                </button>
                <a
                    @click="isModalOpen = true"
                    class="transition-none absolute right-3 top-10 hover:underline hover:bg-transparent text-[#ef9691] hover:transition-none hover:p-0 cursor-pointer"
                    >Glemt passord?</a
                >
            </div>
        </div>
        <div class="flex flex-row gap-5">
            <button
                name="submit"
                :disabled="'' == username.valueOf() || '' == password.valueOf()"
                class="primary grow-0"
                @click="submitForm"
            >
                Logg inn
            </button>
            <p>{{ errorMessage }}</p>
        </div>
    </div>
    <modal-component
        v-if="isModalOpen"
        :title="'Glemt passord'"
        :message="'Vennligst skriv inn e-posten din for å endre passordet.'"
    >
        <div v-if="isSendingEmail" class="flex justify-center items-center">
            <div
                class="p-3 animate-spin bg-gradient-to-r from-lime-500 from-30% to-green-600 to-90% md:w-18 md:h-20 h-20 w-20 aspect-square rounded-full"
            >
                <div class="rounded-full h-full w-full bg-slate-100"></div>
            </div>
        </div>
        <div v-else-if="successMessage">
            <p class="text-green-500 text-center">{{ successMessage }}</p>
            <button
                class="active-button font-bold py-2 px-4 w-1/2 mt-4 border-2 disabled:border-transparent"
                @click="closeModal"
            >
                Lukk
            </button>
        </div>
        <div v-else-if="modalErrorMessage">
            <p class="text-red-500 text-center">{{ modalErrorMessage }}</p>
            <button
                class="active-button font-bold py-2 px-4 w-1/2 mt-4 border-2 disabled:border-transparent"
                @click="closeModal"
            >
                Lukk
            </button>
        </div>
        <div v-else>
            <input
                v-model="resetEmail"
                class="border border-gray-300 p-2 w-full mb-7"
                placeholder="Skriv e-postadressen din her"
                type="email"
            />
            <div class="flex gap-5 mt-4">
                <button
                    :disabled="!isEmailValid"
                    class="active-button font-bold py-2 px-4 w-1/2 border-2 disabled:border-transparent"
                    @click="submitReset"
                >
                    Send mail
                </button>
                <button
                    class="active-button font-bold py-2 px-4 w-1/2 border-2 disabled:border-transparent"
                    @click="closeModal"
                >
                    Lukk
                </button>
            </div>
        </div>
    </modal-component>
</template>
