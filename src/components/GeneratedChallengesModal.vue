<template>
    <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
        <div class="relative bg-white pt-10 p-4 rounded-lg shadow-xl" style="width: 40rem">
            <button @click="closeModal" class="absolute top-0 right-0 m-2 primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div v-if="generatedChallenges.length > 0">
                <div class="text-center font-bold text-3xl mb-4 mt-2">
                    Personlig tilpassede spareutfordringer:
                </div>
                <div class="grid grid-cols-7 sm:grid-cols-11 gap-2 p-3 pb-1 border-b-2">
                    <span class="font-bold col-span-2 md:col-span-3 sm:text-lg pt-1 mb-0"
                        >Tittel</span
                    >
                    <span class="font-bold col-span-2 md:col-span-2 sm:text-lg pt-1 mb-0"
                        >Målsum</span
                    >
                    <span
                        class="font-bold col-span-2 md:col-span-1 sm:text-lg pt-1 pr-1 md:pr-3 mb-0"
                        >Frist</span
                    >
                    <span class="col-span-2"></span>
                </div>
                <div class="space-y-2">
                    <div
                        v-for="(challenge, index) in generatedChallenges"
                        :key="index"
                        :class="{ 'bg-gray-100': index % 2 === 0 }"
                        class="grid grid-cols-7 md:grid-cols-7 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-center border p-3 rounded mt-[-8px]"
                    >
                        <span class="break-words col-span-2 md:col-span-1 lg:col-span-2 text-lg">{{
                            challenge.title
                        }}</span>
                        <span class="col-span-2 md:col-span-2 lg:col-span-1 text-lg">{{
                            challenge.target
                        }}</span>
                        <span class="col-span-2 md:col-span-1 lg:col-span-2 text-lg">{{
                            challenge.due
                        }}</span>
                        <div
                            class="col-span-7 sm:col-start-3 sm:col-span-2 md:col-span-2 lg:col-span-2 flex items-center justify-end space-x-2"
                        >
                            <span v-if="challenge.isAccepted" class="font-bold text-lg"
                                >Godtatt!</span
                            >
                            <button
                                @click="acceptChallenge(challenge)"
                                class="font-bold py-1 px-4 mt-[-14px] sm:mt-0 primary"
                            >
                                Godta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-2xl font-bold mt-1">
                Ingen nye spareutfordringer enda ... sjekk igjen senere!
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import type { AxiosResponse } from 'axios'
import { useChallengeStore } from '@/stores/challengeStore'

interface Challenge {
    title: string
    target: number
    due: string
    dueFull: string
    isAccepted: boolean
    perPurchase?: number
    description?: string
    type?: string
}

const showModal = ref(true)
const generatedChallenges = reactive<Challenge[]>([])
const emit = defineEmits(['update-challenges'])
const challengeStore = useChallengeStore()

// Fetch generated challenges from the backend
async function fetchGeneratedChallenges() {
    try {
        const response: AxiosResponse = await authInterceptor.get('/challenges/generate')
        if (response.status === 200) {
            generatedChallenges.splice(
                0,
                generatedChallenges.length,
                ...response.data.map((ch: any) => ({
                    ...ch,
                    due: new Date(ch.due).toISOString().split('T')[0],
                    dueFull: ch.due,
                    isAccepted: false
                }))
            )
        } else {
            generatedChallenges.splice(0, generatedChallenges.length)
        }
    } catch (error) {
        console.error('Error fetching challenges:', error)
    }
}

// Fetch generated challenges on component mount
onMounted(() => {
    fetchGeneratedChallenges()
    localStorage.setItem('lastModalShow', Date.now().toString())
})

// Accept a challenge
async function acceptChallenge(challenge: Challenge) {
    if (!challenge) {
        console.error('No challenge data provided to acceptChallenge function.')
        return
    }
    const postData = {
        title: challenge.title,
        saved: 0,
        target: challenge.target,
        perPurchase: challenge.perPurchase,
        description: challenge.description,
        due: challenge.dueFull,
        type: challenge.type
    }
    await authInterceptor
        .post('/challenges', postData)
        .then((response: AxiosResponse) => {
            challenge.isAccepted = true
        })
        .catch((error) => {
            console.error('Failed to save challenge:', error)
        })
    await challengeStore.getUserChallenges()
    const challenges = challengeStore.challenges
    emit('update-challenges', challenges)
}

const closeModal = () => {
    showModal.value = false
}
</script>
