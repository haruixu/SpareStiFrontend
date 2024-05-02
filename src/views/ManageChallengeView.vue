<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
import type { Challenge } from '@/types/challenge'
import ModalComponent from '@/components/ModalComponent.vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'

const router = useRouter()

const modalTitle = ref('')
const modalMessage = ref('')
const confirmModalOpen = ref(false)
const errorModalOpen = ref(false)

const oneWeekFromNow = new Date()
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
const minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10)
const selectedDate = ref<string>(minDate)

const thirtyDaysFromNow = new Date()
thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
const maxDate = thirtyDaysFromNow.toISOString().slice(0, 10)

const challengeInstance = ref<Challenge>({
    title: '',
    perPurchase: 0,
    saved: 0,
    target: 0,
    description: '',
    due: ''
})

watch(selectedDate, (newDate) => {
    challengeInstance.value.due = newDate
})

const isEdit = computed(() => router.currentRoute.value.name === 'edit-challenge')
const pageTitle = computed(() => (isEdit.value ? 'Rediger utfordring🎨' : 'Ny utfordring🎨'))
const submitButton = computed(() => (isEdit.value ? 'Oppdater' : 'Opprett'))
const completion = computed(
    () => (challengeInstance.value.saved / challengeInstance.value.target) * 100
)

function validateInputs() {
    const errors = []

    challengeInstance.value.due = selectedDate.value + 'T23:59:59.999Z'

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

const submitAction = async () => {
    const errors = validateInputs()
    if (errors.length > 0) {
        const formatErrors = errors.join('\n')
        modalTitle.value = 'Oops! Noe er feil med det du har fylt ut🚨'
        modalMessage.value = formatErrors
        errorModalOpen.value = true
        return
    }
    try {
        if (isEdit.value) {
            updateChallenge()
        } else {
            createChallenge()
        }
    } catch (error) {
        console.error(error)
        modalTitle.value = 'Systemfeil'
        modalMessage.value = 'En feil oppstod under lagring av utfordringen.'
        errorModalOpen.value = true
    }
}

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
        .post('/challenges', challengeInstance.value, {})
        .then(() => {
            return router.push({ name: 'challenges' })
        })
        .catch((error) => {
            console.error(error)
        })
}

const updateChallenge = () => {
    authInterceptor
        .put(`/challenges/${challengeInstance.value.id}`, challengeInstance.value)
        .then(() => {
            router.push({ name: 'challenges' })
        })
        .catch((error) => {
            console.error(error)
        })
}

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

const confirmCancel = () => {
    router.push({ name: 'challenges' })
    confirmModalOpen.value = false
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
        <div
            class="lg:absolute right-5 lg:top-1/3 max-lg:bottom-0 max-lg:mt-44 transform -translate-y-1/2 lg:w-1/4 lg:max-w-xs"
        >
            <InteractiveSpare
                :png-size="10"
                :speech="[
                        'Her kan du lage en spareutfordring! 🎢',
                        `Trenger du hjelp? Trykk på ❓ nede i høyre hjørne!`
                    ]"
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
