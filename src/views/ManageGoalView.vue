<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import type { Goal } from '@/types/goal'
import ProgressBar from '@/components/ProgressBar.vue'
import authInterceptor from '@/services/authInterceptor'
const uploadedFile: Ref<File | null> = ref(null);


const router = useRouter()

const selectedDate = ref<string>('')
const minDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16)

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

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        uploadedFile.value = target.files[0]; // Save the first selected file
    } else {
        uploadedFile.value = null;
    }
};


const isInputValid = computed(() => {
    return (
        goalInstance.value.title.length > 0 &&
        goalInstance.value.title.length <= 20 &&
        goalInstance.value.description.length <= 280 &&
        goalInstance.value.target > 0 &&
        goalInstance.value.due !== ''
    )
})

const submitAction = async () => {
    if (!isInputValid.value) {
        alert('Fyll ut alle feltene');
        return;
    }

    try {
        const response = await (isEdit.value ? updateGoal() : createGoal());

        const goalId = isEdit.value ? goalInstance.value.id : response.data.id;
        if (uploadedFile.value && goalId) {
            const formData = new FormData();
            formData.append('file', uploadedFile.value);
            formData.append('id', goalId.toString());

            await authInterceptor.post('/goals/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }

        await router.push({ name: 'goals' });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            console.error('En feil oppstod: ' + error.message);
        } else {
            console.error('En feil oppstod, og vi kunne ikke hente detaljer.');
        }
    }
};



const removeUploadedFile = () => {
    uploadedFile.value = null;
};


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

const createGoal = (): Promise<any> => {
    return authInterceptor.post('/goals', goalInstance.value)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
            throw new Error('Failed to create goal');
        });
};

const updateGoal = (): Promise<any> => {
    return authInterceptor.put(`/goals/${goalInstance.value.id}`, goalInstance.value)
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
            throw new Error('Failed to update goal');
        });
};

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

            <label for="fileUpload" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                Legg til bilde
            </label>
            <input id="fileUpload" type="file" accept=".jpg" hidden @change="handleFileChange" />
            <div v-if="uploadedFile" class="flex justify-center items-center mt-4">
                <p>{{ uploadedFile.name }}</p>
                <button @click="removeUploadedFile" class="ml-2">Remove</button>
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
