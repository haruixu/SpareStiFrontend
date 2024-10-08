<script lang="ts" setup>
import authInterceptor from '@/services/authInterceptor'
import { computed, onMounted, ref } from 'vue'
import type { Profile } from '@/types/profile'
import CardTemplate from '@/components/CardTemplate.vue'
import router from '@/router'
import ToolTip from '@/components/ToolTip.vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'

// Profile object
const profile = ref<Profile>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    spendingAccount: {
        accNumber: undefined,
        balance: 0
    },
    savingAccount: {
        accNumber: undefined,
        balance: 0
    }
})

const updatePassword = ref<boolean>(false)
const confirmPassword = ref<string>('')
const errorMessage = ref<string>('')
const isModalOpen = ref(false)

const nameRegex = /^[æÆøØåÅa-zA-Z,.'-][æÆøØåÅa-zA-Z ,.'-]{0,29}$/
const emailRegex =
    /^[æÆøØåÅa-zA-Z0-9_+&*-]+(?:\.[æÆøØåÅa-zA-Z0-9_+&*-]+)*@(?:[æÆøØåÅa-zA-Z0-9-]+\.)+[æÆøØåÅa-zA-Z]{2,7}$/
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zæøå])(?=.*[ÆØÅA-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,30}$/
const accountNumberRegex = /^\d{11}$/

const MAX_DIGITS = 11

// Restrict the input to numbers only
function restrictToNumbers(event: InputEvent, type: string) {
    const inputValue = (event.target as HTMLInputElement)?.value
    if (inputValue !== undefined) {
        const sanitizedValue = inputValue.replace(/\D/g, '')
        const truncatedValue = sanitizedValue.slice(0, MAX_DIGITS)
        if (type === 'spending') {
            profile.value.spendingAccount.accNumber = parseInt(truncatedValue)
        } else {
            profile.value.savingAccount.accNumber = parseInt(truncatedValue)
        }
    }
}

// Apply formatting to the account number
const isFirstNameValid = computed(
    () => nameRegex.test(profile.value.firstName) && profile.value.firstName
)
const isLastNameValid = computed(
    () => nameRegex.test(profile.value.lastName) && profile.value.lastName
)
const isEmailValid = computed(() => emailRegex.test(profile.value.email))
const isPasswordValid = computed(() => passwordRegex.test(profile.value.password || ''))
const isSpendingAccountValid = computed(() =>
    accountNumberRegex.test(profile.value.spendingAccount.accNumber?.toString() || '')
)
const isSavingAccountValid = computed(() =>
    accountNumberRegex.test(profile.value.savingAccount.accNumber?.toString() || '')
)

// Check if the form is invalid
const isFormInvalid = computed(
    () =>
        [
            isFirstNameValid,
            isLastNameValid,
            isEmailValid,
            isSpendingAccountValid,
            isSavingAccountValid
        ].some((v) => !v.value) ||
        (updatePassword.value
            ? profile.value.password !== confirmPassword.value ||
              profile.value.password === '' ||
              !isPasswordValid.value
            : false)
)

// When the component is mounted, fetch the profile
onMounted(async () => {
    await authInterceptor('/profile')
        .then((response) => {
            profile.value = response.data
        })
        .catch((error) => {
            console.error(error)
        })
})

// Save the changes to the profile
const saveChanges = async () => {
    if (isFormInvalid.value) {
        errorMessage.value = 'Vennligst fyll ut alle feltene riktig'
        return
    }

    // Remove password if it is not to be updated
    if (!updatePassword.value) {
        delete profile.value.password
    }

    await authInterceptor
        .put('/profile', profile.value)
        .then(() => {
            router.back()
        })
        .catch((error) => {
            errorMessage.value = error.response.data.message
        })
}
</script>

<template>
    <div class="w-full flex px-10 justify-center">
        <div class="flex flex-row flex-wrap justify-center w-full max-w-screen-xl gap-20">
            <div class="flex flex-col max-w-96 w-full gap-5">
                <h1>Rediger profil</h1>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <p>Fornavn*</p>
                        <ToolTip
                            :message="'Must include only letters, spaces, commas, apostrophes, periods, and hyphens. 1-30 characters long'"
                        />
                    </div>
                    <input
                        v-model="profile.firstName"
                        name="firstName"
                        placeholder="Skriv inn fornavn"
                        type="text"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <p>Etternavn*</p>
                        <ToolTip
                            :message="'Must include only letters, spaces, commas, apostrophes, periods, and hyphens. 1-30 characters long'"
                        />
                    </div>
                    <input
                        v-model="profile.lastName"
                        name="lastName"
                        placeholder="Skriv inn etternavn"
                        type="text"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <p>E-post*</p>
                        <ToolTip
                            :message="'Valid email: Starts with Norwegian letters, numbers, or special characters. Includes \@\ followed by a domain. Ends with 2-7 letters.'"
                        />
                    </div>
                    <input
                        v-model="profile.email"
                        name="email"
                        placeholder="Skriv inn e-post"
                        type="text"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <div class="flex flex-row gap-2">
                            <p>Endre passord</p>
                            <input v-model="updatePassword" type="checkbox" />
                        </div>
                        <ToolTip
                            v-if="updatePassword"
                            :message="'Must be at least 8 characters, including at least one number, one lowercase letter, one uppercase letter, one special character (@#$%^&+=!), and no spaces.'"
                        />
                    </div>
                    <input
                        v-if="updatePassword"
                        v-model="profile.password"
                        class="w-full"
                        name="password"
                        placeholder="Skriv inn passord"
                    />
                    <input
                        v-if="updatePassword"
                        v-model="confirmPassword"
                        class="mt-2"
                        name="confirm"
                        placeholder="Bekreft passord"
                        type="password"
                    />
                </div>

                <p v-if="errorMessage" class="text-red-500" v-text="errorMessage" />
            </div>
            <div class="flex flex-col justify-end max-w-96 w-full gap-5">
                <InteractiveSpare
                    :png-size="10"
                    :speech="['Her kan du endre på profilen din!']"
                    direction="left"
                    :isModalOpen="isModalOpen"
                />

                <p class="font-bold">Endre kontonummer:</p>

                <CardTemplate>
                    <div class="bg-red-100">
                        <p class="font-bold mx-3" v-text="'Brukskonto'" />
                    </div>
                    <input
                        @input="restrictToNumbers($event as InputEvent, 'spending')"
                        v-model="profile.spendingAccount.accNumber"
                        class="border-transparent rounded-none rounded-b-xl w-full"
                        placeholder="Kontonummer"
                        type="number"
                    />
                </CardTemplate>

                <CardTemplate>
                    <div class="bg-red-100">
                        <p class="font-bold mx-3" v-text="'Sparekonto'" />
                    </div>
                    <input
                        @input="restrictToNumbers($event as InputEvent, 'saving')"
                        v-model="profile.savingAccount.accNumber"
                        class="border-transparent rounded-none rounded-b-xl w-full"
                        placeholder="Kontonummer"
                        type="number"
                    />
                </CardTemplate>

                <div class="flex flex-row justify-between">
                    <button class="primary danger" @click="router.back()" v-text="'Avbryt'" />
                    <button class="primary" @click="saveChanges" v-text="'Lagre endringer'" />
                </div>
            </div>
        </div>
    </div>
</template>
