import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/MainLayout.vue'

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
          component: () => import('../views/Dashboard.vue') // 或者您希望的默认主页组件
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
          path: 'user-management',
          name: 'user-management',
          component: () => import('../views/UserManagement.vue')
        },
        {
          path: 'users',
          component: () => import('../views/Users.vue'), // Placeholder for users parent route
          children: [
            {
              path: 'admin',
              name: 'users-admin',
              component: () => import('../views/UsersAdmin.vue')
            },
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
          component: () => import('../views/Chemicals.vue'), // This can be a generic Chemicals layout or a redirect
          children: [
            {
        path: 'encyclopedia',
        name: 'chemicals-encyclopedia',
        component: () => import('../views/ChemicalsEncyclopedia.vue')
      },
      {
        path: 'encyclopedia/add',
        name: 'chemicals-encyclopedia-add',
        component: () => import('../views/ChemicalAdd.vue')
      },
            {
              path: 'warehouse',
              name: 'chemicals-warehouse',
              component: () => import('../views/ChemicalsWarehouse.vue') // Assuming you will create this later
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
          component: () => import('../views/Purchase.vue'), // Placeholder for purchase parent route
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
          component: () => import('../views/Borrow.vue'), // Placeholder for borrow parent route
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
          component: () => import('../views/Scrap.vue'), // Placeholder for scrap parent route
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
          component: () => import('../views/Allocation.vue'), // Placeholder for allocation parent route
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
  const publicPages = ['/login', '/forgot-password', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('username');

  // trying to access a restricted page + not logged in
  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
