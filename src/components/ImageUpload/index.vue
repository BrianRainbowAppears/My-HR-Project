<template>
  <div class="imgupload-container">
    <el-upload :limit="limit" :before-upload="beforeUpload" :on-change="handleChange" :class="{hideplus: imgLen}" :file-list="fileList" list-type="picture-card" :http-request="handleUpload" :on-remove="handleRemove" :on-preview="preview" action="#">
      <!-- action表示图片上传的地址 -->
      <!-- on-preview 用于实现图片预览 -->
      <!-- file-list 表示上传的文件列表 -->
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress v-if="loading" class="progress-tip" type="circle" :percentage="percentage" />
    <el-dialog width="600px" top="20px" title="图片预览" :visible.sync="isShow">
      <img width="100%" :src="currentImg" alt="">
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDc3E9nAG5dtulOlsiHdljSt3wYtwkIafT', // 身份识别 ID
  SecretKey: 'Zrsc8QRZS4PTFkyuZx4uUnqc7PQAcokP' // 身份密钥
})

export default {
  name: 'ImageUpload',
  props: {
    // 默认显示的头像
    defaultImg: {
      type: String,
      default: ''
    },
    // 控制图片的数量
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // 进度条效果
      loading: false,
      // 进度条的进度
      percentage: 0,
      // 控制图片预览标志位
      isShow: false,
      // 当前预览的图片
      currentImg: null,
      // 上传文件列表
      fileList: [
        // { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
        // { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ]
    }
  },
  computed: {
    // 计算当前选中的图片长度(如果大于1，就隐藏加号)
    imgLen () {
      return this.fileList.length >= this.limit
    }
  },
  watch: {
    // 父传子的值如果是调用接口获取的，那么子组件获取该值有时机问题
    defaultImg (newValue) {
      this.fileList = [{
        url: newValue
      }]
    }
  },
  // created () {
  //   this.fileList.push({
  //     url: this.defaultImg
  //   })
  // },
  methods: {
    // 上传前进行检查操作
    beforeUpload (file) {
      // 上传的图片必须是如下类型 jpg、gif、png
      const types = ['image/png', 'image/gif', 'image/jpg']
      if (!types.includes(file.type)) {
        this.$message.error('必须选择jpg/png/git格式图片')
        return false
      }

      // 文件大小不可以超过1M
      if (file.size / 1024 / 1024 > 1) {
        this.$message.error('图片大小必须小于1M')
        return false
      }
      return true
    },
    // 监听图片列表的变化
    handleChange (file, fileList) {
      // file表示当前添加的图片信息
      // fileList 表示添加完成后所有的列表数据
      this.fileList = fileList
    },
    // 手动触发上传操作
    handleUpload (params) {
      // 下一步，在这里自己调用接口进行上传即可
      if (params.file) {
        // 显示进度条
        this.loading = true
        // 调用腾讯的SDK方法上传文件到腾讯云
        cos.putObject({
          Bucket: 'byte123-1252553968', /* 存储桶名称 */
          Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
          Key: params.file.name, /* 文件名 */
          StorageClass: 'STANDARD', // 上传模式, 标准模式（默认即可）
          Body: params.file, // 上传文件对象
          onProgress: (progressData) => {
            // console.log(JSON.stringify(progressData))
            // 上传的进度
            this.percentage = progressData.percent * 100
          }
        }, (err, data) => {
          // 上传成功或者失败的回调函数
          if (err) {
            // 上传失败了
            this.$message.error('上传图片失败')
            return
          }
          // 上传成功，修改文件的状态（success），替换图片的路径
          if (data.statusCode === 200) {
            // 上传成功
            const imgInfo = this.fileList.find(item => item.uid === params.file.uid)
            if (imgInfo) {
              imgInfo.status = 'success'
              imgInfo.url = 'https://' + data.Location
            }
          } else {
            this.$message.error('上传图片失败')
          }
          // 隐藏进度条
          this.loading = false
          this.percentage = 0
        })
      }
    },
    // 删除操作触发
    handleRemove (file, fileList) {
      // file 表示当前删除的图片的相关数据
      // fileList 表示删除后剩余的数据列表
      // const index = this.fileList.findIndex(item => item.uid === file.uid)
      // this.fileList.splice(index, 1)
      // 使用删除之后剩余的列表覆盖原有的列表
      this.fileList = fileList
    },
    // 点击【+】触发该方法
    preview (info) {
      // 记录当前点击的图片地址
      this.currentImg = info.url
      // 实现图片的预览
      this.isShow = true
    }
  }
}
</script>
<style scoped lang='scss'>
.imgupload-container {
  width: 500px;
  .hideplus {
    ::v-deep .el-upload--picture-card {
      display: none;
    }
  }
  .progress-tip {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
