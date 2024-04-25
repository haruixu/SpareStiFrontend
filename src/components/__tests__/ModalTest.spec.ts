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
                isModalOpen: true,
            }
        })
    })

    it('opens modal when button is clicked', async () => {
        expect(wrapper.props().isModalOpen).toBe(true)
    })

    it('title should be: Test Title', () => {
        expect(wrapper.find('.title').text()).toBe('Test Title')
    })

    it('title should not be: Wrong Title', () => {
        expect(wrapper.find('.title').text()).not.toBe('Wrong Title')

    })

    it('message should be: Test Message', () => {
        expect(wrapper.find('.message').text()).toBe('Test Message')
    })

    it('message should not be: Wrong Message', () => {
        expect(wrapper.find('.message').text()).not.toBe('Wrong Message')
    })
})
