<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'
import SpareComponent from '@/components/SpareComponent.vue'
import starImage from '@/assets/star.png'

const router = useRouter()
const challengeImageUrl = ref(starImage)
const isImageLoaded = ref(false)

const challengeInstance = ref<Challenge>({
    title: 'Tittel',
    perPurchase: 20,
    saved: 0,
    target: 100,
    description: 'Dette er en lang textbeskrivelse',
    due: '2024-01-01T00:00:00.000Z',
    type: '☕️',
    completedOn: ''
})

const timesSaved = computed(
    () => challengeInstance.value.saved / challengeInstance.value.perPurchase
)
const completion = computed(
    () => (challengeInstance.value.saved / challengeInstance.value.target) * 100
)
const isCompleted = computed(() => challengeInstance.value.completedOn != null)

const motivation = ref<string[]>([])

const calculateSpeech = () => {
    if (completion.value === 0) {
        return motivation.value.push(
            `Du har ikke spart noe enda. Du har ${challengeInstance.value.target}kr igjen til målet.`
        )
    } else if (completion.value < 25) {
        return motivation.value.push(
            `Du har spart ${challengeInstance.value.saved}kr av ${challengeInstance.value.target}kr, som er ${timesSaved.value} ganger.`
        )
    } else if (completion.value < 75) {
        return motivation.value.push(
            `Du er på god vei! Du har spart ${challengeInstance.value.saved}kr av ${challengeInstance.value.target}kr, som er ${timesSaved.value} ganger.`
        )
    } else if (completion.value < 100) {
        return motivation.value.push(
            `Nesten der! Du har spart ${challengeInstance.value.saved}kr av ${challengeInstance.value.target}kr, som er ${timesSaved.value} ganger.`
        )
    } else if (completion.value >= 100) {
        return motivation.value.push(
            `Fantastisk! Du har nådd målet ditt! Du har spart ${challengeInstance.value.saved}kr av ${challengeInstance.value.target}kr, som er ${timesSaved.value} ganger.`
        )
    }
}

onMounted(async () => {
    const challengeId = router.currentRoute.value.params.id
    if (!challengeId) return router.push({ name: 'challenges' })

    try {
        const challengeResponse = await authInterceptor.get(`/challenges/${challengeId}`)
        challengeInstance.value = challengeResponse.data
        calculateSpeech()

        try {
            const imageResponse = await authInterceptor.get(
                `/challenges/picture?id=${challengeId}`,
                { responseType: 'blob' }
            )
            challengeImageUrl.value = URL.createObjectURL(imageResponse.data)
        } catch (imageError) {
            console.error('Failed to load image:', imageError)
        }
        isImageLoaded.value = true
    } catch (error) {
        console.error('Failed to load challenge details:', error)
        await router.push({ name: 'challenges' })
    }
})

const completeChallenge = () => {
    authInterceptor
        .put(`/challenges/${challengeInstance.value.id}/complete`)
        .then(() => {
            router.push({ name: 'challenges' })
        })
        .catch((error) => {
            console.error(error)
        })
}
</script>

<template>
    <div class="flex flex-row flex-wrap items-center justify-center gap-10">
        <div class="flex flex-col gap-5 max-w-96">
            <div class="flex flex-col items-center"></div>

            <button
                class="w-min bg-transparent rounded-lg font-bold left-10 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-100 justify-start"
                @click="router.push({ name: 'challenges', params: { id: challengeInstance.id } })"
            >
                👈Oversikt
            </button>

            <div
                class="flex flex-col justify-center border-2 rounded-3xl align-middle p-5 card-shadow overflow-hidden w-full"
            >
                <h2 class="my-0">Spareutfordring:</h2>
                <h2 class="font-light">
                    {{ challengeInstance.title }}
                </h2>
                <div class="flex flex-col gap-4 justify-center">
                    <p class="text-wrap break-words">{{ challengeInstance.description }}</p>
                    <div class="flex justify-center items-center">
                        <img
                            v-if="isImageLoaded"
                            :src="challengeImageUrl || '@/assets/star.png'"
                            alt="Goal Image"
                            class="w-44 h-44 object-cover rounded-lg"
                        />
                    </div>
                </div>
                <br />
                <p class="text-center">
                    Du har spart {{ timesSaved }} ganger som er {{ challengeInstance.saved }}kr av
                    {{ challengeInstance.target }}kr
                </p>
                <ProgressBar :completion="completion" />
                <br />

                <br />
                <p>
                    Du sparer {{ challengeInstance.perPurchase }}kr hver gang du dropper å bruke
                    penger på {{ challengeInstance.title }}
                </p>
                <button
                    class="primary secondary"
                    v-if="!isCompleted"
                    @click="
                        router.push({
                            name: 'edit-challenge',
                            params: { id: challengeInstance.id }
                        })
                    "
                >
                    Rediger
                </button>
                <button
                    class="primary danger mt-2 rounded-2xl p-2"
                    @click="
                        authInterceptor
                            .delete(`/challenges/${challengeInstance.id}`)
                            .then(() => router.push({ name: 'challenges' }))
                            .catch((error) => console.error(error))
                    "
                >
                    Slett
                </button>
                <button
                    class="primary mt-2"
                    v-if="!isCompleted"
                    @click="completeChallenge"
                    v-text="'Sett utfordring til ferdig'"
                />
            </div>
        </div>
        <SpareComponent
            :speech="motivation"
            :png-size="15"
            :imageDirection="'left'"
            :direction="'right'"
            class="mb-5 w-96 h-96"
        ></SpareComponent>
    </div>
</template>

<style scoped>
.card-shadow {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
