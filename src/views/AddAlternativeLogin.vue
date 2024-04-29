<template>
    <div class="alt-login-main">
        <h1>Alternativ innlogging</h1>
        <div class="img-div">
            <img src="@/assets/bioAuthTouch.png" alt="bioAuthTouch">
            <img src="@/assets/bioAuthFace.png" alt="bioAuthFace">
        </div>
        <h2>Vil du logge på med touch eller face id?</h2>
        <div class="btn-div">
            <button @click="router.push('konfigurasjonSteg1')">Senere</button>
            <button @click="userStore.bioRegister()">OK</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const userStore = useUserStore()
</script>

<style scoped>
.alt-login-main {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.img-div {
    display: flex;
    justify-content: center;
}

img {
    width: 30%;
}

img:first-child {
    margin-right: 20px;
}

button {
    margin: 10px;
    width: 100px;
    height: 40px;
}
</style>