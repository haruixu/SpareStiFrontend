<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'

const router = useRouter()

const oneWeekFromNow = new Date()
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
const minDate = oneWeekFromNow.toISOString().slice(0, 16)

const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
const maxDate = thirtyDaysFromNow.toISOString().slice(0, 16)

const challengeInstance = ref<Challenge>({
    title: '',
    perPurchase: 20,
    saved: 0,
    target: 100,
    description: '',
    due: minDate + ':00.000Z',
    type: ''
})

const isAmountSaved = ref(false)
const timesSaved = ref(challengeInstance.value.saved / challengeInstance.value.perPurchase)
watch(
    () => timesSaved.value,
    (newVal) => {
        challengeInstance.value.saved = newVal * challengeInstance.value.perPurchase
        challengeInstance.value.saved = parseFloat(challengeInstance.value.saved.toFixed(2))
    }
)
watch(
    () => challengeInstance.value.saved,
    (newVal) => {
        challengeInstance.value.saved = Math.max(
            0,
            Math.min(challengeInstance.value.target, newVal)
        )
        challengeInstance.value.saved = parseFloat(challengeInstance.value.saved.toFixed(2))
        timesSaved.value = challengeInstance.value.saved / challengeInstance.value.perPurchase
        timesSaved.value = parseFloat(timesSaved.value.toFixed(2))
    }
)
watch(
    () => challengeInstance.value.perPurchase,
    (newVal) => {
        challengeInstance.value.perPurchase = Math.max(
            1,
            Math.min(challengeInstance.value.target, newVal)
        )
        challengeInstance.value.perPurchase = parseFloat(
            challengeInstance.value.perPurchase.toFixed(2)
        )
        timesSaved.value = challengeInstance.value.saved / challengeInstance.value.perPurchase
        timesSaved.value = parseFloat(timesSaved.value.toFixed(2))
    }
)

watch(
    () => challengeInstance.value.target,
    (newVal) => {
        challengeInstance.value.target = Math.max(
            Math.max(challengeInstance.value.saved, 1),
            newVal
        )
    }
)

const selectedDate = ref(minDate)
watch(
    () => selectedDate.value,
    (newVal) => {
        if (newVal) {
            selectedDate.value = newVal < minDate ? minDate : newVal
            challengeInstance.value.due = selectedDate.value + ':00.000Z'
        }
    }
)

const isEdit = computed(() => router.currentRoute.value.name === 'edit-challenge')
const pageTitle = computed(() => (isEdit.value ? 'Rediger utfordring' : 'Ny utfordring'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(
    () => (challengeInstance.value.saved / challengeInstance.value.target) * 100
)

const isInputValid = computed(() => {
    return (
        challengeInstance.value.title !== '' &&
        challengeInstance.value.target > 0 &&
        challengeInstance.value.due !== ''
    )
})

const submitAction = () => {
    if (!isInputValid.value) {
        return () => alert('Fyll ut alle feltene')
    }

    if (isEdit.value) {
        updateChallenge()
    } else {
        createChallenge()
    }
}

onMounted(async () => {
    if (isEdit.value) {
        const goalId = router.currentRoute.value.params.id
        if (!goalId) return router.push({ name: 'challenges' })

        await authInterceptor(`/users/me/challenges/${goalId}`)
            .then((response) => {
                challengeInstance.value = response.data
                selectedDate.value = response.data.due.slice(0, 16)
            })
            .catch((error) => {
                console.error(error)
                router.push({ name: 'challenges' })
            })
    }
})

const createChallenge = () => {
    authInterceptor
        .post('/users/me/challenges', challengeInstance.value, {})
        .then(() => {
            return router.push({ name: 'challenges' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const updateChallenge = () => {
    authInterceptor
        .put(`/users/me/challenges/${challengeInstance.value.id}`, challengeInstance.value)
        .then(() => {
            router.push({ name: 'challenges' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const deleteGoal = () => {
    authInterceptor
        .delete(`/users/me/challenges/${challengeInstance.value.id}`)
        .then(() => {
            router.push({ name: 'challenges' })
        })
        .catch((error) => {
            console.error(error)
        })
}
</script>

<template>
    <div class="flex flex-col justify-center items-center">
        <h1 class="font-bold" v-text="pageTitle" />
        <div class="flex flex-col gap-5 items-center justify-center">
            <div class="flex flex-col">
                <p class="mx-4">Tittel*</p>
                <input
                    v-model="challengeInstance.title"
                    placeholder="Skriv en tittel"
                    type="text"
                />
            </div>

            <div class="flex flex-col">
                <p class="mx-4">Type</p>
                <input v-model="challengeInstance.type" placeholder="Skriv en type" type="text" />
            </div>

            <div class="flex flex-col">
                <p class="mx-4">Beskrivelse</p>
                <textarea
                    v-model="challengeInstance.description"
                    class="w-80 h-20 no-rezise"
                    placeholder="Beskriv sparemålet"
                />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex flex-col">
                    <p class="mx-4">Pris per sparing</p>
                    <input
                        v-model="challengeInstance.perPurchase"
                        class="w-40 text-right"
                        placeholder="Kr spart per sparing"
                        type="number"
                    />
                </div>

                <div class="flex flex-col">
                    <div class="flex flex-row justify-between mx-4">
                        <p>{{ isAmountSaved ? 'Kroner spart' : 'Antall sparinger' }}</p>
                        <button class="p-0 bg-transparent" @click="isAmountSaved = !isAmountSaved">
                            🔄️
                        </button>
                    </div>
                    <input
                        v-if="isAmountSaved"
                        v-model="challengeInstance.saved"
                        class="w-40 text-right"
                        min="0"
                        placeholder="Sparebeløp"
                        type="number"
                    />
                    <input
                        v-else
                        v-model="timesSaved"
                        class="w-40 text-right"
                        placeholder="Kr spart per sparing"
                        type="number"
                    />
                </div>

                <div class="flex flex-col">
                    <p class="mx-4">Av målbeløp...*</p>
                    <input
                        v-model="challengeInstance.target"
                        class="w-40 text-right"
                        placeholder="Målbeløp"
                        type="number"
                    />
                </div>
            </div>
            <ProgressBar :completion="completion" />

            <div class="flex flex-col">
                <p class="mx-4">Forfallsdato*</p>
                <input
                    v-model="selectedDate"
                    :max="maxDate"
                    :min="minDate"
                    placeholder="Forfallsdato"
                    type="datetime-local"
                />
            </div>

            <div class="flex flex-row justify-between w-full">
                <button :disabled="!isInputValid" @click="submitAction" v-text="submitButton" />
                <button
                    v-if="isEdit"
                    class="ml-2 bg-button-danger"
                    @click="deleteGoal"
                    v-text="'Slett'"
                />
                <button
                    v-else
                    class="ml-2 bg-button-other"
                    @click="router.push({ name: 'challenge' })"
                    v-text="'Avbryt'"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.no-rezise {
    resize: none;
}
</style>
