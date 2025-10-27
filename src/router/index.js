import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/reset-password', 
      name: 'reset-password',
      component: () => import('../views/ResetPassword.vue') 
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Dashboard.vue') 
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'change-password',
          name: 'change-password',
          component: () => import('../views/ChangePassword.vue')
        },
        {
          path: 'users',
          children: [
            {
              path: 'teacher',
              name: 'users-teacher',
              component: () => import('../views/UsersTeacher.vue')
            },
            {
              path: 'student',
              name: 'users-student',
              component: () => import('../views/UsersStudent.vue')
            }
          ]
        },
        {
          path: 'chemicals',
          component: () => import('../views/Chemicals.vue'), 
          children: [
            {
        path: 'encyclopedia',
        name: 'chemicals-encyclopedia',
        component: () => import('../views/ChemicalsEncyclopedia.vue')
      },

            {
              path: 'warehouse',
              name: 'chemicals-warehouse',
              component: () => import('../views/ChemicalsWarehouse.vue') 
            },
            {
              path: 'classification',
              name: 'chemicals-classification',
              component: () => import('../views/ChemicalsClassification.vue')
            },
            {
              path: 'production-classification',
              name: 'chemicals-production-classification',
              component: () => import('../views/ChemicalsProductionClassification.vue')
            }
          ]
        },
        {
          path: 'purchase',
          component: () => import('../views/Purchase.vue'), 
          children: [
            {
              path: 'application',
              name: 'purchase-application',
              component: () => import('../views/PurchaseApplication.vue')
            },
            {
              path: 'inbound',
              name: 'purchase-inbound',
              component: () => import('../views/PurchaseInbound.vue')
            }
          ]
        },
        {
          path: 'borrow',
          component: () => import('../views/Borrow.vue'), 
          children: [
            {
              path: 'application',
              name: 'borrow-application',
              component: () => import('../views/BorrowApplication.vue')
            },
            {
              path: 'outbound',
              name: 'borrow-outbound',
              component: () => import('../views/BorrowOutbound.vue')
            }
          ]
        },
        {
          path: 'scrap',
          component: () => import('../views/Scrap.vue'), 
          children: [
            {
              path: 'application',
              name: 'scrap-application',
              component: () => import('../views/ScrapApplication.vue')
            },
            {
              path: 'outbound',
              name: 'scrap-outbound',
              component: () => import('../views/ScrapOutbound.vue')
            }
          ]
        },
        {
          path: 'allocation',
          component: () => import('../views/Allocation.vue'),
          children: [
            {
              path: 'application',
              name: 'allocation-application',
              component: () => import('../views/AllocationApplication.vue')
            },
            {
              path: 'inbound',
              name: 'allocation-inbound',
              component: () => import('../views/AllocationInbound.vue')
            }
          ]
        }
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/forgot-password', '/register','/reset-password'];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();
  const loggedIn = authStore.isAuthenticated;

  // trying to access a restricted page + not logged in
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
