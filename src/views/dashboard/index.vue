<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <svg-icon class-name="abc" icon-class="eye-open" />

    <!-- <my-test /> -->
    <div :msg="obj.msg" :info="obj.info">测试v-bind</div>
    <!-- 如皋直接把对象绑定到v-bind上，那么对象中的所有属性会自动绑定到标签上面 -->
    <div v-bind="obj">测试v-bind</div>

    <!-- 渲染动态组件 -->
    <!-- <component :is="activeName" /> -->
    <!-- 在component标签上绑定的属性，最终会绑定到渲染的标签上面 -->
    <!-- <component :is="activeName" :href="url">跳转</component> -->
    <!-- <component :is="activeName" v-bind="info">跳转</component> -->
    <button @click="activeName='TestB'">点击</button>
    <button @click="activeName='a'">渲染A标签</button>
    <hr>
    <!-- 让组件显示姓名信息 -->
    <!-- <ScopeSlotTest :user-info="userInfo" /> -->

    <!-- 从父组件定义子组件的模板，但是不修改子组件的代码 -->
    <ScopeSlotTest :user-info="userInfo">
      <template v-slot="{info}">
        {{ info.lastName + ' ' + info.firstName }}
      </template>
    </ScopeSlotTest>

    <RenderTest msg="hello" />

    <hr>
    <MyTreeTest :list="list">
      <template v-slot="{row}">
        <div v-if="row.uname==='jerry'" style="color: red;">{{ row.uname }}</div>
        <div v-else-if="row.uname==='tom'" style="color: blue;">{{ row.uname }}</div>
        <div v-else>{{ row.uname }}</div>
      </template>
    </MyTreeTest>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import TestA from './components/TestA.vue'
// import TestB from './components/TestB.vue'
import ScopeSlotTest from './components/ScopeSlotTest.vue'
import RenderTest from './components/RenderTest.vue'
import MyTreeTest from './components/MyTreeTest.vue'

export default {
  name: 'Dashboard',
  components: { ScopeSlotTest, RenderTest, MyTreeTest },
  data () {
    return {
      list: [{
        id: 1,
        uname: 'tom'
      }, {
        id: 2,
        uname: 'jerry'
      }, {
        id: 3,
        uname: 'spike'
      }],
      userInfo: {
        // firstName: 'Tom',
        // lastName: 'Smith'
        firstName: '小明',
        lastName: '王'
      },
      activeName: 'TestA',
      url: 'http://itcast.cn',
      // info: {
      //   href: 'http://itcast.cn',
      //   class: 'active'
      // },
      obj: {
        msg: 'hello',
        info: 'nihao'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.abc {
  color: red;
}
</style>
