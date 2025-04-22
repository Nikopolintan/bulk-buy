import { createRouter, createWebHistory } from 'vue-router'
import LandingpageView from '@/views/auth/LandingpageView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import HomepageView from '@/views/auth/HomepageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/landing-page' // Redirect root to login
    },

    {
      path: '/landing-page',
      name: 'landig-page',
      component: LandingpageView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: HomepageView
    },

  ],
})

export default router
