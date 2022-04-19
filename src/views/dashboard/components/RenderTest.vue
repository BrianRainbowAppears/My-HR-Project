<script>
export default {
  // 如果该属性设置为true，表示该组件不再有状态（data数据）
  // 如果此时组件需要数据，那么可以通过父传子的方式获取，此时render函数可以通过参数二得到
  // context.props
  // functional: true,
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  // 单文件组件如果没有template标签，那么可以使用render函数提供模版
  // render函数可以采用js方式做组件模版（更加灵活，更加繁琐）
  render (createElemet, context) {
    console.log(this)
    // 通过 context.propx可以获取父组件传递的数据
    // createElemet创建的表面上是DOM元素，但是本质上是VNode(虚拟节点)
    // 虚拟节点是对真实节点的一种描述，本质上是对象
    // createElement 函数参数说明
    // 参数一：标签名称
    // 参数二：标签的属性
    // 参数三：标签的子元素（如果有多个子元素，使用数组）
    // const div = createElemet('div', null, '测试Render:' + context.props.msg)
    const div = createElemet('div', null, '测试Render:' + this.msg)
    // render函数的返回值就是模板的内容
    return div
  }
}
</script>
