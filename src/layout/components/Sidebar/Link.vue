<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal () {
      return isExternal(this.to)
    },
    // 计算的结果：a标签；router-link标签
    type () {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps (to) {
      if (this.isExternal) {
        // 如果路径是标准的url地址，那么渲染a标签
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      // 如果是路由的路径，就返回to属性绑定到router-link上
      // <router-link :to='to'>内容</router-link>
      return {
        to: to
      }
    }
  }
}
</script>
