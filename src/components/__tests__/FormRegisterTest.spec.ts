import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FormRegister from '../FormRegister.vue' // Change this to your registration component
import { createPinia } from 'pinia'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('FormRegister', () => {
    let wrapper: any
    let mock: MockAdapter

    beforeEach(() => {
        wrapper = mount(FormRegister, {
            global: {
                plugins: [createPinia()]
            }
        })

        mock = new MockAdapter(axios)
    })

    afterEach(() => {
        mock.restore()
    })

    function successfulFormFill() {
        wrapper.find('input[name="firstName"]').setValue('firstName')
        wrapper.find('input[name="lastName"]').setValue('lastName')
        wrapper.find('input[name="email"]').setValue('email@test.work')
        wrapper.find('input[name="username"]').setValue('username')
        wrapper.find('input[name="password"]').setValue('Password123!')
        wrapper.find('input[name="confirm"]').setValue('Password123!')
    }

    it('renders properly', () => {
        expect(wrapper.text()).toContain('Brukernavn')
        expect(wrapper.text()).toContain('Passord')
        expect(wrapper.text()).toContain('Registrer deg')

        expect(wrapper.find('input[name="firstName"]').exists()).toBe(true)
        expect(wrapper.find('input[name="lastName"]').exists()).toBe(true)
        expect(wrapper.find('input[name="email"]').exists()).toBe(true)
        expect(wrapper.find('input[name="username"]').exists()).toBe(true)
        expect(wrapper.find('input[name="password"]').exists()).toBe(true)
        expect(wrapper.find('input[name="confirm"]').exists()).toBe(true)

        expect((wrapper.find('input[name="firstName"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[name="lastName"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[name="email"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[name="username"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[name="password"]').element as HTMLInputElement).value).toBe('')
        expect((wrapper.find('input[name="confirm"]').element as HTMLInputElement).value).toBe('')

        expect(wrapper.find('button[name="submit"]').exists()).toBe(true)
    })

    it('disables button when none inputs are filled', () => {
        const button = wrapper.find('button[name="submit"]')
        expect(button.attributes('disabled')).toBeDefined()
    })

    it('enables button when all inputs are filled', async () => {
        const button = wrapper.find('button[name="submit"]')

        successfulFormFill()

        await wrapper.vm.$nextTick()

        expect(button.attributes('disabled')).toBeUndefined()
    })

    it('disables button when password and confirm password do not match', async () => {
        const button = wrapper.find('button[name="submit"]')

        successfulFormFill()
        wrapper.find('input[name="confirm"]').setValue('Password123')

        await wrapper.vm.$nextTick()

        expect(button.attributes('disabled')).toBeDefined()
    })

    it('disable button when email is invalid', async () => {
        const button = wrapper.find('button[name="submit"]')

        successfulFormFill()
        wrapper.find('input[name="email"]').setValue('email')

        await wrapper.vm.$nextTick()

        expect(button.attributes('disabled')).toBeDefined()
    })
})
