import { mount, VueWrapper } from '@vue/test-utils'
import NavBar from '@/components/NavBarComponent.vue'
import router from '@/router'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

vi.stubGlobal('scrollTo', vi.fn())
// Mocking Axios correctly using `importOriginal`
const mocks = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn()
}))

vi.mock('axios', async (importActual) => {
    const actual = await importActual<typeof import('axios')>()

    return {
        default: {
            ...actual.default,
            create: vi.fn(() => ({
                ...actual.default.create(),
                get: mocks.get,
                post: mocks.post
            }))
        }
    }
})

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

        await router.push({ name: 'start' })
        await router.isReady()
        await nextTick()
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
