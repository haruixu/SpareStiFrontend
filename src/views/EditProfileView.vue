<script lang="ts" setup>
import authInterceptor from '@/services/authInterceptor'
import { computed, onMounted, ref } from 'vue'
import type { Profile } from '@/types/profile'
import CardTemplate from '@/views/CardTemplate.vue'
import router from '@/router'
import ToolTip from '@/components/ToolTip.vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'

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

const nameRegex = /^[æÆøØåÅa-zA-Z,.'-][æÆøØåÅa-zA-Z ,.'-]{1,29}$/
const emailRegex =
    /^[æÆøØåÅa-zA-Z0-9_+&*-]+(?:\.[æÆøØåÅa-zA-Z0-9_+&*-]+)*@(?:[æÆøØåÅa-zA-Z0-9-]+\.)+[æÆøØåÅa-zA-Z]{2,7}$/
const usernameRegex = /^[ÆØÅæøåA-Za-z][æÆøØåÅA-Za-z0-9_]{2,29}$/
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zæøå])(?=.*[ÆØÅA-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,30}$/
const accountNumberRegex = /^\d{11}$/

const isFirstNameValid = computed(
    () => nameRegex.test(profile.value.firstName) && profile.value.firstName
)
const isLastNameValid = computed(
    () => nameRegex.test(profile.value.lastName) && profile.value.lastName
)
const isEmailValid = computed(() => emailRegex.test(profile.value.email))
const isUsernameValid = computed(() => usernameRegex.test(profile.value.username))
const isPasswordValid = computed(() => passwordRegex.test(profile.value.password || ''))
const isSpendingAccountValid = computed(() =>
    accountNumberRegex.test(profile.value.spendingAccount.accNumber?.toString() || '')
)
const isSavingAccountValid = computed(() =>
    accountNumberRegex.test(profile.value.savingAccount.accNumber?.toString() || '')
)

const isFormInvalid = computed(
    () =>
        [
            isFirstNameValid,
            isLastNameValid,
            isEmailValid,
            isUsernameValid,
            isSpendingAccountValid,
            isSavingAccountValid
        ].some((v) => !v.value) ||
        (updatePassword.value
            ? profile.value.password !== confirmPassword.value || profile.value.password === ''
            : false)
)

onMounted(async () => {
    await authInterceptor('/profile')
        .then((response) => {
            profile.value = response.data
            console.log(profile.value)
        })
        .catch((error) => {
            return console.log(error)
        })
})

const saveChanges = async () => {
    if (isFormInvalid.value) {
        errorMessage.value = 'Vennligst fyll ut alle feltene riktig'
        return
    }

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
                <div class="w-full flex flex-row gap-5 justify-between justify-items-end">
                    <div class="flex flex-col justify-center">
                        <button class="h-min bg-transparent text-4xl" v-text="'⬅️'" />
                    </div>
                    <div class="w-32 h-32 border-black border-2 rounded-full shrink-0" />
                    <div class="flex flex-col justify-center">
                        <button class="h-min bg-transparent text-4xl" v-text="'➡️'" />
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <p>Fornavn*</p>
                        <ToolTip
                            :message="'Must include only letters, spaces, commas, apostrophes, periods, and hyphens. 1-30 characters long'"
                        />
                    </div>
                    <input
                        v-model="profile.firstName"
                        :class="{ 'bg-green-200': isFirstNameValid }"
                        name="firstname"
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
                        :class="{ 'bg-green-200': isLastNameValid }"
                        name="lastname"
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
                        :class="{ 'bg-green-200': isEmailValid }"
                        name="email"
                        placeholder="Skriv inn e-post"
                        type="text"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <p>Brukernavn*</p>
                        <ToolTip
                            :message="'Must start with a letter and can include numbers and underscores. 3-30 characters long.'"
                        />
                    </div>
                    <input
                        v-model="profile.username"
                        :class="{ 'bg-green-200': isUsernameValid }"
                        name="username"
                        placeholder="Skriv inn brukernavn"
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
                        :class="{ 'bg-green-200': isPasswordValid }"
                        class="w-full"
                        name="password"
                        placeholder="Skriv inn passord"
                    />
                    <input
                        v-if="updatePassword"
                        v-model="confirmPassword"
                        :class="{ 'bg-red-200': profile.password !== confirmPassword }"
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

                <CardTemplate>
                    <div class="bg-red-300">
                        <p class="font-bold mx-3" v-text="'Brukskonto'" />
                    </div>
                    <input
                        v-model="profile.spendingAccount.accNumber"
                        :class="{ 'bg-green-200': isSpendingAccountValid }"
                        class="border-2 rounded-none rounded-b-xl w-full"
                        placeholder="Kontonummer"
                        type="number"
                    />
                </CardTemplate>

                <CardTemplate>
                    <div class="bg-red-300">
                        <p class="font-bold mx-3" v-text="'Sparekonto'" />
                    </div>
                    <input
                        v-model="profile.savingAccount.accNumber"
                        :class="{ 'bg-green-200': isSavingAccountValid }"
                        class="border-2 rounded-none rounded-b-xl w-full"
                        placeholder="Kontonummer"
                        type="number"
                    />
                </CardTemplate>

                <div class="flex flex-row justify-between">
                    <button class="bg-button-other" @click="router.back()" v-text="'Avbryt'" />
                    <button
                        :disabled="isFormInvalid"
                        @click="saveChanges"
                        v-text="'Lagre endringer'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>