<template>
    <div v-if="isMounted"
        class="flex flex-col basis-2/3 max-h-full mx-auto md:ml-20 md:mr-2 max-w-5/6 md:basis-3/4 md:max-pr-20 md:pr-10 md:max-mr-20"
    >
        <div class="flex justify-center align-center">
            <span
                class="w-full max-w-60 max-h-12 text-black text-2xl font-bold py-2 rounded mt-8 text-center space-x-2 drop-shadow-lg"
            >
                Din Sparesti
            </span>
        </div>
        <button
            v-if="!allChallengesCompleted()"
            class="h-auto w-auto absolute flex text-center self-end mr-10 md:mr-20 text-wrap shadow-sm shadow-black sm:top-50 sm:text-xs sm:mr-20 lg:mr-32 top-60 z-50 p-2 text-xs md:text-sm"
            @click="scrollToFirstUncompleted"
            v-show="!isAtFirstUncompleted"
        >
            Ufullførte utfordringer<br />↓
        </button>
        <div class="h-1 w-4/6 mx-auto my-2 opacity-10"></div>
        <div v-if="challenges"
            ref="containerRef"
            class="container relative pt-6 w-4/5 bg-cover bg-[center] md:[background-position: center;] mx-auto md:w-4/5 no-scrollbar h-full max-h-[60vh] md:max-h-[60vh] md:min-w-2/5 overflow-y-auto border-2 border-transparent rounded-xl bg-white shadow-lg shadow-slate-400"
            style="background-image: url('src/assets/backgroundSavingsPath.png')"
        >
            <div>
                <img src="@/assets/start.png" alt="Spare" class="md:w-1/6 md:h-auto h-20" />
            </div>

            <div
                v-for="(challenge, index) in challenges"
                :key="challenge.id"
                class="flex flex-col items-center"
                :ref="(el) => assignRef(el, challenge, index)"
            >
                <!-- Challenge Row -->
                <div
                    :class="{
                        'justify-center mx-auto md:justify-between': index % 2 === 1,
                        'justify-center md:justify-between mx-auto': index % 2 === 0
                    }"
                    class="flex flex-row w-full md:w-4/5 justify-start gap-4 md:gap-8 "
                >
                    <div class="flex">
                        <img-gif-template
                            :index="index"
                            :mod-value="1"
                            url="src/assets/golfSpare.gif"
                        ></img-gif-template>
                        <img-gif-template
                            :index="index"
                            :mod-value="3"
                            url="src/assets/sleepingSpare.gif"
                        ></img-gif-template>
                        <img-gif-template
                            :index="index"
                            :mod-value="5"
                            url="src/assets/archerSpare.gif"
                        ></img-gif-template>
                    </div>
                    <card-challenge-savings-path :goal="goal!"
                                                 :challenge="challenge"
                                                 @update-challenge="handleChallengeUpdate"
                  ></card-challenge-savings-path>
                    <div class="flex">
                        <img-gif-template
                            :index="index"
                            :mod-value="0"
                            url="src/assets/cowboySpare.gif"
                        ></img-gif-template>
                        <img-gif-template
                            :index="index"
                            :mod-value="2"
                            url="src/assets/hotAirBalloonSpare.gif"
                        ></img-gif-template>
                        <img-gif-template
                            :index="index"
                            :mod-value="4"
                            url="src/assets/farmerSpare.gif"
                        ></img-gif-template>
                    </div>
                </div>
                <!-- Piggy Steps, centered -->
                <div v-if="index !== challenges.length" class="flex justify-center w-full">
                    <img
                        :src="getPigStepsIcon()"
                        :class="{ 'transform scale-x-[-1]': index % 2 === 0 }"
                        class="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32"
                        alt="Pig Steps"
                    />
                </div>

                <div
                    v-if="index === challenges.length - 1 && index % 2 === 0"
                    class="flex flex-row mt-2"
                >
                    <button class="text-2xl ml-48" @click="addSpareUtfordring">+</button>
                    <p class="">Legg til <br />Spareutfordring</p>
                </div>
                <div v-else-if="index === challenges.length - 1 && index % 2 !== 0" class="mr-20 flex flex-row">
                    <button class="text-2xl ml-10 rounded-full" @click="addSpareUtfordring">
                        +
                    </button>
                    <p class="">Legg til <br />Spareutfordring</p>
                </div>
                <!-- Finish line -->
            </div>
            <img
                src="@/assets/finishLine.png"
                class="w-full max-h-auto mx-auto mt-4"
                alt="Finish Line"
            />
        </div>
        <!-- Goal -->
        <div v-if="goal" class="flex flex-row justify-around m-t-2 pt-6 w-full mx-auto">
            <div class="grid grid-rows-2 grid-flow-col gap 4">
                <div class="row-span-3 cursor-pointer" @click="editGoal(goal)">
                    <img
                        :src="getGoalIcon(goal)" class="w-12 h-12 mx-auto" :alt="goal.title" />
                    <div class="text-lg font-bold" data-cy="goal-title">{{ goal.title }}</div>
                </div>
            </div>
            <div class="flex flex-col items-end">
                <div @click="goToEditGoal" class="cursor-pointer">
                    <h3 class="text-blue-500 text-base">Endre mål</h3>
                </div>
                <div :key="componentKey"
                    ref="targetRef"
                    class="bg-yellow-400 px-4 py-1 rounded-full text-black font-bold"
                >
                    {{ goal.saved }}kr / {{ goal.target }}kr
                </div>
            </div>
        </div>
    </div>
    <!-- Animation icon -->
    <img
        src="@/assets/penger.png"
        alt="Penger"
        ref="iconRef"
        class="max-w-20 max-h-20 absolute opacity-0"
    />
    <img v-if="goal"
        :src="getGoalIcon(goal)"
        alt="could not load"
        ref="goalIconRef"
        class="shadow-sm shadow-amber-300 max-w-20 max-h-20 absolute opacity-0"

    />
</template>

<script setup lang="ts">
import {
  type ComponentPublicInstance, nextTick,
  onMounted,
  onUnmounted,
  reactive,
  type Ref,
  ref,
} from 'vue'
import anime from 'animejs'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import confetti from 'canvas-confetti'
import { useRouter } from 'vue-router'
import { useGoalStore } from '@/stores/goalStore'
import ImgGifTemplate from '@/components/ImgGifTemplate.vue'
import CardChallengeSavingsPath from "@/components/CardChallengeSavingsPath.vue";

const router = useRouter()
const goalStore = useGoalStore()

interface Props {
    challenges: Challenge[]
    goal: Goal | null | undefined
}
const props = defineProps<Props>()

const challenges = ref<Challenge[]>()
let goal: Goal | null | undefined = reactive({
  title: '',  // Default empty string to prevent undefined errors
  saved: 0,
  target: 0,
} as Goal)
const isMounted = ref<boolean>(false)
const componentKey = ref<number>(0)

//Initialisation:

onMounted(async () => {
  window.addEventListener('resize', handleWindowSizeChange)
  handleWindowSizeChange();
  challenges.value = props.challenges
  goal = props.goal
  sortChallenges();
  allChallengesCompleted();
  // Delay the execution of the following logic by 300ms
  setTimeout(() => {
    const container = containerRef.value;
    if (container) {
      container.addEventListener('scroll', () => {
        if (!firstUncompletedRef.value) return;
        const containerRect = container.getBoundingClientRect();
        const firstUncompletedRect = firstUncompletedRef.value.getBoundingClientRect();
        isAtFirstUncompleted.value = !(
            firstUncompletedRect.top > containerRect.bottom ||
            firstUncompletedRect.bottom < containerRect.top
        );
      });
    }
    scrollToFirstUncompleted();
  }, 300); // Timeout set to 300 milliseconds
  // Load existing animated states first
  loadAnimatedStates()

  // Get completed challenge IDs, ensuring that only defined IDs are considered
  const completedChallenges = challenges.value
  .filter((challenge) => challenge.completion! >= 100 && challenge.id !== undefined)
  .map((challenge) => challenge.id as number) // Use 'as number' to assert that ids are numbers after the check

  // Update only new completions that are not already in the animatedChallenges
  const newAnimations = completedChallenges.filter((id) => !animatedChallenges.value.includes(id))
  animatedChallenges.value = [...animatedChallenges.value, ...newAnimations]

  // Save the updated list back to localStorage
  localStorage.setItem('animatedChallenges', JSON.stringify(animatedChallenges.value))
  isMounted.value = true;
})



onUnmounted(() => {
  window.removeEventListener('resize', handleWindowSizeChange)
  const container = containerRef.value
  if (container) {
    container.removeEventListener('scroll', () => {
      // Clean up the scroll listener
    })
  }
})

const handleChallengeUpdate = (updatedChallenge: Challenge) => {
  if (challenges.value) {
    const index = challenges.value.findIndex(c => c.id === updatedChallenge.id);
    if (index !== -1) {
      challenges.value[index] = {...updatedChallenge};
    }

    if (updatedChallenge.completion! >= 100 && !animatedChallenges.value.includes(updatedChallenge.id as number)) {
      animateChallenge(updatedChallenge);
      saveAnimatedStateChallenge(updatedChallenge);
    }

    if (goal) {
      incrementGoalSaved(updatedChallenge);
      // Force component update right here might be more appropriate
      componentKey.value++;
    }
  }
}

const incrementGoalSaved = async (challenge: Challenge) => {
  if (goal) {
    // Correct the addition mistake and remove setTimeout
    goal.saved = goal.saved + challenge.perPurchase;
    await nextTick();// Only add the perPurchase amount

    const completion = (goal.saved / goal.target) * 100;
    if (completion >= 100 && !animatedGoals.value.includes(goal.id as number)) {
      animateGoal(goal);
      setTimeout(() => {
        goalStore.getUserGoals();
        goal = goalStore.priorityGoal;
      }, 4000); // Keep this delay only for the store update and goal switch
    } else {
      await goalStore.getUserGoals();
      goal = goalStore.priorityGoal;
    }
  }
}




/**
 * Navigates to the spareutfordringer page
 */
const addSpareUtfordring = () => {
  router.push('/spareutfordringer').catch((error) => {
    console.error('Routing error:', error)
  })
}

/**
 * Checks if all challenges are completed
 */
const allChallengesCompleted = () => {
  // Assuming challenges.value is an array of challenge objects
  if (challenges.value) {
    for (const challenge of challenges.value) {
      if (challenge.completion !== 100) {
        return false; // If any challenge is not completed, return false
      }
    }
    return true;
  }// If all challenges are completed, return true
};

//-----------Animation for goal and challenge completion-----------------//

// Reactive references for DOM elements
const iconRef = ref<HTMLElement | null>(null)
const goalIconRef = ref<HTMLElement |null>(null);
const containerRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)









// Declare the ref with a type annotation for an array of strings
const animatedChallenges: Ref<number[]> = ref([])
const animatedGoals: Ref<number[]> =ref([])


/**
 * Loads the states for animated goals and challenges
 */
const loadAnimatedStates = () => {
    const animated = localStorage.getItem('animatedChallenges')
    const animatedG = localStorage.getItem('animatedGoals')
    animatedChallenges.value = animated ? JSON.parse(animated) : []
    animatedGoals.value =animatedG ? JSON.parse(animatedG):[]
}



/**
 * Saves the animated state for challenge
 * triggers the confetti method
 * triggers the recalculation of dom positioning
 * @param challenge
 */
const animateChallenge = (challenge: Challenge) => {
    if (
        challenge.completion! >= 100 &&
        !animatedChallenges.value.includes(challenge.id as number)
    ) {
        if (challenge.id != null) {
            animatedChallenges.value.push(challenge.id)
        } // Ensure no duplication
        saveAnimatedStateChallenge(challenge) // Refactor this to update localStorage correctly
        triggerConfetti()
        recalculateAndAnimate(false)
    }
}


/**
 * Saves the animated state for goal
 * triggers the confetti method
 * triggers the recalculation of dom positioning
 * @param goal
 */
const animateGoal = (goal: Goal) => {
  console.log('im in animated goal')

  if (goal.id != null) {
    animatedGoals.value.push(goal.id)
  } // Ensure no duplication
  saveAnimatedStateGoal(goal) // Refactor this to update localStorage correctly
  triggerConfetti()
  recalculateAndAnimate(true)
}

/**
 * Recalculates the position of the dom elements
 * @param isGoal
 */
const recalculateAndAnimate = (isGoal: boolean) => {
  console.log('im in recalculate and animate')


    if (!isGoal && iconRef.value && containerRef.value && targetRef.value) {
      animateIcon(isGoal)
    }
    else if (isGoal && containerRef.value && goalIconRef.value){
      animateIcon(isGoal)
    }
    else if (!isGoal && !targetRef.value) {
      animateIcon(isGoal)
    }
    else {
      console.error('Element references are not ready.')
    }
}

/**
 * Saves the animated state for challenge
 * @param challenge
 */
const saveAnimatedStateChallenge = (challenge: Challenge) => {
  if (challenge.id != null) {
    animatedChallenges.value.push(challenge.id)
  }
  localStorage.setItem('animatedChallenges', JSON.stringify(animatedChallenges.value))
}

/**
 * Saves the animated state for goal
 * @param goal
 */
const saveAnimatedStateGoal = (goal: Goal) => {
  console.log('Saving animated state for:', goal.id)
  if (goal.id != null) {
    animatedGoals.value.push(goal.id)
  }
  localStorage.setItem('animatedGoals', JSON.stringify(animatedGoals.value))
}



/**
 * animates the icon images
 * @param isGoal
 */
const animateIcon = (isGoal: boolean) => {
  console.log('im in animate icon')
  const icon = iconRef.value
  const container = containerRef.value
  const target = targetRef.value

  if (!icon || !container) {
    console.error('Required animation elements are not available.')
    return
  }
  // Obtain bounding rectangles safely
  const containerRect = container.getBoundingClientRect();
  const targetRect = target?.getBoundingClientRect();
  const iconRect = icon.getBoundingClientRect();

  // Initialize translation coordinates
  let translateX1 = 0, translateY1 = 0, translateX2 = 0, translateY2 = 0;

  if (isGoal) {
    const goal = goalIconRef.value;
    if (goal) {
      const goalRect = goal.getBoundingClientRect();
      if (goalRect) {
        // Calculate the translation coordinates for the goal
        translateX1 = containerRect.left + containerRect.width / 2 - goalRect.width / 2 - goalRect.left;
        translateY1 = containerRect.top + containerRect.height / 2 - goalRect.height / 2 - goalRect.top;

        anime.timeline({
          easing: 'easeInOutQuad',
          duration: 1500
        })
        .add({
          targets: goal,
          translateX: translateX1,
          translateY: translateY1,
          opacity: [0, 1], // Fix: start from 0 opacity and animate to 1
          duration: 1000
        })
        .add({
          targets: goal,
          opacity: [1, 0], // Fade out after moving
          duration: 3000,
          scale: 3,
          begin: function (anim) {
            if (icon) icon.classList.add('glow'); // Ensure icon exists before applying class
          },
          complete: function (anim) {
            if (icon) icon.classList.remove('glow'); // Clean up: remove class after animation
          }
        });
      } else {
        console.error('Goal rectangle is not available.');
      }
    } else {
      console.error('Goal element is not available.');
    }
    }
    else if (!isGoal && target && targetRect) {
      // Calculate the translation coordinates for the icon
      translateX1 = containerRect.left + containerRect.width / 2 - iconRect.width / 2 - iconRect.left;
      translateY1 = containerRect.top + containerRect.height / 2 - iconRect.height / 2 - iconRect.top;
      translateX2 = targetRect.left + targetRect.width / 2 - iconRect.width / 2 - iconRect.left;
      translateY2 = targetRect.top + targetRect.height / 2 - iconRect.height / 2 - iconRect.top;

      anime
      .timeline({
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
        scale: 3
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
        duration: 500
      })
    }
    else if(!isGoal && !target) {
      // Calculate the translation coordinates for the icon
      translateX1 = containerRect.left + containerRect.width / 2 - iconRect.width / 2 - iconRect.left;
      translateY1 = containerRect.top + containerRect.height / 2 - iconRect.height / 2 - iconRect.top;
      anime
      .timeline({
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
        scale: 3
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
        duration: 500
      })
    }
}
/**
 * Triggers confeti animation
 */
const triggerConfetti = () => {
  confetti({
    particleCount: 400,
    spread: 80,
    origin: { x: 0.8, y: 0.8 }
  })
}


//fetching images
const getGoalIcon = (goal: Goal): string => {
  if (goal){
    return `src/assets/${goal.title.toLowerCase()}.png`
  }
  else{
    return 'src/assets/pengesekkStreak.png'
  }
}
const getPigStepsIcon = () => {
    return 'src/assets/pigSteps.png'
}

const goToEditGoal = () => {
    router.push({ name: 'edit-goal', params: { id: goal?.id } })
}

const editGoal = (goal: Goal) => {
  router.push(`/sparemaal/rediger/${goal.id}`)
}



/**
 * Sorts the challenges by completion status and due date

 */
const sortChallenges = () => {
  if (challenges.value) {
    challenges.value.sort((a, b) => {
      // First, sort by completion status: non-completed (less than 100) before completed (100)
      if (a.completion !== 100 && b.completion === 100) {
        return 1 // 'a' is not completed and 'b' is completed, 'a' should come first
      } else if (a.completion === 100 && b.completion !== 100) {
        return -1 // 'a' is completed and 'b' is not, 'b' should come first
      } else {
        // Explicitly convert dates to numbers for subtraction
        const dateA = new Date(a.due).getTime()
        const dateB = new Date(b.due).getTime()
        return dateA - dateB
      }
    })
  }
}

// Interface for element references
interface ElementRefs {
  [key: string]: HTMLElement | undefined
}

const elementRefs = reactive<ElementRefs>({})
const isAtFirstUncompleted = ref(false)
const firstUncompletedRef: Ref<HTMLElement | undefined> = ref()
const screenSize = ref<number>(window.innerWidth)

/**
 * Handles the window size change event
 */
const handleWindowSizeChange = () => {
  screenSize.value = window.innerWidth
}

/**
 * Scrolls to the first uncompleted challenge

 */
const scrollToFirstUncompleted= ()=> {
  if (challenges.value) {
    let found = false
    for (let i = 0; i < challenges.value.length; i++) {
      if (challenges.value[i].completion! < 100) {
        const refKey = `uncompleted-${i}`
        if (elementRefs[refKey]) {
          elementRefs[refKey]!.scrollIntoView({behavior: 'smooth', block: 'start'})
          firstUncompletedRef.value = elementRefs[refKey] // Store the reference
          found = true
          isAtFirstUncompleted.value = true
          break
        }
      }
    }
    if (!found) {
      isAtFirstUncompleted.value = false
    }
  }
}


/**
 * Assigns the reference to the element
 * @param el
 * @param challenge
 * @param index
 */
const assignRef = (
    el: Element | ComponentPublicInstance | null,
    challenge: Challenge,
    index: number
) => {
  const refKey = `uncompleted-${index}`
  if (el instanceof HTMLElement) {
    // Ensure that el is an HTMLElement
    if (challenge.completion! < 100) {
      elementRefs[refKey] = el
    }
  } else {
    // Cleanup if the element is unmounted or not an HTMLElement
    if (elementRefs[refKey]) {
      delete elementRefs[refKey]
    }
  }
}


</script>

<style scoped>
/* Tailwind CSS - Custom CSS for hiding scrollbars */
.no-scrollbar::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
}
.no-scrollbar {
    -ms-overflow-style: none; /* for Internet Explorer and Edge */
}


</style>
