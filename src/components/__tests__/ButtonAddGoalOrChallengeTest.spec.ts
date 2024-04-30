import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonComponent from '@/components/ButtonAddGoalOrChallenge.vue'

describe('ButtonComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(ButtonComponent, {
            props: {
                buttonText: 'Click me',
                type: 'goal'
            }
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('displays the correct button text', () => {
        const wrapper = mount(ButtonComponent, {
            props: {
                buttonText: 'Submit',
                type: 'goal'
            }
        })
        const buttonText = wrapper.find('span.truncate')
        expect(buttonText.text()).toBe('Submit')
    })
})
