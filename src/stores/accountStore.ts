import { defineStore } from 'pinia'
import { ref } from 'vue'
import authInterceptor from '@/services/authInterceptor'
import axios, { AxiosError } from 'axios'

export const useAccountStore = defineStore('account', {
    state: () => ({
        errorMessage: ref<string>('')
    }),
    actions: {
        async postAccount(accountType: 'SAVING' | 'SPENDING', accNumber: string, balance: number) {
            const payload = {
                accountType,
                accNumber,
                balance
            }

            try {
                const response = await authInterceptor.post('/accounts', payload);
                console.log('Success:', response.data);
            } catch (error) {
                console.error('Error posting account:', error);
                this.handleAxiosError(error);
            }
        },
        handleAxiosError(error: any) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.data) {
                const errorData = axiosError.response.data as { message: string };
            } else {
                this.errorMessage = 'An unexpected error occurred';
            }
        }
    }
});
