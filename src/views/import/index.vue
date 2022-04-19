<template>
  <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
</template>
<script>
import { reqImportEmployee } from '@/api/employees.js'

export default {
  methods: {
    // 判断选择的文件的合法性
    beforeUpload (file) {
      // 传递的文件格式必须是Excel
      if (file.name.endsWith('.xlsx')) {
        return true
      } else {
        this.$message.error('文件格式错误')
        return false
      }
    },
    // 把数字格式的日期转换为年月日
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    // 转换数据格式
    translateData (data) {
      const result = []

      // 中文和英文的对应关系
      const zhEnMap = {
        '入职日期': 'timeOfEntry',
        '姓名': 'username',
        '工号': 'workNumber',
        '手机号': 'mobile',
        '转正日期': 'correctionTime'
      }

      // 遍历每一行数据，分别进行转换
      data.forEach(row => {
        // 转换的单行数据信息
        const rowInfo = {}

        // 遍历一行的每一个属性
        for (const key in zhEnMap) {
          // key 是中文名称；enName是英文名称
          const enName = zhEnMap[key]
          // 根据中文的名称获取对应的值
          const value = row[key]
          // 把英文键值对添加到对象中
          // 只有日期需要做转换
          if (['timeOfEntry', 'correctionTime'].includes(enName)) {
            // 日期格式需要转换
            rowInfo[enName] = this.formatDate(value)
          } else {
            rowInfo[enName] = value
          }
        }

        // 把单行信息放到结果列表中
        result.push(rowInfo)
      })

      return result
    },
    // 获取解析的结果
    async onSuccess (data) {
      // 这里data的形参可以得到解析后的Excel数据
      // 把解析的员工信息传递给后端
      // console.log(data.header, data.results)
      // 后端需要的数据是如下格式
      // const info = [{
      //   username: '张飞',
      //   mobile: 15200011111,
      //   workNumber: '21312',
      //   timeOfEntry: '2022-01-01',
      //   correctionTime: '2022-01-01'
      // }]
      // 转换数据格式
      const result = this.translateData(data.results)
      // 调用接口
      try {
        const ret = await reqImportEmployee(result)
        if (ret.code === 10000) {
          // 导入成功，跳转到员工列表页面
          this.$router.push('/employees')
        } else {
          this.$message.error('上传失败')
        }
      } catch (err) {
        console.log(err)
        this.$message.error('上传失败')
      }
    }
  }
}
</script>
