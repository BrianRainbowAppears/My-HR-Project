<template>
  <el-dialog :title="title" :visible="isShowDept" :before-close="handleClose" @open="loadManagerList">
    <!-- 表单项目 -->
    <!-- 默认插槽 -->
    <template #default>
      <el-form ref="addRef" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <el-option label="请选择负责人" value="" />
            <el-option v-for="item in mlist" :key="item.id" :label="item.username" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
    </template>
    <!-- 提交按钮 -->
    <!-- 具名插槽：slot="footer" -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees.js'
import { reqAddDepartments, reqGetDepartDetail, reqUpdateDepartments } from '@/api/departments.js'

export default {
  name: 'AddDept',
  props: {
    // 操作类型
    type: {
      type: String,
      required: true
    },
    // 所有部门列表数据
    dlist: {
      type: Array,
      required: true
    },
    // 控制弹窗标志位
    isShowDept: {
      type: Boolean,
      required: true
    },
    // 父级部门id
    currentDeptId: {
      type: String,
      required: true
    }
  },
  data () {
    // 自定义表单验证规则
    const validName = (rule, value, callback) => {
      // value 表示输入的值
      // 判断输入的名称是否与同级部门有冲突
      // 1. 获取当前部门的同级部门
      const subDepts = this.dlist.filter(item => {
        if (this.type === 'add') {
          return item.pid === this.currentDeptId
        } else {
          // 编辑表单验证:父级部门pid一致的部门为同级部门(排除自己)
          return item.pid === this.form.pid && item.id !== this.form.id
        }
      })
      // 2. 判断输入的名称是否在同级部门的范围内
      const ret = subDepts.some(item => item.name === value)
      if (ret) {
        // 有重复的
        callback(new Error('同级部门不可以重复'))
      } else {
        // 不重复
        callback()
      }
    }
    // 验证部门的编码是否重复:编码全局不重复
    const validCode = (rule, value, callback) => {
      // 直接判断全局范围是否有部门编码重复（arr.some;arr.every）
      const ret = this.dlist.some(item => {
        if (this.type === 'add') {
          // 添加操作
          return item.code === value
        } else {
          // 编辑操作（排除自己即可）
          return item.code === value && item.id !== this.form.id
        }
      })
      if (ret) {
        // code码重复
        callback(new Error('部门编码不可以重复'))
      } else {
        // 不重复
        callback()
      }
    }
    return {
      // 管理员列表
      mlist: [],
      // 验证规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validName, trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validCode, trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 表单数据
      form: {
        id: '',
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: ''
      }
    }
  },
  computed: {
    title () {
      return this.type === 'add' ? '添加部门' : '编辑部门'
    }
  },
  methods: {
    // 根据部门id获取部门的详细信息
    async loadDeptInfo () {
      const ret = await reqGetDepartDetail(this.currentDeptId)
      if (ret.code === 10000) {
        // 获取部门信息成功，填充表单
        this.form.id = ret.data.id
        this.form.name = ret.data.name
        this.form.code = ret.data.code
        this.form.manager = ret.data.manager
        this.form.introduce = ret.data.introduce
        this.form.pid = ret.data.pid
      }
    },
    // 获取员工列表数据
    async loadManagerList () {
      try {
        // 如果是编辑操作，需要调用查询部门信息的接口
        if (this.type === 'edit') {
          this.loadDeptInfo()
        }
        // 获取负责人列表
        const ret = await getEmployeeSimple()
        if (ret.code === 10000) {
          this.mlist = ret.data
        }
      } catch {
        this.$message.error('获取负责人列表失败')
      }
    },
    // 添加部门提交表单
    handleAdd () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            // 添加部门
            // 表示验证通过，调用接口
            const ret = await reqAddDepartments({
              ...this.form,
              pid: this.currentDeptId
            })
            if (ret.code === 10000) {
              // 添加部门成功，刷新列表
              this.$emit('action-success')
              // 点击确定按钮不会自动触发before-close事件
              this.handleClose()
            }
          } else {
            // 修改部门
            const ret = await reqUpdateDepartments(this.form)
            if (ret.code === 10000) {
              // 编辑成功，刷新列表
              this.$emit('action-success')
              // 点击确定按钮不会自动触发before-close事件
              this.handleClose()
            }
          }
        }
      })
    },
    handleClose () {
      // 通知父组件关闭弹窗
      // this.$emit('on-close', false)
      // 如果父组件传递的属性采用了sync修饰符，那么，子传父的事件名称必须是 update:属性名称
      this.$emit('update:is-show-dept', false)
      // 关闭弹窗时重置表单
      this.$refs.addRef.resetFields()
    }
  }
}
</script>
