import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DisplayInfoForChallengeOrGoal from '@/components/DisplayInfoForChallengeOrGoal.vue'

interface Props {
    displayInfoCard: boolean
    screenSize: number
    challenge: any
    goal: any
    isChallenge: boolean
}

describe('InfoCardComponent', () => {
    let wrapper: any
    const mockChallenge = {
        description: 'Complete daily tasks',
        title: 'Daily Challenge',
        saved: 100,
        completion: 50,
        due: '2024-01-01T00:00:00Z',
        perPurchase: 10,
        target: 500
    }

    beforeEach(() => {
        wrapper = mount(DisplayInfoForChallengeOrGoal, {
            props: {
                challenge: mockChallenge, // Passing only recognized props
                goal: null,
                isChallenge: true
            }
        })
    })

    it('toggles displayInfoCard when the button is clicked', async () => {
        expect(wrapper.vm.displayInfoCard).toBe(false)
        await wrapper.find('button').trigger('click')
        expect(wrapper.vm.displayInfoCard).toBe(true)
        await wrapper.find('button').trigger('click')
        expect(wrapper.vm.displayInfoCard).toBe(false)
    })

    it('does not render the info card when displayInfoCard is false', () => {
        expect(wrapper.find('.w-[40vh]').exists()).toBe(false)
    })
})
