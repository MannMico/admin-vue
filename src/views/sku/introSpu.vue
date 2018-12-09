<template>
  <div>
    <div style="margin-left: 82px;padding: 30px">
      <el-form ref="form">
        <div style="font-size: 14px;display: inline-block;float: left;margin-right: 10px;line-height: 40px">为这款服务(SPU)设置介绍</div>
        <div style="font-size: 14px;display: inline-block;float: left;height: 40px;overflow: hidden">
          <el-form-item style="margin-bottom: 0">
              <el-button type="primary" size="small" @click="editQuillEdit()">编辑</el-button>
              <el-button type="primary" size="small" @click="yulan()">预览</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div style="height: 1px;display: inline-block;width: 100%"></div>
    </div>
  </div>
</template>
<script>
import * as skuApi from '@/api/skuApi'
export default {
  data () {
    return {
      route: this.$route.params.id,
      url: ''
    }
  },
  created () {
    this.ulrAPI()
  },
  methods: {
    // 打开编辑弹窗
    editQuillEdit (id) {
      this.$router.push({
        name: 'richText',
        query: {
          id: id
        }
      })
    },
    ulrAPI () {
      // 获取一级分类
      skuApi.urls({})
        .then(data => {
          if (data.code === 300000) {
            this.url = data.data.pc
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    yulan () {
      window.open(this.url + 'supply/' + this.route)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
