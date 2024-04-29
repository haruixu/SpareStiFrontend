<template>
    <div v-if="challenges.length > 0" class="fixed inset-0 bg-gray-300 bg-opacity-75 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg shadow-xl" style="width: 30rem;">
            <div class="text-center font-bold text-lg mb-4">Spareutfordring:</div>
            <div class="space-y-2">
                <!-- List of challenges -->
                <div v-for="challenge in challenges" :key="challenge.id" class="flex justify-between items-center border p-3 rounded">
                    <span>{{ challenge.text }}</span>
                    <div>
                        <button
                            @click="declineChallenge(challenge.id)"
                            class="w-full max-w-xs max-h-10 font-bold py-2 rounded-full flex items-center justify-center bg-gray-500 hover:bg-gray-700 text-white transition duration-300 ease-in-out text-sm"
                        >
                            Skip
                        </button>
                        <button
                            @click="acceptChallenge(challenge.id)"
                            class="w-full max-w-xs max-h-10 font-bold py-2 rounded-full flex items-center justify-center bg-green-500 hover:bg-green-700 text-white transition duration-300 ease-in-out text-sm ml-2"
                        >
                            Godta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample challenges
const challenges = ref([
    { id: 1, text: 'Challenge 1' },
    { id: 2, text: 'Challenge 2' },
    { id: 3, text: 'Challenge 3' },
]);

const removeChallenge = (id) => {
    const index = challenges.value.findIndex(challenge => challenge.id === id);
    if (index !== -1) {
        challenges.value.splice(index, 1);
    }
}

function acceptChallenge(id) {
    console.log('Accepted challenge:', id);
    removeChallenge(id);
}

function declineChallenge(id) {
    console.log('Declined challenge:', id);
    removeChallenge(id);
}
</script>
