<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import ToolTip from '@/components/ToolTip.vue'
import { useRouter } from 'vue-router'

const firstname = ref<string>('')
const lastname = ref<string>('')
const email = ref<string>('')
const username = ref<string>('')
const password = ref<string>('')
const confirm = ref<string>('')

const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')

const userStore = useUserStore()
const router = useRouter()

const nameRegex = /^[a-zA-Z ,.'-]+$/
const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{2,29}$/
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/

const isFirstNameValid = computed(() => nameRegex.test(firstname.value) && firstname.value)
const isLastNameValid = computed(() => nameRegex.test(lastname.value) && lastname.value)
const isEmailValid = computed(() => emailRegex.test(email.value))
const isUsernameValid = computed(() => usernameRegex.test(username.value))
const isPasswordValid = computed(() => passwordRegex.test(password.value))

const isFormInvalid = computed(
    () =>
        [isFirstNameValid, isLastNameValid, isEmailValid, isUsernameValid, isPasswordValid].some(
            (v) => !v.value
        ) || password.value !== confirm.value
)

const submitForm = () => {
    userStore.register(firstname.value, lastname.value, email.value, username.value, password.value)
    router.push('/konfigurasjonSteg1')
}

const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
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
            <div class="flex flex-row justify-between mx-4">
                <p>Fornavn*</p>
                <ToolTip
                    :message="'Must include only letters, spaces, commas, apostrophes, periods, and hyphens.'"
                />
            </div>
            <input
                v-model="firstname"
                name="firstname"
                :class="{ 'bg-green-200': isFirstNameValid }"
                placeholder="Skriv inn fornavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>Etternavn*</p>
                <ToolTip
                    :message="'Must include only letters, spaces, commas, apostrophes, periods, and hyphens.'"
                />
            </div>
            <input
                v-model="lastname"
                name="lastname"
                :class="{ 'bg-green-200': isLastNameValid }"
                placeholder="Skriv inn etternavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>E-post*</p>
                <ToolTip
                    :message="'Must include a valid format with \'@\' and a domain, only letters, numbers, and special characters (_ + & * -) allowed.'"
                />
            </div>
            <input
                v-model="email"
                name="email"
                :class="{ 'bg-green-200': isEmailValid }"
                placeholder="Skriv inn e-post"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>Brukernavn*</p>
                <ToolTip
                    :message="'Must start with a letter and can include numbers and underscores, 3-30 characters long.'"
                />
            </div>
            <input
                v-model="username"
                name="username"
                placeholder="Skriv inn brukernavn"
                type="text"
                :class="{ 'bg-green-200': isUsernameValid }"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>Passord*</p>
                <ToolTip
                    :message="'Must be at least 8 characters, including at least one number, one lowercase letter, one uppercase letter, one special character (@#$%^&+=!), and no spaces.'"
                />
            </div>
            <div class="relative">
                <input
                    name="password"
                    v-model="password"
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
                :class="{ 'bg-green-200': password == confirm && '' !== confirm.valueOf() }"
                class="mt-2"
                name="confirm"
                placeholder="Bekreft passord"
                type="password"
            />
        </div>
        <div class="flex flex-row gap-5">
            <button :disabled="isFormInvalid" class="grow-0" name="submit" @click="submitForm">
                Registrer deg
            </button>
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>
