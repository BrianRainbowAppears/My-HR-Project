<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <router-link key="collapse" class="sidebar-logo-link" to="/">
      <img v-if="logo" src="@/assets/common/logo.png" class="sidebar-logo">
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    // 该状态类控制collapse样式类名是否添加（折叠添加；展开去掉）
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: 'Vue Admin Template',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 140px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  // 小图样式
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
      width: 50px;
      height: 24px;
    }
  }
}
</style>
