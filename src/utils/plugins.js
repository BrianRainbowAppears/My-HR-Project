// 定义一个Vue插件：插件的本质就是一个对象，必须保证对象中有一个属性install,他的值是函数
// 插件可以扩展Vue的相关特性：指令、过滤器、组件。。。
// import MyTest from '@/views/test/MyTest'
// 默认头像（图片加载失败后显示）
import defaultAvatar from '@/assets/common/head.jpg'
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  install (Vue, options) {
    // 参数一：形参Vue是Vue构造函数
    // 参数二：形参options表示Vue.use调用时传递的参数二
    // Vue.use(MyPlugins, { info: 'hello' })
    // console.log(options)

    // 给Vue的实例扩展了一个属性 $http
    // Vue.prototype.$http = 123

    // 扩展一个全局组件
    // Vue.component('my-test', MyTest)
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)

    // 扩展自定义指令：处理图片加载失败的情况
    Vue.directive('imgerror', {
      // 指令首次初始化时触发一次
      inserted (el, bindings) {
        // el表示绑定指令的DOM元素
        // bindings表示指令相关的参数信息
        // <img v-imgerror="avatar" class="user-avatar">
        // bindings.value表示 v-imgerror 指令等号后面的值
        if (bindings.value) {
          el.src = bindings.value
        }
      },
      // 指令依赖的数据发生更新时触发
      componentUpdated (el, bindings) {
        // 接口获取头像数据之后，会更新avatar
        el.src = bindings.value
        // 如果后端提供的数据是错误的，此时应该显示一张默认头像
        // 如果img加载图片失败了，自动触发该事件
        el.onerror = () => {
          // 显示默认图片即可
          el.src = options.defaultAvatar || defaultAvatar
        }
      }
    })

    // 在Vue的原型上添加一个属性 $isOk
    Vue.prototype.$isOk = (pointName) => {
      // 判断该用户是否有操作 pointName 按钮的权限
      const flag = store.getters.points.includes(pointName)
      if (!flag) {
        // 没有权限，提示没有权限
        Message({
          type: 'warning',
          message: '没有该功能权限'
        })
        return false
      }
      // 拥有权限
      return true
    }
  }
}
