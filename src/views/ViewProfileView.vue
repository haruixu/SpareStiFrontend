<script lang="ts" setup>
import authInterceptor from '@/services/authInterceptor'
import { onMounted, ref } from 'vue'
import type { Profile } from '@/types/profile'
import CardTemplate from '@/components/CardTemplate.vue'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import CardGoal from '@/components/CardGoal.vue'
import router from '@/router'
import SpareComponent from '@/components/SpareComponent.vue'
import { useUserStore } from '@/stores/userStore'

const profile = ref<Profile>()
const completedGoals = ref<Goal[]>([])
const completedChallenges = ref<Challenge[]>([])
const speech = ref<string[]>([])

const updateUser = async () => {
    authInterceptor('/profile')
        .then((response) => {
            profile.value = response.data
        })
        .catch((error) => {
            return console.log(error)
        })
}

onMounted(async () => {
    await updateUser()

    await authInterceptor(`/goals/completed?page=0&size=3`)
        .then((response) => {
            completedGoals.value = response.data.content
        })
        .catch((error) => {
            return console.log(error)
        })

    await authInterceptor('/challenges/completed?page=0&size=3')
        .then((response) => {
            completedChallenges.value = response.data.content
        })
        .catch((error) => {
            return console.log(error)
        })

    openSpare()
})

const updateBiometrics = async () => {
    await useUserStore().bioRegister()
    await updateUser()
}

const openSpare = () => {
    speech.value = [
        `Velkommen, ${profile.value?.firstName} ${profile.value?.lastName}! 🤠`,
        'Her kan du finne en oversikt over dine profilinstillinger!',
        'Du kan også se dine fullførte sparemål og utfordringer!'
    ]
}
</script>

<template>
    <div class="w-full flex px-10 justify-center">
        <div class="flex flex-row flex-wrap justify-center w-full max-w-screen-xl gap-20">
            <div class="flex flex-col max-w-96 w-full gap-5 mt-3">
                <h1>Din profil</h1>
                <div class="flex flex-row gap-5">
                    <div class="w-32 h-32 border-black border-2 rounded-full shrink-0" />
                    <div class="w-full flex flex-col justify-between">
                        <h3 class="font-thin my-0">{{ profile?.username }}</h3>
                        <h3 class="font-thin my-0">
                            {{ profile?.firstName + ' ' + profile?.lastName }}
                        </h3>
                        <h3 class="font-thin my-0">{{ profile?.email }}</h3>
                    </div>
                </div>

                <h3
                    class="font-bold"
                    v-text="'Du har spart ' + profile?.savedAmount + ' kr totalt'"
                />

                <CardTemplate>
                    <div class="bg-red-300">
                        <p class="font-bold mx-3" v-text="'Brukskonto'" />
                    </div>
                    <p
                        class="mx-3"
                        v-text="profile?.spendingAccount.accNumber || 'Ingen brukskonto oppkoblet'"
                    />
                </CardTemplate>

                <CardTemplate>
                    <div class="bg-red-300">
                        <p class="font-bold mx-3" v-text="'Sparekonto'" />
                    </div>
                    <p
                        class="mx-3"
                        v-text="profile?.savingAccount.accNumber || 'Ingen sparekonto oppkoblet'"
                    />
                </CardTemplate>

                <button @click="router.push({ name: 'edit-profile' })" v-text="'Rediger bruker'" />
                <button
                    @click="router.push({ name: 'edit-configuration' })"
                    v-text="'Rediger konfigurasjon'"
                />
                <button @click="updateBiometrics">
                    {{ profile?.hasPasskey ? 'Endre biometri' : 'Legg til biometri' }}
                </button>
            </div>

            <div class="flex flex-col">
                <SpareComponent
                    :speech="speech"
                    :png-size="15"
                    :imageDirection="'left'"
                    :direction="'right'"
                    class="mb-5"
                ></SpareComponent>
                <div class="flex flex-row justify-between mx-4">
                    <p class="font-bold">Fullførte sparemål</p>
                    <a
                        @click="router.push({ name: 'goals' })"
                        class="hover:p-0 cursor-pointer text-blue-500"
                        v-text="'Se alle'"
                    />
                </div>
                <CardTemplate class="p-4 flex flex-row flex-wrap justify-center gap-2 mb-4 mt-2">
                    <CardGoal v-for="goal in completedGoals" :key="goal.id" :goal-instance="goal" />
                </CardTemplate>

                <div class="flex flex-row justify-between mx-4">
                    <p class="font-bold">Fullførte utfordringer</p>
                    <a
                        @click="router.push({ name: 'challenges' })"
                        class="hover:p-0 cursor-pointer text-blue-500"
                        v-text="'Se alle'"
                    />
                </div>
                <CardTemplate class="p-4 flex flex-row flex-wrap justify-center gap-2 mb-4 mt-2">
                    <CardGoal
                        v-for="challenge in completedChallenges"
                        :key="challenge.id"
                        :goal-instance="challenge"
                    />
                </CardTemplate>
            </div>
        </div>
    </div>
</template>
