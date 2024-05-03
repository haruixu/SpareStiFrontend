<template>
    <button @click="openModal" class="primary text-nowrap">Endre avatar</button>
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
            <div class="flex flex-row items-center gap-4 mx-auto">
                <button @click="saveAvatar" class="primary save-button basis-1/2">Lagre</button>
                <button @click="openFileExplorer" class="primary basis-1/2">
                    Upload New Avatar
                </button>
            </div>
            <input type="file" ref="fileInput" @change="handleFileUpload" hidden />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
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
    console.log(state.avatars)
    console.log(img)
    if (state.avatars.includes(state.selectedPublicImg) || state.avatars.includes(img)) {
        // Remove the public asset from the list if it's already selected
        state.avatars = state.avatars.filter((avatar) => avatar !== state.selectedPublicImg)
        console.log(state.avatars, 'state.avatars')
    }
    // Clear
    console.log(state.avatars)
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

const cycleArray = (direction: string) => {
    if (direction === 'prev') {
        state.currentAvatarIndex =
            (state.currentAvatarIndex - 1 + state.avatars.length) % state.avatars.length
    } else {
        state.currentAvatarIndex = (state.currentAvatarIndex + 1) % state.avatars.length
    }
}

const handleFileUpload = async (event: any) => {
    const input = event.target
    if (input.files && input.files[0]) {
        const file = input.files[0]
        // Clear any existing temporary blob URLs
        state.avatars = state.avatars.filter((avatar) => !avatar.startsWith('blob:'))
        state.newFile = file // Save the new file object for later upload
        state.avatars.push(URL.createObjectURL(file)) // Add the blob URL for preview
        state.currentAvatarIndex = state.avatars.length - 1 // Set this new avatar as current
    }
}

const saveAvatar = async () => {
    if (state.newFile && currentAvatar.value.startsWith('blob:')) {
        // If there's a new file selected, upload it
        const formData = new FormData()
        formData.append('file', state.newFile)
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
const nextAvatar = computed(
    () => state.avatars[(state.currentAvatarIndex + 1) % state.avatars.length]
)
const previousAvatar = computed(
    () =>
        state.avatars[(state.currentAvatarIndex - 1 + state.avatars.length) % state.avatars.length]
)
</script>
