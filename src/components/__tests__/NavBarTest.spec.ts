import { mount, VueWrapper } from '@vue/test-utils'
import NavBar from '@/components/NavBarComponent.vue'
import router from '@/router'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('scrollTo', vi.fn())

describe('NavBar Routing', () => {
    let wrapper: VueWrapper<any>

    beforeEach(async () => {
        const pinia = createPinia()
        setActivePinia(pinia)

        wrapper = mount(NavBar, {
            global: {
                plugins: [router, pinia]
            }
        })

        await router.push('/')
        await router.isReady()
    })

    it('renders without errors', () => {
        expect(wrapper.exists()).toBe(true)
    })

    it('displays correct active route for home link on full screen', async () => {
        global.innerWidth = 1200
        await router.push('/hjem')
        await router.isReady()

        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for goals link on full screen', async () => {
        global.innerWidth = 1200

        await router.push('/sparemaal')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for challenges link on full screen', async () => {
        global.innerWidth = 1200

        await router.push('/spareutfordringer')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for profile link on full screen', async () => {
        global.innerWidth = 1200

        await router.push('/profil')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for home link when the hamburger menu is open', async () => {
        global.innerWidth = 1000
        wrapper.vm.hamburgerOpen = true
        await wrapper.vm.$nextTick()

        await router.push('/hjem')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for goals link when the hamburger menu is open', async () => {
        global.innerWidth = 1000
        wrapper.vm.hamburgerOpen = true
        await wrapper.vm.$nextTick()

        await router.push('/sparemaal')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for challenges link when the hamburger menu is open', async () => {
        global.innerWidth = 1000
        wrapper.vm.hamburgerOpen = true
        await wrapper.vm.$nextTick()

        await router.push('/spareutfordringer')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })

    it('displays correct active route for profile link when the hamburger menu is open', async () => {
        global.innerWidth = 1000
        wrapper.vm.hamburgerOpen = true
        await wrapper.vm.$nextTick()

        await router.push('/profil')
        await router.isReady()
        expect(wrapper.find('.router-link-exact-active').exists()).toBe(true)
    })
})
