<template>
  <div>
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="话题分类">
          <el-input v-model="formInline.title" placeholder="话题分类" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="formInline.userName" placeholder="用户昵称" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="发布">
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        style="width: 100%;">
        <el-table-column
          prop="name"
          label="分类名称"
          width="120">
        </el-table-column>
        <el-table-column
          label="封面"
          width="200">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="" style="width:80px;height:80px;">
            <el-button @click="handleEditImg(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="viewNum"
          label="浏览量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="followNum"
          label="关注用户量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="topicNum"
          label="话题数量"
          width="150">
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="创建时间"
          width="200">
        </el-table-column>
        <el-table-column
          prop="user.userName"
          label="创始人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="content"
          label="简介"
          width="120">
        </el-table-column>
        <el-table-column
          prop="display"
          label="显示状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="hot"
          label="热门状态"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button
              v-permission="'v1.topic.switch-display'"
              @click="handleTypeShow(scope.row)"
              type="text"
              size="small">{{scope.row.display == '隐藏' ? '显示' : scope.row.display == '显示' ? '隐藏' : '' }}</el-button>
            <el-button
              v-permission="'v1.topic.switch-hot'"
              @click="handleTypeHot(scope.row)"
              type="text"
              size="small">{{scope.row.display == '用户删除' ? '' : scope.row.hot == '热门' ? '取消热门' : '热门'}}</el-button>
            <el-button
              v-permission="'v1.topic.type-topic-list'"
              type="text"
              size="small">
              <router-link tag='span' :to="{path: 'topicDetail',query: {topicTypeId: scope.row.id}}">查看详情</router-link>
            </el-button>
            <el-button @click="handleBrief(scope.row)" type="text" size="small">编辑</el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paginate.page"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="paginate.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="上传图片" style="width:50%;margin:0 auto" :visible.sync="dialogUploadVisible">
      <img :src="fileList.url" style="width:100px;height:100px" alt="">
      <upload-file :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="false" @urlCB="uploadSuccess" :isCover="true"></upload-file>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterUpload">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置时间范围" style="width:50%;margin:0 auto" :visible.sync="dialogHotVisible">
      <el-date-picker
        style="width:100%"
        v-model="timeRang"
        type="datetimerange"
        value-format="yyyy-MM-dd hh-mm-ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHotVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterHot">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/topic/topic'
import uploadFile from '@/components/Upload/upload'

export default {
  name: 'topicClassify',
  data () {
    return {
      formInline: {
        title: '',
        userName: '',
        startTime: '',
        endTime: '',
        page: 1,
        limit: 10
      },
      fileList: {},
      topicTypeId: '',
      dialogUploadVisible: false,
      dialogHotVisible: false,
      paginate: {},
      loading: false,
      tableData: [],
      timeRang: []
    }
  },
  created () {
    this.getTypeList()
  },
  methods: {
    onSubmit () {
      this.formInline.page = 1
      this.getTypeList(this.formatParams(this.formInline))
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
    getTypeList (params = {}) {
      this.loading = true
      api.topicType(params).then(res => {
        if (res.code === 300000) {
          this.loading = false
          this.tableData = res.data.data.topicTypeList
          this.paginate = res.data.data.paginate
          this.tableData.forEach((v) => {
            let {display, hot, name} = v;
            switch (display) {
            case 0: display = '隐藏'; break;
            case 1: display = '显示'; break;
            case 2: display = '用户删除'; break;
            default: break;
            }
            hot == 1 ? hot = '热门' : hot = '不热门'
            if (name.length > 20) {
              v.name = name.substring(0, 20) + '...'
            }
            v.display = display
            v.hot = hot
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    uploadSuccess (res) {
      if (res.code === 0) {
        let url = res.file_url
        let name = res.file_name
        this.fileList = {
          name: name,
          url: url
        }
      }
    },
    enterUpload () {
      let params = {
        topicTypeId: this.topicTypeId,
        image: this.fileList.url
      }
      api.editTypeImage(params).then(res => {
        if (res.code === 300000) {
          this.$message.success('编辑成功')
          this.getTypeList(this.formatParams(this.formInline))
        } else {
          this.$message.error(res.msg)
        }
        this.dialogUploadVisible = false
      })
    },
    handleEditImg (val) {
      let image = val.image
      let arr = image.split('/')
      let l = arr.length
      this.topicTypeId = val.id
      this.dialogUploadVisible = true
      this.fileList = {
        name: arr[l - 1],
        url: image
      }
    },
    handleCurrentChange (val) {
      this.formInline.page = val
      this.getTypeList(this.formatParams(this.formInline))
    },
    handleTypeHot (val) {
      let params = {}
      this.topicTypeId = val.id
      if (val.hot == '热门') {
        this.isHot = 0
        params = {
          topicTypeId: this.topicTypeId,
          type: this.isHot
        }
        this.switchTypeHotFn(params)
      } else {
        this.dialogHotVisible = true
        this.isHot = 1
      }
      // this.switchTypeHotFn(params)
    },
    enterHot () {
      let params = {
        topicTypeId: this.topicTypeId,
        type: this.isHot,
        startTime: this.timeRang[0],
        endTime: this.timeRang[1]
      }
      this.switchTypeHotFn(params)
    },
    handleTypeShow (val) {
      console.log(val)
      let params = {
        topicTypeId: val.id
      }
      if (val.display == '显示') {
        this.hideReason(params)
      } else {
        this.switchTpyeDisplayFn(params)
      }
    },
    handleBrief (val) {
      console.log(val)
      this.$prompt('请输入话题简介', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: val.content,
        inputValidator: function (v) {
          if (v == null || v == '') {
            return '请输入话题简介'
          }
        }
      }).then(({ value }) => {
        let params = {
          content: value,
          topicTypeId: val.id
        }
        api.editTypeContent(params).then(res => {
          if (res.code === 300000) {
            this.$message.success('操作成功')
            this.getTypeList(this.formatParams(this.formInline))
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消输入'
        })
      })
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
        this.switchTpyeDisplayFn(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消隐藏'
        })
      })
    },
    switchTpyeDisplayFn (params) {
      api.switchTypeDisplay(params).then(res => {
        if (res.code == 300000) {
          this.$message.success('操作成功')
          this.getTypeList(this.formatParams(this.formInline))
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    switchTypeHotFn (params) {
      api.switchTypeHot(params).then(res => {
        if (res.code == 300000) {
          this.$message.success('操作成功')
          this.dialogHotVisible = false
          this.getTypeList(this.formatParams(this.formInline))
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  },
  components: {
    'upload-file': uploadFile
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
