<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import ToolTip from '@/components/ToolTip.vue'

// constants for registering a new user
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const username = ref<string>('')
const password = ref<string>('')
const confirm = ref<string>('')

// reactive variables for form validation
const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')
const passwordValidations = ref<string[]>([])

// store for user data
const userStore = useUserStore()

// regex for validating user input
const nameRegex = /^[æÆøØåÅa-zA-Z,.'-][æÆøØåÅa-zA-Z ,.'-]{0,29}$/
const emailRegex =
    /^[æÆøØåÅa-zA-Z0-9_+&*-]+(?:\.[æÆøØåÅa-zA-Z0-9_+&*-]+)*@(?:[æÆøØåÅa-zA-Z0-9-]+\.)+[æÆøØåÅa-zA-Z]{2,7}$/
const usernameRegex = /^[ÆØÅæøåA-Za-z][æÆøØåÅA-Za-z0-9_]{2,29}$/
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zæøå])(?=.*[ÆØÅA-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,30}$/

// computed properties for form validation
const isFirstNameValid = computed(() => nameRegex.test(firstName.value) && firstName.value)
const isLastNameValid = computed(() => nameRegex.test(lastName.value) && lastName.value)
const isEmailValid = computed(() => emailRegex.test(email.value))
const isUsernameValid = computed(() => usernameRegex.test(username.value))
const isPasswordValid = computed(() => passwordRegex.test(password.value))

// computed property for checking if form is invalid
const isFormInvalid = computed(
    () =>
        [isFirstNameValid, isLastNameValid, isEmailValid, isUsernameValid, isPasswordValid].some(
            (v) => !v.value
        ) || password.value !== confirm.value
)

// function for submitting form with user data
const submitForm = () => {
    userStore.register(firstName.value, lastName.value, email.value, username.value, password.value)
}

// function for toggling show password
const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
}

// function for validating password
const validatePassword = () => {
    const messages = [] // array for storing error messages
    const lengthValid = password.value.length >= 8 && password.value.length <= 30 // check if password length is valid
    const numberValid = /[0-9]/.test(password.value) // check if password contains a number
    const lowercaseValid = /[a-zæøå]/.test(password.value) // check if password contains a lowercase letter
    const uppercaseValid = /[ÆØÅA-Z]/.test(password.value) // check if password contains an uppercase letter
    const specialCharacterValid = /[@#$%^&+=!]/.test(password.value) // check if password contains a special character
    const noSpacesValid = !/\s/.test(password.value) // check if password contains no spaces

    // add error messages to array if validation fails
    if (!lengthValid) {
        messages.push('Må være mellom 8 og 30 karakterer. ')
    }
    if (!numberValid) {
        messages.push('Må inneholde minst ett tall. ')
    }
    if (!lowercaseValid) {
        messages.push('Må inneholde minst én liten bokstav. ')
    }
    if (!uppercaseValid) {
        messages.push('Må inneholde minst én stor bokstav. ')
    }
    if (!specialCharacterValid) {
        messages.push('Må inneholde minst ett spesialtegn (@#$%^&+=!). ')
    }
    if (!noSpacesValid) {
        messages.push('Må ikke inneholde mellomrom. ')
    }

    passwordValidations.value = messages
}

// watch for changes in password input
watch(password, validatePassword)

// watch for changes in error message from user store
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
                    :message="'Må kun inneholde bokstaver, mellomrom, komma, apostrof, punktum, og bindestrek. 1-30 karakterer langt'"
                />
            </div>
            <input
                v-model="firstName"
                name="firstName"
                :class="{ 'border-2 border-lime-400': isFirstNameValid }"
                placeholder="Skriv inn fornavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>Etternavn*</p>
                <ToolTip
                    :message="'Må kun inneholde bokstaver, mellomrom, komma, apostrof, punktum, og bindestrek. 1-30 karakterer langt'"
                />
            </div>
            <input
                v-model="lastName"
                name="lastName"
                :class="{ 'border-2 border-lime-400': isLastNameValid }"
                placeholder="Skriv inn etternavn"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>E-post*</p>
                <ToolTip
                    :message="'Gyldig email: Må starte med norske bokstaver, tall, eller spesielle karakterer. Inkluderer \@\ fulgt av et domene. Ender med 2-7 bokstaver.'"
                />
            </div>
            <input
                v-model="email"
                name="email"
                :class="{ 'border-2 border-lime-400': isEmailValid }"
                placeholder="Skriv inn e-post"
                type="text"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>Brukernavn*</p>
                <ToolTip
                    :message="'Må starte med en bokstav og kan inneholde tall og understrek. 3-30 karakterer langt.'"
                />
            </div>
            <input
                v-model="username"
                name="username"
                placeholder="Skriv inn brukernavn"
                type="text"
                :class="{ 'border-2 border-lime-400': isUsernameValid }"
            />
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row justify-between mx-4">
                <p>Passord*</p>
                <ToolTip
                    :message="'Må være minst 8 karakterer, inkludert et tall, en liten bokstav, en stor bokstav, et spesialtegn (@#$%^&+=!), og ingen mellomrom.'"
                />
            </div>
            <div class="relative">
                <input
                    name="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Skriv inn passord"
                    class="w-full"
                    :class="{ 'border-2 border-lime-400': isPasswordValid }"
                />
                <button
                    class="absolute right-0 top-1 bg-transparent hover:bg-transparent mr-4 mt-1"
                    @click="toggleShowPassword"
                >
                    {{ showPassword ? '🔓' : '🔒' }}
                </button>
            </div>
            <input
                v-model="confirm"
                :class="{
                    'border-2 border-lime-400': password == confirm && '' !== confirm.valueOf()
                }"
                class="mt-2"
                name="confirm"
                placeholder="Bekreft passord"
                type="password"
            />
            <div class="ml-4">
                <p class="text-sm">
                    <span v-for="message in passwordValidations" :key="message">{{ message }}</span>
                    <span v-if="errorMessage">{{ errorMessage }}</span>
                </p>
            </div>
        </div>
        <div class="flex flex-row gap-5">
            <button
                :disabled="isFormInvalid"
                class="grow-0 primary"
                name="submit"
                @click="submitForm"
            >
                Registrer deg
            </button>
        </div>
    </div>
</template>
