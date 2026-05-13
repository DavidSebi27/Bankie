import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import LoginPage from '../views/Login.vue'
import RegisterPage from '../views/Register.vue'
import DashboardPage from '../views/DashboardPage.vue'
import AccountsPage from '../views/AccountsPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import TransferPage from '../views/TransferPage.vue'
import TransactionsPage from '../views/TransactionsPage.vue'
import UnauthorizedPage from '../views/Unauthorized.vue'
import EmployeeLoginPage from '../views/EmployeeLogin.vue'
import EmployeeDashboardPage from '../views/employee/EmployeeDashboard.vue'
import EmployeeTransactionsPage from '../views/employee/EmployeeTransactions.vue'
import EmployeeCustomersPage from '../views/employee/EmployeeCustomers.vue'
import EmployeeCustomerDetailPage from '../views/employee/EmployeeCustomerDetail.vue'
import AtmPage from '../views/Atm.vue'

const EMPLOYEE_ROLES = ['EMPLOYEE', 'ADMIN']

const routes = [
  { path: '/login', component: LoginPage, meta: { public: true } },
  { path: '/register', component: RegisterPage, meta: { public: true } },
  { path: '/unauthorized', component: UnauthorizedPage, meta: { public: true } },

  { path: '/employee/login', component: EmployeeLoginPage, meta: { public: true } },

  { path: '/atm', component: AtmPage, meta: { public: true, hideTopbar: true } },

  { path: '/dashboard', component: DashboardPage, meta: { roles: ['CUSTOMER'] } },
  { path: '/accounts', component: AccountsPage, meta: { roles: ['CUSTOMER'] } },
  { path: '/transfer', component: TransferPage, meta: { roles: ['CUSTOMER'] } },
  { path: '/transactions', component: TransactionsPage, meta: { roles: ['CUSTOMER'] } },
  { path: '/profile', component: ProfilePage, meta: { roles: ['CUSTOMER'] } },
  { path: '/employee/dashboard', component: EmployeeDashboardPage, meta: { roles: ['EMPLOYEE'] } },
  { path: '/employee/transactions', component: EmployeeTransactionsPage, meta: { roles: ['EMPLOYEE'] } },
  { path: '/employee/customers', component: EmployeeCustomersPage, meta: { roles: ['EMPLOYEE'] } },
  { path: '/employee/customers/:id', component: EmployeeCustomerDetailPage, meta: { roles: ['EMPLOYEE'] } },

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

  const isPublic = to.meta.public
  const requiredRoles = to.meta.roles
  const isEmployee = EMPLOYEE_ROLES.includes(auth.role)

  if (isPublic) {
    // Redirect already-authenticated users away from login/register pages
    const customerPublic = ['/login', '/register']
    const employeePublic = ['/employee/login']

    if (auth.token) {
      if (customerPublic.includes(to.path)) {
        return { path: isEmployee ? '/employee/dashboard' : '/dashboard' }
      }
      if (employeePublic.includes(to.path) && isEmployee) {
        return { path: '/employee/dashboard' }
      }
    }
    return
  }

  if (!auth.token) {
    const employeeRoute = to.path.startsWith('/employee')
    return { path: employeeRoute ? '/employee/login' : '/login' }
  }

  if (requiredRoles && !requiredRoles.includes(auth.role)) {
    return { path: isEmployee ? '/employee/dashboard' : '/unauthorized' }
  }
})

export default router
