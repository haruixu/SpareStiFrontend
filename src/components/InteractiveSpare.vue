<template>
    <div
        class="flex items-center max-w-80 w-full"
        :class="{ 'flex-row': direction === 'right', 'flex-row-reverse': direction === 'left' }"
    >
        <!-- Image -->
        <img
            :src="spareImageSrc"
            :class="['w-' + pngSize, 'h-' + pngSize, imageClass]"
            alt="Sparemannen"
            @click="nextSpeech"
        />
        <!-- Speech Bubble -->
        <div
            v-if="currentSpeech"
            class="rounded-lg bg-white p-4 text-black border-black border-2 min-h-16 max-w-48"
        >
            <span>{{ currentSpeech }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import spareImageSrc from '@/assets/spare.png'

interface Props {
    speech?: string[] // Using TypeScript's type for speech as an array of strings
    direction: 'left' | 'right' // This restricts direction to either 'left' or 'right'
    pngSize: number // Just declaring the type directly since it's simple
}

const props = defineProps<Props>()

const speech = ref<String[]>(props.speech || [])

const currentSpeechIndex = ref(0)
const currentSpeech = computed(() => speech.value[currentSpeechIndex.value])

const nextSpeech = () => {
    if (speech.value.length > 0) {
        // Remove the currently displayed speech first
        speech.value.splice(currentSpeechIndex.value, 1)

        // Check if there are any speeches left after removal
        if (speech.value.length > 0) {
            // Move to the next speech or reset to the beginning if the current index is out of range
            currentSpeechIndex.value = currentSpeechIndex.value % speech.value.length
        } else {
            // If no speeches left, reset index to indicate no available speech
            currentSpeechIndex.value = -1
        }
    }
}

const imageClass = computed(() => {
    return [
        'transform',
        props.direction === 'right' ? 'scale-x-[-1]' : '' // Flip image if right
    ]
})
</script>
