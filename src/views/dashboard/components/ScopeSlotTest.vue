<template>
  <div>
    <div>作用域插槽</div>
    <div>姓名：
      <!-- 在slot标签上绑定的属性会传递给父组件 -->
      <slot :info="userInfo">{{ userInfo.firstName + ' ' + userInfo.lastName }}</slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  }
}
</script>
