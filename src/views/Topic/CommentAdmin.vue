<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
      <el-form-item label="话题内容">
        <el-input v-model="formInline.content" placeholder="话题内容" style="width:100px"></el-input>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input v-model="formInline.userName" placeholder="用户名称" style="width:100px"></el-input>
      </el-form-item>
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
      <el-form-item label="状态">
        <el-select v-model="formInline.isDelete" placeholder="状态" style="width:100px">
          <el-option label="正常" value="0"></el-option>
          <el-option label="已删除" value="1"></el-option>
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
      style="width: 100%;">
      <el-table-column
        prop="orderId"
        type="index"
        label="序号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="topicContent"
        label="话题内容"
        width="120">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="评论用户"
        width="150">
      </el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="发布时间"
        width="220">
      </el-table-column>
      <el-table-column
        prop="isDelete"
        label="评论状态"
        width="120">
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        label="操作时间"
        width="220">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button @click="handleDelect(scope.row)" type="text" size="small">{{scope.row.isDelete == '已删除' ? '' : '删除'}}</el-button>
          <el-button @click="handleLock(scope.row)" type="text" size="small">锁定用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginate.page"
        :page-size="30"
        layout="total, prev, pager, next, jumper"
        :total="paginate.total">
      </el-pagination>
    </div>
    <el-dialog title="用户锁定" :visible.sync="dialogTableVisible">
      <el-tabs v-model="activeName" type="card" @tab-click="tabSelect">
        <el-tab-pane label="账号锁定" name="first">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="锁定原因" prop="reason">
              <el-radio-group v-model="ruleForm.reason">
                <el-radio label="发布广告"></el-radio>
                <el-radio label="发布无效信息"></el-radio>
                <el-radio label="创意抄袭"></el-radio>
                <el-radio label="其他"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" style="width:500px;">
              <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="锁定时长" prop="time">
              <el-radio-group v-model="ruleForm.time">
                <el-radio label="3天"></el-radio>
                <el-radio label="7天"></el-radio>
                <el-radio label="永久"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane label="锁定记录" name="second">
          <el-table
            :data="lockRecord"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="操作人"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="操作记录"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="时间">
            </el-table-column>
          </el-table>
        </el-tab-pane> -->
      </el-tabs>
      <div slot="footer" class="dialog-footer" v-show="activeName == 'first'">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/topic/comment'
import * as common from '@/api/common'

export default {
  name: 'commentAdmin',
  data () {
    return {
      formInline: {
        content: '',
        userName: '',
        startTime: '',
        endTime: '',
        isDelete: '',
        page: 1,
        limit: 30
      },
      loading: true,
      tableData: [],
      paginate: {},
      dialogTableVisible: false,
      activeName: 'first',
      gridData: [{
        date: '游戏',
        name: '王小虎王小虎王小虎王小虎',
        address: 'C15468622'
      }],
      ruleForm: {
        reason: '',
        time: '',
        delect: '',
        desc: ''
      },
      rules: {
        reason: [
          { required: true, message: '请选择锁定原因', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择锁定时长', trigger: 'change' }
        ],
        delect: [
          { required: true, message: '请选择评论删除', trigger: 'change' }
        ]
      },
      lockId: '',
      lockRecord: [{

      }]
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    onSubmit () {
      this.formInline.page = 1
      this.getCommentList(this.formatParams(this.formInline))
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
      this.getCommentList(this.formatParams(this.formInline))
    },
    handleDelect (val) {
      console.log(val)
      let params = {}
      params.commentId = val.commentID
      params.topicId = val.topicId
      this.$confirm('是否删除该条评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        api.delectComment(params).then(res => {
          if (res.code === 300000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getCommentList(this.formatParams(this.formInline))
          } else {
            this.$message({
              type: 'info',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleLock (val) {
      this.dialogTableVisible = true
      this.lockId = val.userId
    },
    tabSelect (tab, event) {
      console.log(tab, event);
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.lockSubmit()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    lockSubmit () {
      let oldTime = this.ruleForm.time
      let reason = this.ruleForm.reason
      let reasonNum = 0
      let time = parseInt(/天/g.test(oldTime) ? oldTime.replace(/天/g, '') : 0)
      switch (reason) {
      case '发布广告': reasonNum = 1; break;
      case '发布无效信息': reasonNum = 2; break;
      case '创意抄袭': reasonNum = 3; break;
      case '垃圾评论': reasonNum = 4; break;
      case '其他': reasonNum = 0; break;
      }
      let params = {
        lockDate: time,
        userId: this.lockId,
        lockType: reasonNum
      }
      if (reasonNum == 0) {
        params.lockMsg = this.ruleForm.desc
        if (params.lockMsg == '') {
          this.$message.error('锁定原因不能为空')
          return false
        }
      }
      common.lockUser(params).then(res => {
        if (res.code === 300000) {
          this.$message.success('操作成功')
          this.getCommentList(this.formatParams(this.formInline))
        } else {
          this.$message.error(res.msg)
        }
        this.dialogTableVisible = false
      })
    },
    getCommentList () {
      let params = this.formatParams(this.formInline)
      this.loading = true
      api.getCommentList(params).then(res => {
        if (res.code === 300000) {
          this.loading = false
          this.tableData = res.data.data
          this.paginate = res.data.paginate
          this.tableData.forEach((v) => {
            let {isDelete, topicContent, content} = v
            isDelete = isDelete ? '已删除' : '正常'
            if (topicContent.length > 20) {
              topicContent = topicContent.substring(0, 20) + '...'
            }
            if (content.length > 20) {
              content = content.substring(0, 20) + '...'
            }
            v.topicContent = topicContent
            v.content = content
            v.isDelete = isDelete
          })
        } else {
          this.$message.error(res.msg)
        }
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
