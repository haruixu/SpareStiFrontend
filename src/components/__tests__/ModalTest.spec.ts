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
                isInputValid: true,
            }
        })
    })

    it('opens modal when button is clicked', async () => {
        expect(wrapper.props().isModalOpen).toBe(true);
    })

    it('closes modal when close button is clicked', async () => {
        await wrapper.setProps({ isModalOpen: true });
        await wrapper.vm.$nextTick();

        const closeButton = wrapper.find('button[aria-label="close"]');
        if (closeButton.exists()) {
            await closeButton.trigger('click');

            expect(wrapper.emitted()['update:isModalOpen']).toBeTruthy();
            expect(wrapper.emitted()['update:isModalOpen'][0]).toEqual([false]);
        } else {
            throw new Error('Close button not found');
        }
    });

    it('button is shown when showButton is true', async () => {
        expect(wrapper.props().showButton).toBe(true);
        expect(wrapper.find('.active-button').exists()).toBe(true);
    });

    it('button is not shown when showButton is false', async () => {
        await wrapper.setProps({ showButton: false });
        await wrapper.vm.$nextTick();

        expect(wrapper.props().showButton).toBe(false);
        expect(wrapper.find('.active-button').exists()).toBe(false);
    });

    it('input is shown when showInput is true', async () => {
        await wrapper.setProps({ showInput: true });
        await wrapper.vm.$nextTick();

        expect(wrapper.props().showInput).toBe(true);
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('input is not shown when showInput is false', async () => {
        expect(wrapper.props().showInput).toBe(false);
        expect(wrapper.find('input').exists()).toBe(false);
    });
})
