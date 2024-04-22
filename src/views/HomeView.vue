<template>
  <div class="flex flex-col max-h-[60vh] md:flex-row md:max-h-[80vh] mx-auto">
    <div class="flex flex-col basis-1/3 order-last md:order-first md:basis-1/2">
      <InteractiveSpare :speech="speech"
                        :direction="'right'"
                        :pngSize=60
                        class="opacity-0 h-0 w-0 md:opacity-100 md:h-auto md:w-auto md:mx-auto md:my-20"
      ></InteractiveSpare>
      <div class=" flex flex-row gap-12 items-center mx-auto p-8 md:flex-col md:gap-4 md:m-8">
        <ButtonAddGoalOrChallenge
            :buttonText="'Legg til sparemål'"
        />
        <ButtonAddGoalOrChallenge
            :buttonText="'Legg til spareutfordring'"
        />
      </div>
    </div>
    <div class="flex flex-col basis-2/3 max-h-[70vh] mx-auto max-w-5/6 md:basis-1/2 md:max-h-full">
      <div class="flex justify-center align-center">
        <span class="
            w-full
            max-w-60
            max-h-12
            bg-green-500
            text-white font-bold py-2 rounded
            mt-8

            text-center
            space-x-2
        ">
          Din Sparesti
        </span>
      </div>
      <div class="h-2 w-4/6 bg-black mx-auto my-2 opacity-10"></div>
      <div ref="containerRef" class="container relative mx-auto p-6 no-scrollbar max-h-[60vh] overflow-y-auto">
        <div v-for="(challenge, index) in challenges" :key="challenge.title" class="flex flex-col items-center mx-8">
          <!-- Challenge Row -->
          <div :class="{ 'justify-end ml-40 md:ml-30': index % 2 === 1, 'justify-start': index % 2 === 0 }" class="flex flex-row w-2/3 ml-8">
            <!-- Challenge Icon and Details -->
            <div class="flex">
              <!-- Challenge Icon -->
              <div class="flex flex-col">
                <img
                    :src="getChallengeIcon(challenge)"
                    class="max-w-20 max-h-20"
                    :alt="challenge.title"
                >
                <!-- Progress Bar, if the challenge is not complete -->
                <div v-if="challenge.completion<100" class="flex-grow w-full mt-2">
                  <div class="flex flex-row">
                    <div class="flex flex-col">
                      <div class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-green-600 h-2.5 rounded-full" :style="{ width: (challenge.saved / challenge.target * 100) + '%' }"></div>
                      </div>
                      <div class="text-center">
                        {{ challenge.saved }}kr / {{ challenge.target }}kr
                      </div>
                    </div>

                    <button
                        @click="incrementSaved(challenge)"
                        type="button"
                        class="inline-block mb-2 ml-2 h-8 w-8 rounded-full bg-green-500 p-1 uppercase leading-normal text-white bg-color-green shadow-green-500 transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-green-200 focus:bg-green-accent-300 focus:shadow-green-2 focus:outline-none focus:ring-0 active:bg-green-600 active:shadow-green-200 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                      +
                    </button>

                  </div>
                </div>
                <span v-else class="text-center">Ferdig: {{challenge.saved}}</span>
              </div>
              <!-- Check Icon -->
              <div v-if="challenge.completion >= 100" class="max-w-16 max-h-16">
                <img src="@/assets/completed.png" alt="">️
              </div>
              <div v-else class="max-w-16 max-h-16">
                <img src="@/assets/pending.png" alt="">️
              </div>
            </div>
          </div>
          <!-- Piggy Steps, centered -->
          <div v-if="index !== challenges.length" class="flex justify-center w-full">
            <img :src="getPigStepsIcon()" :class="{ 'transform scale-x-[-1]': (index) % 2 === 0 }" class="w-20 h-20" alt="Pig Steps">
          </div>

          <div v-if="index === challenges.length - 1 && index % 2 === 0" class="ml-40 flex flex-row">
            <button class="text-2xl mr-2 color-black bg-slate-400">+</button>
            <span class="">Legg til <br/>Spareutfordring</span>
          </div>
          <div v-else-if="index === challenges.length - 1 && index % 2 !== 0" class="mr-40">
            <button class="text-2xl mr-2 color-black bg-slate-400 rounded-full" @click="addSpareUtfordring">+</button>
          </div>
        </div>
        <!-- Sparemannen -->
        <InteractiveSpare :speech="speech"
                          :direction="'left'"
                          :pngSize="20"
                          class="fixed bottom-0 right-0 mb-40 mr-4 md:opacity-0 md:h-0 md:w-0"
        ></InteractiveSpare>
      </div>
      <!-- Finish line -->
      <img src="@/assets/finishLine.png" class="w-1/2 max-h-4 mx-auto" alt="Finish Line">

      <!-- Goal -->
      <div v-if="currentGoal" class="flex flex-row gap-24 m-t-2 pt-6 mx-auto">
        <div class="flex flex-col items-start">
          <img :src="getGoalIcon(currentGoal)" class="w-12 h-12 mx-auto" :alt="currentGoal.title">
          <div class="text-lg font-bold">{{ currentGoal.title }}</div>
        </div>
        <div class="flex flex-col items-end">
          <div @click="goToEditGoal" class="cursor-pointer">
            <h3 class="text-blue-500 text-base">Endre mål</h3>
          </div>
          <div ref="targetRef" class="bg-yellow-400 px-4 py-1 rounded-full text-black">
            {{ currentGoal.saved }}kr / {{ currentGoal.target }}kr
          </div>
        </div>
      </div>
    </div>
    <!-- Animation icon -->
      <img
           src="@/assets/coins.png"
           alt="Coins"
           ref="iconRef"
           class="max-w-20 max-h-20 absolute opacity-0">
      </div>
      <div>
      </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import anime from 'animejs';
import InteractiveSpare from "@/components/InteractiveSpare.vue";
import ButtonAddGoalOrChallenge from "@/components/ButtonAddGoalOrChallange.vue";
import router from "@/router";

// Define your speech array
const speechArray = [
  "Hei! Jeg er Sparemannen.",
  "Jeg hjelper deg med å spare penger.",
  "Klikk på meg for å høre mer."
];
// Correctly initialize the ref
const speech = ref(speechArray);

// Reactive references for DOM elements
const iconRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const targetRef = ref<HTMLElement | null>(null);



const goals = ref([
  { title: 'Gaming', saved: 280, target: 100, description: 'Gaming console', priority: 1, completion: 0 },
  // Other goals...
])
const challenges = ref([
  { title: 'Kaffe', challengeType: 'COFFEE', saved: 100, target: 100, description: 'Morning boost', completion: 100 },
  { title: 'Mat og Drikke',  challengeType: 'SNACKS', saved: 80, target: 100, description: 'Morning boost', completion: 80 },
  { title: 'Gaming',  challengeType: 'GAMING', saved: 20, target: 100, description: 'Morning boost', completion: 20 },
  { title: 'Kaffe', challengeType: 'COFFEE', saved: 90, target: 100, description: 'Morning boost', completion: 90 },
  { title: 'Mat og Drikke',  challengeType: 'SNACKS', saved: 80, target: 100, description: 'Morning boost', completion: 80 },
  // Other challenges...
])


// Computed current goal
const currentGoal = computed(() => {
  // Logic to determine the current goal
  return goals.value.find(goal => goal.completion < 100)
})

// AddSpareUtfordring
function addSpareUtfordring() {
  console.log('Add Spare Utfordring');
}



// Increment saved amount
function incrementSaved(challenge) {
  challenge.saved += 10;
  if (challenge.saved >= challenge.target) {
    challenge.completion = 100;
  }
}

function recalculateAndAnimate() {
  nextTick(() => {
    if (iconRef.value && containerRef.value && targetRef.value) {
      animateIcon();
    } else {
      console.error('Element references are not ready.');
    }
  });
}

const animatedChallenges = ref(new Set());

const loadAnimatedStates = () => {
  const animated = localStorage.getItem('animatedChallenges');
  animatedChallenges.value = animated ? new Set(JSON.parse(animated)) : new Set();
};

const saveAnimatedState = (title) => {
  animatedChallenges.value.add(title);
  localStorage.setItem('animatedChallenges', JSON.stringify([...animatedChallenges.value]));
};

const animateChallenge = (challenge) => {
  if (challenge.completion >= 100 && !animatedChallenges.value.has(challenge.title)) {
    console.log("Animating for:", challenge.title);
    recalculateAndAnimate();  // Assumes this function triggers the actual animation
    saveAnimatedState(challenge.title);
  }
};

watch(challenges, (newChallenges) => {
  newChallenges.forEach(challenge => {
    if (challenge.completion === 100 && !animatedChallenges.value.has(challenge.title)) {
      animateChallenge(challenge);
    }
  });
}, { deep: true });

onMounted(() => {
  // Filter challenges that are already completed
  const completedChallenges = challenges.value.filter(challenge => challenge.completion === 100).map(challenge => challenge.title);

  // For testing purposes, clear localStorage
  localStorage.clear();

  // Update localStorage with the titles of completed challenges
  localStorage.setItem('animatedChallenges', JSON.stringify(completedChallenges));

  // Load the initial state of animated challenges from localStorage
  loadAnimatedStates();
});


function animateIcon() {
  const icon = iconRef.value;
  const container = containerRef.value;
  const target = targetRef.value;

  if (!icon || !container || !target) {
    console.error('Required animation elements are not available.');
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const iconRect = icon.getBoundingClientRect();

  const translateX1 = containerRect.left + (containerRect.width / 2) - (iconRect.width / 2) - iconRect.left;
  const translateY1 = containerRect.top + (containerRect.height / 2) - (iconRect.height / 2) - iconRect.top;

  const translateX2 = targetRect.left + (targetRect.width / 2) - (iconRect.width / 2) - iconRect.left;
  const translateY2 = targetRect.top + (targetRect.height / 2) - (iconRect.height / 2) - iconRect.top;


  anime.timeline({
    easing: 'easeInOutQuad',
    duration: 1500
  })
      .add({
        targets: icon,
        translateX: translateX1,
        translateY: translateY1,
        opacity: 0, // Start invisible
        duration: 1000
      })
      .add({
        targets: icon,
        opacity: 1, // Reveal the icon once it starts moving to the container
        duration: 1000, // Make the opacity change almost instantaneously
        scale:3,
      })
      .add({
        targets: icon,
        translateX: translateX2,
        translateY: translateY2,
        scale: 0.5,
        opacity: 1, // Keep the icon visible while moving to the target
        duration: 1500
      })
      .add({
        targets: icon,
        opacity: 0, // Fade out once it reaches the target
        scale: 1,
        duration: 500
      })
      .add({
          targets: icon,
          translateX: 0, // Reset translation to original
          translateY: 0, // Reset translation to original
          duration: 500,
        });
}

// Helper methods to get icons
function getChallengeIcon(challenge) {
  return `src/assets/${challenge.challengeType.toLowerCase()}.png`
}

function getGoalIcon(goal) {
  return `src/assets/${goal.title.toLowerCase()}.png`
}
function getPigStepsIcon() {
  return 'src/assets/pigSteps.png';
}

// TODO - Change when EditGoal view is created
function goToEditGoal() {
  router.push({ name: 'EditGoal' });
}

</script>

<style scoped>
/* Tailwind CSS - Custom CSS for hiding scrollbars */
.no-scrollbar::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}
.no-scrollbar {
  -ms-overflow-style: none;  /* for Internet Explorer and Edge */
}
</style>


