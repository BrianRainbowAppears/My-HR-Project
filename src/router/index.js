import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 如果路由的配置属性中hidden值为true，那么不作为左侧菜单进行显示
import departmentsRouter from './modules/departments.js'
import approvalsRouter from './modules/approvals.js'
import attendancesRouter from './modules/attendances.js'
import employeesRouter from './modules/employees.js'
import permissionRouter from './modules/permission.js'
import salarysRouter from './modules/salarys.js'
import settingRouter from './modules/setting.js'
import socialRouter from './modules/social.js'

// 动态路由（方便后续进行权限控制）
export const dynamicRouters = [
  departmentsRouter,
  settingRouter,
  approvalsRouter,
  attendancesRouter,
  employeesRouter,
  permissionRouter,
  salarysRouter,
  socialRouter
]

// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/import',
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [{
      path: '', // 二级路由path什么都不写 表示二级默认路由
      component: () => import('@/views/import')
    }]
  }

  // 左侧添加一个菜单
  // {
  //   path: '/vuex',
  //   component: Layout,
  //   redirect: '/test',
  //   children: [{
  //     path: 'test',
  //     component: () => import('@/views/test/index'),
  //     meta: { title: 'Vuex补充', icon: 'dashboard' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 合并静态路由和动态路由
  // routes: [...constantRoutes, ...dynamicRouters]
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  // 用新的路由实例覆盖当前的路由实例
  router.matcher = newRouter.matcher // reset router
}

export default router
