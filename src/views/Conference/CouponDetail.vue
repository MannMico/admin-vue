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
      <el-table-column prop="user_id" label="用户id">
      </el-table-column>
      <el-table-column prop="user_name" label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="注册手机号">
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="公司名称">
      </el-table-column>
      <el-table-column
        label="需求点"
        width="240px"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-for="(item, index) in scope.row.require_points"
            :key="item">
            {{(index + 1) === scope.row.require_points.length ? item : `${item}、`}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="领取时间">
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
  name: 'couponDetail',
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
        couponId: this.$route.params.id
      }
      Conference.getCouponzReceiveList(params)
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
