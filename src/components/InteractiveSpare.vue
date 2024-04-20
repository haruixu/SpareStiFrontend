<template>
  <div class="flex items-center max-w-80 w-full" :class="{'flex-row': direction === 'right', 'flex-row-reverse': direction === 'left'}">
    <!-- Image -->
    <img :src="spareImageSrc" :class="['w-' + pngSize, 'h-' + pngSize, imageClass]" alt="Sparemannen" @click="nextSpeech">
    <!-- Speech Bubble -->
    <div class="rounded-lg bg-white p-4 text-black border-black border-2" :style="{ minHeight: '4rem' }">
      <span>{{ currentSpeech }}</span>
    </div>
  </div>
</template>






<script setup lang="ts">
import { ref, defineProps, computed} from 'vue'
import spareImageSrc from '@/assets/spare.png';

interface Props {
  speech?: Array<String>
  // direction string should be either 'left' or 'right'
  direction: {
    type: String,
    required: true
  }
  pngSize: {
    type: Number,
    default: 20,
  }
}

const props = defineProps<Props>();

const speech = ref<string[]>(props.speech || []);

const currentSpeechIndex = ref(0);
const currentSpeech = ref(props.speech[0] || '...');

const nextSpeech = () => {
  if (speech.value.length > 0) {
    currentSpeechIndex.value = (currentSpeechIndex.value + 1) % speech.value.length;
    currentSpeech.value = props.speech[currentSpeechIndex.value];
  }
};


const imageClass = computed(() => {
  return [
    'transform',
    props.direction === 'right' ? 'scale-x-[-1]' : '' // Flip image if right
  ];
});
</script>










