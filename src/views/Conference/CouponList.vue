<template>
  <div>
    <!-- table list -->
    <el-table
      :span="24"
      :data="list.tableData"
      key="table1"
      v-loading="list.loading"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%">
      <el-table-column prop="id" label="编号">
      </el-table-column>
      <el-table-column prop="name" label="优惠券名称">
      </el-table-column>
      <el-table-column
        label="活动时间"
        width="320px">
        <template slot-scope="scope">
          {{scope.row.start_at + ' -- ' + scope.row.end_at}}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="优惠券总数">
      </el-table-column>
      <el-table-column
        prop="remain_quantity"
        label="已领取">
        <template slot-scope="scope">
          {{scope.row.quantity - scope.row.remain_quantity}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <router-link tag="span" :to="`/conference/${scope.row.id}/coupon/detail`">
            <el-button
            size="mini"
            type="text">领取详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- panigation box -->
    <div class="pagination-box">
      <el-pagination
        key="pagination1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="list.page"
        :page-sizes="[10, 20]"
        :page-size="list.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import * as Conference from '@/api/conference'
export default {
  name: 'couponList',
  data () {
    return {
      list: {
        loading: false,
        tableData: [],
        page: 1,
        limit: 10,
        totalPage: 1
      }
    }
  },
  created () {
    this.$nextTick(function () {
      this.getCouponList()
    })
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // pageSize 改变时会触发
    handleSizeChange (size) {
      this.list.limit = size
      this.getList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.list.page = val
      this.getList()
    },
    // 重置验证的表单
    resetForm (formName, dialogTypeArr) {
      this[dialogTypeArr[0]][dialogTypeArr[1]] = false
      this.$refs[formName].resetFields();
    },
    // 提交表单
    submitForm (formName, fnName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this[fnName]()
        } else {
          return false;
        }
      });
    },
    getCouponList () {
      this.list.loading = true
      let params = {
        page: this.list.page,
        limit: this.list.limit,
        conferenceId: this.$route.params.id
      }
      Conference.getConferenceCouponList(params)
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            data = data.data
            this.list.tableData = data.data
            this.list.totalPage = data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    }
  }
}
</script>
