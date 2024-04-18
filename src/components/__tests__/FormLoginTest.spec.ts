import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FormLogin from '../FormLogin.vue'
import { createPinia } from 'pinia'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('FormLogin', () => {
    let wrapper: any
    let mock: MockAdapter

    beforeEach(() => {
        wrapper = mount(FormLogin, {
            global: {
                plugins: [createPinia()]
            }
        })

        mock = new MockAdapter(axios)
    })

    afterEach(() => {
        mock.restore()
    })

    it('renders properly', () => {
        expect(wrapper.text()).toContain('Brukernavn')
        expect(wrapper.text()).toContain('Passord')
        expect(wrapper.text()).toContain('Logg inn')

        expect(wrapper.find('input[type="text"]').exists()).toBe(true)
        expect(wrapper.find('input[type="password"]').exists()).toBe(true)
        expect(wrapper.find('button').exists()).toBe(true)

        expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[type="password"]').element as HTMLInputElement).value).toBe('')
    })

    it('disables button when none inputs are filled', () => {
        const button = wrapper.findAll('button').find((b: any) => b.text() === 'Logg inn')
        expect(button.attributes('disabled')).toBeDefined()
    })

    it('disables button when only username is filled', () => {
        const button = wrapper.findAll('button').find((b: any) => b.text() === 'Logg inn')

        const inputUsername = wrapper.find('input[type="text"]')
        inputUsername.setValue('username')
        expect(button.attributes('disabled')).toBeDefined()
    })

    it('disables button when only password is filled', () => {
        const button = wrapper.findAll('button').find((b: any) => b.text() === 'Logg inn')

        const inputPassword = wrapper.find('input[type="password"]')
        inputPassword.setValue('password')
        expect(button.attributes('disabled')).toBeDefined()
    })

    it('enables button when input', async () => {
        const button = wrapper.findAll('button').find((b: any) => b.text() === 'Logg inn')
        const inputUsername = wrapper.find('input[type="text"]')
        const inputPassword = wrapper.find('input[type="password"]')

        inputUsername.setValue('username')
        inputPassword.setValue('password')
        await wrapper.vm.$nextTick()

        expect(button.attributes('disabled')).toBeUndefined()
    })
})
