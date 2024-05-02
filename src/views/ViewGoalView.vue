<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Goal } from '@/types/goal'
import SpareComponent from '@/components/SpareComponent.vue'

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
            `!Fantastisk Du har nådd målet ditt! Du har spart ${goalInstance.value.saved}kr av ${goalInstance.value.target}kr.`
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
            class="w-min bg-transparent rounded-lg font-bold left-10 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 hover:opacity-100 justify-start"
            @click="router.push({ name: 'goals', params: { id: goalInstance.id } })"
            >
            👈Oversikt
            </button>


            <div
                class="flex flex-col justify-center border-2 rounded-3xl align-middle p-5 card-shadow overflow-hidden w-full"
            >
                <h2 class="my-0">Sparemål:</h2>
                <h2 class="font-light">
                    {{ goalInstance.title }}
                </h2>
                <div class="flex flex-row gap-4 justify-center">
                    <p class="text-wrap break-words">{{ goalInstance.description }}</p>
                    <div>
                        <img
                        class="w-20 h-20"
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        alt="Profilbilde"
                        />
                    </div>
                </div>
                <br />
                <p class="text-center">
                    Du har spart {{ goalInstance.saved }}kr av {{ goalInstance.target }}kr
                </p>
                <ProgressBar :completion="completion" />
                <button class="primary secondary mt-6"
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
                    class="danger mt-2 rounded-2xl p-1"
                    @click="
                        authInterceptor
                            .delete(`/goals/${goalInstance.id}`)
                            .then(() => router.push({ name: 'goals' }))
                            .catch((error) => console.error(error))
                    "
                >
                    Slett
                </button>
                <button class="primary mt-4"
                    v-if="!isCompleted"
                    @click="completeGoal"
                    v-text="'Marker målet som ferdig'"
                />
            </div>
        </div>
        <SpareComponent
            :speech="motivation"
            :png-size="15"
            :imageDirection="'left'"
            :direction="'right'"
            class="mb-5"
        ></SpareComponent>
    </div>
</template>

<style scoped>
.card-shadow {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
