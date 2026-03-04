import { createRouter, createWebHistory } from 'vue-router'
import homepage from '@/pages/homepage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: homepage,

    },
  ],
})

export default router
