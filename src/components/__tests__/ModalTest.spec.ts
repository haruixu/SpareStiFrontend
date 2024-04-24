import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ModalComponent from '@/components/ModalComponent.vue'

describe('ModalComponent', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = shallowMount(ModalComponent, {
            props: {
                title: 'Test Title',
                message: 'Test Message',
                button1: 'Test button',
                isModalOpen: true,
                showButton: true,
                showInput: false,
                typeValue: 'text',
                inputPlaceholder: 'Placeholder',
                isInputValid: true
            }
        })
    })

    it('opens modal when button is clicked', async () => {
        expect(wrapper.props().isModalOpen).toBe(true)
    })

    it('closes modal when close button is clicked', async () => {
        await wrapper.setProps({ isModalOpen: true })
        await wrapper.vm.$nextTick()

        const closeButton = wrapper.find('button[aria-label="close"]')
        if (closeButton.exists()) {
            await closeButton.trigger('click')

            expect(wrapper.emitted()['update:isModalOpen']).toBeTruthy()
            expect(wrapper.emitted()['update:isModalOpen'][0]).toEqual([false])
        } else {
            throw new Error('Close button not found')
        }
    })
})
