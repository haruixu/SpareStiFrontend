<template>
    <div v-if="generatedChallenges.length > 0" class="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center">
        <div class="relative bg-white pt-10 p-6 rounded-lg shadow-xl" style="width: 40rem;">
            <button @click="closeModal" class="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="text-center font-bold text-3xl mb-4 mt-2">Personlig tilpassede spareutfordringer:</div>
            <div class="grid grid-cols-3 gap-4 p-3  border-b-2">
                <span class="font-bold col-span-1">Tittel</span>
                <span class="font-bold col-span-1">Målsum</span>
                <span class="font-bold col-span-1">Frist</span>
            </div>
            <div class="space-y-2">
                <div v-for="(challenge, index) in generatedChallenges" :key="challenge.id" :class="{ 'bg-gray-100': index % 2 === 0 }" class="grid grid-cols-3 gap-4 items-center border p-3 rounded">
                    <span class="break-words font-bold col-span-1">{{ challenge.title }}</span>
                    <span class="font-bold col-span-1">{{ challenge.target }}</span>
                    <span class="font-bold col-span-1">{{ challenge.due }}</span>
                    <div class="flex items-center justify-end space-x-2 col-span-3">
                        <button @click="declineChallenge(challenge.id)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4">Skip</button>
                        <button @click="acceptChallenge(challenge.id)" class="text-white font-bold py-1 px-4">Godta</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import authInterceptor from '@/services/authInterceptor'
import { useChallengeStore } from '@/stores/challengeStore';

const generatedChallenges = ref([]);

const fetchGeneratedChallenges = async () => {
    try {
        const response = await authInterceptor.get('/challenges/active');
        if (response.status === 200 && response.data.content) {
            console.log('Active challenges:', response.data.content);
            generatedChallenges.value = response.data.content.map(challenge => ({
                id: challenge.id,
                title: challenge.title,
                target: challenge.target.toString(),
                due: challenge.due.substring(0, 10)
            }));
        } else {
            console.error('No challenges found for the user.');
            generatedChallenges.value = [];
        }
    } catch (error) {
        console.error('Error fetching challenges:', error);
        generatedChallenges.value = [];
    }
};


onMounted(() => {
    fetchGeneratedChallenges();
});

const removeChallenge = (id) => {
    const index = generatedChallenges.value.findIndex(challenge => challenge.id === id);
    if (index !== -1) {
        generatedChallenges.value.splice(index, 1);
        generatedChallenges.value = [...generatedChallenges.value]; // Force reactivity
    }
    if (generatedChallenges.value.length === 0) {
        closeModal();
    }
}

function acceptChallenge(id) {
    console.log('Accepted challenge:', id);
    const acceptedChallenge = generatedChallenges.value.find(challenge => challenge.id === id);
    if (acceptedChallenge) {
        useChallengeStore.editUserChallenge(acceptedChallenge);
        removeChallenge(id);
    }
}

const declineChallenge = async (id) => {
    try {
        const response = authInterceptor.delete(`/challenges/${id}`);
        if (response.status === 200) {
            console.log('Challenge declined and removed:', id);
            removeChallenge(id);
        } else {
            console.error('Failed to decline challenge:', response.data);
        }
    } catch (error) {
        console.error('Error declining challenge:', error);
    }
};

const closeModal = () => {
    generatedChallenges.value = [];
}
</script>
