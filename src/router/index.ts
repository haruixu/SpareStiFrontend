import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'start',
            component: () => import('@/views/StartView.vue')
        },
        {
            path: '/hjem',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/RegisterLoginView.vue')
        },
        {
            path: '/profil',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue')
        },
        {
            path: '/sparemaal',
            name: 'goals',
            component: () => import('@/views/GoalView.vue')
        },
        {
            path: '/spareutfordringer',
            name: 'challenges',
            component: () => import('@/views/ChallengeView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue')
        },
        {
            path: '/konfigurasjonSteg1',
            name: 'configurations1',
            component: () => import('@/views/ConfigHabitChangeView.vue')
        },
        {
            path: '/konfigurasjonSteg2',
            name: 'configurations2',
            component: () => import('@/views/ConfigFamiliarWithSavingsView.vue')
        },
        {
            path: '/konfigurasjonSteg3',
            name: 'configurations3',
            component: () => import('@/views/ConfigSpendingItemsView.vue')
        },
        {
            path: '/konfigurasjonSteg4',
            name: 'configurations4',
            component: () => import('@/views/ConfigSpendingItemsAmountView.vue')
        },
        {
            path: '/forsteSparemaal',
            name: 'firstSavingGoal',
            component: () => import('../views/FirstSavingGoalView.vue')
        },
        {
            path: '/forsteSpareutfordring',
            name: 'firstSavingChallengde',
            component: () => import('../views/FirstSavingChallengeView.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
})

export default router
