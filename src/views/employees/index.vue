<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 顶部菜单 -->
      <!-- 组件标签之间只要有内容就是插槽内容，这个内容传递给子组件：父传子 -->
      <!-- 中间的插槽内容：默认插槽；具名插槽；作用域插槽 -->
      <!-- 没有template包裹的内容传递给默认插槽 -->
      <!-- template包裹的插槽称之为具名插槽 -->
      <!-- v-slot -->
      <!-- v-slot:default -->
      <!-- #插槽名称 -->
      <!-- v-slot:插槽名称 -->
      <PageTools>
        <span>公司决定：全员普涨20%: </span>
        <!-- <template v-slot="{info}">
          <span>公司决定：全员普涨20%: {{ info.msg }}</span>
        </template> -->
        <template #right>
          <el-button type="primary" size="small" @click="$router.push('/import')">导入</el-button>
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">添加员工</el-button>
        </template>
      </PageTools>
      <!-- 员工列表 -->
      <el-card style="margin-top: 10px;">
        <el-table border :data="list">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <!-- formatter属性的作用：用于格式化列内容（绑定的函数形参可以得到一行数据），函数的返回值就是最终处理的结果 -->
          <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" :formatter="handleType">
            <!-- <template v-slot="{row}"> -->
            <!-- {{ row.formOfEmployment | formatType }} -->
            <!-- {{ formatType(row.formOfEmployment) }} -->
            <!-- </template> -->
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <template v-slot="{row}">
              {{ formatTime(row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template v-slot="{row}">
              <el-switch v-model="row.enableState" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#eee" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="handleJump(row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination :page-size="queryData.size" :current-page="queryData.page" :total="total" layout="prev, pager, next" @current-change="changePager" />
        </div>
      </el-card>
    </div>
    <!-- 添加部门弹窗 -->
    <!-- <AddEmployee :show-dialog="showDialog" @update:showDialog="showDialog=$event" /> -->
    <AddEmployee :show-dialog.sync="showDialog" />
    <AssignRole :current-user-id="currentUserId" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>

<script>
import { reqGetEmployeeList } from '@/api/employees.js'
import Types from '@/api/constant/employees'
import moment from 'moment'
import { reqDelEmployee } from '@/api/employees.js'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'

export default {
  components: { AddEmployee, AssignRole },
  filters: {
    // 局部过滤器
    formatType (value) {
      const info = Types.hireType.find(item => item.id === value)
      return info ? info.value : '---'
    }
  },
  data () {
    return {
      // 当前分配角色的用户id
      currentUserId: '',
      // 分配角色标志位
      showRoleDialog: false,
      // 添加弹窗标志位
      showDialog: false,
      // 列表总数
      total: 0,
      // 员工列表
      list: [],
      // 查询参数
      queryData: {
        page: 1,
        size: 10
      }
    }
  },
  created () {
    this.loadEmpList()
  },
  methods: {
    // 分配角色弹窗
    assignRole (id) {
      // 记录当前用户id
      this.currentUserId = id
      // 打开弹窗
      this.showRoleDialog = true
    },
    // 控制路由跳转
    handleJump (id) {
      this.$router.push('/employees/detail/' + id)
    },
    // 转换导出员工信息的参数格式
    translateExportData (data) {
      // 导出的Excel的头信息
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 最终的结果：header和数据
      const result = {
        // Object.keys用于获取对象中所有的key，从而形成一个数组
        header: Object.keys(headers),
        list: []
      }

      // 遍历整个员工列表数据
      data.forEach(row => {
        // 其中一行数据
        // rowInfo = [15751786628,'张飞', '2022-01-10', '2022-01-10', 88088]
        const rowInfo = []

        // 遍历headers，逐个获取列的数据
        for (const key in headers) {
          // key 是中文名称
          // 获取英文的 key
          const enKey = headers[key]
          // 根据英文的key获取对应的值
          let value = row[enKey]
          // 处理数据格式
          if (enKey === 'formOfEmployment') {
            // 聘用形式
            const info = Types.hireType.find(item => item.id === value)
            value = info ? info.value : '---'
          } else if (['timeOfEntry', 'correctionTime'].includes(enKey)) {
            // 日期格式
            try {
              value = moment(value).format('yyyy-MM-DD')
            } catch {
              value = '无效日期'
            }
          }
          // 把一列的数据添加到数组
          rowInfo.push(value)
        }
        // 把处理一行结果添加到数组
        result.list.push(rowInfo)
      })

      return result
    },
    // 实现导出功能
    async handleExport () {
      if (!this.$isOk('export_employee_btn')) return
      // 1. 调用接口获取所有员工的列表数据
      const all = await reqGetEmployeeList({
        page: 1,
        size: 100000
      })
      // 2. 把后端返回的数据转换成Excel需要的数据格式
      const result = this.translateExportData(all.data.rows)
      // 3. 调用相关的API实现导出功能
      // import基于底层webpack，用于实现按需加载
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: result.header,
          data: result.list, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 删除员工
    async handleDel (id) {
      const isOk = await this.$confirm('确认要删除员工吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 点击取消操作
      if (isOk === 'cancel') return

      // 点击确定操作
      try {
        const ret = await reqDelEmployee(id)
        if (ret.code === 10000) {
          // 删除成功，刷新列表
          this.loadEmpList()
        } else {
          this.$message.error('删除失败')
        }
      } catch {
        this.$message.error('删除失败')
      }
    },
    // 格式化时间
    formatTime (time) {
      return moment(time).format('yyyy-MM-DD')
    },
    // 基于ElementUI的规则格式化数据
    handleType (row) {
      const info = Types.hireType.find(item => item.id === row.formOfEmployment)
      return info ? info.value : '---'
    },
    // 格式化聘用形式
    formatType (value) {
      const info = Types.hireType.find(item => item.id === value)
      return info ? info.value : '---'
    },
    // 切换页码
    changePager (page) {
      this.queryData.page = page
      this.loadEmpList()
    },
    // 获取员工列表数据
    async loadEmpList () {
      try {
        const ret = await reqGetEmployeeList(this.queryData)
        if (ret.code === 10000) {
          // 获取员工列表成功
          this.list = ret.data.rows
          this.total = ret.data.total
        } else {
          this.$message.error('获取员工列表失败')
        }
      } catch {
        this.$message.error('获取员工列表失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
