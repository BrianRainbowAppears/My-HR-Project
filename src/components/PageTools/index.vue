<template>
  <el-card>
    <div class="page-tools">
      <!-- 左侧 -->
      <div class="left">
        <!-- this.$slots.default 获取默认插槽的内容 -->
        <div v-if="$slots.default" class="tips">
          <i class="el-icon-info" />
          <span>
            <!-- 默认插槽 -->
            <slot name="default" />
            <!-- <slot :info="info" name="default" /> -->
          </span>
        </div>
      </div>
      <div class="right">
        <!-- 右侧 -->
        <slot name="right" />
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  data () {
    return {
      info: {
        msg: 'hello'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
