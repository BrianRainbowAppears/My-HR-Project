<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // render (createElement, context) {
  //   const { icon, title } = context.props
  //   // <svg-icon icon-class={icon}/>
  //   // 返回的结果是连个元素
  //   const svg = createElement('svg-icon', { props: { iconClass: icon } }, null)
  //   const span = createElement('span', null, title)
  //   return [svg, span]
  // }
  render (h, context) {
    // h表示createElement函数
    // context表示父传递给子组件的值
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        // 采用Element提供图标
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 采用svg图标
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(<span >{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
