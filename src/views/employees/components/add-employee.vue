<template>
  <el-dialog title="新增员工" :visible="showDialog" :before-close="handleClose" top="20px">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option value="" label="请选择..." />
          <el-option v-for="item in hireType" :key="item.id" :value="item.id" :label="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="showTreeBox" />
        <!-- 显示一颗树列表 -->
        <el-tree v-if="showTree" v-loading="loading" class="tree-box" :data="dlist" :props="defaultProps" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Types from '@/api/constant/employees.js'
import { reqGetDepartments } from '@/api/departments.js'
import { translateListToTree } from '@/utils/index.js'
import { reqAddEmployee } from '@/api/employees.js'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 控制树加载状态
      loading: false,
      // 控制树形结构显示
      defaultProps: {
        label: 'name',
        childrend: 'children'
      },
      // 控制树的显示和隐藏
      showTree: false,
      // 所属部门的列表数据
      dlist: [],
      // 聘用形式列表数据
      hireType: Types.hireType,
      // 整个表单数据
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    // 控制树形节点的选中
    selectNode (node) {
      // 必须选中叶子节点（没有子部门的节点）
      if (node.children && node.children.length === 0) {
        // 获取叶子节点的名称
        this.formData.departmentName = node.name
        // 关闭弹窗
        this.showTree = false
      }
    },
    // 控制下拉树弹窗显示
    showTreeBox () {
      // 显示树
      this.showTree = true
      // 设置为正则加载
      this.loading = true
      // 加载数据
      this.loadDepartList()
    },
    // 获取部门列表数据
    async loadDepartList () {
      try {
        // 调用接口
        const ret = await reqGetDepartments()
        if (ret.code === 10000) {
          // 转化为树形结构
          this.dlist = translateListToTree(ret.data.depts, '')
          console.log(this.dlist)
        }
      } catch {
        this.$message.error('获取部门列表数据失败')
      } finally {
        this.loading = false
      }
    },
    // 表单提交
    handleSubmit () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 提交表单
        try {
          const ret = await reqAddEmployee(this.formData)
          if (ret.code === 10000) {
            // 添加成功，关闭弹窗，刷新列表
            this.$emit('update:showDialog', false)
            // 刷新父组件的列表 (this.$parent表示父组件)
            this.$parent.loadEmpList()
          } else {
            this.$message.error('添加员工失败')
          }
        } catch {
          this.$message.error('添加员工失败')
        }
      })
    },
    // 关闭弹窗
    handleClose () {
      // 关闭弹窗
      this.$emit('update:showDialog', false)
      // 重置表单（el-form-item组件需要有prop）
      this.$refs.addForm.resetFields()
      // 关闭树形弹层
      this.showTree = false
      // 基于表单的原始数据覆盖当前表单数据
      this.formData = this.$options.data().formData
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
}
</style>
