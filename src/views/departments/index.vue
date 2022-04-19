<template>
  <div class="dashboard-container">
    <div v-loading="loading" class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools :node-data="titleData" @on-open="handleOpen" />
        <!-- 树形结构 -->
        <el-tree :data="departs" :props="defaultProps">
          <template v-slot="{data}">
            <!-- 如果在组件上绑定事件，那么$event表示子传父的值 -->
            <TreeTools :node-data="data" @on-open="handleOpen" @action-success="loadDepartList" />
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 添加部门 -->
    <!-- :is-show-dept="isShowDept" 父传子，不显示弹窗，当该值变成true之后，弹窗就显示了 -->
    <!-- @on-close="isShowDept=$event" 子传父，关闭弹窗 -->
    <!-- isShowDept 这个值在父子之间是双向传递的 -->
    <!-- <AddDept :is-show-dept="isShowDept" @on-close="isShowDept=$event" /> -->
    <!-- <AddDept :is-show-dept="isShowDept" @update:is-show-dept="isShowDept=$event" /> -->
    <AddDept :type="type" :dlist="dlist" :current-dept-id="currentDeptId" :is-show-dept.sync="isShowDept" @action-success="loadDepartList" />
  </div>
</template>

<script>
// 1. 先导入
import TreeTools from './components/tree-tools.vue'
import { reqGetDepartments } from '@/api/departments.js'
import { translateListToTree } from '@/utils/index.js'
import AddDept from './components/add-dept.vue'

export default {
  name: 'Departments',
  // 2. 配置组件
  components: { TreeTools, AddDept },
  data () {
    return {
      // 列表加载状态
      loading: false,
      // 操作类型
      type: 'add',
      // 部门列表原始数据
      dlist: [],
      // 当前父级部门
      currentDeptId: '',
      // 控制添加部门弹窗标志位
      isShowDept: false,
      // 标题数据
      titleData: {
        name: '江苏传智播客股份有限公司',
        manager: '负责人',
        root: true,
        // 一级部门的父id是''
        id: ''
      },
      // 部门列表
      departs: [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{ name: '董事会', manager: '曹丕' }]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.loadDepartList()
  },
  methods: {
    // 控制弹窗的打开操作
    handleOpen (info) {
      // 当前添加子部门的父级部门的id
      this.currentDeptId = info.id
      // 表示操作类型：添加或者编辑
      this.type = info.type
      // 打开弹窗
      this.isShowDept = true
    },
    // 获取部门列表数据
    async loadDepartList () {
      try {
        // 启动loading效果
        this.loading = true
        // 关闭弹窗
        this.isShowDept = false
        // 调用接口
        const ret = await reqGetDepartments()
        if (ret.code === 10000) {
          // 成功获取数据
          this.titleData.name = ret.data.companyName
          // 保存后端返回的原始部门列表数据
          this.dlist = ret.data.depts
          // 转化为树形结构
          this.departs = translateListToTree(ret.data.depts, '')
        }
      } catch {
        this.$message.error('获取部门列表数据失败')
      } finally {
        // 无论是否有异常，最终都会触发finally
        this.loading = false
      }
    },
    handle (info, data) {
      console.log(info)
      console.log(data)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
}
</style>
