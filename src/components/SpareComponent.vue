<template>
    <div>
        <!-- This image shows only if new speech is available -->
        <img
            v-if="false"
            alt="Varsel"
            class="jump w-1/12 h-1/12 ml-52 cursor-pointer z-10"
            src="@/assets/varsel.png"
        />

        <!-- This is the clickable image that will trigger the modal to open -->
        <div
            class="flex items-center"
            :class="{
                'flex-row scale-x-[-1]': imageDirection === 'right',
                'flex-row-reverse': imageDirection === 'left'
            }"
        >
            <a @click="handleSpareClick" class="hover:bg-transparent z-20">
                <img
                    alt="Spare"
                    class="md:h-5/6 md:w-5/6 w-2/3 h-2/3 cursor-pointer ml-14 md:ml-10"
                    src="@/assets/spare.png"
                />
            </a>
        </div>

        <!-- InteractiveSpare modal component -->
        <InteractiveSpare
            :isModalOpen="isModalOpen"
            :speech="speech"
            :png-size="pngSize"
            :direction="direction"
        ></InteractiveSpare>
    </div>
</template>

<script setup lang="ts">
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import { defineProps, ref } from 'vue'

const isModalOpen = ref(false)

defineProps(['speech', 'pngSize', 'direction', 'imageDirection'])

const emit = defineEmits(['openSpare'])

function handleSpareClick() {
    emit('openSpare')
    isModalOpen.value = true
}
</script>

<style>
@keyframes jump {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.jump {
    animation: jump 0.6s infinite ease-in-out;
}
</style>
