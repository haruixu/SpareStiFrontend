<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Goal } from '@/types/goal'
import InteractiveSpare from '@/components/InteractiveSpare.vue'

const router = useRouter()

const goalInstance = ref<Goal>({
    title: 'Test tittel',
    saved: 0,
    target: 100,
    description: 'Dette er en lang textbeskrivelse',
    due: ''
})

const completion = computed(() => (goalInstance.value.saved / goalInstance.value.target) * 100)
const isCompleted = computed(() => goalInstance.value.completedOn != null)

const motivation = ref<string[]>([])
const isModalOpen = ref(false)

const openInteractiveSpare = () => {
    isModalOpen.value = true
}

const calculateSpeech = () => {
    if (completion.value === 0) {
        return motivation.value.push(
            `Du har ikke spart noe enda. Du har ${goalInstance.value.target}kr igjen til målet.`
        )
    } else if (completion.value < 25) {
        return motivation.value.push(
            `Du har spart ${goalInstance.value.saved}kr av ${goalInstance.value.target}kr.`
        )
    } else if (completion.value < 75) {
        return motivation.value.push(
            `Du er på god vei! Du har spart ${goalInstance.value.saved}kr av ${goalInstance.value.target}kr.`
        )
    } else if (completion.value < 100) {
        return motivation.value.push(
            `Nesten der! Du har spart ${goalInstance.value.saved}kr av ${goalInstance.value.target}kr.`
        )
    } else if (completion.value >= 100) {
        return motivation.value.push(
            `Fantastisk! Du har nådd målet ditt! Du har spart ${goalInstance.value.saved}kr av ${goalInstance.value.target}kr.`
        )
    }
}

onMounted(() => {
    const goalId = router.currentRoute.value.params.id
    if (!goalId) return router.push({ name: 'goals' })

    authInterceptor(`/goals/${goalId}`)
        .then((response) => {
            goalInstance.value = response.data
            calculateSpeech()
        })
        .catch(() => router.push({ name: 'goals' }))
})

const completeGoal = () => {
    authInterceptor
        .put(`/goals/${goalInstance.value.id}/complete`)
        .then(() => {
            router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}
</script>

<template>
    <div class="flex flex-row flex-wrap items-center justify-center gap-10">
        <div class="flex flex-col gap-5 max-w-96">
            <button
                class="w-min"
                @click="router.push({ name: 'goals', params: { id: goalInstance.id } })"
            >
                Oversikt
            </button>

            <div
                class="flex flex-col justify-center border-4 border-black rounded-3xl align-middle p-5 card-shadow overflow-hidden w-full"
            >
                <h2 class="my-0">Sparemål:</h2>
                <h2 class="font-light">
                    {{ goalInstance.title }}
                </h2>
                <p class="text-wrap break-words">{{ goalInstance.description }}</p>
                <br />
                <p class="text-center">
                    Du har spart {{ goalInstance.saved }}kr av {{ goalInstance.target }}kr
                </p>
                <ProgressBar :completion="completion" />
            </div>

            <div class="flex flex-row justify-between gap-2 w-full">
                <button
                    v-if="!isCompleted"
                    @click="
                        router.push({
                            name: 'edit-goal',
                            params: { id: goalInstance.id }
                        })
                    "
                >
                    Rediger
                </button>

                <button
                    v-if="!isCompleted"
                    @click="completeGoal"
                    v-text="'Marker målet som ferdig'"
                />

                <button
                    class="bg-button-danger hover:bg-button-danger"
                    @click="
                        authInterceptor
                            .delete(`/goals/${goalInstance.id}`)
                            .then(() => router.push({ name: 'goals' }))
                            .catch((error) => console.error(error))
                    "
                >
                    Slett
                </button>
            </div>
        </div>
        <div class="flex items-center">
            <a @click="openInteractiveSpare" class="hover:bg-transparent z-20">
                <img
                    alt="Spare"
                    class="scale-x-[-1] md:h-5/6 md:w-5/6 w-2/3 h-2/3 cursor-pointer ml-14 md:ml-10"
                    src="@/assets/spare.png"
                />
            </a>
        </div>
        <InteractiveSpare
            :png-size="10"
            :speech="motivation"
            direction="left"
            :isModalOpen="isModalOpen"
        />
    </div>
</template>

<style scoped>
.card-shadow {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
