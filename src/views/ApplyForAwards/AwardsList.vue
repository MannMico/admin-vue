<template>
  <div>
    <!--增加一项-->
    <el-button v-permission="'v1.award.prizes.create'" type="primary" @click="dialogAddVisible = true">增加奖项</el-button>
    <!--列表-->
    <el-table :data="data">
      <el-table-column label="序号" prop="id"></el-table-column>
      <el-table-column label="奖项名称" prop="name"></el-table-column>
      <el-table-column label="已报数量" prop="reported_num"></el-table-column>
      <el-table-column label="已获数量" prop="got_num"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="showAwardDetail(scope)">查看</el-button>
          <el-button type="text" v-permission="'v1.award.prizes.update'" @click="openDialog2(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表的分页-->
    <el-pagination
      :total="total"
      @current-change="changePage"
      background
      layout="prev, pager, next">
    </el-pagination>
    <!--增加奖项弹窗-->
    <el-dialog
      title="增加奖项"
      :visible.sync="dialogAddVisible">
      <span>奖项名称：</span>
      <el-input v-model="inputAddAward"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAward">保 存</el-button>
      </span>
    </el-dialog>
    <!--编辑奖项弹窗-->
    <el-dialog
      title="编辑奖项"
      :visible.sync="dialogEditVisible">
      <span>奖项名称：</span>
      <el-input v-model="inputEditAward"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAward">保 存</el-button>
      </span>
    </el-dialog>
    <!--查看奖项弹窗-->
    <el-dialog
      title="查看奖项"
      :visible.sync="dialogTableVisible">
      <el-table :data="detailData">
        <el-table-column property="created_at" label="时间"></el-table-column>
        <el-table-column property="operator" label="操作人"></el-table-column>
        <el-table-column property="log_name" label="类型"></el-table-column>
        <el-table-column property="note" label="内容"></el-table-column>
      </el-table>
      <el-pagination
        :total="detailTotal"
        @size-change="void 0"
        @current-change="changeDetailPage"
        background
        layout="prev, pager, next">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data () {
    return {
      data: [],
      detailData: [],
      dialogTableVisible: false,
      dialogAddVisible: false,
      dialogEditVisible: false,
      inputAddAward: '',
      inputEditAward: '',
      total: 0,
      detailTotal: 0,
      x: {}
    }
  },
  methods: {
    addAward () {
      var that = this
      request({
        url: '/v1/award/prizes',
        method: 'post',
        data: {
          name: that.inputAddAward
        }
      }).then((data) => {
        if (data.code == 300000) {
          this.data.unshift({
            id: this.total + 1,
            name: this.inputAddAward,
            reported_num: '0',
            got_num: '0'
          })
          this.dialogAddVisible = false
          this.total++
          this.inputAddAward = ''
        } else {
          this.dialogAddVisible = false
          this.$message.error(data.msg)
        }
      }).catch(() => {
        this.$message('出错了')
      })
    },
    editAward () {
      var that = this
      this.x.row.name = this.inputEditAward
      this.dialogEditVisible = false
      request({
        url: '/v1/award/prizes/' + that.x.row.id,
        method: 'PUT',
        data: {
          name: that.x.row.name,
          id: that.x.row.id
        }
      }).then((data) => {
        if (data.code == 300000) {}
      })
      this.inputAddAward = ''
    },
    changePage (pageNum) {
      request({
        url: '/v1/award/prizes',
        method: 'GET',
        params: {
          page: pageNum
        }
      }).then((data) => {
        if (data.code == 300000) {
          this.data = data.data.data
          this.total = data.data.total
        }
      })
    },
    changeDetailPage (pageNum) {
      request({
        url: '/v1/award/prizes/' + this.x.row.id + '/log',
        method: 'GET',
        params: {
          page: pageNum
        }
      }).then((data) => {
        if (data.code == 300000) {
          this.detailData = data.data.data
          this.detailTotal = data.data.total
        }
      })
    },
    openDialog2 (v) {
      this.x = v
      this.inputEditAward = v.row.name
      this.dialogEditVisible = true
    },
    showAwardDetail (scope) {
      this.x = scope
      this.dialogTableVisible = true
      request({
        url: '/v1/award/prizes/' + this.x.row.id + '/log',
        method: 'GET'
      }).then((data) => {
        console.log(data)
        if (data.code == 300000) {
          this.detailData = data.data.data
          this.detailTotal = data.data.total
        }
      })
    }
  },
  mounted () {
    // 获得列表数据
    request({
      url: '/v1/award/prizes',
      method: 'GET'
    }).then((data) => {
      if (data.code == 300000) {
        this.data = data.data.data
        this.total = data.data.total
      }
    })
  }
}
</script>
