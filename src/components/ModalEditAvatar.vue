<template>
    <button @click="openModal" class="primary text-nowrap" data-cy="edit-avatar">
        Endre avatar
    </button>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-[80vh] h-auto w-full text-center">
            <div class="flex flex-row justify-end">
                <button @click="closeModal" class="primary">X</button>
            </div>
            <h2 class="title">Endre avatar</h2>
            <div class="avatar-container flex flex-row justify-between gap-2 items-center my-8">
                <button @click="cycleArray('prev')">◀</button>
                <div class="flex flex-row items-center justify-around">
                    <img :src="previousAvatar" alt="avatar" class="avatar h-16 w-16" />
                    <img
                        :src="currentAvatar"
                        alt="avatar"
                        class="avatar block mx-auto h-32 w-32 rounded-full border-green-600 border-2 sm:mx-0 sm:shrink-0"
                    />
                    <img :src="nextAvatar" alt="avatar" class="avatar h-16 w-16" />
                </div>
                <button @click="cycleArray('next')">▶</button>
            </div>
            <div class="flex flex-row items-center justify-center mx-auto">
                <button @click="saveAvatar" class="primary save-button" data-cy="save-avatar">
                    Lagre
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const state = reactive({
    avatars: [
        '/avatar1.png',
        '/avatar2.png',
        '/avatar3.png',
        '/avatar4.png',
        '/avatar5.png',
        '/avatar6.png',
        '/avatar7.png',
        '/avatar8.png',
        '/avatar9.png'
    ],
    currentAvatarIndex: 0,
    newFile: null, // To hold the new file object
    selectedPublicImg: '' // Track blob URLs created for uploaded files
})

const isModalOpen = ref(false)
const fileInput = ref<HTMLElement | null>(null)

const emit = defineEmits(['update-profile-picture'])

// Open the modal and fetch the profile picture
const openModal = () => {
    state.avatars = [
        '/avatar1.png',
        '/avatar2.png',
        '/avatar3.png',
        '/avatar4.png',
        '/avatar5.png',
        '/avatar6.png',
        '/avatar7.png',
        '/avatar8.png',
        '/avatar9.png'
    ]
    userStore.getProfilePicture()
    const urlProfilePicture = userStore.profilePicture
    // Check if a profile picture URL exists and append it to the avatars list
    const img = localStorage.getItem('profilePicture') as string

    if (state.avatars.includes(state.selectedPublicImg) || state.avatars.includes(img)) {
        // Remove the public asset from the list if it's already selected
        state.avatars = state.avatars.filter((avatar) => avatar !== state.selectedPublicImg)
    }
    // Clear
    localStorage.removeItem('profilePicture')
    state.selectedPublicImg = ''

    if (urlProfilePicture) {
        state.avatars.push(urlProfilePicture)
        state.currentAvatarIndex = state.avatars.length - 1 // Set the current avatar to the profile picture
    }
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    //Remove the uploaded file if there is one.
    state.avatars = []

    state.newFile = null // Clear the new file reference
}

// Cycle through the avatars
const cycleArray = (direction: string) => {
    if (direction === 'prev') {
        state.currentAvatarIndex =
            (state.currentAvatarIndex - 1 + state.avatars.length) % state.avatars.length
    } else {
        state.currentAvatarIndex = (state.currentAvatarIndex + 1) % state.avatars.length
    }
}

// Save the selected avatar
const saveAvatar = async () => {
    if (currentAvatar.value.startsWith('blob:')) {
        // If there's a new file selected, upload it
        const formData = new FormData()
        formData.append('file', currentAvatar.value)
        await userStore.uploadProfilePicture(formData)
    } else if (currentAvatar.value.startsWith('/')) {
        // If it's a public asset, fetch it as a blob and upload
        state.selectedPublicImg = currentAvatar.value
        const response = await fetch(currentAvatar.value)
        const blob = await response.blob()
        const file = new File([blob], 'public-avatar.png', { type: blob.type })
        const formData = new FormData()
        formData.append('file', file)
        await userStore.uploadProfilePicture(formData)
        localStorage.setItem('profilePicture', currentAvatar.value)
    }
    closeModal()
    emit('update-profile-picture', currentAvatar.value)
}

const openFileExplorer = () => {
    fileInput.value?.click()
}

const currentAvatar = computed(() => state.avatars[state.currentAvatarIndex])
// Get the next and previous avatars
const nextAvatar = computed(
    () => state.avatars[(state.currentAvatarIndex + 1) % state.avatars.length]
)
const previousAvatar = computed(
    () =>
        state.avatars[(state.currentAvatarIndex - 1 + state.avatars.length) % state.avatars.length]
)
</script>
