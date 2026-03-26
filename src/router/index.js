import { createRouter, createWebHistory } from 'vue-router'
import homepage from '@/pages/homepage.vue'
import Signup from '@/pages/signup.vue'
import login from '@/pages/login.vue'
import Navbar from '@/components/navbar.vue'
import Hero2 from '@/components/hero2.vue'
import Sponsorhero from '@/components/sponsorhero.vue'
import Reviewhero from '@/components/reviewhero.vue'
import Trialbox from '@/components/trialbox.vue'
import Menuhero from '@/components/menuhero.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: homepage,

    },
    {
      path:'/signup',
      name:'signup',
      component: Signup,
    },
    {
      path:'/login',
      name:'login',
      component:login,
    },
    {
      path:'/navbar',
      name:'navbar',
      component:Navbar,
    },
    {
      path:'/hero2',
      name:'hero2',
      component:Hero2,
    },
    {
      path:'/sponsorhero',
      name:'sponsorhero',
      component: Sponsorhero,
    },
    {
      path: '/reviewhero',
      name:'reviewhero',
      component: Reviewhero,
    },
    {
      path: '/trialbox',
      name: 'trialbox',
      component: Trialbox,
    },
    {
      path: '/menuhero',
      name: 'menuhero',
      component: Menuhero,
    }
  ],
})

export default router
