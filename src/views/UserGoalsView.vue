<script lang="ts" setup>
import CardGoal from '@/components/CardGoal.vue'
import PageControl from '@/components/PageControl.vue'

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const router = useRouter()

const currentPage = ref(1)
const totalPages = ref(1)

onMounted(() => {
    try {
        const response = axios.get('http://localhost:8080/users/me/goals', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
    } catch (error) {
        console.error(error)
    }
})
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
