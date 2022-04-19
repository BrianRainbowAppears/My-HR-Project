<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <!-- 左侧 -->
          <el-tab-pane name="role" label="角色管理">
            <!-- 按钮 -->
            <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAdd">新增角色</el-button>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="list">
              <el-table-column type="index" :index="handleIndex" label="序号" width="100" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="assignAuth(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="toEdit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDel(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!-- page-size 表示每页显示几条数据 -->
            <!-- page-sizes 可以选择的每页条数列表 -->
            <!-- layout - jumper 表示跳转到第几页 -->
            <!-- layout - -> 用于控制左右两侧布局，箭头之左显示到左边，否则显示到右侧 -->
            <!-- layout - slot 表示插槽内容，slot位置决定了标签之间内容的位置 -->
            <!-- current-change 监听页码的变化 -->
            <!-- size-change 监听每页显示条数的变化 -->
            <el-pagination :page-size="queryData.pagesize" :page-sizes="pageSizes" layout="sizes, prev, pager, next, jumper, ->, total" :total="total" @current-change="changePager" @size-change="changeSize" />
          </el-tab-pane>

          <el-tab-pane name="info" label="公司信息">
            <!-- 公司信息 -->
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 添加角色 -->
    <!-- this.$emit('update:visible', false) -->
    <!-- <el-dialog title="弹层标题" :visible="isShowAddBox" @update:visible='isShowAddBox=$event'> -->
    <el-dialog :title="title" :visible.sync="isShowAddBox" @close="handleClose">
      <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.description" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 给角色分配权限点 -->
    <!-- 分配权限的弹层 -->
    <el-dialog title="分配权限" :visible.sync="showAuthDialog" @open="loadAuthList">
      <el-tree ref="tree" :data="authList" :check-strictly="true" :show-checkbox="true" node-key="id" :default-expand-all="true" :default-checked-keys="oldAuthList" :props="defaultProps" />
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showAuthDialog=false">取消</el-button>
          <el-button type="primary" @click="handleAssign">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reqAssignPerm, reqGetRoleList, reqDeleteRole, reqAddRole, reqGetRoleDetail, reqUpdateRole } from '@/api/setting.js'
import { reqGetPermissionList } from '@/api/permission.js'
import { translateListToTree } from '@/utils/index.js'

export default {
  data () {
    return {
      // 角色本来拥有的权限列表
      oldAuthList: [],
      // 设置树形节点的属性名称
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 权限列表数据
      authList: [],
      // 当前分配权限的角色id
      currentRoleId: '',
      // 给角色分配权限弹层
      showAuthDialog: false,
      // 表单数据
      form: {
        id: '',
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ]
      },
      // 弹窗控制标志位
      isShowAddBox: false,
      // 加载状态
      loading: false,
      // 控制Tab选项
      activeName: 'role',
      // 查询参数
      queryData: {
        // 当前查询第几页
        page: 1,
        // 每页查询几条数据
        pagesize: 5
      },
      // 角色列表
      list: [],
      // 列表的总长度
      total: 0,
      // 每页条数选择列表
      pageSizes: [5, 20, 30, 40, 50, 100]
    }
  },
  computed: {
    title () {
      return this.form.id ? '编辑角色' : '添加角色'
    }
  },
  created () {
    this.loadSettingList()
  },
  methods: {
    // 控制分配权限提交表单
    async handleAssign () {
      try {
        const ret = await reqAssignPerm({
          // 当前分配权限的角色id
          id: this.currentRoleId,
          // 当前选中的所有的权限的id
          permIds: this.$refs.tree.getCheckedKeys()
        })
        if (ret.code === 10000) {
          // 分配成功，关闭弹窗
          this.showAuthDialog = false
        } else {
          this.$message.error('分配权限失败')
        }
      } catch {
        this.$message.error('分配权限失败')
      }
    },
    // 获取权限点列表数据
    loadAuthList () {
      // 获取原有的权限信息
      const ret = reqGetPermissionList()
      // 获取所有的权限信息
      const auth = reqGetRoleDetail(this.currentRoleId)
      Promise.all([ret, auth]).then(result => {
        // this.oldAuthList = result[1].data.permIds
        this.authList = translateListToTree(result[0].data, '0')
        // 基于el-tree树形组件的实例方法，控制节点的选中
        this.$refs.tree.setCheckedKeys(result[1].data.permIds)
      }).catch((err) => {
        console.log(err)
        this.$message.error('获取权限信息失败')
      })
    },
    // async loadAuthList () {
    //   try {
    //     const ret = await reqGetPermissionList()
    //     const auth = await reqGetRoleDetail(this.currentRoleId)
    //     if (auth.code === 10000) {
    //       this.oldAuthList = auth.data.permIds
    //     } else {
    //       this.$message.error('获取原有权限列表失败')
    //     }
    //     if (ret.code === 10000) {
    //       this.authList = translateListToTree(ret.data, '0')
    //       console.log(this.authList)
    //     } else {
    //       this.$message.error('获取权限列表失败')
    //     }
    //   } catch {
    //     this.$message.error('获取权限列表失败')
    //   }
    // },
    // 分配权限弹窗
    assignAuth (roleId) {
      this.currentRoleId = roleId
      this.showAuthDialog = true
    },
    // 编辑显示弹窗
    async toEdit (id) {
      try {
        // 根据id查询详情数据
        const ret = await reqGetRoleDetail(id)
        if (ret.code === 10000) {
          // 获取角色详情数据
          // this.roleInfo = ret.data
          this.form.id = ret.data.id
          this.form.name = ret.data.name
          this.form.description = ret.data.description

          // 显示表单弹窗
          this.isShowAddBox = true
        } else {
          this.$message.error('获取角色信息失败')
        }
      } catch {
        this.$message.error('获取角色信息失败')
      }
    },
    // 监听弹窗的关闭
    handleClose () {
      // 这里重置表单的方法依赖表单验证
      this.$refs.roleForm.resetFields()
      // 重置data的数据
      // this.$options.data() 表示获取data中的原始数据
      this.form = this.$options.data().form
      // this.form.description = ''
    },
    // 添加角色提交表单
    handleSubmit () {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return
        // 判断是添加还是编辑的提交
        if (this.form.id) {
          // 编辑操作
          try {
            const ret = await reqUpdateRole(this.form)
            if (ret.code === 10000) {
              // 编辑成功，刷新列表，关闭弹窗
              this.isShowAddBox = false
              this.loadSettingList()
            } else {
              this.$message.error('编辑失败')
            }
          } catch (err) {
            console.dir(err)
            this.$message.error('编辑失败')
          }
        } else {
          // 添加操作
          try {
            const ret = await reqAddRole(this.form)
            if (ret.code === 10000) {
              // 添加成功，刷新列表，关闭弹窗
              this.isShowAddBox = false
              this.loadSettingList()
            } else {
              this.$message.error('添加失败')
            }
          } catch {
            this.$message.error('添加失败')
          }
        }
      })
    },
    // 添加角色
    handleAdd () {
      // 控制弹窗显示
      this.isShowAddBox = true
    },
    // 删除操作
    async handleDel (id) {
      const ret = await this.$confirm('确认要删除吗', '提示', {
        type: 'warning'
      }).catch(err => err)
      // 点击取消
      if (ret === 'cancel') return
      // 点击确定
      try {
        const delRet = await reqDeleteRole(id)
        if (delRet.code === 10000) {
          // 删除成功，刷新列表
          // 如果当前页面数据被删除完成了，刷新上一页数据
          if (this.queryData.page > 1 && this.list.length === 1) {
            // 页码需要大于1且当前页就剩一条数据
            this.queryData.page -= 1
          }
          this.loadSettingList()
        } else {
          // 删除失败
          this.$message.error('删除失败')
        }
      } catch {
        this.$message.error('删除失败')
      }
    },
    // 动态控制索引
    handleIndex (index) {
      // 当前页前面的页数 * 每页条数 + index + 1
      const { page, pagesize } = this.queryData
      return (page - 1) * pagesize + index + 1
    },
    // 监听每页条数的变化
    changeSize (size) {
      // 更新请求参数中的每页的条数，重新调用接口即可
      this.queryData.pagesize = size
      this.loadSettingList()
    },
    // 监听页码的切换
    changePager (page) {
      // 更新接口参数中的页码，重新调用接口即可
      this.queryData.page = page
      this.loadSettingList()
    },
    // 获取角色列表
    async loadSettingList () {
      try {
        // 显示加载状态
        this.loading = true
        // 开始调用接口
        const ret = await reqGetRoleList(this.queryData)
        if (ret.code === 10000) {
          // 获取成功
          this.list = ret.data.rows
          this.total = ret.data.total
        } else {
          // 获取失败
          this.$message.error('获取角色列表失败')
        }
      } catch {
        this.$message.error('获取角色列表失败')
      } finally {
        // 取消loading效果
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
