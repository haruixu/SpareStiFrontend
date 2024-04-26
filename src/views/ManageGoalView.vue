<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { Goal } from '@/types/goal'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'

const router = useRouter()

const oneWeekFromNow = new Date()
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
const minDate = oneWeekFromNow.toISOString().slice(0, 16)

const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
const maxDate = thirtyDaysFromNow.toISOString().slice(0, 16)

const goalInstance = ref<Goal>({
    id: 0,
    title: '',
    saved: 0,
    target: 100,
    completion: 0,
    description: '',
    priority: 0,
    createdOn: undefined,
    due: minDate + ':00.000Z'
})

watch(
    () => goalInstance.value.saved,
    (newVal) => {
        goalInstance.value.saved = Math.max(0, Math.min(goalInstance.value.target, newVal))
    }
)

watch(
    () => goalInstance.value.target,
    (newVal) => {
        goalInstance.value.target = Math.max(Math.max(goalInstance.value.saved, 1), newVal)
    }
)

const selectedDate = ref(minDate)
watch(
    () => selectedDate.value,
    (newVal) => {
        if (newVal) {
            selectedDate.value = newVal < minDate ? minDate : newVal
            goalInstance.value.due = selectedDate.value + ':00.000Z'
        }
        console.log(selectedDate.value)
    }
)

const isEdit = computed(() => router.currentRoute.value.name === 'edit-goal')
const pageTitle = computed(() => (isEdit.value ? 'Rediger sparemål' : 'Nytt sparemål'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(() => (goalInstance.value.saved / goalInstance.value.target) * 100)

const isInputValid = computed(() => {
    return (
        goalInstance.value.title !== '' &&
        goalInstance.value.target > 0 &&
        goalInstance.value.due !== ''
    )
})

const submitAction = () => {
    if (
        goalInstance.value.title === '' ||
        goalInstance.value.target < 1 ||
        goalInstance.value.due === ''
    ) {
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
                goalInstance.value = response.data
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
        .post('/users/me/goals', goalInstance.value, {})
        .then(() => {
            return router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const updateGoal = () => {
    authInterceptor
        .put(`/users/me/goals/${goalInstance.value.id}`, goalInstance.value)
        .then(() => {
            router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const deleteGoal = () => {
    authInterceptor
        .delete(`/users/me/goals/${goalInstance.value.id}`)
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
                <input v-model="goalInstance.title" placeholder="Skriv en tittel" type="text" />
            </div>

            <div class="flex flex-col">
                <p class="mx-4">Beskrivelse</p>
                <textarea
                    v-model="goalInstance.description"
                    class="w-80 h-20 no-rezise"
                    placeholder="Beskriv sparemålet"
                />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex flex-col">
                    <p class="mx-4">Kroner spart...</p>
                    <input
                        v-model="goalInstance.saved"
                        class="w-40 text-right"
                        min="0"
                        placeholder="Sparebeløp"
                        type="number"
                    />
                </div>

                <div class="flex flex-col">
                    <p class="mx-4">Av målbeløp...*</p>
                    <input
                        v-model="goalInstance.target"
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
