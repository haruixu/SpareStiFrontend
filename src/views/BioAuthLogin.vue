<template>
    <corbado-auth :project-id="corbadoProjectID" conditional="yes">
        <input name="username" id="corbado-username" required autocomplete="webauthn"/>
    </corbado-auth>
    <button @click="testAPIMethod">TestAPI</button>
</template>

<script setup>
import '@corbado/webcomponent/pkg/auth_cui.css'
import '@corbado/webcomponent'
import {ref} from 'vue'
import axios from 'axios'
const corbadoProjectID = ref(import.meta.env.VITE_CORBADO_PROJECT_ID)


const testAPIMethod = async () => {
    await axios
        .post("https://" + corbadoProjectID.value + ".frontendapi.corbado.io/v1/users/passkey/register/start", {
            username: "larsmiloni3@gmail.com",
            fullName: "Lars Mikke Nilsen"
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
}
</script>