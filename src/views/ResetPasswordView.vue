<template>
    <div>
        <h1 class="flex flex-col items-center mt-8">Oppdater passord</h1>
        <p class="flex flex-col items-center mb-16">Skriv inn ditt nye passord 🔐</p>
        <div class="flex justify-center items-center w-full">
            <div class="flex flex-col md:w-1/4 w-2/3">
                <div class="flex flex-row justify-between mx-4">
                    <p>Nytt passord:</p>
                    <ToolTip
                        :message="'Must be at least 8 characters, including at least one number, one lowercase letter, one uppercase letter, one special character (@#$%^&+=!), and no spaces.'"
                    />
                </div>
                <div class="relative">
                    <input
                        name="password"
                        v-model="newPassword"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Skriv inn passord"
                        class="w-full"
                        :class="{ 'bg-green-200': isPasswordValid }"
                    />
                    <button
                        class="absolute right-0 top-1 bg-transparent hover:bg-transparent"
                        @click="toggleShowPassword"
                    >
                        {{ showPassword ? '🔓' : '🔒' }}
                    </button>
                </div>
                <input
                    v-model="confirm"
                    :class="{ 'bg-green-200': newPassword == confirm && '' !== confirm.valueOf() }"
                    class="mt-2 w-full"
                    name="confirm"
                    placeholder="Bekreft passord"
                    type="password"
                />
                <div class="flex justify-center mt-10">
                    <button
                        :disabled="!canResetPassword"
                        @click="resetPassword"
                        class="p-2 w-2/3 md:w-5/6 disabled:opacity-50"
                    >
                        Oppdater passord
                    </button>
                </div>
            </div>
        </div>
        <ModalComponent
            :title="'Passordet er oppdatert ✨'"
            :message="'Passordet ditt er nå oppdatert. Du kan nå logge inn med ditt nye passord.'"
            :is-modal-open="isModalOpen"
            @close="isModalOpen = false"
        >
            <template v-slot:buttons>
                <button
                    @click="goToLogin"
                    class="active-button font-bold py-2 px-4 w-1/2 hover:bg-[#f7da7c] border-2 border-[#f7da7c] disabled:border-transparent"
                >
                    Logg inn
                </button>
            </template>
        </ModalComponent>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ToolTip from '@/components/ToolTip.vue'
import ModalComponent from '@/components/ModalComponent.vue'

const route = useRoute()
const router = useRouter()

const resetID = ref(route.query.resetID)
const userID = ref(route.query.userID)
const newPassword = ref<string>('')
const confirm = ref<string>('')
const showPassword = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/

const isPasswordValid = computed(() => passwordRegex.test(newPassword.value))

const canResetPassword = computed(() => {
    return isPasswordValid.value && newPassword.value === confirm.value && confirm.value !== ''
})

const resetPassword = async () => {
    isModalOpen.value = true

    const resetPasswordDTO = {
        resetID: resetID.value,
        userID: userID.value,
        newPassword: newPassword.value
    }
    try {
        await axios.post('http://localhost:8080/forgotPassword/resetPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetPasswordDTO)
        })
    } catch (error) {
        const err = error as Error
        console.error(err.message)
    }
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

const goToLogin = () => {
    isModalOpen.value = false
    router.push('/logginn')
}
</script>
