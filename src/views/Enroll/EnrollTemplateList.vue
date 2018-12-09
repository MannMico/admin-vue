<template>
  <div>
    <!-- add btn -->
    <router-link tag="span" to="create">
      <el-button
        v-permission="'v1.sign-up.create'"
        type="primary"
        icon="el-icon-plus"
        size="small"
        class="add-btn">
          创建
      </el-button>
    </router-link>
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
      <el-table-column prop="id" label="id">
      </el-table-column>
      <el-table-column
        prop="name"
        label="大会报名名称">
      </el-table-column>
      <el-table-column
        prop="begin_at"
        label="活动时间"
        width="320px">
        <template slot-scope="scope">
          {{scope.row.begin_at + ' -- ' + scope.row.end_at}}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="creator_info.name"
        label="创建人">
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <router-link tag="span" :to="`/enroll/${scope.row.id}/list`">
            <el-button
              v-permission="'v1.sign-up.users.list'"
              size="mini"
              type="text">查看报名列表</el-button>
          </router-link>
          <router-link tag="span" :to="`/enroll/edit/${scope.row.id}`">
            <el-button
              v-permission="'v1.sign-up.update'"
              size="mini"
              type="text">编辑</el-button>
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
import * as Enroll from '@/api/enroll'
export default {
  name: 'EnrollTemplateList',
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
        limit: this.list.limit
      }
      Enroll.getEnrollList(params)
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
