<template>
    <button @click="openModal" class="text-nowrap">Endre avatar</button>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-[80vh] h-auto w-full text-center">
            <h2 class="title">Endre avatar</h2>
            <div class="avatar-container flex flex-row justify-between items-center my-8">
                <button @click="cycleArray('prev')">◀</button>
                <div class="flex flex-row items-center justify-around">
                    <img :src="previousAvatar" alt="avatar" class="avatar h-16 w-16" />
                    <div class="border-4 rounded-full border-green-600 p-8 mx-4">
                        <img :src="currentAvatar" alt="avatar" class="avatar h-40 w-40" />
                    </div>
                    <img :src="nextAvatar" alt="avatar" class="avatar h-16 w-16" />
                </div>
                <button @click="cycleArray('next')">▶</button>
            </div>
            <button @click="saveAvatar" class="save-button">Lagre</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isModalOpen = ref(false)
const avatars = [
    'src/assets/coffee.png',
    'src/assets/head.png',
    'src/assets/nose.png',
    'src/assets/penger.png',
    'src/assets/pig.png'
]
let currentAvatarIndex = 0

const openModal = () => {
    isModalOpen.value = !isModalOpen.value
}

const nextAvatar = ref(avatars[(currentAvatarIndex + 1) % avatars.length])
const currentAvatar = ref(avatars[currentAvatarIndex])
const previousAvatar = ref(avatars[(currentAvatarIndex - 1 + avatars.length) % avatars.length])

const cycleArray = (direction: string) => {
    if (direction === 'prev') {
        currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length
        console.log(currentAvatarIndex)
        currentAvatar.value = avatars[currentAvatarIndex]
        previousAvatar.value = avatars[(currentAvatarIndex - 1 + avatars.length) % avatars.length]
        nextAvatar.value = avatars[(currentAvatarIndex + 1) % avatars.length]
    } else {
        currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length
        currentAvatar.value = avatars[currentAvatarIndex]
        previousAvatar.value = avatars[(currentAvatarIndex - 1 + avatars.length) % avatars.length]
        nextAvatar.value = avatars[(currentAvatarIndex + 1) % avatars.length]
    }
}

const saveAvatar = () => {
    localStorage.setItem('avatar', currentAvatar.value)
    isModalOpen.value = false
}
</script>
