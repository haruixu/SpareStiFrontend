import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import router from '@/router'
import type { AxiosError } from 'axios'
import axios from 'axios'
import authInterceptor from '@/services/authInterceptor'
import type { Streak } from '@/types/streak'
import type { CredentialRequestOptions } from '@/types/CredentialRequestOptions'
import { base64urlToUint8array, initialCheckStatus, uint8arrayToBase64url } from '@/util'
import type { CredentialCreationOptions } from '@/types/CredentialCreationOptions'

export const useUserStore = defineStore('user', () => {
    // Reactive state to hold the user information
    const user = ref<User>({
        firstName: '',
        lastName: '',
        username: '',
        isConfigured: false
    })
    const errorMessage = ref<string>('')
    const streak = ref<Streak>()
    const profilePicture = ref<string>('')

    // Function to register a new user
    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        username: string,
        password: string
    ) => {
        await axios
            .post(`http://localhost:8080/auth/register`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password
            })
            .then((response) => {
                // Save access token in session storage
                sessionStorage.setItem('accessToken', response.data.accessToken)

                // Update user information
                user.value.firstName = firstName
                user.value.lastName = lastName
                user.value.username = username

                router.push({ name: 'configure-biometric' })
            })
            .catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
            })
    }

    // Function to log in a user
    const login = (username: string, password: string) => {
        axios
            .post(`http://localhost:8080/auth/login`, {
                username: username,
                password: password
            })
            .then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)

                user.value.firstName = response.data.firstName
                user.value.lastName = response.data.lastName
                user.value.username = response.data.username

                return authInterceptor('/profile')
            })
            .then((profileResponse) => {
                // Check if the user has a passkey and store spare username if needed
                if (profileResponse.data.hasPasskey === true) {
                    localStorage.setItem('spareStiUsername', username)
                } else {
                    localStorage.removeItem('spareStiUsername')
                }
                // Check if the user is configured and redirect accordingly
                return checkIfUserConfigured()
            })
            .then(() => {
                user.value.isConfigured
                    ? router.push({ name: 'home' })
                    : router.push({ name: 'configure-biometric' })
            })
            .catch((error) => {
                const axiosError = error as AxiosError
                errorMessage.value = (axiosError.response?.data as string) || 'An error occurred'
            })
    }

    // Method to log out a user
    const logout = () => {
        // Remove access token and spare username from storage
        sessionStorage.removeItem('accessToken')
        localStorage.removeItem('spareStiUsername')

        // Clear user information
        user.value.firstName = ''
        user.value.lastName = ''
        user.value.username = ''
        user.value.isConfigured = false

        router.push({ name: 'login' })
    }

    // Method to retrieve user's streak
    const getUserStreak = () => {
        authInterceptor('/profile/streak')
            .then((response) => {
                streak.value = response.data
            })
            .catch((error) => {
                console.error('Error fetching challenges:', error)
                streak.value = undefined
            })
    }

    // Method to register biometric data
    const bioRegister = async (): Promise<boolean | null> => {
        // Send biometric registration request to the server
        let response = null
        await authInterceptor
            .post('/auth/bioRegistration')
            .then((response) => {
                initialCheckStatus(response)

                // Process credential creation options
                const credentialCreateJson: CredentialCreationOptions = response.data

                // Transform credential creation options
                const credentialCreateOptions: CredentialCreationOptions = {
                    publicKey: {
                        ...credentialCreateJson.publicKey,
                        challenge: base64urlToUint8array(
                            credentialCreateJson.publicKey.challenge as unknown as string
                        ),
                        user: {
                            ...credentialCreateJson.publicKey.user,
                            id: base64urlToUint8array(
                                credentialCreateJson.publicKey.user.id as unknown as string
                            )
                        },
                        excludeCredentials: credentialCreateJson.publicKey.excludeCredentials?.map(
                            (credential) => ({
                                ...credential,
                                id: base64urlToUint8array(credential.id as unknown as string)
                            })
                        ),
                        extensions: credentialCreateJson.publicKey.extensions
                    }
                }

                // Create credential using browser's credentials API
                return navigator.credentials.create(
                    credentialCreateOptions
                ) as Promise<PublicKeyCredential>
            })
            .then((publicKeyCredential) => {
                // Process the created credential
                const publicKeyResponse =
                    publicKeyCredential.response as AuthenticatorAttestationResponse
                const encodedResult = {
                    type: publicKeyCredential.type,
                    id: publicKeyCredential.id,
                    response: {
                        attestationObject: uint8arrayToBase64url(
                            publicKeyResponse.attestationObject
                        ),
                        clientDataJSON: uint8arrayToBase64url(publicKeyResponse.clientDataJSON),
                        transports: publicKeyResponse.getTransports?.() || []
                    },
                    clientExtensionResults: publicKeyCredential.getClientExtensionResults()
                }

                // Send encoded result to complete biometric registration
                return authInterceptor.post('/auth/finishBioRegistration', {
                    credential: JSON.stringify(encodedResult)
                })
            })
            .then(() => {
                localStorage.setItem('spareStiUsername', user.value.username)
                response = true
            })
            .catch((error) => {
                console.error(error)
                response = false
            })
        return response
    }

    // Method to login using biometric data
    const bioLogin = (username: string) => {
        axios
            .post(`http://localhost:8080/auth/bioLogin/${username}`)
            .then((request) => {
                initialCheckStatus(request)

                const credentialGetJson: CredentialRequestOptions = request.data

                const credentialGetOptions: CredentialRequestOptions = {
                    publicKey: {
                        ...credentialGetJson.publicKey,
                        allowCredentials: credentialGetJson.publicKey.allowCredentials?.map(
                            (credential) => ({
                                ...credential,
                                id: base64urlToUint8array(credential.id as unknown as string)
                            })
                        ),
                        challenge: base64urlToUint8array(
                            credentialGetJson.publicKey.challenge as unknown as string
                        ),
                        extensions: credentialGetJson.publicKey.extensions
                    }
                }

                return navigator.credentials.get(
                    credentialGetOptions
                ) as Promise<PublicKeyCredential>
            })
            .then((publicKeyCredential) => {
                const response = publicKeyCredential.response as AuthenticatorAssertionResponse

                const encodedResult = {
                    type: publicKeyCredential.type,
                    id: publicKeyCredential.id,
                    response: {
                        authenticatorData:
                            response.authenticatorData &&
                            uint8arrayToBase64url(response.authenticatorData),
                        clientDataJSON:
                            response.clientDataJSON &&
                            uint8arrayToBase64url(response.clientDataJSON),
                        signature: response.signature && uint8arrayToBase64url(response.signature),
                        userHandle:
                            response.userHandle && uint8arrayToBase64url(response.userHandle)
                    },
                    clientExtensionResults: publicKeyCredential.getClientExtensionResults()
                }

                return axios.post(`http://localhost:8080/auth/finishBioLogin/${username}`, {
                    credential: JSON.stringify(encodedResult)
                })
            })
            .then((response) => {
                sessionStorage.setItem('accessToken', response.data.accessToken)

                user.value.firstName = response.data.firstName
                user.value.lastName = response.data.lastName
                user.value.username = response.data.username

                router.push({ name: 'home' })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    // Method to check if the user is configured
    const checkIfUserConfigured = async () => {
        await authInterceptor('/config')
            .then((response) => {
                user.value.isConfigured = response.data.challengeConfig != null
            })
            .catch(() => {
                user.value.isConfigured = false
            })
    }

    // Method to upload user's profile picture
    const uploadProfilePicture = async (formData: FormData) => {
        try {
            const response = await authInterceptor.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log('Upload successful:', response.data)
        } catch (error: any) {
            console.error('Failed to upload profile picture:', error.response.data)
        }
    }

    // Method to retrieve user's profile picture
    const getProfilePicture = async () => {
        try {
            const imageResponse = await authInterceptor.get('/profile/picture', {
                responseType: 'blob'
            })
            // Ensure the response is indeed an image
            if (imageResponse.data.type.startsWith('image/')) {
                profilePicture.value = URL.createObjectURL(imageResponse.data)
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
                console.error('No profile picture found:', error.response.data)
            } else {
                console.error('Error fetching profile picture:', error)
            }
            profilePicture.value = ''
        }
    }

    // Return the variables and methods to be used by components
    return {
        user,
        checkIfUserConfigured,
        register,
        login,
        logout,
        bioLogin,
        bioRegister,
        errorMessage,
        getUserStreak,
        streak,
        uploadProfilePicture,
        getProfilePicture,
        profilePicture
    }
})
