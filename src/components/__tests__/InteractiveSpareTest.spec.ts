import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SpeechBubbleComponent from '@/components/InteractiveSpare.vue' // Adjust the import path as needed.

describe('SpeechBubbleComponent', () => {
    it('renders correctly with default props', () => {
        const wrapper: any = mount(SpeechBubbleComponent, {
            props: {
                direction: 'left',
                speech: ['Hello', 'World'],
                pngSize: 100
            }
        })
        expect(wrapper.exists()).toBeTruthy()
    })

    it('applies dynamic classes based on direction prop', () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'right',
                speech: ['Hello', 'World'],
                pngSize: 100
            }
        })
        expect(wrapper.find('.spareDiv').classes()).toContain('flex-row')
        const wrapperReverse = mount(SpeechBubbleComponent, {
            props: {
                direction: 'left',
                speech: ['Hello', 'World'],
                pngSize: 100
            }
        })
        expect(wrapperReverse.find('.spareDiv').classes()).toContain('flex-row-reverse')
    })

    it('image class is computed based on direction', () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'right',
                speech: ['Hello', 'World'],
                pngSize: 100
            }
        })
        expect(wrapper.find('img').classes()).toContain('scale-x-[-1]')
    })

    it('updates speech text on div click', async () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'left',
                speech: ['First speech', 'Second speech'],
                pngSize: 100
            }
        })
        expect(wrapper.find('.speech').text()).toBe('First speech')
        await wrapper.find('.spareDiv').trigger('click')
        expect(wrapper.find('.speech').text()).toBe('Second speech')
    })
})
