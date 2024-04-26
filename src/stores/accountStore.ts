import { defineStore } from 'pinia'
import { ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import axios, { AxiosError } from 'axios'

export const useAccountStore = defineStore('account', {
    state: () => ({
        accounts: [] as {
            accountType: 'SAVING' | 'SPENDING'
            accNumber: string
            balance: number
        }[],
        errorMessage: ref<string>('')
    }),
    actions: {
        addAccount(accountType: 'SAVING' | 'SPENDING', accNumber: string) {
            const account = {
                accountType,
                accNumber,
                balance: 1
            }
            this.accounts.push(account)
        },
        postAccount(account: {
            accountType: 'SAVING' | 'SPENDING'
            accNumber: string
            balance: number
        }) {
            const payload = {
                accountType: account.accountType,
                accNumber: account.accNumber,
                balance: account.balance
            }

            authInterceptor
                .post('/accounts', payload)
                .then((response) => {
                    console.log('Success:', response.data)
                })
                .catch((error) => {
                    const axiosError = error as AxiosError
                    if (axiosError.response && axiosError.response.data) {
                        const errorData = axiosError.response.data as { message: string }
                        this.errorMessage = errorData.message || 'An error occurred'
                    } else {
                        this.errorMessage = 'An unexpected error occurred'
                    }
                    console.error('Axios error:', this.errorMessage)
                })
        },
        async postAllAccounts() {
            for (const account of this.accounts) {
                this.postAccount(account)
            }
        }
    }
})
