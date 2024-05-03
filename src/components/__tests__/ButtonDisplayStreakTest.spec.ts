import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ButtonComponent from '@/components/ButtonDisplayStreak.vue';

describe('ButtonComponent', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('renders correctly', () => {
        const wrapper = mount(ButtonComponent, {
            props: {
                buttonText: 'Click me',
                type: 'goal',
            },
        });
        expect(wrapper.exists()).toBe(true);
    });
});
