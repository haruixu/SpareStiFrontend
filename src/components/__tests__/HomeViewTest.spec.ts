import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue' // Adjust the import path as needed.
import anime from 'animejs'

// Setup localStorage mock
const localStorageMock = (function () {
    let store = {}
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString()
        }),
        clear: vi.fn(() => {
            store = {}
        }),
        removeItem: vi.fn((key) => {
            delete store[key]
        }),
        __store: store // expose store for assertions
    }
})()

// Apply the mock
global.localStorage = localStorageMock

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
    let wrapper

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
        const challenge = { title: 'Kaffe', saved: 90, target: 100, completion: 90 }
        wrapper.vm.incrementSaved(challenge)
        expect(challenge.saved).toBe(100)
        expect(challenge.completion).toBe(100)
    })

    it('animates on challenge completion', async () => {
        const challenge = {
            title: 'Mat og Drikke',
            challengeType: 'SNACKS',
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
        wrapper.vm.goals = [
            {
                title: 'Vacation',
                saved: 500,
                target: 1500,
                description: 'Summer vacation',
                priority: 1,
                completion: 33
            },
            {
                title: 'Camera',
                saved: 300,
                target: 800,
                description: 'New camera',
                priority: 2,
                completion: 37
            }
        ]
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.currentGoal.title).toBe('Vacation')
    })

    it('responds to changes in challenges and updates animation states', async () => {
        wrapper.vm.challenges.push({
            title: 'New Challenge',
            challengeType: 'LEARNING',
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
        const challenge = { title: 'Coffee', challengeType: 'COFFEE' }
        expect(wrapper.vm.getChallengeIcon(challenge)).toBe('src/assets/coffee.png')
    })
})
