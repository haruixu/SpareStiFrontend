<template>
    <ModalComponent :is-modal-open="isModalOpen" @close="isModalOpen = false">
        <template v-slot:input>
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
                    v-if="currentSpeech"
                    :class="`mb-40 inline-block relative w-64 bg-white p-4 rounded-3xl border border-gray-600 tri-right round ${bubbleDirection}`"
                >
                    <div class="text-left leading-6">
                        <p class="speech m-0">{{ currentSpeech }}</p>
                    </div>
                </div>
            </div>
            <div class="-mb-5 mt-8 text-xs text-gray-500">
                <p class="justify-center items-center">Trykk for å se hva Spare har å si!</p>
                <a
                    @click="clearSpeeches"
                    class="underline hover:bg-transparent font-normal text-gray-500 cursor-pointer transition-none hover:transition-none hover:p-0"
                >
                    Skip
                </a>
            </div>
        </template>
    </ModalComponent>
</template>

<script setup lang="ts">
import {computed, defineProps,ref, watch} from 'vue'
import spareImageSrc from '@/assets/spare.png'
import ModalComponent from '@/components/ModalComponent.vue'

interface Props {
  speech: string[] | null;
  direction: 'left' | 'right';
  pngSize: number;
  isModalOpen: boolean;
}

const props = defineProps<Props>();

const speech = ref<string[]>(props.speech || []);
const isModalOpen = ref(props.isModalOpen);

// Watch the speech prop for changes
watch(() => props.speech, (newVal) => {
  if (newVal) {  // Check if the new value is not null
    speech.value = newVal;  // Update the reactive speech array
    currentSpeechIndex.value = 0;  // Reset the speech index
    isModalOpen.value = true;  // Open the modal if new speech is available
  } else {
    speech.value = [];  // Clear the speech array if null is received
    isModalOpen.value = false;  // Close the modal if there's no speech
  }
});

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
            // Close the modal if there are no speeches left
            modalClosed()
        }
    }
}

const imageClass = computed(() => {
    return [
        'transform',
        props.direction === 'right' ? 'scale-x-[-1]' : '' // Flip image if right
    ]
})

const bubbleDirection = computed(() => {
    return props.direction === 'right' ? 'btm-left-in' : 'btm-right-in'
})

const clearSpeeches = () => {
    currentSpeechIndex.value = -1
    modalClosed()
}

const modalClosed = () => {
    isModalOpen.value = false
}

watch(() => props.isModalOpen, (newVal) => {
    isModalOpen.value = newVal;
});

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
