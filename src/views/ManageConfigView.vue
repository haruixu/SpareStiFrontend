<script lang="ts" setup>
import authInterceptor from '@/services/authInterceptor'
import CardTemplate from '@/components/CardTemplate.vue'
import type { ChallengeConfig } from '@/types/challengeConfig'
import { onMounted, ref } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'
import router from '@/router'

const configuration = ref<ChallengeConfig>({
    motivation: '',
    experience: '',
    challengeTypeConfigs: [
        {
            type: 'Kaffe',
            generalAmount: 100,
            specificAmount: 10
        }
    ]
})

const error = ref<string | null>(null)

const deleteChallengeType = (type: string) => {
    if (configuration.value.challengeTypeConfigs) {
        configuration.value.challengeTypeConfigs = configuration.value.challengeTypeConfigs.filter(
            (item) => item.type !== type
        )
    }
}

const createChallengeType = () => {
    configuration.value.challengeTypeConfigs?.push({
        type: '',
        specificAmount: null,
        generalAmount: null
    })
}

const validateAndSave = () => {
    if (!configuration.value.motivation) {
        return (error.value = 'Du må velge hvor store vaneendringer du er villig til å gjøre')
    }

    if (!configuration.value.experience) {
        return (error.value = 'Du må velge hvor kjent du er med sparing fra før av')
    }

    if (configuration.value.challengeTypeConfigs.length == 0) {
        return (error.value = 'Du må legge til minst én ting du bruker mye penger på')
    }

    if (
        configuration.value.challengeTypeConfigs.some(
            (item) => !item.type || !item.specificAmount || !item.generalAmount
        )
    ) {
        return (error.value = 'Du må fylle ut alle feltene for ting du bruker mye penger på')
    }

    if (
        configuration.value.challengeTypeConfigs.some(
            (item) =>
                (item.specificAmount && item.specificAmount < 0) ||
                (item.generalAmount && item.generalAmount < 0)
        )
    ) {
        return (error.value = 'Prisene kan ikke være negative')
    }

    saveConfiguration()
}

const saveConfiguration = () => {
    authInterceptor
        .put('/config/challenge', configuration.value)
        .then(() => {
            router.push({ name: 'profile' })
        })
        .catch((error) => {
            error.value = error.response.data.message
        })
}

onMounted(() => {
    authInterceptor('/config/challenge')
        .then((response) => {
            configuration.value = response.data
        })
        .catch((error) => {
            console.error(error)
        })
})
</script>

<template>
    <div class="w-full flex px-10 justify-center">
        <div class="flex flex-col justify-center items-center max-w-screen-xl gap-3">
            <h1>Rediger konfigurasjon✏️</h1>

            <h3 class="font-bold">Hvor store vaneedringer er du villig til å gjøre?</h3>
            <div v-if="configuration" class="flex flex-row gap-5">
                <CardTemplate
                    :class="{ 'border-2 border-lime-400': configuration.motivation === 'VERY_LOW' }"
                    class="cursor-pointer p-4 border-2"
                    @click="configuration.motivation = 'VERY_LOW'"
                >
                    <p class="font-bold">Litt</p>
                </CardTemplate>
                <CardTemplate
                    :class="{ 'border-2 border-lime-400': configuration.motivation === 'MEDIUM' }"
                    class="cursor-pointer p-4 border-2"
                    @click="configuration.motivation = 'MEDIUM'"
                >
                    <p class="font-bold">Passe</p>
                </CardTemplate>
                <CardTemplate
                    :class="{
                        'border-2 border-lime-400': configuration.motivation === 'VERY_HIGH'
                    }"
                    class="cursor-pointer p-4 border-2"
                    @click="configuration.motivation = 'VERY_HIGH'"
                >
                    <p class="font-bold">Store</p>
                </CardTemplate>
            </div>

            <h3 class="font-bold">Hvor kjent er du med sparing fra før av?</h3>
            <div v-if="configuration" class="flex flex-row gap-5">
                <CardTemplate
                    :class="{ 'border-2 border-lime-400': configuration.experience === 'VERY_LOW' }"
                    class="cursor-pointer p-4 border-2"
                    @click="configuration.experience = 'VERY_LOW'"
                >
                    <p class="font-bold">Litt kjent</p>
                </CardTemplate>
                <CardTemplate
                    :class="{ 'border-2 border-lime-400': configuration.experience === 'MEDIUM' }"
                    class="cursor-pointer p-4 border-2"
                    @click="configuration.experience = 'MEDIUM'"
                >
                    <p class="font-bold">Noe kjent</p>
                </CardTemplate>
                <CardTemplate
                    :class="{
                        'border-2 border-lime-400': configuration.experience === 'VERY_HIGH'
                    }"
                    class="cursor-pointer p-4 border-2"
                    @click="configuration.experience = 'VERY_HIGH'"
                >
                    <p class="font-bold">Godt kjent</p>
                </CardTemplate>
            </div>

            <h3 class="font-bold my-0">Hva bruker du mye penger på?</h3>
            <div class="flex flex-col gap-4 p-4 items-center">
                <CardTemplate
                    v-for="(item, index) in configuration.challengeTypeConfigs"
                    :key="index"
                    class="flex flex-row flex-wrap justify-center gap-5 border-2 p-4"
                >
                    <input v-model="item.type" placeholder="Type" type="text" />
                    <input v-model="item.specificAmount" placeholder="Pris per uke" type="number" />
                    <input v-model="item.generalAmount" placeholder="Generell pris" type="number" />
                    <button
                        class="primary danger w-min items-center"
                        @click="deleteChallengeType(item.type)"
                        v-text="'x'"
                    />
                </CardTemplate>
                <button
                    class="font-bold text-2xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-100 justify-start"
                    @click="createChallengeType"
                    v-text="'Legg til flere📝'"
                />
            </div>

            <div class="flex flex-row justify-center gap-5">
                <button class="primary danger" @click="router.back()">Avbryt</button>
                <button class="primary" @click="validateAndSave">Lagre</button>
            </div>
        </div>

        <ModalComponent v-if="error">
            <p class="my-4" v-text="error" />
            <button @click="error = null">Lukk</button>
        </ModalComponent>
    </div>
</template>

<style scoped></style>
