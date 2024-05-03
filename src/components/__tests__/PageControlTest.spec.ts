import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PageControl from '../PageControl.vue'

describe('PageControl', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(PageControl, {
            props: {
                currentPage: 0,
                totalPages: 10
            }
        })
    })

    it('renders correctly', () => {
        expect(wrapper.text()).toContain('1 / 10')
        expect(wrapper.find('button', { text: 'Forrige' }).exists()).toBe(true)
        expect(wrapper.find('button', { text: 'Neste' }).exists()).toBe(true)
    })

    it('disables the "Forrige" button and enables the "Neste" button when currentPage is 0', () => {
        expect(wrapper.find('button', { text: 'Forrige' }).attributes('disabled')).toBe('')
        expect(wrapper.find('button', { text: 'Neste' }).attributes('disabled')).toBe('')
    })

    it('enables both buttons when currentPage is more than 0 and less than totalPages', async () => {
        await wrapper.setProps({ currentPage: 1 })
        expect(wrapper.find('button', { text: 'Forrige' }).attributes('disabled')).toBeUndefined()
        expect(wrapper.find('button', { text: 'Neste' }).attributes('disabled')).toBeUndefined()
    })

    it('enables the "Forrige" button and disables the "Neste" button when currentPage is equal to totalPages - 1', async () => {
        await wrapper.setProps({ currentPage: 9 })
        expect(wrapper.find('button', { text: 'Forrige' }).attributes('disabled')).toBeUndefined()
        expect(wrapper.find('button', { text: 'Neste' }).attributes('disabled')).toBeUndefined()
    })
})
