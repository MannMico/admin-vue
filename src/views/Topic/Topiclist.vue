<template>
  <div>
    <div>
      <el-form :inline="true" :model="params" class="demo-form-inline" size="small">
        <!-- <el-form-item label="话题分类">
          <el-input v-model="params.content" placeholder="话题分类" style="width:100px"></el-input>
        </el-form-item> -->
        <el-form-item label="话题内容">
          <el-input v-model="params.content" placeholder="话题内容" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="params.userName" placeholder="用户昵称" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="发布">
            <el-col :span="11">
              <el-form-item prop="date1" style="width:140px">
                <el-date-picker type="date" placeholder="选择时间" v-model="params.startTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">—</el-col>
            <el-col :span="11">
              <el-form-item prop="date2" style="width:140px">
                <el-date-picker type="date" placeholder="选择时间" v-model="params.endTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model="params.display" placeholder="显示状态" style="width:100px">
            <el-option label="显示" value="1"></el-option>
            <el-option label="隐藏" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论状态">
          <el-select v-model="params.commentStatus" placeholder="评论状态" style="width:100px">
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热门">
          <el-select v-model="params.hot" placeholder="热门" style="width:100px">
            <el-option label="热门" value="1"></el-option>
            <el-option label="不热门" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 20px;">
        <el-button
          v-permission="'v1.topic.batch-topic-like'"
          type="primary"
          size="small"
          @click="openNumDialog">批量点赞</el-button>
        <a href="http://lkker-10041312.file.myqcloud.com/template/%E8%AF%9D%E9%A2%98%E5%AF%BC%E5%85%A5%E7%A4%BA%E4%BE%8B%E6%A8%A1%E6%9D%BF.xlsx">
          <el-button type="primary" size="small">模板下载</el-button>
        </a>
        <el-button
          v-permission="'v1.topic.batch-topic-add'"
          type="primary"
          size="small"
          @click="openImportDialog">批量导入</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%;">
        <el-table-column
          type="selection"
          label="批量操作"
          width="55">
        </el-table-column>
        <el-table-column
          prop="classifyName"
          label="话题分类"
          width="120">
        </el-table-column>
        <el-table-column
          prop="content"
          label="话题内容"
          width="200">
        </el-table-column>
        <el-table-column
          prop="userInfo.userId"
          label="用户ID"
          width="120">
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
          prop="commentStatus"
          label="评论状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="hot"
          label="热门话题"
          width="120">
        </el-table-column>
        <el-table-column
          prop="commentNum"
          label="评论数量"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              v-permission="'v1.topic.switch-display'"
              @click="handleShowStatus(scope.row)"
              type="text"
              size="small">{{scope.row.display == '隐藏' ? '显示' : scope.row.display == '显示' ? '隐藏' : '' }}</el-button>
            <el-button
              v-permission="'v1.topic.switch-comment-status'"
              @click="handleComment(scope.row)"
              type="text"
              size="small">{{scope.row.display == '用户删除' ? '' : scope.row.commentStatus == '开启' ? '关闭评论' : '开启评论'}}</el-button>
            <el-button
              v-permission="'v1.topic.operate-log'"
              @click="handleRecord(scope.row)"
              type="text"
              size="small">操作记录</el-button>
            <el-button
              v-permission="'v1.topic.switch-hot'"
              @click="handleHot(scope.row)"
              type="text"
              size="small">{{scope.row.display == '用户删除' ? '' : scope.row.hot == '热门' ? '取消热门' : '热门'}}</el-button>
            <el-button @click="handleLock(scope.row)" type="text" size="small">锁定用户</el-button>
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
          :total="paginate.total">
        </el-pagination>
      </div>
      <el-dialog title="用户锁定" :visible.sync="dialogLockVisible">
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
    <el-dialog :visible.sync="dialogTableVisible">
      <el-table :data="gridData" border>
        <el-table-column property="admin_user.name" label="操作人" width="150"></el-table-column>
        <el-table-column property="remark" label="操作记录" width="200"></el-table-column>
        <el-table-column property="created_at" label="操作时间"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量点赞 -->
    <el-dialog
      title="点赞数量"
      width="300px"
      :visible.sync="dialogNumVisible">
      <el-input-number v-model="batchLike.num" :min="1" :max="30"></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNumVisible = false">取 消</el-button>
        <el-button type="primary" :loading="numLoading" @click="handleBatchLike">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="话题导入"
      :visible.sync="dialogImportVisible"
      width="700px">
      <div class="upload-box">
        <upload
          upfileType="image"
          :isDrag="true"
          :upMultiple="true"
          :showFileList="false"
          @urlCB="uploadSuccess"></upload>
        <ul
          class="el-upload-list el-upload-list--picture"
          v-if="uploadArr.length > 0">
          <li
            class="el-upload-list__item is-success"
            v-for="(elem, i) in uploadArr"
            :key="'uploadArr' + i">
            <img
              class="el-upload-list__item-thumbnail"
              :src="elem.url">
            <a class="el-upload-list__item-name">
              <div class="file-name" :title="elem.name">{{elem.name}}</div>
              <div style="margin-right: 10px;">
                所属话题：<el-input style="width: 60px;" v-model.number="elem.id"></el-input>
              </div>
              <div>
                图片排序：<el-input style="width: 60px;" v-model.number="elem.sort" maxlength="1"></el-input>
              </div>
            </a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
            <i class="el-icon-close" @click="delHasUpload(i)"></i>
          </li>
        </ul>
        <div class="result" v-if="Object.keys(uploadSortObj).length > 0">
          <ul>
            <li v-for="(item, i) in uploadSortObj" :key="'text' + i">
              <p>
                话题：<span class="text-tips" v-text="i"></span>,
                链接：<span v-for="(ele, index) in item" :key="'link' + index">
                  <span v-text="formatUploadSort[i+'-'+ele]"></span><span v-text="(item.length !== index + 1) ? ',': ''"></span>
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <el-upload
        :action="batchAddUrl"
        :auto-upload="false"
        ref="uploadExcel"
        accept="file"
        :on-change="uploadExcelChange"
        :on-success="uploadExcelSuccess"
        :file-list="uploadExcelFileList">
        <el-button size="medium" slot="trigger" type="text" style="margin: 0 10px 0 30px;">选取文件</el-button>
        <el-button size="medium" type="primary" @click="uploadExcel">上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>

import * as common from '@/api/common'
import * as api from '@/api/topic/topic'
import Upload from '@/components/Upload/custom'
import { getToken } from '@/utils/auth'

export default {
  name: 'topiclist',
  components: {
    upload: Upload
  },
  data () {
    return {
      params: {
        content: '',
        userName: '',
        display: '',
        hot: '',
        commentStatus: '',
        startTime: '',
        endTime: '',
        page: 1,
        limit: 10
      },
      activeName: 'first',
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
      loading: true,
      tableData: [],
      paginate: {},
      dialogTableVisible: false,
      dialogLockVisible: false,
      dialogNumVisible: false,
      dialogImportVisible: false,
      gridData: [],
      // 批量点赞，导入添加
      numLoading: false,
      batchLike: {
        num: 1,
        arrTopicId: []
      },
      batchFile: null,
      uploadArr: [],
      uploadExcelFileList: [],
      batchAddUrl: api.batchAddUrl
    }
  },
  created () {
    this.getTopic()
  },
  methods: {
    getTopic (params = {}) {
      this.loading = true
      api.getTopicList(params).then(res => {
        this.loading = false
        if (res.code === 300000) {
          this.tableData = res.data.data.topicList
          this.paginate = res.data.data.paginate
          this.tableData.forEach((v) => {
            let {display, hot, content, commentStatus} = v;
            switch (display) {
            case 0: display = '隐藏'; break;
            case 1: display = '显示'; break;
            case 2: display = '用户删除'; break;
            default: break;
            }
            hot == 1 ? hot = '热门' : hot = '不热门'
            commentStatus == 1 ? commentStatus = '开启' : commentStatus = '关闭'
            let classifyName = content.indexOf('#') == -1 ? '' : content.split('#')[1]
            if (content.length > 20) {
              v.content = content.substring(0, 20) + '...'
            }
            if (classifyName.length > 20) {
              classifyName = classifyName.substring(0, 20) + '...'
            }
            v.commentStatus = commentStatus
            v.display = display
            v.hot = hot
            v.classifyName = classifyName
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    onSubmit () {
      this.params.page = 1
      this.getTopic(this.formatParams(this.params))
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
    tabSelect (tab, event) {
      console.log(tab, event);
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      let newParams = this.formatParams(this.params)
      newParams.page = val
      this.params.page = val
      this.getTopic(newParams)
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
    handleLock (val) {
      console.log(val)
      this.dialogLockVisible = true
      this.lockId = val.userInfo.userId
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
          this.getTopic(this.formatParams(this.params))
        } else {
          this.$message.error(res.msg)
        }
        this.dialogLockVisible = false
      })
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
    handleComment (val) {
      let params = {}
      params.topicId = val.id
      if (val.commentStatus == '开启') {
        params.type = '0'
      } else {
        params.type = '1'
      }
      this.switchCommentFn(params)
    },
    handleHot (val) {
      let params = {}
      params.topicId = val.id
      params.userId = val.userInfo.userId
      if (val.display == '隐藏') {
        params.title = val.content
      }
      if (val.hot == '热门') {
        params.type = 0
      } else {
        params.type = 1
      }
      this.switchHotFn(params)
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
    handleRecord (val) {
      this.dialogTableVisible = true
      let params = {}
      params.page = 1
      params.limit = 100
      params.type = 'topic'
      params.modelId = val.id
      common.operateLog(params).then(res => {
        if (res.code === 300000) {
          this.gridData = res.data.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    switchDisplayFn (params) {
      api.switchDisplay(params).then(res => {
        if (res.code == 300000) {
          this.$message.success('操作成功')
          this.getTopic(this.formatParams(this.params))
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    switchCommentFn (params) {
      api.switchCommentStatus(params).then(res => {
        if (res.code === 300000) {
          this.$message.success('操作成功')
          this.getTopic(this.formatParams(this.params))
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    switchHotFn (params) {
      api.switchHot(params).then(res => {
        if (res.code == 300000) {
          this.$message.success('操作成功')
          this.getTopic(this.formatParams(this.params))
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 获取随机数
    getRandomNum (Min, Max) {
      let Range = Max - Min
      let Rand = Math.random()
      let num = Min + Math.round(Rand * Range)
      return num
    },
    openNumDialog () {
      // 是否选择话题
      if (this.batchLike.arrTopicId.length === 0) {
        return this.$message.warning('请选择要点赞的话题！')
      }
      this.batchLike.num = this.getRandomNum(1, 30)
      this.dialogNumVisible = true
    },
    handleSelectionChange (items) {
      let idArr = []
      for (let item of items) {
        idArr.push(item.id)
      }
      this.batchLike.arrTopicId = idArr;
    },
    // 批量点赞
    handleBatchLike () {
      this.numLoading = true
      api.batchLike(this.batchLike)
        .then(res => {
          this.numLoading = false
          if (res.code === 300000) {
            this.dialogNumVisible = false
            // this.getTopic()
            this.$message.success('批量点赞成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    openImportDialog () {
      this.dialogImportVisible = true
    },
    uploadSuccess (file) {
      this.uploadArr.push({
        name: file.file_name,
        url: file.file_url,
        id: '',
        sort: ''
      })
    },
    // 删除已经上传选中的项
    delHasUpload (index) {
      this.uploadArr = this.uploadArr.filter((item, i) => {
        return i != index
      })
    },
    uploadExcelChange (file, fileList) {
      this.batchFile = file.raw
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    uploadExcel () {
      if (!this.batchFile) {
        return this.$message.error('请选择要上传的文件！')
      }
      /* api.batchAdd({file: this.batchFile})
        .then(res => {
          if (res.code === 300000) {

          } else {
            this.$message.error(res.msg)
          }
        }) */
      this.$refs.uploadExcel.headers['Authorization'] = 'Bearer ' + getToken()
      this.$refs.uploadExcel.submit();
    },
    uploadExcelSuccess (response, file, fileList) {
      if (response.code === 300000) {
        this.$message.success('批量导入成功！')
        this.batchFile = null
        this.uploadExcelFileList = []
        this.uploadArr = []
        this.dialogImportVisible = false
        this.getTopic()
      } else {
        this.$message.error(response.msg)
      }
    },
    // 数组排序
    compare (x, y) {
      if (x < y) {
        return -1;
      } else if (x > y) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  watch: {
    params: {
      handler (val) {
        for (var k in val) {
          // 处理element el-date-picker清除值变成null
          if (val[k] == null) {
            val[k] = ''
          }
        }
      },
      deep: true
    }
  },
  computed: {
    uploadSortObj () {
      let result = {}
      for (let item of this.uploadArr) {
        // 排除掉没有写所属话题和图片排序的项
        if (item.id && item.sort) {
          if (!result[item.id]) {
            result[item.id] = []
          }
          result[item.id].push(item.sort)
        }
      }
      // 根据sort排序
      for (let key of Object.keys(result)) {
        result[key].sort(this.compare)
      }
      return result
    },
    formatUploadSort () {
      let result = {}
      // 根据sort获取对应的url
      for (let item of this.uploadArr) {
        if (item.id && item.sort) {
          if (!result[item.id + '-' + item.sort]) {
            result[item.id + '-' + item.sort] = {}
          }
          result[item.id + '-' + item.sort] = item.url
        }
      }
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .upload-box {
    margin: 0 auto;
    width: 600px;
    .el-upload-list {
      max-height: 220px;
      margin: 6px 0;
      padding: 4px 6px;
      border: 1px dashed #d9d9d9;
      overflow-y: scroll;
    }
    .el-upload-list__item-name {
      text-overflow: inherit;
      & > div {
        display: inline-block;
        vertical-align: middle;
      }
      &:hover {
        color: #606266;
      }
    }
    .el-upload-list--picture {
      .el-upload-list__item {
        height: 70px;
      }
      .el-upload-list__item-thumbnail {
        width: 50px;
        height: 50px;
      }
      .el-upload-list__item-name {
        line-height: 50px;
      }
    }
    .file-name {
      width: 140px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .result {
    margin-top:20px;
    width:100%;
    max-height:200px;
    overflow-y:scroll;
    li {
      padding: 5px 16px;
      font-size: 12px;
      line-height: 16px;
      border-bottom: 1px solid #f0f0f0;
      border-radius: 4px;
      word-break: break-all;
    }
    .text-tips {
      color: red;
      font-weight: 600;
    }
  }
  .pr {
    position: relative;
  }
  .choose-file {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
