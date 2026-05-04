import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import LoginPage        from '../views/Login.vue'
import RegisterPage     from '../views/Register.vue'
import DashboardPage    from '../views/DashboardPage.vue'
import UnauthorizedPage from '../views/Unauthorized.vue'

const routes = [
  { path: '/login',        component: LoginPage,        meta: { public: true } },
  { path: '/register',     component: RegisterPage,     meta: { public: true } },
  { path: '/unauthorized', component: UnauthorizedPage, meta: { public: true } },

  { path: '/dashboard', component: DashboardPage },

  { path: '/', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (auth.token && !auth.initialized) {
    await auth.fetchUser()
  }

  const isPublic      = to.meta.public
  const requiredRoles = to.meta.roles

  // If the route is public (login, register, unauthorized),
  // let it through — UNLESS the user is logged in and trying
  // to hit login/register (redirect them home instead).
  if (isPublic) {
    const authOnlyPublic = ['/login', '/register']
    if (auth.token && authOnlyPublic.includes(to.path)) {
      return { path: '/dashboard' }
    }
    return
  }

  if (!auth.token) {
    return { path: '/login' }
  }

  if (requiredRoles && !requiredRoles.includes(auth.role)) {
    return { path: '/unauthorized' }
  }
})

export default router