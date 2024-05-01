<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { Goal } from '@/types/goal'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import HelpComponent from "@/components/HelpComponent.vue";

const router = useRouter()

const selectedDate = ref<string>('')
const minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16)
const helpSpeech = ref<string[]>([])

const goalInstance = ref<Goal>({
    title: '',
    saved: 0,
    target: 100,
    description: '',
    due: ''
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
    () => selectedDate.value,
    (newVal) => {
        if (newVal < minDate) selectedDate.value = minDate
        goalInstance.value.due = newVal + ':00.000Z'
    }
)

const isEdit = computed(() => router.currentRoute.value.name === 'edit-goal')
const pageTitle = computed(() => (isEdit.value ? 'Rediger sparemål' : 'Nytt sparemål'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(() => (goalInstance.value.saved / goalInstance.value.target) * 100)

const isInputValid = computed(() => {
    return (
        goalInstance.value.title.length > 0 &&
        goalInstance.value.title.length <= 20 &&
        goalInstance.value.description.length <= 280 &&
        goalInstance.value.target > 0 &&
        goalInstance.value.due !== ''
    )
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

        await authInterceptor(`/goals/${goalId}`)
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
        .post('/goals', goalInstance.value, {})
        .then(() => {
            return router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const updateGoal = () => {
    authInterceptor
        .put(`/goals/${goalInstance.value.id}`, goalInstance.value)
        .then(() => {
            router.back()
        })
        .catch((error) => {
            console.error(error)
        })
}

const deleteGoal = () => {
    authInterceptor
        .delete(`/goals/${goalInstance.value.id}`)
        .then(() => {
            router.push({ name: 'goals' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const openHelp = () => {
  helpSpeech.value = [
    'Her kan du opprette et nytt sparemål 🌸',
    'Tittel er navnet på sparemålet, og beskrivelse er en kort forklaring på hva sparemålet går ut på.',
    'Kroner spart er hvor mye du har spart til nå, og av målbeløp er hvor mye du ønsker å spare.',
    'Forfallsdato er datoen du ønsker å ha nådd sparemålet ditt.',
    'Lykke til med sparingen! 🌴'
  ]
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
                    :min="minDate"
                    v-model="selectedDate"
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
  <HelpComponent :speech="helpSpeech" @openHelp="openHelp"></HelpComponent>
</template>

<style scoped>
.no-rezise {
    resize: none;
}
</style>
