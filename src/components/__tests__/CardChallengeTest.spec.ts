import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CardChallenge from '../CardChallenge.vue'
import type { Challenge } from '../../types/challenge'

describe('CardChallenge', () => {
    let wrapper: any

    const incompleteChallenge: Challenge = {
        id: 1,
        title: 'Test title',
        perPurchase: 10,
        saved: 100,
        target: 1000,
        description: 'Test description',
        due: '2022-01-01T00:00:00Z',
        createdOn: '2021-01-01T00:00:00Z',
        type: 'Challenge type',
        completion: 10
    }

    const completeChallenge: Challenge = {
        id: 1,
        title: 'Test title',
        perPurchase: 10,
        saved: 100,
        target: 1000,
        description: 'Test description',
        due: '2022-01-01T00:00:00Z',
        createdOn: '2021-01-01T00:00:00Z',
        type: 'Challenge type',
        completion: 10,
        completedOn: '2022-01-01T00:00:00Z'
    }

    beforeEach(async () => {
        wrapper = mount(CardChallenge, {
            propsData: {
                challengeInstance: incompleteChallenge
            }
        })
        await wrapper.vm.$nextTick()
    })

    it('renders correctly', () => {
        expect(wrapper.text()).toContain('Test title')
        expect(wrapper.text()).toContain('100kr / 1000kr')
        expect(wrapper.text()).toContain('2022-01-01 00:00')
    })

    it('sets isCompleted to false', () => {
        expect(wrapper.vm.isCompleted).toBe(false)
    })

    it('sets isCompleted to true', async () => {
        const completedWrapper = mount(CardChallenge, {
            propsData: {
                challengeInstance: completeChallenge
            }
        })
        await completedWrapper.vm.$nextTick()

        expect(completedWrapper.vm.isCompleted).toBe(true)
    })
})
