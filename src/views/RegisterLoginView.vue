<script setup lang="ts">
import FormLogin from '@/components/FormLogin.vue'
import FormRegister from '@/components/FormRegister.vue'
import { onMounted, ref } from 'vue'
import router from '@/router'

const isLogin = ref<boolean>(true)

onMounted(() => {
    isLogin.value = router.currentRoute.value.path === '/logginn'
})
</script>

<template>
    <div class="flex flex-col items-center gap-5 justify-center md:flex-row h-screen">
        <div class="flex items-center justify-center md:w-2/3">
            <img
                src="@/assets/spare_og_sti.png"
                alt="Spare og sti logo"
                class="w-5/6 ml-10 md:mb-64"
            />
        </div>
        <div class="flex flex-col md:mr-10 md:mt-20 md:w-1/3 h-screen justify-start">
            <div class="flex flex-row gap-5 justify-center">
                <h3
                    :class="{ selected: isLogin }"
                    class="cursor-pointer"
                    tabindex="0"
                    @click="isLogin = true"
                    @keydown.enter.prevent="isLogin = true"
                >
                    Logg inn
                </h3>
                <h3
                    :class="{ selected: !isLogin }"
                    class="cursor-pointer"
                    tabindex="0"
                    @click="isLogin = false"
                    @keydown.enter.prevent="isLogin = false"
                >
                    Registrer deg
                </h3>
            </div>
            <FormLogin v-if="isLogin" />
            <FormRegister v-else />
        </div>
    </div>
</template>

<style scoped>
.selected {
    border-bottom: 2px solid black;
}
</style>
