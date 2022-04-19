<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <div class="app-breadcrumb">
      江苏传智播客教育科技股份有限公司
      <span class="breadBtn">体验版</span>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 通过自定义指令控制，图片如果加载失败，显示默认图片 -->
          <img v-imgerror="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
          <span>{{ username }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">主页</span>
          </el-dropdown-item>
          <!-- 第三方组件如果不支持原生事件，可以添加native修饰符 -->
          <!-- native修饰符可以把原始事件绑定到组件的根标签上 -->
          <!-- native是Vue2提供的规则 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data () {
    return {
      abc: 'hello'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'username',
      'avatar'
    ])
  },
  created () {
    // 触发action，调用接口获取用户信息
    // this.$store.dispatch('user/getInfo')
    this.getInfo()
  },
  methods: {
    ...mapActions('user', ['getInfo']),
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 实现退出功能
    async logout () {
      const ret = await this.$confirm('确认要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => e)
      // 点击了取消操作
      if (ret === 'cancel') return
      // 点击了确定操作，触发action退出
      this.$store.dispatch('user/logout')
      // 重置路由权限
      // this.$store.commit('permission/updateRoutes', [])
      // 重置正在运行的路由映射
      // resetRouter()
      // 跳转到登录页
      // this.$router.push('/login')
    }
    // async logout () {
    //   this.$confirm('确认要退出吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // 实现退出操作
    //     this.$store.dispatch('user/logout')
    //   }).catch((e) => {
    //     console.log('cancel')
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-image: -webkit-linear-gradient(left, #3d6df8, #5b8cff);
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-wrapper {
      position: relative;

      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        vertical-align: middle;
      }
      .name {
        cursor: pointer;
        color: #fff;
        vertical-align: middle;
        margin-left: 5px;
      }
      .user-dropdown {
        color: #fff;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>
