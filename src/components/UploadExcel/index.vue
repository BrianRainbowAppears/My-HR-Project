<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
    <!-- 监听file标签的change事件 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
// 基于xlsx包解析Excel数据
import XLSX from 'xlsx'

export default {
  name: 'UploadExcel',
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data () {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    // 通过该函数把最终解析的结果传递给成功的回调
    generateData ({ header, results }) {
      // header表示Excel中的表头
      // results表示具体数据
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      // 获取拖拽的文件信息
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('仅仅支持上传一个文件!')
        return
      }
      // 获取文件的内容
      const rawFile = files[0] // only use files[0]
      if (!this.isExcel(rawFile)) {
        this.$message.error('仅仅支持如下文件后缀 .xlsx, .xls, .csv')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    // 鼠标拖拽文件进入区域时触发操作
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      // 添加一个图标效果
      e.dataTransfer.dropEffect = 'copy'
    },
    // 点击按钮后，弹窗提示选择文件
    handleUpload () {
      // 通过ref操作file类型的input元素，触发click事件
      this.$refs['excel-upload-input'].click()
    },
    // 获取选中的Excel文件内容
    handleClick (e) {
      // 获取Excel文件信息
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      // 没有选择文件
      if (!rawFile) return
      // 选中文件了
      this.upload(rawFile)
    },
    // 解析选中的文件内容
    upload (rawFile) {
      // 清空选中的Excel文件
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      // beforeUpload 的作用：判断选中的文件是否符合要求
      if (!this.beforeUpload) {
        // 父组件没有传递 beforeUpload
        this.readerData(rawFile)
        return
      }
      // 父组件传递了 beforeUpload
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    // 负责解析Excel中的数据
    readerData (rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        // 基于原生js的一个方法（WebAPI）
        const reader = new FileReader()
        // onload触发后说明读取完成
        reader.onload = e => {
          // 获取读取的文件数据
          const data = e.target.result
          // 基于XLSX包提供的方法读取文件数据
          const workbook = XLSX.read(data, { type: 'array' })
          // 读取Excel第一页数据
          const firstSheetName = workbook.SheetNames[0]
          // 根据Excel的sheet名称获取对应页面数据
          const worksheet = workbook.Sheets[firstSheetName]
          // 读取页面的header信息
          const header = this.getHeaderRow(worksheet)
          // 读取实际数据并且转换为json格式
          const results = XLSX.utils.sheet_to_json(worksheet)
          // 把解析好的结果传递给使用者
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        // 读取文件数据到内存
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow (sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel (file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
