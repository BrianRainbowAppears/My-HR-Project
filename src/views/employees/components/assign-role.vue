 <template>
  <el-dialog title="分配角色" :visible="showRoleDialog" :before-close="handleClose" @open="loadSettingList">
    <!-- 角色列表 -->
    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { reqGetRoleList } from '@/api/setting.js'
import { getBaseInfo } from '@/api/user'
import { reqAssignRoles } from '@/api/employees.js'

export default {
  name: 'AssignRole',
  props: {
    // 给该用户分配角色
    currentUserId: {
      type: String,
      required: true
    },
    // 控制弹窗标志位
    showRoleDialog: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      // 加载状态
      loading: false,
      // 选中的角色id
      roleIds: [],
      // 所有角色列表
      list: []
    }
  },
  methods: {
    // 分配角色提交表单
    async handleSubmit () {
      try {
        const ret = await reqAssignRoles({
          id: this.currentUserId,
          roleIds: this.roleIds
        })
        if (ret.code === 10000) {
          // 分配成功，关闭弹窗
          this.handleClose()
        } else {
          this.$message.error('分配角色失败')
        }
      } catch {
        this.$message.error('分配角色失败')
      }
    },
    // 获取所有的角色列表数据
    loadSettingList () {
      // 显示loading
      this.loading = true
      // 获取用户已有角色
      const info = getBaseInfo(this.currentUserId)
      // 获取所有角色
      const ret = reqGetRoleList({
        page: 1,
        pagesize: 10000
      })
      // Promise.all 并发触发多个异步任务，所有任务完成后触发thne
      // Promise.race() 仅仅接收最先返回的结果
      Promise.all([info, ret]).then(result => {
        // 获取已有角色
        this.roleIds = result[0].data.roleIds
        // 获取所有角色
        this.list = result[1].data.rows
      }).catch(() => {
        this.$message.error('获取角色失败')
      }).finally(() => {
        this.loading = false
      })
    },
    // 获取角色列表
    // async loadSettingList () {
    //   try {
    //     // 获取用户已有角色
    //     const info = await getBaseInfo(this.currentUserId)
    //     if (info.code === 10000) {
    //       this.roleIds = info.data.roleIds
    //     } else {
    //       this.$message.error('获取已有角色失败')
    //     }
    //   } catch {
    //     this.$message.error('获取已有角色失败')
    //   }
    //   try {
    //     // 获取所有角色
    //     const ret = await reqGetRoleList({
    //       page: 1,
    //       pagesize: 10000
    //     })
    //     if (ret.code === 10000) {
    //       // 获取成功
    //       this.list = ret.data.rows
    //     } else {
    //       // 获取失败
    //       this.$message.error('获取角色列表失败')
    //     }
    //   } catch {
    //     this.$message.error('获取角色列表失败')
    //   }
    // },
    // 控制弹窗关闭
    handleClose () {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.assign-role {
  ::v-deep {
    .el-checkbox {
      font-size: 30px;
    }
  }
}
</style>
