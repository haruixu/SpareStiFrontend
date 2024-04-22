import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ButtonComponent from '@/components/ButtonAddGoalOrChallange.vue' // Adjust the import path as needed.

describe('ButtonComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(ButtonComponent, {
            props: {
                buttonText: 'Click me'
            }
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('has the correct classes', () => {
        const wrapper = mount(ButtonComponent, {
            props: {
                buttonText: 'Click me'
            }
        })
        const button = wrapper.find('button')
        const expectedClasses = [
            'w-full',
            'max-w-60',
            'max-h-12',
            'bg-green-500',
            'text-white',
            'font-bold',
            'py-2',
            'rounded-full',
            'flex',
            'items-center',
            'justify-start',
            'pl-4',
            'space-x-2',
            'hover:bg-green-600',
            'drop-shadow-lg',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-green-700',
            'focus:ring-opacity-50',
            'shadow-md',
            'transition',
            'duration-300',
            'ease-in-out',
            'text-xs',
            'md:text-sm',
            'lg:text-base'
        ]
        expectedClasses.forEach((cls) => {
            expect(button.classes()).toContain(cls)
        })
    })

    it('displays the correct button text', () => {
        const wrapper = mount(ButtonComponent, {
            props: {
                buttonText: 'Submit'
            }
        })
        const buttonText = wrapper.find('span.truncate')
        expect(buttonText.text()).toBe('Submit')
    })
})
