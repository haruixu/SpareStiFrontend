<template>
    <!-- Challenge Icon and Details -->
    <div
        v-if="challenge"
        class="flex items-center justify-center shadow-black min-w-24 w-full h-auto md:max-h-full min-h-24 max-w-32 max-h-32 md:min-h-32 md:min-w-32 md:max-w-48 overflow-hidden"
    >
        <!-- Challenge Icon -->
        <div class="flex flex-col items-center mx-auto md:mx-2 my-auto">
            <div class="flex flex-col flex-nowrap self-center">
                <!-- Check Icon -->
                <div
                    v-if="challenge.completion !== undefined && challenge.completion >= 100"
                    class="min-w-6 min-h-6 max-w-6 max-h-6 md:min-h-8 md:max-h-8 md:min-w-8 md:max-w-8 ml-20 md:ml-32 p-1 basis-1/4 self-end"
                >
                    <img src="@/assets/completed.png" alt="" />️
                </div>
                <div
                    v-else
                    class="min-w-6 min-h-6 max-w-6 max-h-6 md:min-h-8 md:max-h-8 md:min-w-8 md:max-w-8 ml-20 md:ml-32 p-1 basis-1/4 self-end"
                >
                    <img src="@/assets/pending.png" alt="" />️
                </div>
                <div class="basis-3/4">
                    <p
                        class="text-center text-wrap text-xs lg:text-lg md:text-md"
                        data-cy="challenge-title"
                    >
                        {{ challenge.title }}
                    </p>
                </div>
            </div>
            <img
                @click="editChallenge(challenge)"
                :data-cy="'challenge-icon-' + challenge.id"
                :src="challengeImageUrl"
                class="max-w-8 max-h-12 md:max-h-8 md:max-w-8 lg:max-w-10 lg:max-h-10 cursor-pointer hover:scale-125 rounded-sm"
                :alt="challenge.title"
            />
            <!-- Progress Bar, if the challenge is not complete -->
            <div
                v-if="challenge.completion != undefined && challenge.completion < 100"
                class="flex-grow w-full mt-2"
            >
                <div class="flex flex-row ml-5 md:ml-10 justify-center">
                    <div class="flex flex-col">
                        <div class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                class="bg-lime-400 h-2.5 rounded-full"
                                data-cy="challenge-progress"
                                :style="{
                                    width: (challenge.saved / challenge.target) * 100 + '%'
                                }"
                            ></div>
                        </div>
                        <div class="text-center text-nowrap text-xs md:text-base">
                            {{ challenge.saved }}kr / {{ challenge.target }}kr
                        </div>
                        <button
                            @click="incrementSaved(challenge)"
                            :data-cy="'increment-challenge' + challenge.id"
                            type="button"
                            class="primary text-xs ml-2 z-10 relative"
                        >
                            + {{ challenge.perPurchase }}kr på {{ challenge.title }}
                        </button>
                    </div>
                </div>
            </div>
            <span v-else class="text-center text-xs md:text-base"
                >Ferdig: {{ challenge.saved }}</span
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Challenge } from '@/types/challenge'
import { useChallengeStore } from '@/stores/challengeStore'
import router from '@/router'
import { onMounted, ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'

const challengeStore = useChallengeStore()
const challengeImageUrl = ref('/src/assets/star.png') // Default or placeholder image
const props = defineProps<{ challenge: Challenge }>()

const emit = defineEmits(['update-challenge', 'complete-challenge'])

// Increment saved amount
// In your incrementSaved function in the child component
const incrementSaved = async (challenge: Challenge) => {
    challenge.saved += challenge.perPurchase
    // Trigger the update in the store

    const updatedChallenge = (await challengeStore.editUserChallenge(challenge)) as Challenge

    console.log('updated challenge in child: ', updatedChallenge)

    // Emit an event to inform the parent component of the update
    emit('update-challenge', updatedChallenge)
}

const editChallenge = (challenge: Challenge) => {
    router.push(`/spareutfordringer/rediger/${challenge.id}`)
}

const getChallengeIcon = async (challengeId: number) => {
    try {
        const imageResponse = await authInterceptor.get(`/challenges/picture?id=${challengeId}`, {
            responseType: 'blob'
        })
        challengeImageUrl.value = URL.createObjectURL(imageResponse.data)
    } catch (error) {
        challengeImageUrl.value = '/src/assets/star.png' // Fallback on error
    }
}

onMounted(() => {
    if (props.challenge?.id) {
        getChallengeIcon(props.challenge.id)
    } else {
        console.error('Challenge id is undefined')
    }
})
</script>
