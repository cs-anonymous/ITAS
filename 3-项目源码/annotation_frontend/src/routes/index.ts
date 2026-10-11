import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { MessagePlugin } from 'tdesign-vue-next'
import { h, resolveComponent } from 'vue'

const routes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'project/:id',
        name: 'projectDetail',
        component: () => import('@/views/annotation/project-detail/index.vue'),
      },
      {
        path: 'workspace/:id',
        name: 'workspace',
        component: () => import('@/views/annotation/workspace/index.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: {
          render: () => h(resolveComponent('router-view')),
        },
        meta: {
          requireAdmin: true,
        },
        children: [
          {
            path: '',
            name: 'adminHome',
            component: () => import('@/views/admin/home/index.vue'),
          },
          {
            path: 'project/:id',
            name: 'adminProject',
            component: () => import('@/views/admin/project/index.vue'),
          },
          {
            path: 'review/:paperId',
            name: 'adminReview',
            component: () => import('@/views/admin/review/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/sys/login/index.vue'),
    meta: {
      noLogin: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/sys/register/index.vue'),
    meta: {
      noLogin: true,
    },
  },
  {
    path: '/unauthorized',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: {
      noLogin: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      noLogin: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (localStorage.getItem('token')) {
    if (to.path == '/login') {
      return '/'
    } else {
      // 判断当前用户是否已拉取完user信息
      if (!useUserStore().user) {
        try {
          await useUserStore().getUserInfo()
        } catch (err) {
          return '/login'
        }
      }
      // 判断权限
      if (to.meta && to.meta.requireAdmin && !useUserStore().hasAdminRole) {
        return '/unauthorized'
      }
    }
  }
  // 登录校验
  else {
    if (to.path != '/login' && to.meta && !to.meta.noLogin) {
      MessagePlugin.warning('请登录后进行操作')
      return '/login'
    }
  }
})

export default router
