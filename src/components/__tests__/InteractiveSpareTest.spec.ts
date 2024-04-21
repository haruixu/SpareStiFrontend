import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SpeechBubbleComponent from '@/components/InteractiveSpare.vue'; // Adjust the import path as needed.

describe('SpeechBubbleComponent', () => {
    it('renders correctly with default props', () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'left',
                speech: ['Hello', 'World']
            }
        });
        expect(wrapper.exists()).toBeTruthy();
    });

    it('applies dynamic classes based on direction prop', () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'right',
                speech: ['Hello', 'World']
            }
        });
        expect(wrapper.find('div').classes()).toContain('flex-row');
        const wrapperReverse = mount(SpeechBubbleComponent, {
            props: {
                direction: 'left',
                speech: ['Hello', 'World']
            }
        });
        expect(wrapperReverse.find('div').classes()).toContain('flex-row-reverse');
    });

    it('image class is computed based on direction', () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'right',
                speech: ['Hello', 'World']
            }
        });
        expect(wrapper.find('img').classes()).toContain('scale-x-[-1]');
    });

    it('updates speech text on image click', async () => {
        const wrapper = mount(SpeechBubbleComponent, {
            props: {
                direction: 'left',
                speech: ['First speech', 'Second speech']
            }
        });
        expect(wrapper.find('span').text()).toBe('First speech');
        await wrapper.find('img').trigger('click');
        expect(wrapper.find('span').text()).toBe('Second speech');
        // Test wrap-around
        await wrapper.find('img').trigger('click');
        expect(wrapper.find('span').text()).toBe('First speech');
    });
});

