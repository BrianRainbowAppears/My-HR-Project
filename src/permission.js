import router from './router'
import store from './store'
// import { dynamicRouters } from '@/router'

// 白名单：运行不登录就可以访问的路径
const whiteList = ['/login', '/404']

// 添加前置导航守卫
router.beforeEach(async (to, from, next) => {
  // 1. 判断是否有token
  // const token = store.state.user.token
  const token = store.getters.token
  if (token) {
    // 已经登录了，判断是否为登录页面
    if (to.path === '/login') {
      // 是登录页面
      next('/')
    } else {
      // 不是登录页面,直接放行
      if (store.getters.username) {
        // 已经存在用户信息
        next()
      } else {
        // 尚未获取用户信息(如下的代码必须保证仅仅执行一次)
        // 获取用户信息 profile （是否可以直接从Vuex获取？不可以）
        const authInfo = await store.dispatch('user/getInfo')
        // 获取当前用户所拥有的路由权限
        // const menus = authInfo.roles.menus
        // 从全部的动态路由中过滤出拥有权限的路由
        const authRouter = await store.dispatch('permission/filterAuth', authInfo.roles.menus)
        // const authRouter = dynamicRouters.filter(item => menus.includes(item.children[0].name))
        // 添加动态路由映射
        // 如果调用了router.addRoutes，那么上一次路由会重新请求一次（重新生成一个浏览器的访问记录）
        // 通过router.addRoutes添加的路由称之为动态路由
        router.addRoutes([...authRouter, { path: '*', redirect: '/404', hidden: true }])
        // 跳转到目标路由
        next({
          ...to,
          // 合并两次相同的路由历史
          replace: true
        })
      }
    }
  } else {
    // 没有登录，判断是否在白名单
    if (whiteList.includes(to.path)) {
      // 访问的路径在白名单里面，直接放行
      next()
    } else {
      // 访问的路径不在白名单里面,跳回登录页面
      next('/login')
    }
  }
})

// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
