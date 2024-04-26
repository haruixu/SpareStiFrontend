<script lang="ts" setup>
import authInterceptor from '@/services/authInterceptor'
import { onMounted } from 'vue'

onMounted(async () => {
    await authInterceptor
        .get('/config')
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
})
</script>

<template>
    <h1>Din profil</h1>
</template>

<style scoped></style>
