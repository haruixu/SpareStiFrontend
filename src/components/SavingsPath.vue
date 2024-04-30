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
                        'justify-end md:mx-auto md:justify-between': index % 2 === 1,
                        'justify-start md:justify-between md:mx-auto': index % 2 === 0
                    }"
                    class="flex flex-row w-4/5 gap-8"
                >
                    <div class="right-auto just">
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
                    <!-- Challenge Icon and Details -->
                    <div class="flex">
                        <!-- Challenge Icon -->
                        <div class="flex flex-col items-center gap-4">
                            <div class="flex flex-row flex-nowrap">
                                <p
                                    class="text-center text-wrap text-xs md:text-lg"
                                    data-cy="challenge-title"
                                >
                                    {{ challenge.title }}
                                </p>
                                <display-info-for-challenge-or-goal
                                    :goal="goal"
                                    :challenge="challenge"
                                    :is-challenge="true"
                                ></display-info-for-challenge-or-goal>
                            </div>
                            <img
                                @click="editChallenge(challenge)"
                                :data-cy="'challenge-icon-' + challenge.id"
                                :src="getChallengeIcon(challenge)"
                                class="max-w-20 max-h-20 cursor-pointer hover:scale-125"
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
                                        <div class="text-center text-xs md:text-base">
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
                        <!-- Check Icon -->
                        <div
                            v-if="challenge.completion !== undefined && challenge.completion >= 100"
                            class="md:max-w-10 min-w-4 max-w-6 max-h-6 w-full h-auto md:max-h-10 min-h-4"
                        >
                            <img src="@/assets/completed.png" alt="" />️
                        </div>
                        <div v-else class="max-w-6 max-h-6">
                            <img src="@/assets/pending.png" alt="" />️
                        </div>
                    </div>
                    <div class="">
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
                        class="w-20 h-20"
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
                <display-info-for-challenge-or-goal
                    class="col-span-2"
                    :goal="goal"
                    :challenge="null"
                    :is-challenge="false"
                ></display-info-for-challenge-or-goal>
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
import { useChallengeStore } from '@/stores/challengeStore'
import DisplayInfoForChallengeOrGoal from '@/components/DisplayInfoForChallengeOrGoal.vue'
import ImgGifTemplate from '@/components/ImgGifTemplate.vue'

const router = useRouter()
const goalStore = useGoalStore()
const challengeStore = useChallengeStore()

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
})

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
    const container = containerRef.value
    if (container) {
        container.addEventListener('scroll', () => {
            if (!firstUncompletedRef.value) return
            const containerRect = container.getBoundingClientRect()
            const firstUncompletedRect = firstUncompletedRef.value.getBoundingClientRect()
            isAtFirstUncompleted.value = !(
                firstUncompletedRect.top > containerRect.bottom ||
                firstUncompletedRect.bottom < containerRect.top
            )
        })
    }
    scrollToFirstUncompleted()
})

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
    if (goal.value) {
        goal.value.saved = (goal.value.saved || 0) + challenge.perPurchase
        // Update the goal in the store, ensuring goal is not null or undefined
        if (goal.value) {
            await goalStore.editUserGoal(goal.value)
        }
    } else {
        console.error('No goal selected for incrementing saved value.')
    }

    // Update the challenge in the store
    await challengeStore.editUserChallenge(challenge)
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

const editChallenge = (challenge: Challenge) => {
    router.push(`/spareutfordringer/${challenge.id}`)
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

// Helper methods to get icons
const getChallengeIcon = (challenge: Challenge): string => {
    return `src/assets/${challenge.type.toLowerCase()}.png`
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
