import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SpareComponent from '@/components/SpareComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'

describe('SpareComponent', () => {
    it('renders properly and opens modal when image is clicked', async () => {
        const wrapper = mount(SpareComponent, {
            props: {
                speech: ['Hello', 'World'],
                pngSize: 100,
                direction: 'left',
                imageDirection: 'left',
                show: false
            }
        })

        expect(wrapper.findComponent(ModalComponent).exists()).toBe(false)

        await wrapper.find('img').trigger('click')

        expect(wrapper.findComponent(ModalComponent).exists()).toBe(true)
    })
})
