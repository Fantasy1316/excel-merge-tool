import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    redirect: '/home/merge',
    name: 'Home',
    component: () => import('../layout/Navigation/Navigation.vue'),
    children: [
      {
        path: 'merge',
        name: 'Merge',
        meta: {
          title: '文件合并'
        },
        component: () => import('../views/Home/Merge/Merge.vue')
      },
      {
        path: 'errorlog',
        name: 'ErrorLog',
        meta: {
          title: '错误日志'
        },
        component: () => import('../views/Home/ErrorLog/ErrorLog.vue')
      },
      {
        path: 'setting',
        name: 'Setting',
        meta: {
          title: '通用设置'
        },
        component: () => import('../views/Home/Setting/Setting.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home/merge'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
