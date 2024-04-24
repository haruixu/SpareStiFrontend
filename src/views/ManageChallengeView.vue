<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'

const router = useRouter()

const oneWeekFromNow = new Date()
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
const minDate = oneWeekFromNow

const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
const maxDate = thirtyDaysFromNow

const challengeInstance = ref<Challenge>({
    title: '',
    saved: 50,
    target: 100,
    description: '',
    due: new Date(),
    type: ''
})

watch(
    () => challengeInstance.value.saved,
    (newVal) => {
        challengeInstance.value.saved = Math.max(
            0,
            Math.min(challengeInstance.value.target, newVal)
        )
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
            challengeInstance.value.due = selectedDate.value
        }
        console.log(selectedDate.value)
    }
)

const isEdit = computed(() => router.currentRoute.value.name === 'edit-goal')
const pageTitle = computed(() => (isEdit.value ? 'Rediger sparemål' : 'Nytt sparemål'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(
    () => (challengeInstance.value.saved / challengeInstance.value.target) * 100
)

const isInputValid = computed(() => {
    return challengeInstance.value.title !== '' && challengeInstance.value.target > 0
})

const submitAction = () => {
    if (!isInputValid.value) {
        return () => alert('Fyll ut alle feltene')
    }

    if (isEdit.value) {
        updateGoal()
    } else {
        createGoal()
    }
}

onMounted(async () => {
    if (isEdit.value) {
        const goalId = router.currentRoute.value.params.id
        if (!goalId) return router.push({ name: 'goals' })

        await authInterceptor(`/users/me/goals/${goalId}`)
            .then((response) => {
                challengeInstance.value = response.data
                selectedDate.value = response.data.due.slice(0, 16)
            })
            .catch((error) => {
                console.error(error)
                router.push({ name: 'goals' })
            })
    }
})

const createGoal = () => {
    authInterceptor
        .post('/users/me/goals', challengeInstance.value, {})
        .then(() => {
            return router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const updateGoal = () => {
    authInterceptor
        .put(`/users/me/goals/${challengeInstance.value.id}`, challengeInstance.value)
        .then(() => {
            router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const deleteGoal = () => {
    authInterceptor
        .delete(`/users/me/goals/${challengeInstance.value.id}`)
        .then(() => {
            router.push({ name: 'goals' })
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
                <p class="mx-4">Beskrivelse</p>
                <textarea
                    v-model="challengeInstance.description"
                    class="w-80 h-20 no-rezise"
                    placeholder="Beskriv sparemålet"
                />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex flex-col">
                    <p class="mx-4">Kroner spart...</p>
                    <input
                        v-model="challengeInstance.saved"
                        class="w-40 text-right"
                        min="0"
                        placeholder="Sparebeløp"
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
                    @click="router.push({ name: 'goals' })"
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
