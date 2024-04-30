<template>
    <div
        v-if="generatedChallenges.length > 0"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
        <div class="relative bg-white pt-10 p-4 rounded-lg shadow-xl" style="width: 40rem">
            <button @click="closeModal" class="absolute top-0 right-0 m-2 text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div class="text-center font-bold text-3xl mb-4 mt-2">
                Personlig tilpassede spareutfordringer:
            </div>
            <div class="grid grid-cols-7 sm:grid-cols-11 gap-2 p-3 pb-1 border-b-2">
                <span class="font-bold col-span-2 md:col-span-3 sm:text-lg pt-1 mb-0">Tittel</span>
                <span class="font-bold col-span-2 md:col-span-2 sm:text-lg pt-1 mb-0">Målsum</span>
                <span class="font-bold col-span-2 md:col-span-1 sm:text-lg pt-1 pr-1 md:pr-3 mb-0"
                    >Frist</span
                >
                <span class="col-span-2"></span>
            </div>
            <div class="space-y-2">
                <div
                    v-for="(challenge, index) in generatedChallenges"
                    :key="challenge.id"
                    :class="{ 'bg-gray-100': index % 2 === 0 }"
                    class="grid grid-cols-7 md:grid-cols-7 sm:grid-cols-2 lg:grid-cols-7 gap-4 items-center border p-3 rounded mt-[-8px]"
                >
                    <span class="break-words col-span-2 md:col-span-1 lg:col-span-2 text-lg">{{
                        challenge.title
                    }}</span>
                    <span class="col-span-2 md:col-span-2 lg:col-span-1 text-lg">{{
                        challenge.target
                    }}</span>
                    <span class="col-span-2 md:col-span-1 lg:col-span-2 text-lg">{{
                        challenge.due
                    }}</span>
                    <div
                        class="col-span-7 sm:col-start-3 sm:col-span-2 md:col-span-2 lg:col-span-2 flex items-center justify-end space-x-2"
                    >
                        <button
                            @click="declineChallenge(challenge.id)"
                            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 mt-[-14px] sm:mt-0"
                        >
                            Skip
                        </button>
                        <button
                            @click="acceptChallenge(challenge)"
                            class="text-white font-bold py-1 px-4 mt-[-14px] sm:mt-0">
                            Godta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import authInterceptor from '@/services/authInterceptor'

const generatedChallenges = ref([])


const fetchGeneratedChallenges = async () => {
    try {
        const response = await authInterceptor.get('/challenges/generate');
        if (response.status === 200 && response.data.length > 0) {
            generatedChallenges.value = response.data.map(challenge => ({
                ...challenge,
                due: new Date(challenge.due).toISOString().split('T')[0],
                dueFull: challenge.due
            }));
            console.log('Generated challenges:', generatedChallenges.value);
        } else {
            console.log('No challenges found for the user.');
            generatedChallenges.value = [];
        }
    } catch (error) {
        console.error('Error fetching challenges:', error);
        generatedChallenges.value = [];
    }
}

onMounted(fetchGeneratedChallenges)

function acceptChallenge(challenge) {
    if (!challenge) {
        console.error('No challenge data provided to acceptChallenge function.');
        return;
    }

    console.log('Accepting challenge:', challenge);

    const postData = {
        title: challenge.title,
        saved: 0,
        target: challenge.target,
        perPurchase: challenge.perPurchase,
        description: challenge.description,
        due: challenge.dueFull,
        type: challenge.type
    };

    console.log('Posting data:', postData);

    authInterceptor.post('/challenges', postData)
        .then(response => {
            console.log('Challenge accepted and saved:', response.data);
            removeChallenge(challenge.id);
        })
        .catch(error => {
            console.error('Failed to save challenge:', error);
            if (error.response && error.response.data) {
                console.error('Error details:', error.response.data);
            }
        });
}

function declineChallenge(id) {
    removeChallenge(id);
}

const removeChallenge = (id) => {
    const index = generatedChallenges.value.findIndex(c => c.id === id);
    if (index !== -1) {
        generatedChallenges.value.splice(index, 1);
        generatedChallenges.value = [...generatedChallenges.value];
    }
    if (generatedChallenges.value.length === 0) {
        closeModal();
    }
}

const closeModal = () => {
    generatedChallenges.value = [];
}
</script>

