import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SavingsPath from '@/components/SavingsPath.vue'

vi.mock('canvas-confetti', () => ({
    default: vi.fn(() => ({
        reset: vi.fn(),
        addFettis: vi.fn(),
        render: vi.fn(),
        clear: vi.fn()
    }))
}))
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

describe('SavingsPath Component', () => {
    let wrapper: any
    const pinia = createPinia()

    beforeEach(() => {
        window.HTMLElement.prototype.scrollIntoView = function () {}
        setActivePinia(pinia)
        wrapper = mount(SavingsPath, {
            global: {
                plugins: [pinia]
            },
            props: {
                challenges: [
                    {
                        id: 1,
                        title: 'Test challenge',
                        perPurchase: 20,
                        saved: 100,
                        target: 1000,
                        description: 'Test description',
                        due: '2022-01-01T00:00:00Z',
                        createdOn: '2021-01-01T00:00:00Z',
                        type: 'Challenge type',
                        completion: 10
                    }
                ],
                goal: {
                    id: 1,
                    title: 'Test goal',
                    saved: 100,
                    target: 1000,
                    description: 'Test description',
                    due: '2022-01-01T00:00:00Z',
                    createdOn: '2021-01-01T00:00:00Z',
                    completion: 10
                }
            }
        })
    })

    describe('Initial Render', () => {
        it('should render challenge and goal details correctly', async () => {
            await wrapper.vm.$nextTick()
            const challengeText = wrapper.text()
            expect(challengeText).toContain('Test challenge')
            expect(challengeText).toContain('100kr / 1000kr')
            expect(challengeText).toContain('Test goal')
            expect(challengeText).toContain('100kr / 1000kr')
        })

        it('should display the correct number of challenge elements', () => {
            const challengeElements = wrapper.findAll('[data-cy="challenge-title"]')
            expect(challengeElements.length).toBe(1)
        })
    })

    describe('User Interactions', () => {
        it('should update challenge progress when increment button is clicked', async () => {
            await wrapper.vm.$nextTick()
            const incrementButton = wrapper.find('[data-cy="increment-challenge1"]')
            expect(incrementButton.exists()).toBe(true)
            await incrementButton.trigger('click')
            expect(wrapper.vm.challenges[0].saved).toBe(120)
        })
    })

    describe('State Management', () => {
        it('should react to changes in challenge completion status', async () => {
            // Initially incomplete
            let progressBar = wrapper.find('.bg-green-600')
            expect(progressBar.element.style.width).toBe('10%')

            // Update challenge to be almost complete
            await wrapper.setProps({
                challenges: [
                    {
                        ...wrapper.props().challenges[0],
                        saved: 900,
                        completion: 90
                    }
                ]
            })
            await wrapper.vm.$nextTick()
            await wrapper.vm.$nextTick()

            progressBar = wrapper.find('.bg-green-600')
            expect(progressBar.element.style.width).toBe('90%')
        })
    })
})
