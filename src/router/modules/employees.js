// 员工模块
import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail/:id', // 动态路由参数
      component: () => import('@/views/employees/detail'),
      hidden: true,
      // 如果添加选项props:true,那么组件中可以直接通过props获取路由参数
      props: true,
      meta: {
        title: '员工详情'
      }
    }
  ]
}
