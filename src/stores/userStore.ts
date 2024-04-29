import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import router from '@/router'
import type { AxiosError } from 'axios'
import axios from 'axios'
import type { CredentialRequestOptions } from '@/types/CredentialRequestOptions'
import { base64urlToUint8array, initialCheckStatus, uint8arrayToBase64url } from '@/util'
import authInterceptor from '@/services/authInterceptor'
import type { CredentialCreationOptions } from '@/types/CredentialCreationOptions'

export const useUserStore = defineStore('user', () => {
    const defaultUser: User = {
        firstname: 'Firstname',
        lastname: 'Lastname',
        username: 'Username'
    }

    const user = ref<User>(defaultUser)
    const errorMessage = ref<string>('')

    const register = async (
        firstname: string,
        lastname: string,
        email: string,
        username: string,
        password: string
    ) => {
        await axios
            .post(`http://localhost:8080/auth/register`, {
                firstName: firstname, //TODO rename all instances of firstname to firstName
                lastName: lastname,
                email: email,
                username: username,
                password: password
            })
            .then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)

                user.value.firstname = firstname
                user.value.lastname = lastname
                user.value.username = username

                router.push({ name: 'configurations1' })
            })
            .catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
            })
    }

    const login = async (username: string, password: string) => {
        await axios
            .post(`http://localhost:8080/auth/login`, {
                username: username,
                password: password
            })
            .then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)

                user.value.firstname = response.data.firstName
                user.value.lastname = response.data.lastName
                user.value.username = response.data.username

                router.push({ name: 'home' })
            })
            .catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
            })
    }

    const logout = () => {
        console.log('Logging out')
        sessionStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        user.value = defaultUser
        router.push({ name: 'login' })
    }

    const registerPasskey = async () => {
        try {
            const response = await authInterceptor.post("/auth/bioRegistration");
            initialCheckStatus(response);

            const credentialCreateJson: CredentialCreationOptions = response.data;

            const credentialCreateOptions: CredentialCreationOptions = {
                publicKey: {
                    ...credentialCreateJson.publicKey,
                    challenge: base64urlToUint8array(credentialCreateJson.publicKey.challenge as unknown as string),
                    user: {
                        ...credentialCreateJson.publicKey.user,
                        id: base64urlToUint8array(credentialCreateJson.publicKey.user.id as unknown as string),
                    },
                    excludeCredentials: credentialCreateJson.publicKey.excludeCredentials?.map(credential => ({
                        ...credential,
                        id: base64urlToUint8array(credential.id as unknown as string),
                    })),
                    extensions: credentialCreateJson.publicKey.extensions,
                },
            };

            const publicKeyCredential = await navigator.credentials.create(credentialCreateOptions) as PublicKeyCredential;

            const publicKeyResponse = publicKeyCredential.response as AuthenticatorAttestationResponse;
            const encodedResult = {
                type: publicKeyCredential.type,
                id: publicKeyCredential.id,
                response: {
                    attestationObject: uint8arrayToBase64url(publicKeyResponse.attestationObject),
                    clientDataJSON: uint8arrayToBase64url(publicKeyResponse.clientDataJSON),
                    transports: publicKeyResponse.getTransports?.() || [],
                },
                clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
            };

            await authInterceptor.post("/auth/finishBioRegistration", { credential: JSON.stringify(encodedResult) });
        } catch (error) {
            console.error(error);
        }
    }

    const bioLogin = async (username: string) => {
        try {
            const request = await axios.post(`http://localhost:8080/auth/bioLogin/${username}`);

            initialCheckStatus(request);
            console.log(request)

            const credentialGetJson: CredentialRequestOptions = request.data;
            console.log(credentialGetJson)

            const credentialGetOptions: CredentialRequestOptions = {
                publicKey: {
                    ...credentialGetJson.publicKey,
                    allowCredentials: credentialGetJson.publicKey.allowCredentials
                        && credentialGetJson.publicKey.allowCredentials.map(credential => ({
                            ...credential,
                            id: base64urlToUint8array(credential.id as unknown as string),
                        })),
                    challenge: base64urlToUint8array(credentialGetJson.publicKey.challenge as unknown as string),
                    extensions: credentialGetJson.publicKey.extensions,
                },
            };

            const publicKeyCredential = await navigator.credentials.get(credentialGetOptions) as PublicKeyCredential;

            // Extract response data based on the type of credential
            const response = publicKeyCredential.response as AuthenticatorAssertionResponse;

            const encodedResult = {
                type: publicKeyCredential.type,
                id: publicKeyCredential.id,
                response: {
                    authenticatorData: response.authenticatorData && uint8arrayToBase64url(response.authenticatorData),
                    clientDataJSON: response.clientDataJSON && uint8arrayToBase64url(response.clientDataJSON),

                    signature: response.signature && uint8arrayToBase64url(response.signature),
                    userHandle: response.userHandle && uint8arrayToBase64url(response.userHandle),
                },
                clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
            };
            console.log(encodedResult);

            await axios.post("http://localhost:8080/auth/finishBioLogin/katanta1", {
                credential: JSON.stringify(encodedResult)
            }).then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)

                user.value.firstname = response.data.firstName
                user.value.lastname = response.data.lastName
                user.value.username = response.data.username

                router.push({ name: 'home' })
            }).catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
                console.log("hei :" + errorMessage.value)
            })
        } catch (error) {
            // Handle errors
            console.log(error);
        }
    }

    return {
        register,
        login,
        logout,
        bioLogin,
        errorMessage
    }
})
