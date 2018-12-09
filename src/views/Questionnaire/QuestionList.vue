<template>
  <div>
    <el-form :model="tableForm" ref="ruleForm" size="small" :inline="true" class="demo-form-inline">
      <!-- <el-form-item label="搜索内容" prop="content">
        <el-input v-model="tableForm.content" placeholder="当前搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">搜索</el-button>
      </el-form-item> -->
    </el-form>
    <el-form size="small" :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" v-permission="'v1.qnr.questionnaire.create'" @click="createQuestion">创建</el-button>
        <el-button type="primary" v-permission="'v1.qnr.option.delete'" @click="deleteQuestion">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="QuestionTable"
      v-loading="loading"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="240">
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作人"
        width="240">
      </el-table-column>
      <el-table-column
        property="created_at"
        label="发布日期"
        width="240">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-permission="'v1.qnr.questionnaire.detail'"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">题目列表</el-button> -->
          <el-button
            size="mini"
            type="danger"
            v-permission="'v1.qnr.questionnaire.delete'"
            @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/questionaire/questionaire'
export default {
  name: 'QuestionList',
  data () {
    return {
      tableForm: {
        content: ''
      },
      params: {
        page: 1,
        limit: 10
      },
      total: 0,
      loading: true,
      QuestionTable: [
        {
          title: '111',
          date: '2016-05-03',
          name: '王小虎'
        },
        {
          title: '111',
          date: '2016-05-03',
          name: '王小虎'
        }],
      multipleSelection: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      api.getQnrList(this.params).then(res => {
        if (res.code === 300000) {
          this.loading = false
          this.QuestionTable = res.data.data
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDelete (index) {
      // 单个删除
      let ids = []
      let params = {}
      ids.push(this.QuestionTable[index].id)
      params = {
        ids
      }
      this.$confirm('确定删除当前选择问卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteQnr(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getList()
    },
    searchForm () {
      // 11
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    createQuestion () {
      this.$router.push({
        name: 'questionCreate',
        query: {
          type: 0,
          id: ''
        }
      })
    },
    deleteQuestion () {
      // 批量删除
      let ids = []
      let params = {}
      if (this.multipleSelection.length == 0) {
        return false
      }
      this.multipleSelection.forEach((v, i) => {
        ids.push(v.id)
      })
      params = {
        ids
      }
      this.$confirm('确定删除当前选择问卷?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteQnr(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteQnr (params) {
      api.deleteQnr(params).then(res => {
        if (res.code === 300000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleEdit (index, row) {
      this.$router.push({
        name: 'questionCreate',
        query: {
          type: 1,
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
