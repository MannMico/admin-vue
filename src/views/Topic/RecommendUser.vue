<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item label="用户ID">
        <el-input v-model="formInline.userId" placeholder="用户ID" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="formInline.userName" placeholder="用户昵称" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="手机号" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="话题数量">
          <el-col :span="10">
            <el-form-item style="width:75px">
              <el-input v-model="formInline.minTopicNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="10">
            <el-form-item style="width:75px">
              <el-input v-model="formInline.maxTopicNum"></el-input>
            </el-form-item>
          </el-col>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-select v-model="formInline.isRecommend" placeholder="是否推荐" style="width:100px">
          <el-option label="是" value="2"></el-option>
          <el-option label="否" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%;text-align:center">
      <el-table-column
        prop="id"
        label="用户ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户昵称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="fansNum"
        label="粉丝量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="topicNum"
        label="话题数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="recommendText"
        label="是否推荐"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button @click="handleRecommend(scope.row)" type="text" size="small">{{scope.row.isRecommend == 1 ? '推荐' : '取消推荐'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total=total>
      </el-pagination>
    </div>
  </div>
</template>
<script>

import * as api from '@/api/topic/topic'

export default {
  name: 'recommendUser',
  data () {
    return {
      formInline: {
        userId: '',
        userName: '',
        phone: '',
        minTopicNum: '',
        maxTopicNum: '',
        isRecommend: '',
        page: 1,
        limit: 10
      },
      loading: false,
      tableData: [],
      currentPage: 4,
      total: 0
    }
  },
  created () {
    this.getRecommendList()
  },
  methods: {
    onSubmit () {
      this.formInline.page = 1
      this.getRecommendList(this.formatParams(this.formInline))
    },
    formatParams (params) {
      let newParams = {}
      for (var k in params) {
        if (params[k] != '') {
          newParams[k] = params[k]
        }
      }
      return newParams
    },
    getRecommendList (params) {
      this.loading = true
      api.userRecommendList(params).then(res => {
        console.log(res)
        if (res.code === 300000) {
          this.loading = false
          this.tableData = res.data.data
          this.total = res.data.total
          this.tableData.forEach((v) => {
            let recommendText
            recommendText = v.isRecommend == 1 ? '不推荐' : '推荐'
            v.recommendText = recommendText
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleRecommend (val) {
      let params = {
        userId: val.id
      }
      if (val.isRecommend == '推荐') {
        params.type = 0
      } else {
        params.type = 0
      }
      this.switchRecommend(params)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.formInline.page = val
      this.getRecommendList(this.formatParams(this.formInline))
    },
    switchRecommend (params) {
      api.switchUserRecommend(params).then(res => {
        if (res.code == 300000) {
          this.$message.success('操作成功')
          this.getRecommendList(this.formatParams(this.formInline))
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  },
  components: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
