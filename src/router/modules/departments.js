// 组织架构模块
import Layout from '@/layout'

export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      // 如果二级路由的path是空字符串，那么默认显示该二级路由组件
      path: '',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
