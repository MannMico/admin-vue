<template>
  <div class="drafts-wrap">
    <template>
      <el-table
        border
        ref="multipleTable"
        :data="draftsTableData"
        @selection-change="handleSelectionChange"
        @row-click="viewDetail"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="company_name"
          label="公司">
        </el-table-column>
        <el-table-column
          prop="contact_name"
          label="联系人">
        </el-table-column>
         <el-table-column
          prop="contact_phone"
          label="联系方式">
        </el-table-column>
         <el-table-column
          prop="created_by_name"
          label="客户网站登录账号">
        </el-table-column>
         <el-table-column
          label="项目名称">
          <template slot-scope="scope">
            <div style="display: inline-block" v-for="(projectItem, index) in scope.row.projects" :key="index">{{projectItem.name}} <span v-if="index !== scope.row.projects.length - 1">，</span> </div>
          </template>
        </el-table-column>
         <el-table-column
          label="服务">
            <template slot-scope="scope">
              <!-- <div class="services-tb" style="display: inline-block" v-for="(projectItem, index) in scope.row.projects" :key="index">
                <div style="display: inline-block" v-for="(serviceItem, j) in projectItem.services" :key="j"><span style="margin-left: 10px;"></span>{{serviceItem.name}}</div>
              </div> -->
              <div class="services-tb" style="display: inline-block" v-for="(projectItem, index) in scope.row.newService" :key="index">
                {{projectItem}}
              </div>
            </template>
        </el-table-column>
      </el-table>
    </template>
    <el-row>
      <template>
        <el-checkbox v-model="isAllChecked">全选</el-checkbox>
      </template>
      <el-button style="margin-left: 20px;" type="text" size="normal" @click="deleteDrafts" v-permission="'v1.quotation.quotations.drafts.delete'">删除</el-button>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="productTotal"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="changeCurrentPage">
    </el-pagination>
  </div>
</template>
<script>

import * as api from '@/api/quote/quote'

export default {
  name: 'drafts',
  data () {
    return {
      draftsTableData: [],
      deleteIds: [],
      isAllChecked: false,
      draftsParams: {
        page: 1,
        limit: 20
      },
      currentPage: 1,
      productTotal: 10,
      pageSize: 10
    }
  },
  created () {
    this.initDragts()
  },
  methods: {
    initDragts () {
      let params = this.draftsParams
      api.getQuoteDrafts(params).then(res => {
        if (res.code === 300000) {
          this.draftsTableData = res.data.data
          this.formatService(this.draftsTableData)
          this.productTotal = Number(res.data.total)
          this.currentPage = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    deleteDrafts () {
      let data = {
        ids: this.deleteIds // 删除选中
      }
      api.deleteDrafts(data).then(res => {
        if (res.code === 300000) {
          this.initDragts()
          this.$message({
            showClose: true,
            message: '删除成功',
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
    },
    formatService (data) {
      for (let i = 0; i < data.length; i++) { // 返回新服务数据
        let secondArr = []
        for (let j = 0; j < data[i].projects.length; j++) {
          for (let z = 0; z < data[i].projects[j].services.length; z++) {
            secondArr.push(data[i].projects[j].services[z].name)
          }
        }
        data[i].newService = secondArr
      }

      for (let i = 0; i < data.length; i++) { // 添加省略号
        let iNow = 0;
        for (let j = 0; j < data[i].newService.length; j++) {
          iNow += data[i].newService[j].length
          if (iNow >= 20) {
            data[i].newService = data[i].newService.slice(0, j)
            data[i].newService[j - 1] += '......'
            return
          }
          data[i].newService[j - 1] += ','
        }
      }
    },
    handleSelectionChange (val) {
      this.deleteIds = []
      if (val && val.length !== 0) {
        for (let i = 0; i < val.length; i++) {
          this.deleteIds.push(val[i].id)
        }
      }
    },
    changeCurrentPage (currentPage) {
      this.draftsParams.page = currentPage
      this.initDragts()
    },
    viewDetail (row) {
      this.$router.push({path: `/quote/add-quote/${row.id}/edit`})
    }
  },
  watch: {
    isAllChecked (checked) {
      if (checked) {
        var rows = this.draftsTableData
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 10px;
  .drafts-wrap {
    font-size: 14px;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .services-tb {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
  }
</style>
