// 工资模块
import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys'),
      meta: { title: '工资管理', icon: 'money' }
    }
  ]
}
