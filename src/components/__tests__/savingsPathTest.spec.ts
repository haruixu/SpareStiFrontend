import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SavingsPath from '@/components/SavingsPath.vue';
import { useGoalStore } from '@/stores/goalStore';
import { useChallengeStore } from '@/stores/challengeStore';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [{ path: '/', component: SavingsPath }]; // Define routes if necessary
const router = createRouter({
  history: createWebHistory(),
  routes,
});



// Mock the stores and any other external modules
vi.mock('@/stores/goalStore', () => ({
  useGoalStore: vi.fn(() => ({
    getUserGoals: vi.fn(),
    editUserGoal: vi.fn(),
    goals: []
  }))
}));
vi.mock('@/stores/challengeStore', () => ({
  useChallengeStore: vi.fn(() => ({
    getUserChallenges: vi.fn(),
    editUserChallenge: vi.fn(),
    challenges: []
  }))
}));

describe('SavingsPath.vue', () => {
  let wrapper: any;

  beforeEach(async () => {
    wrapper = mount(SavingsPath, {
      global: {
        plugins: [router],
        mocks: {
          $router: {
            push: vi.fn()
          }
        }
      }
    });

    const goalStore = useGoalStore();
    const challengeStore = useChallengeStore();

    goalStore.goals = [{
      id: 1,
      title: 'gaming',
      saved: 100,
      target: 500,
      completion: 20,
      description: 'ho ho',
      priority: 1,
      createdOn: '2022-01-01',
      due: '2022-12-31',
      completedOn: '2022-01-02'
    }];


    challengeStore.challenges = [{
      id: 1,
      title: 'Challenge Test',
      type: 'coffee',
      perPurchase: 20,
      saved: 60,
      target: 100,
      completion: 60,
      description: 'hoho',
      completedOn: '2022-01-02',
      due: '2022-12-31',
      createdOn: '2022-01-01'
    }];

  });

  it('renders challenges and goals from the store', async () => {
    await flushPromises();
    expect(wrapper.find('[data-cy=goal-title]').text()).toContain('gaming');
    expect(wrapper.find('[data-cy=challenge-title]').text()).toContain('Challenge Test');
  });

  it('increments the saved amount when incrementSaved is called', async () => {
    const challenge = { id: 1, title: 'Challenge Test', perPurchase: 20, saved: 30, target: 100 };
    await wrapper.vm.incrementSaved(challenge);
    expect(challenge.saved).toEqual(50);  // Checks if the saved amount is incremented correctly
  });
});
