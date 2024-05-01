<template>
  <!-- Challenge Icon and Details -->
  <div class="flex  items-center justify-center shadow-black min-w-24 w-full h-auto md:max-h-full min-h-24 max-w-32 max-h-32 md:min-h-32 md:min-w-32 md:max-w-48 overflow-hidden">
    <!-- Challenge Icon -->
    <div class="flex flex-col items-center mx-auto md:mx-2 my-auto">

      <div class="flex flex-col flex-nowrap self-center">
        <!-- Check Icon -->
        <div
            v-if="challenge.completion !== undefined && challenge.completion >= 100"
            class="min-w-6 min-h-6 max-w-6 max-h-6 md:min-h-8 md:max-h-8 md:min-w-8 md:max-w-8 ml-20 md:ml-32 p-1 basis-1/4 self-end"
        >
          <img src="@/assets/completed.png" alt="" />️
        </div>
        <div v-else class="min-w-6 min-h-6 max-w-6 max-h-6 md:min-h-8 md:max-h-8 md:min-w-8 md:max-w-8 ml-20 md:ml-32 p-1 basis-1/4 self-end">
          <img src="@/assets/pending.png" alt="" />️
        </div>
        <div class="basis-3/4">
        <p
            class="text-center text-wrap text-xs lg:text-lg md:text-md"
            data-cy="challenge-title"
        >
          {{ challenge.title }}
        </p>
        </div>
      </div>
      <img
          @click="editChallenge(challenge)"
          :data-cy="'challenge-icon-' + challenge.id"
          :src="getChallengeIcon(challenge)"
          class="max-w-12 max-h-12 md:max-h-16 md:max-w-16 lg:max-w-20 lg:max-h-20 cursor-pointer hover:scale-125"
          :alt="challenge.title"
      />
      <!-- Progress Bar, if the challenge is not complete -->
      <div
          v-if="
                                    challenge.completion != undefined && challenge.completion < 100
                                "
          class="flex-grow w-full mt-2"
      >
        <div class="flex flex-row ml-5 md:ml-10 justify-center">
          <div class="flex flex-col">
            <div
                class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
            >
              <div
                  class="bg-green-600 h-2.5 rounded-full"
                  data-cy="challenge-progress"
                  :style="{
                                                    width:
                                                        (challenge.saved / challenge.target) * 100 +
                                                        '%'
                                                }"
              ></div>
            </div>
            <div class=" text-center text-nowrap text-xs md:text-base">
              {{ challenge.saved }}kr / {{ challenge.target }}kr
            </div>
          </div>

          <button
              @click="incrementSaved(challenge)"
              :data-cy="'increment-challenge' + challenge.id"
              type="button"
              class="inline-block mb-2 ml-2 h-7 w-8 rounded-full p-1 uppercase leading-normal transition duration-150 ease-in-out focus:bg-green-accent-300 focus:shadow-green-2 focus:outline-none focus:ring-0 active:bg-green-600 active:shadow-green-200 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
          >
            +
          </button>
        </div>
      </div>
      <span v-else class="text-center text-xs md:text-base"
      >Ferdig: {{ challenge.saved }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Challenge} from "@/types/challenge";
import {useChallengeStore} from "@/stores/challengeStore";
import type {Goal} from "@/types/goal";
import {useGoalStore} from "@/stores/goalStore";
import router from "@/router";

const challengeStore = useChallengeStore();
const goalStore = useGoalStore();

interface Props {
  challenge: Challenge,
  goal: Goal
}
const props = defineProps<Props>()

// Increment saved amount
const incrementSaved = async (challenge: Challenge) => {
  // Safely increment the saved amount, ensuring it exists
  challenge.saved += challenge.perPurchase

  // Check if the saved amount meets or exceeds the target
  if (challenge.saved >= challenge.target) {
    challenge.completion = 100
    await challengeStore.completeUserChallenge(challenge)
  }

  console.log('Incrementing saved amount for:', challenge)

  // Safely update the goal's saved value, ensuring goal.value exists and is not null
  if (props.goal) {
    props.goal.saved = (props.goal.saved || 0) + challenge.perPurchase
    // Update the goal in the store, ensuring goal is not null or undefined
    if (props.goal) {
      await goalStore.editUserGoal(props.goal)
    }
  } else {
    console.error('No goal selected for incrementing saved value.')
  }

  // Update the challenge in the store
  await challengeStore.editUserChallenge(challenge)
}

const editChallenge = (challenge: Challenge) => {
  router.push(`/spareutfordringer/${challenge.id}`)
}
// Helper methods to get icons
const getChallengeIcon = (challenge: Challenge): string => {
  return `src/assets/${challenge.type.toLowerCase()}.png`
}

</script>
