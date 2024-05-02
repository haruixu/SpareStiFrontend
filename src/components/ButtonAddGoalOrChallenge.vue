<template>
    <button
        class="w-full max-w-60 max-h-12 font-bold py-2 rounded-full flex items-center justify-start pl-4 space-x-2 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 shadow-md transition duration-300 ease-in-out text-xs md:text-sm lg:text-base"
        @click="routeToGoalOrChallenge"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            />
        </svg>
        <span class="truncate">{{ btnText }}</span>
    </button>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    buttonText: String,
    type: String,
    showModal: Boolean
})

const emit = defineEmits(['update:showModal'])

const router = useRouter()

const btnText = ref(props.buttonText)

const routeToGoalOrChallenge = () => {
    if (props.type === 'goal') {
        router.push('/sparemaal')
    } else if (props.type === 'challenge') {
        router.push('/spareutfordringer')
    } else if (props.type === 'generatedChallenge') {
        emit('update:showModal', true)
    }
}
</script>
