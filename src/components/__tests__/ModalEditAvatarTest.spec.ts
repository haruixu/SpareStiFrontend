import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ModalEditAvatar from '@/components/ModalEditAvatar.vue'

const pinia = createPinia()
const app = createApp({
    setup() {
        app.use(pinia)
    },
    render: () => null
})

const wrapper = mount(ModalEditAvatar, {
    global: {
        plugins: [pinia]
    }
})

describe('ModalEditAvatar', () => {
    it('renders properly when modal is closed', async () => {
        const wrapper = mount(ModalEditAvatar)
        expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('opens modal when button is clicked', async () => {
        const wrapper = mount(ModalEditAvatar)
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('closes modal when close button is clicked', async () => {
        const wrapper = mount(ModalEditAvatar)
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('.fixed').exists()).toBe(true)
        await wrapper.find('.bg-white button').trigger('click')
        expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('cycles avatars to the next one when next button is clicked', async () => {
        const wrapper = mount(ModalEditAvatar)
        await wrapper.find('button').trigger('click')
        const currentAvatarSrc = wrapper.find('.avatar').attributes('src')
        await wrapper.find('.avatar-container button:last-child').trigger('click')
        const newAvatarSrc = wrapper.find('.avatar').attributes('src')
        expect(newAvatarSrc).not.toBe(currentAvatarSrc)
    })

    it('cycles avatars to the previous one when previous button is clicked', async () => {
        const wrapper = mount(ModalEditAvatar)
        await wrapper.find('button').trigger('click')
        await wrapper.find('.avatar-container button:last-child').trigger('click')
        const currentAvatarSrc = wrapper.find('.avatar').attributes('src')
        await wrapper.find('.avatar-container button:first-child').trigger('click')
        const newAvatarSrc = wrapper.find('.avatar').attributes('src')
        expect(newAvatarSrc).not.toBe(currentAvatarSrc)
    })
})
