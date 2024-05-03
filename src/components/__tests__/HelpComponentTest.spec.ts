import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HelpComponent from '@/components/HelpComponent.vue'
import InteractiveSpare from '@/components/InteractiveSpare.vue'
import ModalComponent from '@/components/ModalComponent.vue'

describe('HelpComponent', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(HelpComponent, {
            props: {
                speech: ['Sample Speech'], // Pass as an array
            }
        })
    })

    it('initially, the modal should not be open', () => {
        expect(wrapper.vm.isModalOpen).toBe(false)
    })

    it('should open the modal when the image is clicked', async () => {
        await wrapper.find('.fixed').trigger('click');
        expect(wrapper.vm.isModalOpen).toBe(true);
    })

    it('should close the modal when the skip link is clicked', async () => {
        wrapper.vm.isModalOpen = true;
        await wrapper.vm.$nextTick();

        if (wrapper.find('a').exists()) {
            await wrapper.find('a').trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.isModalOpen).toBe(false);
        } else {
            throw new Error('Skip link is not rendered');
        }
    });

    it('modal should render the correct speech text to the InteractiveSpare component when modal is open', async () => {
        wrapper.vm.isModalOpen = true;
        await wrapper.vm.$nextTick();

        const interactiveSpare = wrapper.findComponent(InteractiveSpare);
        if (interactiveSpare.exists()) {
            expect(interactiveSpare.props('speech')).toEqual(['Sample Speech']); // Pass as an array
        } else {
            throw new Error('InteractiveSpare component is not rendered');
        }
    })

    it('should close the modal when close event is emitted by the ModalComponent', async () => {
        wrapper.vm.isModalOpen = true;
        await wrapper.vm.$nextTick();

        wrapper.findComponent(ModalComponent).vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isModalOpen).toBe(false);
    })
})
