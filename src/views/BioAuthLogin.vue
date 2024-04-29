<template>
    <button @click="testSignUp">Signup</button>
    <button @click="testLogin">Login</button>
</template>

<script setup>
import axios from 'axios'
import { base64urlToUint8array, initialCheckStatus, uint8arrayToBase64url } from '@/utilo.js'
import authInterceptor from '@/services/authInterceptor'

const testSignUp = async () => {
    await authInterceptor
        .post("/auth/bioRegistration")
        .then(response => {
            initialCheckStatus(response)
            return response.data
        })
        .then(credentialCreateJson => ({
            publicKey: {
                ...credentialCreateJson.publicKey,
                challenge: base64urlToUint8array(credentialCreateJson.publicKey.challenge),
                user: {
                    ...credentialCreateJson.publicKey.user,
                    id: base64urlToUint8array(credentialCreateJson.publicKey.user.id),
                },
                excludeCredentials: credentialCreateJson.publicKey.excludeCredentials.map(credential => ({
                    ...credential,
                    id: base64urlToUint8array(credential.id),
                })),
                extensions: credentialCreateJson.publicKey.extensions,
            },
        }))
        .then(credentialCreateOptions => {
            return navigator.credentials.create(credentialCreateOptions)
        })
        .then(publicKeyCredential => ({
            type: publicKeyCredential.type,
            id: publicKeyCredential.id,
            response: {
                attestationObject: uint8arrayToBase64url(publicKeyCredential.response.attestationObject),
                clientDataJSON: uint8arrayToBase64url(publicKeyCredential.response.clientDataJSON),
                transports: publicKeyCredential.response.getTransports && publicKeyCredential.response.getTransports() || [],
            },
            clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
        }))
        .then((encodedResult) =>
            authInterceptor.post("/auth/finishBioRegistration", { credential: JSON.stringify(encodedResult) }
        ))
        .catch((error) =>
            console.log(error)
        );
}


const testLogin = async () => {
    await axios.post("http://localhost:8080/auth/bioLogin/katanta1")
        // Collect from login form
        .then(response => {
            initialCheckStatus(response)
            return response.data
        })
        .then(credentialGetJson => {
            console.log(credentialGetJson);
            return {
                publicKey: {
                    ...credentialGetJson.publicKey,
                    allowCredentials: credentialGetJson.publicKey.allowCredentials
                        && credentialGetJson.publicKey.allowCredentials.map(credential => ({
                            ...credential,
                            id: base64urlToUint8array(credential.id),
                        })),
                    challenge: base64urlToUint8array(credentialGetJson.publicKey.challenge),
                    extensions: credentialGetJson.publicKey.extensions,
                },
            };
        })
        .then(credentialGetOptions => {
            return navigator.credentials.get(credentialGetOptions)
        })
        .then(publicKeyCredential => ({
            type: publicKeyCredential.type,
            id: publicKeyCredential.id,
            response: {
                authenticatorData: uint8arrayToBase64url(publicKeyCredential.response.authenticatorData),
                clientDataJSON: uint8arrayToBase64url(publicKeyCredential.response.clientDataJSON),
                signature: uint8arrayToBase64url(publicKeyCredential.response.signature),
                userHandle: publicKeyCredential.response.userHandle && uint8arrayToBase64url(publicKeyCredential.response.userHandle),
            },
            clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
        }))
        .then((encodedResult) => {
            console.log(encodedResult)
            axios.post("http://localhost:8080/auth/finishBioLogin/katanta1", {
                    credential: JSON.stringify(encodedResult)
            })
        })
        .catch(error => console.log(error))
}
</script>
