import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MainLayout',
    redirect: '/home',
    component: () => import('@/layouts/MainLayout/index.vue'),
    children: [
      {
        path: 'vis-panel',
        name: 'visPanel',
        component: () => import('@/views/vis-panel/index.vue'),
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: 'project/:id',
        name: 'projectDetail',
        component: () => import('@/views/project/index.vue'),
        redirect: {
          name: 'uploadPaper',
        },
        children: [
          {
            path: 'upload-paper',
            name: 'uploadPaper',
            component: () => import('@/views/project/upload-paper/index.vue'),
            meta: {
              step: 1,
            },
          },
          {
            path: 'synthesis-paragraph',
            name: 'synthesisParagraph',
            component: () =>
              import('@/views/project/synthesis-paragraph/index.vue'),
            meta: {
              step: 2,
            },
          },
          {
            path: 'entity-extract/:taskId',
            name: 'entityExtract',
            component: () => import('@/views/project/entity-extract/index.vue'),
            meta: {
              step: 3,
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
