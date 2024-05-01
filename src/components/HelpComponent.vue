<template>
    <div class="fixed bottom-5 left-5">
        <div @click="handleHelpClick" class="hover:cursor-pointer">
            <img
                 alt="Hjelp"
                 class="w-1/12 transition-transform duration-300 ease-in-out hover:scale-110"
                 src="@/assets/hjelp.png"
            />
        </div>
    </div>
    <InteractiveSpare
        :speech="speech"
        :direction="'right'"
        :pngSize="15"
        :isModalOpen="isModalOpen"
        class="opacity-0 h-0 w-0 md:opacity-100 md:h-auto md:w-auto"
    ></InteractiveSpare>
</template>

<script setup lang="ts">
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import { ref } from 'vue'

const isModalOpen = ref(false)

defineProps(['speech'])

const emit = defineEmits(['openHelp'])

function handleHelpClick() {
    emit('openHelp')
    isModalOpen.value = true
}
</script>
