<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import ModalComponent from '@/components/ModalComponent.vue'
import { useRouter } from 'vue-router'

const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')
const isModalOpen = ref<boolean>(false)
const resetEmail = ref<string>('')
const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/

const userStore = useUserStore()
const router = useRouter()

const isEmailValid = computed(() => emailRegex.test(resetEmail.value))

const submitForm = () => {
    userStore.login(username.value, password.value)
    router.push('/hjem')
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

const openForgotPasswordModal = (event: MouseEvent) => {
    event.preventDefault()
    isModalOpen.value = true
}

const submitReset = () => {
    resetEmail.value = ''
    isModalOpen.value = false
    // TODO: Implement logic for sending reset email
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
                <a
                    @click="openForgotPasswordModal"
                    class="absolute right-3 top-10 hover:underline hover:bg-transparent cursor-pointer"
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
        </div>
    </div>
    <ModalComponent
        :title="'Glemt passord'"
        :message="'Vennligst skriv inn e-posten din for å endre passordet.'"
        :button1="'Send mail'"
        :isModalOpen="isModalOpen"
        :buttonAction="submitReset"
        :showButton="true"
        :showInput="true"
        :typeValue="'email'"
        :inputPlaceholder="'Skriv e-postadressen din her'"
        :inputValue="resetEmail"
        :isInputValid="isEmailValid"
        @update:isModalOpen="isModalOpen = $event"
        @update:inputValue="resetEmail = $event"
    />
</template>

<style scoped></style>
