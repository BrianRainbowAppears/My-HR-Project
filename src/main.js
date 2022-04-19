// 导入Vue的核心
import Vue from 'vue'
// 用于屏蔽浏览器之间的样式差异
import 'normalize.css/normalize.css'
// 导入ElementUI的包和样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化配置：支持多国语言
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

// 导入自己写的全局样式
import '@/styles/index.scss' // global css

// 导入根组件
import App from './App'
// 导入vuex的状态对象
import store from './store'
// 导入vue-router对象
import router from './router'

// 导入图标文件
import '@/icons' // icon
// 导入权限控制逻辑：路由的导航守卫
import '@/permission' // permission control

// 导入自定义插件
import MyPlugins from '@/utils/plugins.js'
import defaultAvatar from '@/assets/common/head.jpg'
// 配置插件
Vue.use(MyPlugins, { defaultAvatar })

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 提供假接口：Mock
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 配置ElementUI的插件并且设置语言支持（中文）
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 实例化Vue根组件
// this.$store
// this.$router
new Vue({
  el: '#app',
  router,
  store,
  // 把根组件App渲染到public/index.html页面的id是app的div里面
  render: h => h(App)
})
