<template>
  <div
      class="flex items-center mr-10 max-w-[60vh]"
      :class="{ 'flex-row': direction === 'right', 'flex-row-reverse': direction === 'left' }"
  >
    <!-- Image -->
    <img
        :src="spareImageSrc"
        :style="{ width: pngSize + 'rem', height: pngSize + 'rem' }"
        :class="['object-contain', ...imageClass]"
        alt="Sparemannen"
        class="w-dynamic h-dynamic object-contain"
        @click="nextSpeech"
    />

    <!-- Speech Bubble -->
    <div v-if="currentSpeech" :class="`mb-40 inline-block relative w-64 bg-white p-4 rounded-3xl border border-gray-600 tri-right round ${bubbleDirection}`">
      <div class="text-left leading-6">
        <p class="m-0">{{currentSpeech}}</p>
      </div>
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

const bubbleDirection = computed(() => {
    return props.direction === 'right' ? 'btm-left-in' : 'btm-right-in'
})
</script>
<style scoped>
/* CSS talk bubble */

.border{
  border: 0.375rem solid black;
}
.round{
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
  left: 1.875rem;
  right: auto;
  top: auto;
  bottom: -2.5rem;
  border: 1.25rem solid;
  border-color: black transparent transparent black;
}
.tri-right.btm-left-in:after{
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
  right: 1.875rem;
  bottom: -2.5rem;
  border: 1.25rem solid;
  border-color: black black transparent transparent;
}
.tri-right.btm-right-in:after{
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
