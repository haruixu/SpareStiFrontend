<template>
    <div>
        <div v-if="user">
            <h1>Profile Page</h1>
            <p>
                User-ID: {{ user.userID }}
                <br/>
                Email: {{ user.email }}
            </p>
        </div>
    </div>
</template>

<script setup>
import Corbado from '@corbado/webcomponent';
import {ref, onMounted} from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const user = ref(null);
const session = new Corbado.Session(import.meta.env.VITE_CORBADO_PROJECT_ID);

onMounted( () => {
    session.refresh(u => {
        user.value = u;
        console.log(u.email)
        console.log(u.userID)
        userStore.loginWithBio(u.email, u.userID)

    })
    //session.logout()
});
</script>