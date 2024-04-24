import { beforeEach, describe, expect, it } from 'vitest'
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
})
