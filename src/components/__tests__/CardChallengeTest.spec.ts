import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CardChallenge from '../CardChallenge.vue'
import type { Challenge } from '../../types/challenge'

describe('CardChallenge', () => {
    let incompleteWrapper: any
    let completeWrapper: any

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

    const mountIncompletedWrapper = async () => {
        incompleteWrapper = mount(CardChallenge, {
            propsData: {
                challengeInstance: incompleteChallenge
            }
        })
        await incompleteWrapper.vm.$nextTick()
    }

    const mountCompleteWrapper = async () => {
        completeWrapper = mount(CardChallenge, {
            propsData: {
                challengeInstance: completeChallenge
            }
        })
        await completeWrapper.vm.$nextTick()
    }

    it('renders correctly', () => {
        mountIncompletedWrapper()
        expect(incompleteWrapper.text()).toContain('Test title')
        expect(incompleteWrapper.text()).toContain('100kr / 1000kr')
        expect(incompleteWrapper.text()).toContain('2022-01-01 00:00')
    })

    it('sets isCompleted to false', () => {
        mountIncompletedWrapper()
        expect(incompleteWrapper.vm.isCompleted).toBe(false)
    })

    it('sets isCompleted to true', () => {
        mountCompleteWrapper()
        expect(completeWrapper.vm.isCompleted).toBe(true)
    })
})
