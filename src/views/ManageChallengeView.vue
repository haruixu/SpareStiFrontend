<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'
import ModalComponent from '@/components/ModalComponent.vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'

const router = useRouter()
const uploadedFile = ref<File | null>(null)

const modalTitle = ref('')
const modalMessage = ref('')
const confirmModalOpen = ref(false)
const errorModalOpen = ref(false)

// Set the minimum date to one week from now
const oneWeekFromNow = new Date()
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
const minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10)
const selectedDate = ref<string>(minDate)

// Set the maximum date to thirty days from now
const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
const maxDate = thirtyDaysFromNow.toISOString().slice(0, 10)

// Create a new challenge instance
const challengeInstance = ref<Challenge>({
    title: '',
    perPurchase: 0,
    saved: 0,
    target: 0,
    description: '',
    due: ''
})

// Watch for changes in the selected date
watch(selectedDate, (newDate) => {
    challengeInstance.value.due = newDate
})

// Computed properties
const isEdit = computed(() => router.currentRoute.value.name === 'edit-challenge')
const pageTitle = computed(() => (isEdit.value ? 'Rediger utfordring🎨' : 'Ny utfordring🎨'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(
    () => (challengeInstance.value.saved / challengeInstance.value.target) * 100
)

// Function to validate the inputs
function validateInputs() {
    const errors = []

    challengeInstance.value.due = selectedDate.value + 'T23:59:59.999Z'
    challengeInstance.value.saved = parseInt(challengeInstance.value.saved.toString())
    challengeInstance.value.target = parseInt(challengeInstance.value.target.toString())

    if (!challengeInstance.value.title || challengeInstance.value.title.length > 20) {
        errors.push('Tittelen må være mellom 1 og 20 tegn.')
    }
    if (challengeInstance.value.description.length > 280) {
        errors.push('Beskrivelsen må være under 280 tegn.')
    }
    if (challengeInstance.value.target <= 0) {
        errors.push('Målbeløpet må være større enn 0.')
    }
    if (new Date(challengeInstance.value.due) < new Date(minDate)) {
        errors.push('Forfallsdatoen må være minst en uke frem i tid.')
    }
    if (challengeInstance.value.perPurchase <= 0) {
        errors.push('Pris per sparing må være større enn 0.')
    }
    return errors
}

// Function to handle file change
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        uploadedFile.value = target.files[0]
    } else {
        uploadedFile.value = null
    }
}

// Function to submit
const submitAction = async () => {
    const errors = validateInputs()

    // If there are errors, show them in a modal
    if (errors.length > 0) {
        const formatErrors = errors.join('\n')
        modalTitle.value = 'Oops! Noe er feil med det du har fylt ut🚨'
        modalMessage.value = formatErrors
        errorModalOpen.value = true
        return
    }
    try {
        let response
        if (isEdit.value) {
            response = await updateChallenge()
        } else {
            response = await createChallenge()
        }

        const challengeId = isEdit.value ? challengeInstance.value.id : response.id

        if (uploadedFile.value && challengeId) {
            const formData = new FormData()
            formData.append('file', uploadedFile.value)
            formData.append('id', challengeId.toString())

            await authInterceptor.post('/challenges/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }

        await router.push({ name: 'challenges' })
    } catch (error) {
        modalTitle.value = 'Systemfeil'
        modalMessage.value = 'En feil oppstod under lagring av utfordringen.'
        errorModalOpen.value = true
    }
}

// Function to fetch the challenge if it is an edit
onMounted(async () => {
    if (isEdit.value) {
        const challengeId = router.currentRoute.value.params.id
        if (!challengeId) return router.push({ name: 'challenges' })

        await authInterceptor(`/challenges/${challengeId}`)
            .then((response) => {
                if (response.data.completedOn) {
                    router.push({ name: 'challenges' })
                }

                challengeInstance.value = response.data
                selectedDate.value = response.data.due.slice(0, 10)
            })
            .catch((error) => {
                console.error(error)
                router.push({ name: 'challenges' })
            })
    }
})

// Function to create a challenge
const createChallenge = async () => {
    const response = await authInterceptor.post('/challenges', challengeInstance.value)
    return response.data
}

// Function to update a challenge
const updateChallenge = async () => {
    const response = await authInterceptor.put(
        `/challenges/${challengeInstance.value.id}`,
        challengeInstance.value
    )
    return response.data
}

// Function to cancel the creation
const cancelCreation = () => {
    if (
        challengeInstance.value.title !== '' ||
        challengeInstance.value.description !== '' ||
        challengeInstance.value.perPurchase !== 0 ||
        challengeInstance.value.saved !== 0 ||
        challengeInstance.value.target !== 0
    ) {
        modalTitle.value = 'Du er i ferd med å avbryte redigeringen🚨'
        modalMessage.value = 'Er du sikker på at du vil avbryte?'
        confirmModalOpen.value = true
    } else {
        router.push({ name: 'challenges' })
    }
}

// Function to confirm the cancel and open the modal
const confirmCancel = () => {
    router.push({ name: 'challenges' })
    confirmModalOpen.value = false
}

// Function to remove the uploaded file
const removeUploadedFile = () => {
    uploadedFile.value = null
}
</script>

<template>
    <div class="relative flex-1">
        <h1 class="font-bold flex justify-center items-center" v-text="pageTitle" />
        <div class="flex md:flex-row flex-col justify-center md:items-start items-center">
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
                    <p class="mx-4">Beskrivelse (valgfri)</p>
                    <textarea
                        v-model="challengeInstance.description"
                        class="w-80 h-20 no-rezise"
                        placeholder="Beskriv sparemålet"
                    />
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="flex flex-col">
                        <p class="mx-4">Spare per gang</p>
                        <input
                            v-model="challengeInstance.perPurchase"
                            class="w-40 text-right"
                            placeholder="Kr spart per sparing"
                            type="number"
                        />
                    </div>

                    <div class="flex flex-col">
                        <div class="flex flex-row justify-between mx-4">
                            <p>Kroner spart💸</p>
                        </div>
                        <input
                            v-model="challengeInstance.saved"
                            class="w-40 text-right"
                            placeholder="Sparebeløp"
                            type="number"
                        />
                    </div>

                    <div class="flex flex-col">
                        <p class="mx-4">Av målbeløp💯*</p>
                        <input
                            v-model="challengeInstance.target"
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
                            :max="maxDate"
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
                    <button class="primary danger" @click="cancelCreation" v-text="'Avbryt'" />

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
                                <button class="primary" @click="errorModalOpen = false">
                                    Lukk
                                </button>
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
                    <template v-slot:buttons>
                        <button class="primary" @click="confirmCancel">Bekreft</button>
                        <button class="primary danger" @click="confirmModalOpen = false">
                            Avbryt
                        </button>
                    </template>
                </ModalComponent>
            </div>
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
