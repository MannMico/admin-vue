<template>
    <div>
      <el-form :inline="true" :model="params" class="demo-form-inline" size="small">
        <el-form-item label="用户">
          <el-input v-model="params.name" placeholder="可搜索用户昵称" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="完善资料">
          <el-select v-model="params.hasInfo" placeholder="全部" style="width:150px">
            <el-option label="全部" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实名认证">
          <el-select v-model="params.hasCard" placeholder="实名认证" style="width:150px">
            <el-option label="全部" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-permission="'v1.points.points-export'" type="primary" @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        id="myTable"
        ref="myTable"
        style="width: 100%"
        border
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column
        type="index"
        >
        </el-table-column>
        <el-table-column
        prop="name"
        label="昵称">
        </el-table-column>
        <el-table-column
        prop="current_points"
        label="当前脑力值"
        sortable>
        </el-table-column>
        <el-table-column
        prop="history_points"
        label="累计脑力值"
        sortable>
        </el-table-column>
        <el-table-column
        prop="signCount"
        label="每日签到">
        </el-table-column>
        <el-table-column
        prop="replyCount"
        label="每日回复">
        </el-table-column>
        <el-table-column
        prop="shareCount"
        label="每日分享">
        </el-table-column>
        <el-table-column
        prop="likeCount"
        label="每日点赞">
        </el-table-column>
        <el-table-column
        prop="infoCount"
        :formatter="formInfo"
        label="是否完善资料">
        </el-table-column>
        <el-table-column
        prop="cardCount"
        :formatter="formCard"
        label="是否实名认证">
        </el-table-column>
        <el-table-column
        label="操作">
        <template slot-scope="scope">
          <router-link v-permission="'v1.points.user-points'" class="blue" tag='span' size="small" :to="{path: 'mentalDetail',query: {mentalDetailId: scope.row.user_id}}">详情</router-link>
          <el-button v-permission="'v1.points.points-log'" @click="handleRecord(scope.row.user_id)" type="text" size="small">记录</el-button>
        </template>
        </el-table-column>
      </el-table>
      <el-dialog title="查看脑力值记录" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" border>
            <el-table-column property="createdAt" label="时间"></el-table-column>
            <el-table-column property="name" label="操作"></el-table-column>
            <el-table-column property="status" :formatter="formNum" label="脑力值状态"></el-table-column>
            <el-table-column property="points" label="当前脑力值"></el-table-column>
        </el-table>
        <div class="block" style="margin-top:20px;">
            <el-pagination
            @size-change="handleDialogSizeChange"
            @current-change="handleDialogCurrentChange"
            :current-page="dialog.page"
            :page-size="dialog.limit"
            layout="total, prev, pager, next, jumper"
            :total="dialogtotal">
            </el-pagination>
        </div>
      </el-dialog>
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-size="params.limit"
          layout="total, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
</template>
<script>
// import FileSaver from 'file-saver'
import * as mentalUrl from '@/api/mental/mental'
// import * as Accounts from '@/api/accounts/account'

// import XLSX from 'xlsx'
export default {
  name: 'MentalList',
  data () {
    return {
      params: {
        name: '',
        hasCard: '',
        hasInfo: '',
        page: 1,
        limit: 10
      },
      paginate: {
        total: 5
      },
      tableData: [],
      gridData: [],
      dialog: {
        userId: '',
        limit: 10,
        page: 1
      },
      dialogtotal: 0,
      dialogTableVisible: false
    }
  },
  mounted () {
    let _this = this
    this.$nextTick(function () {
      _this.getList()
    })
  },
  computed: {
    totalPage () {
      return this.paginate.total || 0
    }
  },
  methods: {
    // 获取列表数据
    getList () {
      // this.loading = true
      let _this = this
      mentalUrl.mentalList(_this.params)
        .then(data => {
          if (data.code == 300000) {
            _this.tableData = data.data.data
            _this.paginate.total = data.data.total
          } else {
            _this.$message.error(data.msg)
          }
        })
        .catch(data => {
          _this.$message.error(data.msg)
        })
    },
    searchList () {
      var _this = this
      _this.getList()
    },
    formInfo (row) {
      return [
        row.infoCount == 1 ? '是' : '否'
      ]
    },
    formCard (row) {
      return [
        row.cardCount == 1 ? '是' : '否'
      ]
    },
    formNum (row) {
      return [
        row.status == 1 ? '加分' : '减分'
      ]
    },
    handleRecordList (userId, page) {
      var _this = this
      _this.dialog.userId = userId
      _this.dialog.page = page
      mentalUrl.mentalEvery(_this.dialog)
        .then(data => {
          if (data.code == 300000) {
            _this.gridData = data.data.pointsRule
            _this.dialogtotal = data.data.pagination.total
          } else {
            _this.$message.error(data.msg)
          }
        })
        .catch(data => {
          _this.$message.error(data.msg)
        })
    },
    handleRecord (userId) {
      var _this = this
      this.dialogTableVisible = true
      _this.handleRecordList(userId, 1)
    },
    handleSizeChange (size) {
      this.params.limit = size
      this.getList()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getList()
    },
    handleDialogSizeChange (size) {
      this.dialog.limit = size
      this.handleRecordList(this.dialog.userId, this.dialog.page)
    },
    handleDialogCurrentChange (val) {
      this.dialog.page = val
      this.handleRecordList(this.dialog.userId, this.dialog.page)
    },
    exportExcel () {
      //  导出excel
      let param = {
        name: this.params.name,
        hasCard: this.params.hasCard,
        hasInfo: this.params.hasInfo
      }
      mentalUrl.mentalExport(param)
        .then(data => {
          if (data.code == 300000) {
            window.location.href = data.data
          } else {
            _this.$message.error(data.msg)
          }
        })
        .catch(data => {
          _this.$message.error(data.msg)
        })
      // var wb = XLSX.utils.table_to_book(document.querySelector('#myTable'))
      // var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'})
      // try {
      //   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
      // } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      // return wbout
    }
  }
}
</script>
<style lang="scss" scoped>
  .blue{
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
  }
</style>
