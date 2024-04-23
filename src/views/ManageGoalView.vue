<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { Goal } from '@/types/goal'
import ProgressBar from '@/components/ProgressBar.vue'
import axios from 'axios'

const router = useRouter()

const oneWeekFromNow = new Date()
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
const minDate = oneWeekFromNow.toISOString()

const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
const maxDate = thirtyDaysFromNow.toISOString()

const goalInstance = ref<Goal>({
    id: 0,
    title: '',
    saved: 50,
    target: 100,
    completion: 0,
    description: '',
    priority: 0,
    createdOn: undefined,
    due: minDate,
    completedOn: null
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

watch(
    () => goalInstance.value.due,
    (newVal) => {
        if (newVal) {
            goalInstance.value.due = newVal < minDate ? minDate : newVal
        }
    }
)
const isEdit = computed(() => router.currentRoute.value.name === 'edit-goal')
const pageTitle = computed(() => (isEdit.value ? 'Rediger sparemål' : 'Nytt sparemål'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(() => (goalInstance.value.saved / goalInstance.value.target) * 100)

const submitAction = () => {
    if (
        goalInstance.value.title === '' ||
        goalInstance.value.target < 1 ||
        goalInstance.value.due === ''
    ) {
        return () => alert('Fyll ut alle feltene')
    }

    goalInstance.value.due += ':00.000Z'

    if (isEdit.value) {
        updateGoal()
    } else {
        createGoal()
    }
}

onMounted(() => {
    console.log(minDate, maxDate)

    let id = null

    if (isEdit.value) {
        id = Number(router.currentRoute.value.params.id)

        if (!id) {
            router.push('/')
        }

        goalInstance.value.id = id
    }
})

const createGoal = () => {
    console.log('Creating goal', goalInstance.value)

    axios
        .post('http://localhost:8080/users/me/goals', goalInstance.value, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
        .then((response) => {
            console.log(response.data)
            return router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const updateGoal = () => {
    console.log('Updating goal', goalInstance.value)

    axios
        .put(`http://localhost:8080/users/me/goals/${goalInstance.value.id}`, goalInstance.value, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
            }
        })
        .then((response) => {
            console.log(response.data)
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
                    v-model="goalInstance.due"
                    :max="maxDate"
                    :min="minDate"
                    placeholder="Forfallsdato"
                    type="datetime-local"
                />
            </div>

            <button @click="submitAction" v-text="submitButton" />
        </div>
    </div>
</template>

<style scoped>
.no-rezise {
    resize: none;
}
</style>
