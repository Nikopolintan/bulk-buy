import { createRouter, createWebHistory } from 'vue-router'
import LandingpageView from '@/views/auth/LandingpageView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import CustomerHomepageView from '@/views/auth/CustomerHomepageView.vue'
import DriverHomepageView from '@/views/auth/DriverHomepageView.vue'
import CompletedDeliverypageView from '@/views/auth/CompletedDeliverypageView.vue'
import OrderHistorypageView from '@/views/auth/OrderHistorypageView.vue'
import { isAuthenticated, getUserRole } from '@/utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingpageView,  // Landing page is displayed by default
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
      component: CustomerHomepageView,
      meta: { requiresAuth: true, role: 'customer' }
    },
    {
      path: '/orderhistorypage',
      name: 'orderhistorypage',
      component: OrderHistorypageView,
      meta: { requiresAuth: true, role: 'customer' }
    },
    {
      path: '/driverhomepage',
      name: 'driverhomepage',
      component: DriverHomepageView,
      meta: { requiresAuth: true, role: 'driver' }
    },
    {
      path: '/completed-delivery',
      name: 'completed-delivery',
      component: CompletedDeliverypageView,
      meta: { requiresAuth: true, role: 'driver' }
    }
  ]
})

router.beforeEach(async (to) => {
  const isLoggedIn = await isAuthenticated()

  // Check if the user is logged in and if they are on the landing page
  if (to.name === 'landing-page') {
    if (!isLoggedIn) {
      return true  // Allow the user to stay on the landing page
    }

    // Redirect based on the role
    const role = await getUserRole()
    return {
      name: role === 'driver' ? 'driverhomepage' : 'customerhomepage'
    }
  }

  // Block logged-in users from accessing login/register pages
  if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
    const role = await getUserRole()
    return { name: role === 'driver' ? 'driverhomepage' : 'customerhomepage' }
  }

  // Block unauthenticated users from accessing protected routes
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  // Allow navigation
  return true
})

export default router
