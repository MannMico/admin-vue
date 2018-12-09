<template>
  <div>
    <div><el-button @click="add">添加任务</el-button></div>
    <el-table
      :data="listData">
      <el-table-column
        prop="id"
        label="任务编号"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="任务名称"
      ></el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        prop="cover"
        label="封面图"
        width="180"
      >
        <template slot-scope="obj">
          <img :src="obj.row.cover" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="任务起止时间"
      >
        <template slot-scope="obj">
          <div>{{obj.row.start_time | timeFilter}}</div> <div>至</div> <div>{{obj.row.end_time | timeFilter}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="所属企业"
      ></el-table-column>
      <el-table-column
        prop="award"
        label="奖金"
      ></el-table-column>
      <el-table-column
        prop="join_num"
        label="参与作品数"
      ></el-table-column>
      <el-table-column
        prop="thirty_num"
        label="入围作品数"
      ></el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteItem(scope)">删除</el-button>
          <el-button type="text" size="small" @click="showDetail(scope)">查看详情</el-button>
          <el-button type="text" size="small" @click="linkOpusList(scope)">查看作品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      @close="closeDialog"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <span slot="title">{{ dialogTitle }}</span>
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        labelPosition="left"
        label-width="100px"
      >
        <h4 style="margin-bottom:20px;">任务信息</h4>
        <el-form-item
          prop="title"
          label="任务名称">
          <el-input
            :maxlength="30"
            v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="任务起止时间">
          <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            v-model="formData.time"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item
          prop="companyName"
          label="所属企业">
          <el-autocomplete
            value-key="company_name"
            v-model="formData.companyName"
            :fetch-suggestions="queryCompany"
            @select="selectCompany"></el-autocomplete>
        </el-form-item>
        <el-form-item
          prop="award"
          label="奖金">
          <el-input v-model="formData.award"></el-input>
        </el-form-item>
        <el-form-item
          prop="sort"
          label="顺序">
          <el-input v-model="formData.sort"></el-input>
        </el-form-item>
        <h4 style="margin-bottom:20px;margin-top: 50px;">PC图片</h4>
        <el-form-item
          prop="cover"
          label="封面图">
          <upload-file :upfileSize="51200" :upfileType="'image'" :upLimit="1" :upMultiple="false" @urlCB="upload1" @removeFile="removeUpload1" info="点击上传按钮替换封面图"></upload-file>
        </el-form-item>
        <el-row><img :src="formData.cover" alt=""></el-row>
        <el-form-item
          prop="head_cover"
          label="头部图">
          <upload-file :upfileSize="51200" :upfileType="'image'" :upLimit="1" :upMultiple="false" @urlCB="upload2" @removeFile="removeUpload2" info="点击上传按钮替换头部图"></upload-file>
        </el-form-item>
        <el-row><img :src="formData.head_cover" alt=""></el-row>
        <el-form-item
          prop="background"
          label="背景图">
          <upload-file :upfileSize="51200" :upfileType="'image'" :upLimit="20" :upMultiple="false" @urlCB="upload3" @removeFile="removeUpload3" info="点击背景图上面的x删除此图片, 上传图片排在前一张的下面"></upload-file>
        </el-form-item>
        <el-row v-for="(url, k) in formData.background" :key="k" style="position: relative;">
          <i class="el-icon-error" style="position: absolute; top: 0; left: 190px;"  @click="deleteBackground(k)"></i>
          <img :src="url" alt="123">
        </el-row>

        <h4 style="margin-bottom:20px;margin-top: 50px;">微信图片</h4>
        <el-form-item
          prop="cover"
          label="封面图">
          <upload-file :upfileSize="51200" :upfileType="'image'" :upLimit="1" :upMultiple="false" @urlCB="upload4" @removeFile="removeUpload4" info="点击上传按钮替换封面图"></upload-file>
        </el-form-item>
        <el-row><img :src="formData.wx_cover" alt=""></el-row>
        <el-form-item
          prop="head_cover"
          label="头部图">
          <upload-file :upfileSize="51200" :upfileType="'image'" :upLimit="1" :upMultiple="false" @urlCB="upload5" @removeFile="removeUpload5" info="点击上传按钮替换头部图"></upload-file>
        </el-form-item>
        <el-row><img :src="formData.wx_head_cover" alt=""></el-row>
        <el-form-item
          prop="background"
          label="背景图">
          <upload-file :upfileSize="51200" :upfileType="'image'" :upLimit="20" :upMultiple="false" @urlCB="upload6" @removeFile="removeUpload6" info="点击背景图上面的x删除此图片, 上传图片排在前一张的下面"></upload-file>
        </el-form-item>
        <el-row v-for="(url, k) in formData.wx_background" :key="k+100" style="position: relative;">
          <i class="el-icon-error" style="position: absolute; top: 0; left: 190px;"  @click="deleteWxBackground(k)"></i>
          <img :src="url" alt="123">
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible1"
      @close="closeDialog"
      width="600px">
      <span slot="title">任务详情</span>
      <h4 style="margin-bottom:20px;margin-top: 50px;">任务信息</h4>
      <el-row>
        任务编号：{{formData.id}}
      </el-row>
      <el-row>
        任务名称：{{formData.title}}
      </el-row>
      <el-row>
        创建时间：{{formData.createdAt}}
      </el-row>
      <el-row>
        任务起止时间：{{formData.time[0]}} - {{formData.time[1]}}
      </el-row>
      <el-row>
        所属企业：{{formData.companyName}}
      </el-row>
      <el-row>
        奖金：{{formData.award}}
      </el-row>

      <h4 style="margin-bottom:20px;margin-top: 50px;">参与状态</h4>
      <el-row>
        参与人数：{{formData.joinNum}}
      </el-row>
      <el-row>
        入围30强：{{formData.thirtyNum}}
      </el-row>
      <h4 style="margin-bottom:20px;margin-top: 50px;">PC</h4>
      <el-row>封面图</el-row>
      <el-row><img :src="formData.cover" alt=""></el-row>
      <el-row>头部图</el-row>
      <el-row><img :src="formData.head_cover" alt=""></el-row>
      <el-row>背景图</el-row>
      <el-row v-for="(url, k) in formData.background" :key="k + 200">
        <img :src="url" alt="">
      </el-row>
      <h4 style="margin-bottom:20px;margin-top: 50px;">微信</h4>
      <el-row>封面图</el-row>
      <el-row><img :src="formData.wx_cover" alt=""></el-row>
      <el-row>头部图</el-row>
      <el-row><img :src="formData.wx_head_cover" alt=""></el-row>
      <el-row>背景图</el-row>
      <el-row v-for="(url, k) in formData.wx_background" :key="k + 300">
        <img :src="url" alt="">
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import uploadFile from '@/components/Upload/upload'
import request from '@/utils/request'

export default {
  data () {
    var formData = {
      id: '',
      title: '',
      companyId: '',
      companyName: '',
      time: [],
      startTime: '',
      endTime: '',
      award: '',
      sort: '',
      cover: '',
      head_cover: '',
      background: [],
      wx_cover: '',
      wx_head_cover: '',
      wx_background: []
    }
    var rules = {}
    var rule = [{required: true, message: '必填'}]
    var formArr = Object.keys(formData)
    formArr.forEach(function (v) {
      rules[v] = rule
    })
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogVisible1: false,
      submitState: 0,
      listData: [{
        award: '',
        background: '',
        company_id: '',
        company_name: '',
        cover: '',
        created_at: '',
        end_time: '',
        head_cover: '',
        id: '',
        join_num: '',
        sort: '',
        start_time: '',
        thirty_num: '',
        title: '',
        updated_at: '',
        wx_background: '',
        wx_cover: '',
        wx_head_cover: ''
      }],
      formData: formData,
      rules: rules
    }
  },
  methods: {
    deleteBackground (k) {
      this.formData.background.splice(k, 1)
    },
    deleteWxBackground (k) {
      this.formData.wx_background.splice(k, 1)
    },
    upload1 (file) {
      this.formData.cover = file.file_url
    },
    removeUpload1 (arr) {
      // this.formData.cover = arr.url
    },
    upload2 (file) {
      this.formData.head_cover = file.file_url
    },
    removeUpload2 (arr) {
      // this.formData.head_cover = arr.url
    },
    upload3 (file) {
      this.formData.background.push(file.file_url)
    },
    removeUpload3 (arr) {
      // var that = this
      // this.formData.background = []
      // arr.forEach(function (v) {
      // that.formData.background.push(v.url)
      // })
    },
    upload4 (file) {
      this.formData.wx_cover = file.file_url
    },
    removeUpload4 (arr) {
      // this.formData.cover = arr.url
    },
    upload5 (file) {
      this.formData.wx_head_cover = file.file_url
    },
    removeUpload5 (arr) {
      // this.formData.head_cover = arr.url
    },
    upload6 (file) {
      this.formData.wx_background.push(file.file_url)
    },
    removeUpload6 (arr) {
      // var that = this
      // this.formData.background = []
      // arr.forEach(function (v) {
      // that.formData.background.push(v.url)
      // })
    },
    queryCompany (str, cb) {
      console.log(str)
      request({
        url: '/v1/designer/partner-task-company',
        method: 'get',
        params: {
          name: str
        }
      }).then(function (data) {
        cb(data.data)
      })
    },
    selectCompany (obj) {
      this.formData.companyId = obj.id
    },
    add () {
      this.submitState = 1
      this.dialogVisible = true
      this.dialogTitle = '创建任务'
    },
    deleteItem (scope) {
      request({
        url: '/v1/designer/' + scope.row.id + '/partner-task-delete',
        method: 'delete',
        data: {
          id: scope.row.id
        }
      }).then(data => {
        this.$router.go()
      })
    },
    edit (scope) {
      this.submitState = 2

      this.formData.title = scope.row.title
      this.formData.createdAt = scope.row.created_at
      this.formData.companyId = scope.row.company_id
      this.formData.companyName = scope.row.company_name
      this.formData.time = [scope.row.start_time, scope.row.end_time]
      this.formData.award = scope.row.award
      this.formData.cover = scope.row.cover
      this.formData.wx_cover = scope.row.wx_cover
      this.formData.head_cover = scope.row.head_cover
      this.formData.wx_head_cover = scope.row.wx_head_cover
      this.formData.sort = scope.row.sort
      this.formData.background = scope.row.background
      this.formData.wx_background = scope.row.wx_background
      this.formData.id = scope.row.id
      this.formData.thirtyNum = scope.row.thirty_num
      this.formData.joinNum = scope.row.join_num

      this.dialogTitle = '编辑任务'
      this.dialogVisible = true
    },
    submit () {
      var url, method
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.submitState == 1) {
            url = '/v1/designer/partner-task-create'
            method = 'post'
          } else if (this.submitState == 2) {
            url = '/v1/designer/' + this.formData.id + '/partner-task-update'
            method = 'put'
          }
          this.formData.startTime = this.formData.time[0]
          this.formData.endTime = this.formData.time[1]
          if (this.submitState == 1) {
            if (this.formData.id) {
              delete this.formData.id
            }
          }
          this.formData.headCover = this.formData.head_cover
          this.formData.wxHeadCover = this.formData.wx_head_cover
          this.formData.wxCover = this.formData.wx_cover
          this.formData.wxBackground = this.formData.wx_background

          request({
            url: url,
            method: method,
            data: this.formData
          }).then(data => {
            this.dialogVisible = false
            this.$router.go()
          })
        }
      })
    },
    showDetail (scope) {
      this.formData.title = scope.row.title
      this.formData.createdAt = scope.row.created_at
      this.formData.companyId = scope.row.company_id
      this.formData.companyName = scope.row.company_name
      this.formData.time = [scope.row.start_time, scope.row.end_time]
      this.formData.award = scope.row.award
      this.formData.cover = scope.row.cover
      this.formData.wx_cover = scope.row.wx_cover
      this.formData.head_cover = scope.row.head_cover
      this.formData.wx_head_cover = scope.row.wx_head_cover
      this.formData.sort = scope.row.sort
      this.formData.background = scope.row.background
      this.formData.wx_background = scope.row.wx_background
      this.formData.wx_background = scope.row.wx_background
      this.formData.id = scope.row.id
      this.formData.thirtyNum = scope.row.thirty_num
      this.formData.joinNum = scope.row.join_num
      this.dialogVisible1 = true
    },
    closeDialog () {
      this.formData.title = ''
      this.formData.createdAt = ''
      this.formData.companyId = ''
      this.formData.companyName = ''
      this.formData.time = ''
      this.formData.award = ''
      this.formData.cover = ''
      this.formData.wx_cover = ''
      this.formData.head_cover = ''
      this.formData.wx_head_cover = ''
      this.formData.sort = ''
      this.formData.background = []
      this.formData.wx_background = []
      this.formData.id = ''
      this.formData.thirtyNum = ''
      this.formData.joinNum = ''
    },
    linkOpusList (scope) {
      this.$router.push('/design-power/opus-list/' + scope.row.id)
    }
  },
  mounted () {
    var that = this
    request({
      url: '/v1/designer/partner-task-list',
      method: 'get',
      params: {}
    }).then(data => {
      that.listData = data.data.data
    })
  },
  filters: {
    timeFilter (value) {
      return value.slice(0, 10)
    }
  },
  components: {
    'upload-file': uploadFile
  }
}
</script>

<style scoped>
.el-table img{
  width: 160px;
  height: 160px;
}
  .el-row img {
    width: 200px;
  }
</style>
