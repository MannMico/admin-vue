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
      <el-table-column prop="user_id" label="用户ID">
      </el-table-column>
      <el-table-column
        prop="user.name"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="用户手机号">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="remark"
        :label="list.tableData[0] ? list.tableData[0].remarkName : '角色详情'"
        >
      </el-table-column>
      <el-table-column
        prop="enroll_session"
        label="场次时间">
      </el-table-column>
      <el-table-column
        prop="sign_up_at"
        label="报名时间">
      </el-table-column>
      <el-table-column
        label="是否付费">
        <template slot-scope="scope">
          {{scope.row.pay_status == 1 ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_amount"
        label="付费金额（元）">
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
import * as Enroll from '@/api/enroll'
export default {
  name: 'EnrollList',
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
      this.getSignList()
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
      this.getSignList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.list.page = val
      this.getSignList()
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
    getSignList () {
      this.list.loading = true
      let params = {
        page: this.list.page,
        limit: this.list.limit,
        id: this.$route.params.id
      }
      Enroll.getEnrollUserList(params)
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
