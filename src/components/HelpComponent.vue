<template>
    <div class="fixed bottom-10 right-10 hover:cursor-pointer z-50" @click="isModalOpen = true">
        <img
            alt="Hjelp"
            class="h-12 transition-transform duration-300 ease-in-out hover:scale-110"
            src="@/assets/hjelp.png"
        />
    </div>
    <ModalComponent v-if="isModalOpen" @close="isModalOpen = false">
        <InteractiveSpare
            :speech="speech"
            :png-size="12"
            direction="right"
            @emit:close="isModalOpen = false"
        />

        <div class="-mb-5 mt-8 text-xs text-gray-500">
            <p class="justify-center items-center">Trykk for å se hva Spare har å si!</p>
            <a
                @click="isModalOpen = false"
                class="underline hover:bg-transparent font-normal text-gray-500 cursor-pointer transition-none hover:transition-none hover:p-0"
            >
                Skip
            </a>
        </div>
    </ModalComponent>
</template>

<script setup lang="ts">
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import { ref } from 'vue'
import ModalComponent from '@/components/ModalComponent.vue'

const isModalOpen = ref(false)

defineProps(['speech'])
</script>
