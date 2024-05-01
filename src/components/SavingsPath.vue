<template>
    <div
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
        <div
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
                    <card-challenge-savings-path :goal="goal!" :challenge="challenge"></card-challenge-savings-path>
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
                    <span class="">Legg til <br />Spareutfordring</span>
                </div>
                <div v-else-if="index === challenges.length - 1 && index % 2 !== 0" class="mr-40">
                    <button class="text-2xl ml-10 rounded-full" @click="addSpareUtfordring">
                        +
                    </button>
                    <span class="">Legg til <br />Spareutfordring</span>
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
                    <img :src="getGoalIcon(goal)" class="w-12 h-12 mx-auto" :alt="goal.title" />
                    <div class="text-lg font-bold" data-cy="goal-title">{{ goal.title }}</div>
                </div>
            </div>
            <div class="flex flex-col items-end">
                <div @click="goToEditGoal" class="cursor-pointer">
                    <h3 class="text-blue-500 text-base">Endre mål</h3>
                </div>
                <div
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
</template>

<script setup lang="ts">
import {
    type ComponentPublicInstance,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    type Ref,
    ref,
    watch
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

const challenges = ref<Challenge[]>(props.challenges)
const goal = ref<Goal | null | undefined>(props.goal)


onMounted(async () => {
    await goalStore.getUserGoals()
    window.addEventListener('resize', handleWindowSizeChange)
    handleWindowSizeChange()
    sortChallenges()
    allChallengesCompleted()
})

const allChallengesCompleted = () => {
  // Assuming challenges.value is an array of challenge objects
  for (const challenge of challenges.value) {
    if (challenge.completion !== 100) {
      return false; // If any challenge is not completed, return false
    }
  }
  return true; // If all challenges are completed, return true
};


const sortChallenges = () => {
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

const screenSize = ref<number>(window.innerWidth)

onUnmounted(() => {
    window.removeEventListener('resize', handleWindowSizeChange)
})
const handleWindowSizeChange = () => {
    screenSize.value = window.innerWidth
}

interface ElementRefs {
    [key: string]: HTMLElement | undefined
}

const elementRefs = reactive<ElementRefs>({})

const isAtFirstUncompleted = ref(false) // This state tracks visibility of the button
const firstUncompletedRef: Ref<HTMLElement | undefined> = ref()

function scrollToFirstUncompleted() {
    let found = false
    for (let i = 0; i < challenges.value.length; i++) {
        if (challenges.value[i].completion! < 100) {
            const refKey = `uncompleted-${i}`
            if (elementRefs[refKey]) {
                elementRefs[refKey]!.scrollIntoView({ behavior: 'smooth', block: 'start' })
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


onMounted(() => {
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
});

onUnmounted(() => {
    const container = containerRef.value
    if (container) {
        container.removeEventListener('scroll', () => {
            // Clean up the scroll listener
        })
    }
})

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

// Utilizing watch to specifically monitor for changes in the props
watch(
    () => props.goal,
    (newGoal, oldGoal) => {
        if (newGoal !== oldGoal) {
            goal.value = newGoal
            console.log('Updated goal:', goal.value)
        }
    },
    { immediate: true }
)

watch(
    () => props.challenges,
    (newChallenges, oldChallenges) => {
        if (newChallenges !== oldChallenges) {
            challenges.value = newChallenges
            sortChallenges()
            allChallengesCompleted()
            console.log('Updated challenges:', challenges.value)
        }
    },
    { immediate: true }
)
// Reactive references for DOM elements
const iconRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)

// Define your goal

// AddSpareUtfordring
const addSpareUtfordring = () => {
    console.log('Attempting to navigate to /spareutfordringer')
    router.push('/spareutfordringer').catch((error) => {
        console.error('Routing error:', error)
    })
}

const recalculateAndAnimate = () => {
    nextTick(() => {
        if (iconRef.value && containerRef.value && targetRef.value) {
            animateIcon()
        } else {
            console.error('Element references are not ready.')
        }
    })
}

const editGoal = (goal: Goal) => {
    router.push(`/sparemaal/${goal.id}`)
}

// Declare the ref with a type annotation for an array of strings
const animatedChallenges: Ref<number[]> = ref([])

const loadAnimatedStates = () => {
    const animated = localStorage.getItem('animatedChallenges')
    animatedChallenges.value = animated ? JSON.parse(animated) : []
}

const saveAnimatedState = (challenge: Challenge) => {
    console.log('Saving animated state for 1:', challenge.id)
    if (challenge.id != null) {
        animatedChallenges.value.push(challenge.id)
    }
    console.log('Saving animated state for:', challenge.title)
    localStorage.setItem('animatedChallenges', JSON.stringify(animatedChallenges.value))
}

const animateChallenge = (challenge: Challenge) => {
    if (
        challenge.completion === 100 &&
        !animatedChallenges.value.includes(challenge.id as number)
    ) {
        console.log('Animating for:', challenge.title)
        if (challenge.id != null) {
            animatedChallenges.value.push(challenge.id)
        } // Ensure no duplication
        saveAnimatedState(challenge) // Refactor this to update localStorage correctly
        triggerConfetti()
        recalculateAndAnimate()
    }
}

const triggerConfetti = () => {
    confetti({
        particleCount: 400,
        spread: 80,
        origin: { x: 0.8, y: 0.8 }
    })
}

watch(
    challenges,
    (newChallenges) => {
        newChallenges.forEach((challenge) => {
            //wait for 300ms before animating maybe?
            nextTick(() => {
                if (challenge.completion === 100) {
                    if (!animatedChallenges.value.includes(challenge.id as number)) {
                        console.log(!animatedChallenges.value.includes(challenge.id as number))
                        console.log('Animating challenge in watcher:', challenge.id)
                        animateChallenge(challenge)
                        saveAnimatedState(challenge) // Refactor this to update localStorage correctly
                    }
                }
            })
        })
    },
    { deep: true }
)
onMounted(() => {
    // Load existing animated states first
    loadAnimatedStates()

    // Get completed challenge IDs, ensuring that only defined IDs are considered
    const completedChallenges = challenges.value
        .filter((challenge) => challenge.completion === 100 && challenge.id !== undefined)
        .map((challenge) => challenge.id as number) // Use 'as number' to assert that ids are numbers after the check

    // Update only new completions that are not already in the animatedChallenges
    const newAnimations = completedChallenges.filter((id) => !animatedChallenges.value.includes(id))
    animatedChallenges.value = [...animatedChallenges.value, ...newAnimations]

    // Save the updated list back to localStorage
    localStorage.setItem('animatedChallenges', JSON.stringify(animatedChallenges.value))
})

const animateIcon = () => {
    const icon = iconRef.value
    const container = containerRef.value
    const target = targetRef.value

    if (!icon || !container || !target) {
        console.error('Required animation elements are not available.')
        return
    }

    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const iconRect = icon.getBoundingClientRect()

    const translateX1 =
        containerRect.left + containerRect.width / 2 - iconRect.width / 2 - iconRect.left
    const translateY1 =
        containerRect.top + containerRect.height / 2 - iconRect.height / 2 - iconRect.top

    const translateX2 = targetRect.left + targetRect.width / 2 - iconRect.width / 2 - iconRect.left
    const translateY2 = targetRect.top + targetRect.height / 2 - iconRect.height / 2 - iconRect.top

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


const getGoalIcon = (goal: Goal): string => {
    return `src/assets/${goal.title.toLowerCase()}.png`
}
const getPigStepsIcon = () => {
    return 'src/assets/pigSteps.png'
}

// TODO - Change when EditGoal view is created
const goToEditGoal = () => {
    router.push({ name: 'EditGoal' })
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
