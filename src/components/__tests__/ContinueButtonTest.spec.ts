import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContinueButtonComponent from '@/components/ContinueButtonComponent.vue'

describe('ContinueButtonComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(ContinueButtonComponent)
        expect(wrapper.text()).toContain('Fortsett')
    })

    it('is disabled when the `disabled` prop is true', () => {
        const wrapper = mount(ContinueButtonComponent, {
            props: { disabled: true }
        })
        const button = wrapper.find('button')
        expect(button.attributes('disabled')).toBeDefined()
        expect(button.classes()).toContain('opacity-60')
        expect(button.classes()).toContain('cursor-not-allowed')
    })

    it('does not emit click event when disabled', async () => {
        const wrapper = mount(ContinueButtonComponent, {
            props: { disabled: true }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted()).not.toHaveProperty('click')
    })

    it('emits click event when not disabled', async () => {
        const wrapper = mount(ContinueButtonComponent, {
            props: { disabled: false }
        })
        await wrapper.trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
    })
})
