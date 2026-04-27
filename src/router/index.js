import { createRouter, createWebHistory } from 'vue-router'
import { clearCurrentUser, getCurrentUser, syncCurrentUserProfile } from '@/utils/auth-session'
import { supabase } from '@/utils/supabase'

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

const protectedRouteNames = new Set(['dashboard', 'transactions', 'reports', 'settings']);
const guestOnlyRouteNames = new Set(['login', 'signup']);

router.beforeEach(async (to) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (protectedRouteNames.has(to.name)) {
    if (!user) {
      clearCurrentUser();
      return { name: 'login' };
    }

    if (!getCurrentUser()) {
      try {
        await syncCurrentUserProfile();
      } catch {
        clearCurrentUser();
        return { name: 'login' };
      }
    }
  }

  if (guestOnlyRouteNames.has(to.name) && user) {
    if (!getCurrentUser()) {
      try {
        await syncCurrentUserProfile();
      } catch {
        clearCurrentUser();
      }
    }

    return { name: 'dashboard' };
  }

  return true;
});

export default router
