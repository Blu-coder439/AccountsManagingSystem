import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: () => import('@/pages/general/homepage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/general/signup.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/general/login.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/general/user/dashboard.vue'),
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/pages/general/user/transactions.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/pages/general/user/reports.vue'),
    },
    {
      path: '/adminpage',
      name: 'adminpage',
      component: () => import ('@/pages/general/admin/adminpage.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/general/user/settings.vue')
    },
  ],
})

export default router
