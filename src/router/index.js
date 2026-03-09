import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: 'لوحة التحكم',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'لوحة التحكم', path: '/' }
          ]
        }
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: () => import('../views/Analytics.vue'),
        meta: {
          title: 'نظرة تحليلية',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'نظرة تحليلية', path: '/analytics' }
          ]
        }
      },
      {
        path: 'governance',
        name: 'governance',
        component: () => import('../views/Governance.vue'),
        meta: {
          title: 'الحوكمة',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'الحوكمة', path: '/governance' }
          ]
        }
      },
      {
        path: 'governance/business-units',
        name: 'business-units',
        component: () => import('../views/BusinessUnits.vue'),
        meta: {
          title: 'وحدات الأعمال',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'الحوكمة', path: '/governance' },
            { text: 'وحدات الأعمال', path: '/governance/business-units' }
          ]
        }
      },
      {
        path: 'governance/business-units/departments',
        name: 'departments',
        component: () => import('../views/Departments.vue'),
        meta: {
          title: 'الأقسام',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'الحوكمة', path: '/governance' },
            { text: 'وحدات الأعمال', path: '/governance/business-units' },
            { text: 'الأقسام', path: '/governance/business-units/departments' }
          ]
        }
      },
      {
        path: 'risk-management',
        name: 'risk-management',
        component: () => import('../views/RiskManagement.vue'),
        meta: {
          title: 'إدارة المخاطر',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'إدارة المخاطر', path: '/risk-management' }
          ]
        }
      },
      {
        path: 'compliance',
        name: 'compliance',
        component: () => import('../views/Compliance.vue'),
        meta: {
          title: 'الامتثال والالتزام',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'الامتثال', path: '/compliance' }
          ]
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/Settings.vue'),
        meta: {
          title: 'الإعدادات',
          breadcrumbs: [
            { text: 'الرئيسية', path: '/' },
            { text: 'الإعدادات', path: '/settings' }
          ]
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      layout: 'auth',
      title: 'تسجيل الدخول'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: 'الصفحة غير موجودة'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title
    ? `${to.meta.title} - CyberMode`
    : 'CyberMode - GRC Platform'

  // Authentication check - localStorage only (Pinia store may not be ready here)
  const isAuthenticated = !!localStorage.getItem('auth_token')

  if (to.name !== 'login' && to.name !== 'not-found' && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
