<template>
  <div class="import-wrap">
    <el-row>
      <el-col :span="4" style="text-align: right;">
      </el-col>
    </el-row>
    <el-row>
      <hr>
    </el-row>

    <el-row>
      <div class="import-action">
        <el-row>
          <h3>导入操作</h3>
        </el-row>
        <el-row>
          <h4>1.请先下载模版，并表头填写信息，注意不要删除表头</h4>
        </el-row>
        <el-row>
          <div>
            <a href="http://lkker-10041312.file.myqcloud.com/File/%E6%B4%9B%E5%8F%AF%E5%8F%AF%E5%A5%BD%E4%BA%A7%E5%93%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xls"><el-button size="small" type="info" plain>下载好产品模板</el-button></a>
            <li style="margin-top: 10px;">注意：</li>
            <li>1）为避免数据重复，洛客给到洛可可的项目，请不要导入；</li>
            <li>2）必填字段为所属地区、项目名称、项目经理姓名、客户公司名称、产品名称、产品上市状态；</li>
            <li>3）历史导入的产品信息请不要修改项目名称和产品名称，否则会重复导入；</li>
            <li>4）同一项目下，产品名称不可重复，否则无法创建多个产品；</li>
            <li>5）产品上市时间参考示例：2018-04-28</li>
          </div>
        </el-row>
        <h4>2.请导入本次需要上传的好产品信息</h4>
        <el-row style="margin-top: 10px;">
          <div>
            <upload
              :upfileSize='3072'
              :upLimit="10"
              :upfileType="'file'"
              :file-list="realfileList"
              @urlCB="uploadSuccessReally"
              :isCover="true"></upload>
          </div>
          <span v-if="isUpload">已选择：文件名称</span>
        </el-row>
        <hr>
      </div>
      <el-row style="margin-top: 10px;">
        <el-button size="small" type="primary" @click="isImport">确定导入</el-button>
      </el-row>
    </el-row>
    <el-row v-if="tableInfo && tableInfo.length !== 0">
      <el-row style="font-size: 14px;">
        当前导入成功{{successNum}}条，失败{{tableInfo.length}}条，导入失败详情如下：
      </el-row>
      <template>
        <el-table
          :data="tableInfo"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="产品名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="error"
            label="失败原因">
          </el-table-column>
        </el-table>
      </template>
    </el-row>
  </div>
</template>
<script>

import * as api from '@/api/goodproduct/common'
import upload from '@/components/Upload/upload.vue'

export default {
  name: 'bulkImport',
  data () {
    return {
      isUpload: false,
      realfileList: [],
      fileUrl: '',
      tableInfo: [],
      successNum: 0
    }
  },
  created () {
  },
  methods: {
    uploadSuccessReally (obj, kk) {
      this.fileUrl = obj.file_url
    },
    isImport () {
      var data = {
        url: this.fileUrl
      }
      api.bulkImport(data).then(res => {
        if (res.code === 300000) {
          let data = res.data.error
          this.successNum = res.data.success
          this.tableInfo = data
          this.$message({
            showClose: true,
            message: '导入成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    }
  },
  components: {
    upload
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 20px;
  .import-wrap {
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .import-action {
      font-size: 14px;
      box-sizing: border-box;
      padding: 15px;
      border: 1px solid #d8e0e0;
      li {
        margin-bottom: $row-distance;
      }
    }
  }
</style>
