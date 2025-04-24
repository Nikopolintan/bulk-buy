import { createRouter, createWebHistory } from 'vue-router'
import LandingpageView from '@/views/auth/LandingpageView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import CustomerHomepageView from '@/views/auth/CustomerHomepageView.vue'
import DriverHomepageView from '@/views/auth/DriverHomepageView.vue'
import CompletedDeliverypageView from '@/views/auth/CompletedDeliverypageView.vue'

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
      path: '/customerhomepage',
      name: 'customerhomepage',
      component: CustomerHomepageView
    },
    {
      path: '/driverhomepage',
      name: 'driverhomepage',
      component: DriverHomepageView
    },
    {
      path: '/CompletedDeliverypage',
      name: 'CompletedDeliverypage',
      component: CompletedDeliverypageView
    },

  ],
})

export default router
