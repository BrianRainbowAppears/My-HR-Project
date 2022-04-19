<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%;">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleAction">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <template v-if="!nodeData.root">
                <el-dropdown-item command="edit">编辑部分</el-dropdown-item>
                <el-dropdown-item command="del">删除部门</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { reqDelDepartments } from '@/api/departments.js'

export default {
  props: {
    nodeData: {
      type: Object,
      required: true
    }
  },
  methods: {
    async handleAction (type) {
      if (type === 'add') {
        // 添加部门，打开弹窗
        this.$emit('on-open', {
          id: this.nodeData.id,
          type: 'add'
        })
      } else if (type === 'edit') {
        // 编辑部门,打开编辑部门的弹窗
        this.$emit('on-open', {
          id: this.nodeData.id,
          type: 'edit'
        })
      } else {
        // 删除部门，确认是否要删除
        const ret = await this.$confirm('确实要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 点击了取消操作
        if (ret === 'cancel') return
        // 点击确认操作
        try {
          const delRet = await reqDelDepartments(this.nodeData.id)
          if (delRet.code === 10000) {
            // 删除成功,刷新列表（子传父）
            this.$emit('action-success')
          } else {
            // 删除失败
            this.$message.error('删除部门失败')
          }
        } catch {
          this.$message.error('删除部门失败')
        }
      }
    }
  }
}
</script>
