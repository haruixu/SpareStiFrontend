<script lang="ts" setup>
import CardGoal from '@/components/CardGoal.vue'
import PageControl from '@/components/PageControl.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <h1 class="font-bold text-center">Dine sparemål</h1>
    <div class="flex flex-col gap-5 items-center">
        <div class="flex flex-col justify-center gap-10 sm:flex-row">
            <CardGoal />
            <CardGoal />
            <CardGoal />
        </div>
        <PageControl />
        <button @click="router.push('/sparemaal/ny')">Opprett et nytt sparemål</button>
    </div>
</template>

<style scoped></style>
