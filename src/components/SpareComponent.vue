<template>
    <div>
        <!-- This is the clickable image that will trigger the modal to open -->
        <div
            class="flex items-center"
            :class="{
                'flex-row scale-x-[-1]': imageDirection === 'right',
                'flex-row-reverse': imageDirection === 'left'
            }"
        >
            <a
                @click="isModalOpen = true"
                class="hover:bg-transparent hover:p-0 hover:scale-105 z-20 flex justify-center"
            >
                <img
                    v-if="profilePicture && isMounted"
                    alt="Spare"
                    class="md:h-5/6 md:w-5/6 w-2/3 h-2/3 cursor-pointer ml-14 md:ml-10"
                    :src="profilePicture"
                />
                <img
                    v-else
                    alt="Spare"
                    class="md:h-5/6 md:w-5/6 w-2/3 h-2/3 cursor-pointer"
                    src="@/assets/spare.png"
                />
            </a>
        </div>

        <!-- InteractiveSpare modal component -->
        <ModalComponent v-if="isModalOpen" @close="isModalOpen = false">
            <InteractiveSpare
                :speech="speech"
                :png-size="12"
                direction="right"
                @emit:close="isModalOpen = false"
            />

            <div class="-mb-5 mt-8 text-xs text-gray-500">
                <p class="justify-center items-center">Trykk for å se hva Spare har å si!</p>
                <a
                    @click="isModalOpen = false"
                    class="underline hover:bg-transparent font-normal text-gray-500 cursor-pointer transition-none hover:transition-none hover:p-0"
                >
                    Skip
                </a>
            </div>
        </ModalComponent>
    </div>
</template>

<script setup lang="ts">
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import { defineProps, onMounted, ref, watchEffect } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const isModalOpen = ref(false)
const profilePicture = ref<string>()
const isMounted = ref(false)

const props = defineProps({
    speech: Array<string>,
    pngSize: Number,
    direction: String,
    imageDirection: String,
    show: {
        type: Boolean,
        default: false,
        required: false
    }
})
watchEffect(() => {
    isModalOpen.value = props.show
})

onMounted(async () => {
    await userStore.getProfilePicture()
    profilePicture.value = userStore.profilePicture
    isMounted.value = true
})
</script>
