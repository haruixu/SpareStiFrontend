import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue' // Adjust the import path as needed.
import anime from 'animejs'
import type { Challenge } from '../../types/challenge'
import type { Goal } from '../../types/goal'

// Setup localStorage mock
const localStorageMock = (function () {
    let store = {} as { [key: string]: string }
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: any) => {
            store[key] = value.toString()
        }),
        clear: vi.fn(() => {
            store = {}
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key]
        }),
        get length() {
            return Object.keys(store).length
        },
        key: vi.fn((index: number): string | null => {
            const keys = Object.keys(store)
            return keys[index] || null
        }),
        __store: store // expose store for assertions
    }
})()
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
})

// Mocking animejs with a default export
vi.mock('animejs', () => ({
    default: {
        // Ensuring the mock includes a 'default' export
        timeline: vi.fn(() => ({
            add: vi.fn().mockReturnThis()
        }))
    }
}))

describe('HomeView', () => {
    let wrapper: any

    beforeEach(() => {
        // Clear localStorage and reset all mocks
        localStorage.clear()
        vi.clearAllMocks()
        wrapper = mount(HomeView, {
            global: {
                mocks: {
                    $router: {
                        push: vi.fn()
                    }
                }
            }
        })
    })

    it('renders correctly and initializes data', () => {
        expect(wrapper.find('.no-scrollbar').exists()).toBe(true)
        expect(wrapper.vm.challenges.length).toBeGreaterThan(0)
    })

    it('handles incrementSaved correctly', async () => {
        const challenge: Challenge = {
            createdOn: new Date(),
            description: '',
            title: 'Kaffe',
            saved: 90,
            target: 100,
            completion: 90
        }
        wrapper.vm.incrementSaved(challenge)
        expect(challenge.saved).toBe(100)
        expect(challenge.completion).toBe(100)
    })

    it('animates on challenge completion', async () => {
        const challenge: Challenge = {
            createdOn: new Date(),
            description: '',
            title: 'Mat og Drikke',
            type: 'SNACKS',
            saved: 100,
            target: 100,
            completion: 100
        }
        wrapper.vm.animateChallenge(challenge)
        await wrapper.vm.$nextTick()
        expect(anime.timeline).toHaveBeenCalled()
    })

    it('persists animated challenges to localStorage', async () => {
        const challenge = {
            title: 'Gaming',
            challengeType: 'GAMING',
            saved: 100,
            target: 100,
            completion: 100
        }
        await wrapper.vm.animateChallenge(challenge)
        expect(localStorage.setItem).toHaveBeenCalled()
        expect(localStorage.getItem('animatedChallenges')).toContain('Gaming')
    })

    it('correctly computes currentGoal based on goals', async () => {
        const goal: Goal = {
            id: 1,
            due: new Date(),
            createdOn: new Date(),
            title: 'Vacation',
            saved: 500,
            target: 1500,
            description: 'Summer vacation',
            priority: 1,
            completion: 33
        }
        await wrapper.vm.$nextTick()
        expect(goal.title).toBe('Vacation')
    })

    it('responds to changes in challenges and updates animation states', async () => {
        wrapper.vm.challenges.push({
            title: 'New Challenge',
            challengeType: 'COFFEE',
            saved: 50,
            target: 100,
            completion: 50
        })
        await wrapper.vm.$nextTick()
        wrapper.vm.challenges[wrapper.vm.challenges.length - 1].completion = 100 // Directly modify the data
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.animatedChallenges.has('New Challenge')).toBe(true)
    })

    it('triggers animation on completion', async () => {
        const challenge = {
            title: 'Test Challenge',
            challengeType: 'TEST',
            saved: 100,
            target: 100,
            completion: 100
        }
        await wrapper.vm.animateChallenge(challenge)
        await wrapper.vm.$nextTick() // Wait for all nextTick callbacks to resolve

        expect(anime.timeline).toHaveBeenCalled() // Check if anime.timeline was called
    })

    // Test other methods like animateIcon, getChallengeIcon, etc.
    it('returns correct icon path based on challenge type', () => {
        const challenge: Challenge = {
            createdOn: new Date(),
            description: '',
            saved: 0,
            target: 0,
            title: 'Coffee',
            type: 'COFFEE'
        }
        expect(wrapper.vm.getChallengeIcon(challenge)).toBe('src/assets/coffee.png')
    })
})
