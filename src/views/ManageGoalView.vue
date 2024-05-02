<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import type { Goal } from '@/types/goal'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import ModalComponent from '@/components/ModalComponent.vue'

const router = useRouter()

const minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10)
const selectedDate = ref<string>(minDate)

const modalMessage = ref<string>('')
const modalTitle = ref<string>('')
const errorModalOpen = ref<boolean>(false)
const confirmModalOpen = ref<boolean>(false)

const goalInstance = ref<Goal>({
    title: '',
    saved: 0,
    target: 0,
    description: '',
    due: ''
})

watch(selectedDate, (newDate) => {
    goalInstance.value.due = newDate
})

const isEdit = computed(() => router.currentRoute.value.name === 'edit-goal')
const pageTitle = computed(() => (isEdit.value ? 'Rediger sparemål🎨' : 'Nytt sparemål🎨'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(() => (goalInstance.value.saved / goalInstance.value.target) * 100)

function validateInputs() {
    const errors = []

    goalInstance.value.due = selectedDate.value + 'T23:59:59.999Z'

    if (!goalInstance.value.title) {
        errors.push('Tittel må fylles ut')
    }
    if (!goalInstance.value.target) {
        errors.push('Målbeløp må fylles ut')
    }
    if (!goalInstance.value.due) {
        errors.push('Forfallsdato må fylles ut')
    }

    if (goalInstance.value.target < 1) {
        errors.push('Målbeløp må være større enn 0')
    }

    if (goalInstance.value.saved < 0) {
        errors.push('Sparebeløp kan ikke være negativt')
    }

    if (goalInstance.value.saved > goalInstance.value.target) {
        errors.push('Sparebeløp kan ikke være større enn målbeløp')
    }

    return errors
}
const submitAction = async () => {
    const errors = validateInputs()
    if (errors.length > 0) {
        const formatErrors = errors.join('\n')
        modalTitle.value = 'Oops! Noe er feil med det du har fylt ut🚨'
        modalMessage.value = formatErrors.replace(/\n/g, '<br>')
        errorModalOpen.value = true
        return
    }
    try {
        if (isEdit.value) {
            updateGoal()
        } else {
            createGoal()
        }
    } catch (error) {
        console.error(error)
        modalTitle.value = 'Systemfeil'
        modalMessage.value = 'En feil oppstod under lagring av utfordringen.'
        errorModalOpen.value = true
    }
}

watch(selectedDate, (newDate) => {
    console.log(newDate)
})

onMounted(async () => {
    if (isEdit.value) {
        const goalId = router.currentRoute.value.params.id
        if (!goalId) return router.push({ name: 'goals' })

        await authInterceptor(`/goals/${goalId}`)
            .then((response) => {
                goalInstance.value = response.data
                selectedDate.value = response.data.due.slice(0, 10)
            })
            .catch((error) => {
                console.error(error)
                router.push({ name: 'goals' })
            })
    } else {
        goalInstance.value.due = selectedDate.value
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

function cancelCreation() {
    if (
        goalInstance.value.title !== '' ||
        goalInstance.value.description !== '' ||
        goalInstance.value.target !== 0 ||
        selectedDate.value !== ''
    ) {
        modalTitle.value = 'Du er i ferd med å avbryte redigeringen🚨'
        modalMessage.value = 'Er du sikker på at du vil avbryte?'
        confirmModalOpen.value = true
    } else {
        router.push({ name: 'goals' })
    }
}

const confirmCancel = () => {
    router.push({ name: 'goals' })
    confirmModalOpen.value = false
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
                <p class="mx-4">Beskrivelse (valgfri)</p>
                <textarea
                    v-model="goalInstance.description"
                    class="w-80 h-20 no-rezise"
                    placeholder="Beskriv sparemålet"
                />
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex flex-col">
                    <p class="mx-4">Kroner spart💸</p>
                    <input
                        v-model="goalInstance.saved"
                        class="w-40 text-right"
                        placeholder="Sparebeløp"
                        type="number"
                    />
                </div>

                <div class="flex flex-col">
                    <p class="mx-4">Av målbeløp💯*</p>
                    <input
                        v-model="goalInstance.target"
                        class="w-40 text-right"
                        placeholder="Målbeløp"
                        type="number"
                    />
                </div>
            </div>
            <ProgressBar :completion="completion" />

            <div class="flex flex-row gap-4">
                <div class="flex flex-col">
                    <p class="mx-4">Forfallsdato*</p>
                    <input
                        :min="minDate"
                        v-model="selectedDate"
                        placeholder="Forfallsdato"
                        type="date"
                    />
                </div>
                <div class="flex flex-col">
                    <p>Last opp ikon for utfordringen📸</p>
                    <button
                        class="mt-2 font-bold cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-90"
                    >
                        💾
                    </button>
                </div>
            </div>

            <div class="flex flex-row justify-between w-full">
                <button
                    v-if="isEdit"
                    class="ml-2 primary danger"
                    @click="deleteGoal"
                    v-text="'Slett'"
                />
                <button
                    v-else
                    class="ml-2 primary danger"
                    @click="cancelCreation"
                    v-text="'Avbryt'"
                />
                <button class="primary" @click="submitAction" v-text="submitButton" />
            </div>
            <ModalComponent
                :title="modalTitle"
                :message="modalMessage"
                :isModalOpen="errorModalOpen"
                @close="errorModalOpen = false"
            >
                <template v-slot:input>
                    <div class="flex justify-center items-center">
                        <div class="flex flex-col gap-5">
                            <button class="primary" @click="errorModalOpen = false">Lukk</button>
                        </div>
                    </div>
                </template>
            </ModalComponent>

            <ModalComponent
                :title="modalTitle"
                :message="modalMessage"
                :isModalOpen="confirmModalOpen"
                @close="confirmModalOpen = false"
            >
                <template v-slot:input>
                    <div class="flex justify-center items-center">
                        <div class="flex flex-col gap-5">
                            <button class="primary" @click="confirmCancel">Bekreft</button>
                            <button class="primary danger" @click="confirmModalOpen = false">
                                Avbryt
                            </button>
                        </div>
                    </div>
                </template>
            </ModalComponent>
        </div>
    </div>
</template>

<style scoped>
.no-rezise {
    resize: none;
}
</style>
