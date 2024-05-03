<template>
    <div
        class="spareDiv flex items-center mr-10 max-w-[60vh] cursor-pointer"
        :class="{
            'flex-row': direction === 'right',
            'flex-row-reverse': direction === 'left'
        }"
        @click="nextSpeech"
    >
        <!-- Image -->
        <img
            :src="spareImageSrc"
            :style="{ width: pngSize + 'rem', height: pngSize + 'rem' }"
            :class="['object-contain', ...imageClass]"
            alt="Spare"
            class="w-dynamic h-dynamic object-contain"
        />

        <!-- Speech Bubble -->
        <div
            :class="`mb-40 inline-block relative w-64 bg-white p-4 rounded-3xl border border-gray-600 tri-right round ${bubbleDirection}`"
        >
            <div class="text-left leading-6">
                <p class="speech m-0">{{ currentSpeech }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import spareImageSrc from '@/assets/spare.png'

interface Props {
    speech?: Array<string>
    direction: 'left' | 'right'
    pngSize: number
}

const props = defineProps<Props>()
const speech = ref<string[]>(props.speech || [])
const currentSpeechIndex = ref(0)
const currentSpeech = computed(() => speech.value[currentSpeechIndex.value])

const emit = defineEmits(['emit:close'])

// Next speech bubble
const nextSpeech = () => {
    if (currentSpeechIndex.value < speech.value.length - 1) {
        currentSpeechIndex.value++
    } else {
        emit('emit:close')
    }
}

// Image class
const imageClass = computed(() => {
    return [
        'transform',
        props.direction === 'right' ? 'scale-x-[-1]' : '' // Flip image if right
    ]
})

// Speech bubble direction
const bubbleDirection = computed(() => {
    return props.direction === 'right' ? 'btm-left-in' : 'btm-right-in'
})
</script>
<style scoped>
/* CSS talk bubble */

.border {
    border: 0.1rem solid black;
}
.round {
    border-radius: 1.875rem;
    -webkit-border-radius: 1.875rem;
    -moz-border-radius: 1.875rem;
}

/*Right triangle, placed bottom left side slightly in*/
.tri-right.border.btm-left-in:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: 2.3rem;
    right: auto;
    top: auto;
    bottom: -1.5rem;
    border: 0.7rem solid;
    border-color: black transparent transparent black;
}
.tri-right.btm-left-in:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: 2.375rem;
    right: auto;
    top: auto;
    bottom: -1.25rem;
    border: 0.75rem solid;
    border-color: white transparent transparent white;
}

/*Right triangle, placed bottom right side slightly in*/
.tri-right.border.btm-right-in:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: auto;
    right: 2.3rem;
    top: auto;
    bottom: -1.5rem;
    border: 0.7rem solid;
    border-color: black black transparent transparent;
}
.tri-right.btm-right-in:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: auto;
    right: 2.375rem;
    bottom: -1.25rem;
    border: 0.75rem solid;
    border-color: white white transparent transparent;
}
</style>
