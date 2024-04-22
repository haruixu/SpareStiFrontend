<template>
<div class="flex flex-col items-center">
<Span class="text-sm text-bold">STREAK</Span>
<button @click="toggleStreakCard" class="bg-transparent">
  <img src="@/assets/streak.png" alt="streak" class="mx-auto w-12 h-12" />
</button>

  <div v-if="displayStreakCard"
      class="w-96 h-64 duration-500 group overflow-hidden relative rounded bg-white-800 text-neutral-50 p-4 flex flex-col justify-evenly"
  >
    <div
        class="absolute blur opacity-40 duration-500 group-hover:blur-none w-72 h-72 rounded-full group-hover:translate-x-12 group-hover:translate-y-12 bg-green-100 right-1 -bottom-24"
    ></div>
    <div
        class="absolute blur opacity-40 duration-500 group-hover:blur-none w-12 h-12 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 bg-green-300 right-12 bottom-12"
    ></div>
    <div
        class="absolute blur opacity-40 duration-500 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 bg-green-500 right-1 -top-12"
    ></div>
    <div
        class="absolute blur opacity-40 duration-500 group-hover:blur-none w-24 h-24 bg-green-400 rounded-full group-hover:-translate-x-12"
    ></div>
    <div class="z-10 flex flex-col justify-evenly w-full h-full px-4">
      <span class="text-2xl font-bold text-black">{{currentStreak}}{{currentStreak === 1 ? ' dag':' dager'}} streak</span>
      <p class="text-black text-1xl font-bold">
        {{ currentStreak > 0 ? 'Bra jobba du har spart i ' + currentStreak + ' dager!' : 'Du har ikke gjort noe i dag. Gjør noe nå for å starte en streak!' }}
      </p>
      <!-- Row component with horizontal padding and auto margins for centering -->
      <div class="flex flex-row justify-content-center items-center h-20 w-full mx-auto bg-black-400 gap-4">
        <div class="flex flex-1 overflow-x-auto">
          <div v-for="(index) in 6" :key="index" class="min-w-max mx-auto">
            <div class="flex flex-col items-center">
              <span class="text-black">Dag {{currentStreak-(currentStreak%(7)-index)}}</span>
              <!-- Conditional rendering for streak images -->
              <img v-if="index-1 < currentStreak%7" src="@/assets/streak.png" alt="challenge completed" class="max-h-8 max-w-8">
              <img v-else src="@/assets/streak.png" alt="challenge not completed" class="max-h-8 max-w-8 grayscale">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>


</template>

<script setup lang="ts">
import { ref} from 'vue';

const displayStreakCard = ref(false);
const currentStreak = ref(5);


function toggleStreakCard() {
  displayStreakCard.value = !displayStreakCard.value;
}

</script>





