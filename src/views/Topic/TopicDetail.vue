<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item label="发布时间">
          <el-col :span="11">
            <el-form-item prop="date1" style="width:140px">
              <el-date-picker type="date" placeholder="选择日期" v-model="formInline.startTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">—</el-col>
          <el-col :span="11">
            <el-form-item prop="date2" style="width:140px">
              <el-date-picker type="date" placeholder="选择时间" v-model="formInline.endTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
      </el-form-item>
      <el-form-item label="显示状态">
        <el-select v-model="formInline.display" placeholder="状态" style="width:100px">
          <el-option label="不显示" value="0"></el-option>
          <el-option label="显示" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-select v-model="formInline.top" placeholder="状态" style="width:100px">
          <el-option label="置顶" value="1"></el-option>
          <el-option label="不置顶" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%;">
      <el-table-column
        prop="content"
        label="话题内容"
        width="120">
      </el-table-column>
      <el-table-column
        prop="userInfo.userId"
        label="用户ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="userInfo.userName"
        label="用户昵称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="发布时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="display"
        label="显示状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="isTop"
        label="是否置顶"
        width="120">
      </el-table-column>
      <el-table-column
        prop="hotTime"
        label="置顶时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="commentNum"
        label="评论数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="likeNum"
        label="点赞数量"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button @click="handleShowStatus(scope.row)" type="text" size="small">{{scope.row.display == '隐藏' ? '显示' : scope.row.display == '显示' ? '隐藏' : '' }}</el-button>
          <el-button @click="handleTop(scope.row)" type="text" size="small">{{scope.row.isTop == '置顶' ? '不置顶' : scope.row.isTop == '不置顶' ? '置顶' : '' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="paginate.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import * as api from '@/api/topic/topic'

export default {
  name: 'topiclist',
  data () {
    return {
      formInline: {
        display: '',
        top: '',
        startTime: '',
        endTime: '',
        page: 1
      },
      paginate: {},
      tableData: []
    }
  },
  created () {
    this.topicList()
  },
  methods: {
    onSubmit () {
      this.formInline.page = 1
      this.topicList(this.formatParams(this.formInline))
    },
    topicList (params = {}, id = {topicTypeId: this.$route.query.topicTypeId}) {
      let obj = Object.assign(params, id)
      api.typeTopicList(obj).then(res => {
        if (res.code === 300000) {
          this.tableData = res.data.data.topicList
          this.paginate = res.data.data.paginate
          this.tableData.forEach((v) => {
            let {display, isTop, content} = v;
            switch (display) {
            case 0: display = '隐藏'; break;
            case 1: display = '显示'; break;
            case 2: display = '用户删除'; break;
            default: break;
            }
            isTop == 1 ? isTop = '置顶' : isTop = '不置顶'
            if (content.length > 20) {
              v.content = content.substring(0, 20) + '...'
            }
            v.display = display
            v.isTop = isTop
          })
        } else {
          this.$message.error(res.msg)
        }
      })
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
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.formInline.page = val
      this.topicList(this.formatParams(this.formInline))
    },
    handleTop (val) {
      console.log(val)
      let isTop = val.isTop == '置顶' ? 0 : 1
      let params = {
        topicTypeId: this.$route.query.topicTypeId,
        topicId: val.id,
        type: isTop
      }
      this.handleTopFn(params)
    },
    handleTopFn (params) {
      api.typeTopicTop(params).then(res => {
        if (res.code === 300000) {
          this.$message.success('操作成功')
          this.topicList(this.formatParams(this.formInline))
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleShowStatus (val) {
      let params = {
        topicId: val.id
      }
      if (val.display == '显示') {
        params.userId = val.userInfo.userId
        params.title = val.content
        this.hideReason(params)
      } else {
        this.switchDisplayFn(params)
      }
    },
    hideReason (params) {
      this.$prompt('请输入隐藏理由', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: function (v) {
          if (v == null || v == '') {
            return '请输入隐藏理由'
          }
        }
      }).then(({ value }) => {
        params.reason = value
        this.switchDisplayFn(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消隐藏'
        })
      })
    },
    switchDisplayFn (params) {
      api.switchDisplay(params).then(res => {
        if (res.code == 300000) {
          this.$message.success('操作成功')
          this.topicList(this.formatParams(this.formInline))
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
