<template>
  <div class="identity-wrap">
    <el-row>
      <el-button
        type="primary"
        size="small"
        v-permission="'v1.quotation.attendant.create'"
        @click="addIdentify">创建身份</el-button>
    </el-row>
    <el-row>
      <template>
        <el-table
          border
          :data="attendantstableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="身份名称">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-permission="'v1.quotation.attendant.update'"
                @click="editAttendants(scope.row)">编辑</el-button>
              <el-button
                type="text"
                size="small"
                v-permission="'v1.quotation.attendant.toggle'"
                @click="totalAttendants(scope.row)">{{scope.row.is_enabled === 1 ? '禁用' : '开启'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="productTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changeCurrentPage">
      </el-pagination>
    </el-row>
    <el-dialog :width="'80%'" title="提示" :visible.sync="toggleDialog" :close-on-click-modal="false">
      <div style="text-align: center">
        提示：是否确认<span :style="{'color' : isEnabled === '开启' ? 'green' : 'red'}">{{isEnabled}}</span>身份？
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" @click="isToggle">确定</el-button>
        <el-button type="primary" size="small" @click="toggleDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :width="'80%'" title="编辑身份" :visible.sync="editDialog" :close-on-click-modal="false">
      <div style="text-align: center">
        身份名称：<el-input v-model="editIdentityNameModel" style="width: 300px"></el-input>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" @click="isEdit">确定</el-button>
        <el-button type="primary" size="small" @click="editDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :width="'80%'" title="添加身份" :visible.sync="addIdentifyDialog" :close-on-click-modal="false">
      <div style="text-align: center">
        身份名称：<el-input v-model="addIdentityNameModel" style="width: 300px"></el-input>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" @click="isAdd">确定</el-button>
        <el-button type="primary" size="small" @click="addIdentifyDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/attendants/attendants'

export default {
  name: 'identity',
  data () {
    return {
      attendantstableData: [],
      toggleDialog: false,
      isEnabled: '',
      editDialog: false,
      editIdentityNameModel: '',
      currentId: -1,
      addIdentityNameModel: '',
      addIdentifyDialog: false,
      currentPage: 1,
      productTotal: 10,
      pageSize: 10,
      formFilter: {
        page: 1,
        limit: 10
      }
    }
  },
  created () {
    this.getAttendants()
  },
  methods: {
    getAttendants () {
      let params = this.formFilter
      api.getAttendants(params).then(res => {
        if (res.code === 300000) {
          this.attendantstableData = res.data.data
          this.productTotal = Number(res.data.total)
          this.currentPage = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
          this.formatStatus(this.attendantstableData)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatStatus (data) {
      for (let i = 0; i < data.length; i++) {
        if (Number(data[i].is_enabled) === 1) {
          data[i].status = '开启'
        } else if (Number(data[i].is_enabled) === 0) {
          data[i].status = '禁用'
        }
      }
    },
    editAttendants (row) {
      this.editDialog = true
      this.currentId = row.id
    },
    totalAttendants (row) {
      this.toggleDialog = true
      this.currentId = row.id
      if (row.is_enabled === 1) {
        this.isEnabled = '禁用'
      } else {
        this.isEnabled = '开启'
      }
    },
    addIdentify () {
      this.addIdentifyDialog = true
    },
    isToggle () {
      api.toggleServicePerson(this.currentId).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          })
          this.getAttendants()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
      this.toggleDialog = false
    },
    isEdit () {
      let data = {
        name: this.editIdentityNameModel
      }
      api.eidtServicePerson(this.currentId, data).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          })
          this.getAttendants()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
      this.editDialog = false
    },
    isAdd () {
      let data = {
        name: this.addIdentityNameModel
      }
      api.addServicePerson(data).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          })
          this.getAttendants()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
      this.addIdentifyDialog = false
    },
    changeCurrentPage (currentPage) {
      this.formFilter.page = currentPage
      this.getAttendants()
    }
  },
  watch: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 10px;
  .identity-wrap {
    font-size: 14px;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
