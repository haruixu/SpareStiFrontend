<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import type { Goal } from '@/types/goal'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import ModalComponent from '@/components/ModalComponent.vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'

const router = useRouter()
const uploadedFile: Ref<File | null> = ref(null)

const minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10)
const selectedDate = ref<string>(minDate)

const modalMessage = ref<string>('')
const modalTitle = ref<string>('')
const errorModalOpen = ref<boolean>(false)
const confirmModalOpen = ref<boolean>(false)

// Goal instance
const goalInstance = ref<Goal>({
    title: '',
    saved: 0,
    target: 0,
    description: '',
    due: ''
})

// Watch for changes in the selected date
watch(selectedDate, (newDate) => {
    goalInstance.value.due = newDate
})

// Computed properties
const isEdit = computed(() => router.currentRoute.value.name === 'edit-goal')
const pageTitle = computed(() => (isEdit.value ? 'Rediger sparemål🎨' : 'Nytt sparemål🎨'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(() => (goalInstance.value.saved / goalInstance.value.target) * 100)

// Function to validate the inputs
function validateInputs() {
    const errors = []

    goalInstance.value.due = selectedDate.value + 'T23:59:59.999Z'
    goalInstance.value.saved = parseInt(goalInstance.value.saved.toString())
    goalInstance.value.target = parseInt(goalInstance.value.target.toString())

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

// Function to submit the goal
const submitAction = async () => {
    const errors = validateInputs()

  // Handle the errors
    if (errors.length > 0) {
        const formatErrors = errors.join('<br>')
        modalTitle.value = 'Oops! Noe er feil med det du har fylt ut🚨'
        modalMessage.value = formatErrors
        errorModalOpen.value = true
        return
    }

    try {
        let response

        if (isEdit.value) {
            response = await updateGoal()
        } else {
            response = await createGoal()
        }

        const goalId = isEdit.value ? goalInstance.value.id : response.id // Adjusted to handle the returned data

        if (uploadedFile.value && goalId) {
            const formData = new FormData()
            formData.append('file', uploadedFile.value)
            formData.append('id', goalId.toString())

            await authInterceptor.post('/goals/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }

        await router.push({ name: 'goals' })
    } catch (error) {
        console.error('Error during goal submission:', error)
        modalTitle.value = 'Systemfeil'
        modalMessage.value = 'En feil oppstod under lagring av utfordringen.'
        errorModalOpen.value = true
    }
}

// Fetch the goal on mounted
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

// Function to create a goal
const createGoal = async (): Promise<any> => {
    try {
        const response = await authInterceptor.post('/goals', goalInstance.value)
        return response.data // Ensure the response data is returned
    } catch (error) {
        console.error('Failed to create goal:', error)
        throw error // Rethrow the error to handle it in the submitAction method
    }
}

// Function to update a goal
const updateGoal = async (): Promise<any> => {
    try {
        const response = await authInterceptor.put(
            `/goals/${goalInstance.value.id}`,
            goalInstance.value
        )
        return response.data // Ensure the response data is returned
    } catch (error) {
        console.error('Failed to update goal:', error)
        throw error // Rethrow the error to handle it in the submitAction method
    }
}

// Function to delete a goal
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

// Function to cancel the creation
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

// Function to confirm the cancel
const confirmCancel = () => {
    router.push({ name: 'goals' })
    confirmModalOpen.value = false
}

// Function to handle file change
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        uploadedFile.value = target.files[0] // Save the first selected file
    } else {
        uploadedFile.value = null
    }
}

// Function to remove the uploaded file
const removeUploadedFile = () => {
    uploadedFile.value = null
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
                <div class="flex flex-col items-center">
                    <p>Last opp ikon for utfordringen📸</p>
                    <label
                        for="fileUpload"
                        class="bg-white text-black text-lg cursor-pointer leading-none rounded-full border p-3 border-black"
                    >
                        Legg til 💾
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        accept=".jpg, .png"
                        hidden
                        @change="handleFileChange"
                    />
                    <div v-if="uploadedFile" class="flex justify-center items-center mt-2">
                        <p class="text-sm">{{ uploadedFile.name }}</p>
                        <button
                            @click="removeUploadedFile"
                            class="ml-2 text-xs font-bold border-2 p-1 rounded text-red-500"
                        >
                            Fjern fil
                        </button>
                    </div>
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
                <template v-slot:buttons>
                    <button class="primary" @click="errorModalOpen = false">Lukk</button>
                </template>
            </ModalComponent>

            <ModalComponent
                :title="modalTitle"
                :message="modalMessage"
                :isModalOpen="confirmModalOpen"
                @close="confirmModalOpen = false"
            >
                <template v-slot:buttons>
                    <button class="primary" @click="confirmCancel">Bekreft</button>
                    <button class="primary danger" @click="confirmModalOpen = false">Avbryt</button>
                </template>
            </ModalComponent>
        </div>
        <div
            class="lg:absolute right-5 lg:top-1/3 max-lg:bottom-0 max-lg:mt-44 transform -translate-y-1/2 lg:w-1/4 lg:max-w-xs"
        >
            <InteractiveSpare
                :png-size="10"
                :speech="[`Trenger du hjelp? Trykk på ❓ nede i høyre hjørne!`]"
                direction="left"
            />
        </div>
    </div>
</template>

<style scoped>
.no-rezise {
    resize: none;
}
</style>
