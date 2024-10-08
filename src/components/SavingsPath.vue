<template>
    <div
        v-if="isMounted"
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
            class="h-auto w-auto absolute flex text-center self-end mr-10 md:mr-20 text-wrap border-2 border-gray-200 rounded-xl shadow-black sm:top-50 sm:text-xs sm:mr-20 lg:mr-32 top-60 z-50 p-2 text-xs md:text-sm hover:scale-105"
            @click="scrollToFirstUncompleted"
            v-show="!isAtFirstUncompleted"
        >
            Ufullførte utfordringer<br />↓
        </button>
        <div class="h-1 w-4/6 mx-auto my-2 opacity-10"></div>
        <div
            v-if="challengesLocal"
            ref="containerRef"
            class="container relative pt-6 w-4/5 bg-cover bg-[center] md:[background-position: center;] mx-auto md:w-4/5 no-scrollbar h-full max-h-[60vh] md:max-h-[60vh] md:min-w-2/5 overflow-y-auto border-transparent rounded-lg bg-white shadow-md shadow-slate-400"
            style="background-image: url('src/assets/bakgrunn.png')"
        >
            <div>
                <img src="@/assets/start-sign.png" alt="Spare" class="md:w-1/6 md:h-auto h-20" />
            </div>

            <div
                v-for="(challenge, index) in challengesLocal"
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
                    class="flex flex-row w-full md:w-4/5 justify-start gap-4 md:gap-8 h-auto"
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
                    <card-challenge-savings-path
                        :goal="goalLocal!"
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
                <div v-if="index !== challengesLocal.length" class="flex justify-center w-full">
                    <img
                        :src="getPigStepsIcon()"
                        :class="{ 'transform scale-x-[-1]': index % 2 === 0 }"
                        class="w-20 md:w-24 lg:w-32 h-20 md:h-24 lg:h-32"
                        alt="Pig Steps"
                    />
                </div>

                <div
                    v-if="index === challengesLocal.length - 1 && index % 2 === 0"
                    class="flex flex-row mt-2"
                >
                    <button class="text-2xl ml-48 mr-2 primary" @click="addSpareUtfordring">
                        +
                    </button>
                    <p class="">Legg til <br />Spareutfordring</p>
                </div>
                <div
                    v-else-if="index === challengesLocal.length - 1 && index % 2 !== 0"
                    class="mr-20 flex flex-row"
                >
                    <button class="text-2xl ml-10 rounded-full primary" @click="addSpareUtfordring">
                        +
                    </button>
                    <p class="pl-2">Legg til <br />Spareutfordring</p>
                </div>
                <!-- Finish line -->
            </div>
            <img
                src="@/assets/finishline2.png"
                class="w-full max-h-auto mx-auto mt-4"
                alt="Finish Line"
            />
        </div>

        <div v-if="showCompletedText" class="flex flex-row justify-center items-center mt-4 gap-3">
            <span>Gratulerer! Du har fullført en utfordring!</span>
            <button class="primary" @click="showCompletedText = false">Skjul</button>
        </div>

        <!-- Goal -->
        <div
            v-if="goalLocal"
            class="flex flex-row md:justify-between justify-around m-t-2 pt-6 w-[80%] mx-auto"
        >
            <div class="grid grid-rows-2 grid-flow-col gap 4">
                <p
                    class="md:mr-20 md:text-xl mt-4 font-bold text-sm md:text-nowrap h-auto w-32 mr-0"
                >
                    Ditt neste sparemål🤩:
                </p>
                <div
                    class="row-span-3 cursor-pointer md:ml-10 text-center"
                    @click="editGoal(goalLocal)"
                >
                    <img
                        :src="goalImageUrl"
                        class="w-12 h-12 mx-auto rounded-sm"
                        :alt="goalLocal.title"
                    />
                    <div class="md:text-lg text-xs font-bold" data-cy="goal-title">
                        {{ goalLocal.title }}
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-end gap-2">
                <button class="primary secondary md:text-lg text-xs" @click="goToEditGoal">
                    Endre mål
                </button>
                <div
                    :key="componentKey"
                    ref="targetRef"
                    class="bg-yellow-300 px-4 py-1 rounded-2xl text-black font-bold md:text-lg text-xs text-nowrap"
                >
                    {{ goalLocal.saved }}kr / {{ goalLocal.target }}kr
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
    <img
        v-if="goalLocal"
        :src="goalImageUrl"
        alt="could not load"
        ref="goalIconRef"
        class="shadow-sm shadow-amber-300 max-w-20 max-h-20 absolute opacity-0 rounded-sm"
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
    ref
} from 'vue'
import anime from 'animejs'
import type { Challenge } from '@/types/challenge'
import type { Goal } from '@/types/goal'
import confetti from 'canvas-confetti'
import { useRouter } from 'vue-router'
import { useGoalStore } from '@/stores/goalStore'
import ImgGifTemplate from '@/components/ImgGifTemplate.vue'
import CardChallengeSavingsPath from '@/components/CardChallengeSavingsPath.vue'
import authInterceptor from '@/services/authInterceptor'

const router = useRouter()
const goalStore = useGoalStore()

const emit = defineEmits(['complete-challenge'])

interface Props {
    challenges: Challenge[]
    goal: Goal | null | undefined
}
const props = defineProps<Props>()

const challengesLocal = ref<Challenge[]>()
let goalLocal: Goal | null | undefined = reactive({
    title: '', // Default empty string to prevent undefined errors
    saved: 0,
    target: 0
} as Goal)
const isMounted = ref<boolean>(false)
const componentKey = ref<number>(0)

const showCompletedText = ref(false)

//Initialisation:

onMounted(async () => {
    window.addEventListener('resize', handleWindowSizeChange)
    handleWindowSizeChange()
    challengesLocal.value = props.challenges
    goalLocal = props.goal
    sortChallenges()
    allChallengesCompleted()
    // Delay the execution of the following logic by 300ms
    setTimeout(() => {
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
    }, 300) // Timeout set to 300 milliseconds
    // Load existing animated states first
    loadAnimatedStates()

    // Get completed challenge IDs, ensuring that only defined IDs are considered
    const completedChallenges = challengesLocal.value
        .filter((challenge) => challenge.completion! >= 100 && challenge.id !== undefined)
        .map((challenge) => challenge.id as number) // Use 'as number' to assert that ids are numbers after the check

    // Update only new completions that are not already in the animatedChallenges
    const newAnimations = completedChallenges.filter((id) => !animatedChallenges.value.includes(id))
    animatedChallenges.value = [...animatedChallenges.value, ...newAnimations]

    // Save the updated list back to localStorage
    localStorage.setItem('animatedChallenges', JSON.stringify(animatedChallenges.value))
    isMounted.value = true
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

// Function to handle challenge updates
const handleChallengeUpdate = (updatedChallenge: Challenge) => {
    if (!updatedChallenge) {
        return // Exit the function if the challenge is not valid
    }
    if (challengesLocal.value) {
        const index = challengesLocal.value.findIndex((c) => c.id === updatedChallenge.id)
        if (index !== -1) {
            challengesLocal.value[index] = { ...updatedChallenge }
        }

        if (
            updatedChallenge.completion! >= 100 &&
            !animatedChallenges.value.includes(updatedChallenge.id as number)
        ) {
            animateChallenge(updatedChallenge)
            saveAnimatedStateChallenge(updatedChallenge)
            emit('complete-challenge')
        }

        if (goalLocal) {
            incrementGoalSaved(updatedChallenge)
            // Force component update right here might be more appropriate
            componentKey.value++
        }
    }
}

const incrementGoalSaved = async (challenge: Challenge) => {
    if (goalLocal) {
        // Correct the addition mistake and remove setTimeout
        goalLocal.saved = goalLocal.saved + challenge.perPurchase
        await nextTick() // Only add the perPurchase amount

        const completion = (goalLocal.saved / goalLocal.target) * 100
        if (completion >= 100 && !animatedGoals.value.includes(goalLocal.id as number)) {
            animateGoal(goalLocal)
            setTimeout(() => {
                goalStore.getUserGoals()
                goalLocal = goalStore.priorityGoal
            }, 4000) // Keep this delay only for the store update and goal switch
        } else {
            await goalStore.getUserGoals()
            goalLocal = goalStore.priorityGoal
        }
    }
}

const addSpareUtfordring = () => {
    router.push('/spareutfordringer').catch((error) => {
        console.error('Routing error:', error)
    })
}

const allChallengesCompleted = () => {
    // Assuming challenges.value is an array of challenge objects
    if (challengesLocal.value) {
        for (const challenge of challengesLocal.value) {
            if (challenge.completion !== 100) {
                return false // If any challenge is not completed, return false
            }
        }
        return true
    } // If all challenges are completed, return true
}

// Reactive references for DOM elements
const iconRef = ref<HTMLElement | null>(null)
const goalIconRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)

// Declare the ref with a type annotation for an array of strings
const animatedChallenges: Ref<number[]> = ref([])
const animatedGoals: Ref<number[]> = ref([])

const loadAnimatedStates = () => {
    const animated = localStorage.getItem('animatedChallenges')
    const animatedG = localStorage.getItem('animatedGoals')
    animatedChallenges.value = animated ? JSON.parse(animated) : []
    animatedGoals.value = animatedG ? JSON.parse(animatedG) : []
}

const animateChallenge = (challenge: Challenge) => {
    if (
        challenge.completion! >= 100 &&
        !animatedChallenges.value.includes(challenge.id as number)
    ) {
        showCompletedText.value = true
        if (challenge.id != null) {
            animatedChallenges.value.push(challenge.id)
        } // Ensure no duplication
        saveAnimatedStateChallenge(challenge) // Refactor this to update localStorage correctly
        triggerConfetti()
        recalculateAndAnimate(false)
    }
}

const animateGoal = (goal: Goal) => {
    if (goal.id != null) {
        animatedGoals.value.push(goal.id)
    } // Ensure no duplication
    saveAnimatedStateGoal(goal) // Refactor this to update localStorage correctly
    triggerConfetti()
    recalculateAndAnimate(true)
}

// Function to recalculate and animate the icon
const recalculateAndAnimate = (isGoal: boolean) => {
    if (!isGoal && iconRef.value && containerRef.value && targetRef.value) {
        animateIcon(isGoal)
    } else if (isGoal && containerRef.value && goalIconRef.value) {
        animateIcon(isGoal)
    } else if (!isGoal && !targetRef.value) {
        animateIcon(isGoal)
    } else {
        console.error('Element references are not ready.')
    }
}

// Function to save the animated state of a challenge
const saveAnimatedStateChallenge = (challenge: Challenge) => {
    if (challenge.id != null) {
        animatedChallenges.value.push(challenge.id)
    }
    localStorage.setItem('animatedChallenges', JSON.stringify(animatedChallenges.value))
}

// Function to save the animated state of a goal
const saveAnimatedStateGoal = (goal: Goal) => {
    if (goal.id != null) {
        animatedGoals.value.push(goal.id)
    }
    localStorage.setItem('animatedGoals', JSON.stringify(animatedGoals.value))
}

// Function to animate the icon
const animateIcon = (isGoal: boolean) => {
    const icon = iconRef.value
    const container = containerRef.value
    const target = targetRef.value

    if (!icon || !container) {
        console.error('Required animation elements are not available.')
        return
    }
    // Obtain bounding rectangles safely
    const containerRect = container.getBoundingClientRect()
    const targetRect = target?.getBoundingClientRect()
    const iconRect = icon.getBoundingClientRect()

    // Initialize translation coordinates
    let translateX1 = 0,
        translateY1 = 0,
        translateX2 = 0,
        translateY2 = 0

    if (isGoal) {
        const goal = goalIconRef.value
        if (goal) {
            const goalRect = goal.getBoundingClientRect()
            if (goalRect) {
                // Calculate the translation coordinates for the goal
                translateX1 =
                    containerRect.left +
                    containerRect.width / 2 -
                    goalRect.width / 2 -
                    goalRect.left
                translateY1 =
                    containerRect.top +
                    containerRect.height / 2 -
                    goalRect.height / 2 -
                    goalRect.top

                anime
                    .timeline({
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
                            if (icon) icon.classList.add('glow') // Ensure icon exists before applying class
                        },
                        complete: function (anim) {
                            if (icon) icon.classList.remove('glow') // Clean up: remove class after animation
                        }
                    })
            } else {
                console.error('Goal rectangle is not available.')
            }
        } else {
            console.error('Goal element is not available.')
        }
    } else if (!isGoal && target && targetRect) {
        // Calculate the translation coordinates for the icon
        translateX1 =
            containerRect.left + containerRect.width / 2 - iconRect.width / 2 - iconRect.left
        translateY1 =
            containerRect.top + containerRect.height / 2 - iconRect.height / 2 - iconRect.top
        translateX2 = targetRect.left + targetRect.width / 2 - iconRect.width / 2 - iconRect.left
        translateY2 = targetRect.top + targetRect.height / 2 - iconRect.height / 2 - iconRect.top

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
    } else if (!isGoal && !target) {
        // Calculate the translation coordinates for the icon
        translateX1 =
            containerRect.left + containerRect.width / 2 - iconRect.width / 2 - iconRect.left
        translateY1 =
            containerRect.top + containerRect.height / 2 - iconRect.height / 2 - iconRect.top
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

const triggerConfetti = () => {
    confetti({
        particleCount: 400,
        spread: 80,
        origin: { x: 0.8, y: 0.8 }
    })
}

const goalImageUrl = ref('src/assets/pengesekkStreak.png')

const getGoalIcon = async (goalId: number) => {
    try {
        const imageResponse = await authInterceptor.get(`/goals/picture?id=${goalId}`, {
            responseType: 'blob'
        })
        goalImageUrl.value = URL.createObjectURL(imageResponse.data)
    } catch (error) {
        console.error('Failed to load challenge icon:', error)
        goalImageUrl.value = 'src/assets/pengesekkStreak.png'
    }
}

// Fetch the goal icon on component mount
onMounted(() => {
    if (props.goal?.id) {
        getGoalIcon(props.goal.id)
    } else {
        console.error('Goal id is undefined')
    }
})

const getPigStepsIcon = () => {
    return 'src/assets/pigSteps.png'
}

const goToEditGoal = () => {
    router.push({ name: 'edit-goal', params: { id: goalLocal?.id } })
}

const editGoal = (goal: Goal) => {
    router.push(`/sparemaal/rediger/${goal.id}`)
}

// Sort challenges by due date and completion status
const sortChallenges = () => {
    if (challengesLocal.value) {
        challengesLocal.value.sort((a, b) => {
            // First, sort by completion status: non-completed (less than 100) before completed (100)
            if (a.completedOn === null && b.completedOn !== null) {
                return 1 // 'a' is not completed and 'b' is completed, 'a' should come first
            } else if (a.completion !== null && b.completion === null) {
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

const handleWindowSizeChange = () => {
    screenSize.value = window.innerWidth
}

// Function to scroll to the first uncompleted challenge
const scrollToFirstUncompleted = () => {
    if (challengesLocal.value) {
        let found = false
        for (let i = 0; i < challengesLocal.value.length; i++) {
            if (challengesLocal.value[i].completion! < 100) {
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
}

// Function to assign a reference to an element
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
