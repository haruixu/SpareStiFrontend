import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import FormUserDetails from '../FormUserDetails.vue'

describe('FormUserDetails', () => {
    it('renders properly', () => {
        const wrapper = mount(FormUserDetails)
        expect(wrapper.text()).toContain('Logg inn')
    })
})
