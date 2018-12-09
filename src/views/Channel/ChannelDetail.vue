<template>
  <div>
    <el-card>
      <div class="card-item">渠道类型：{{convertType2String(detailData.channel_type_id)}}</div>
      <div class="card-item">添加时间：{{detailData.created_at}}</div>
      <div class="card-item">渠道负责人：{{detailData.owner}}</div>
    </el-card>
    <el-tabs type="border-card" v-model="activePane" @tab-click="tabClick">
      <el-tab-pane label="渠道情况" name="detail">
        <div class="card-item">渠道名称：{{detailData.name}}</div>
        <template v-if="detailData.extra_info && detailData.channel_type_id == 1">
          <div class="card-item">账号：{{detailData.extra_info.account}}</div>
          <div class="card-item">计划：{{detailData.extra_info.plan}}</div>
          <div class="card-item">单元：{{detailData.extra_info.unit}}</div>
          <div class="card-item">关键词：{{detailData.extra_info.keyword}}</div>
        </template>
        <div class="card-item">备注：{{detailData.remark}}</div>
        <div class="card-item">utm_source：{{detailData.utm_source}}</div>
      </el-tab-pane>
      <el-tab-pane label="注册情况" name="reg">
        <el-form inline>
          <el-form-item label="">
            <el-radio-group
              size="small"
              v-model="regFastSelectTime"
              @change="selectRegTimeChangeHandler">
              <el-radio-button :label="''">全部</el-radio-button>
              <el-radio-button :label="0">今天</el-radio-button>
              <el-radio-button :label="7">最近7天</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="regFilterDate"
              @change="regDataChangeHandler"
              ref="regDatePicker"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="regPhone" placeholder="搜索手机号码" width="200px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="regRole" placeholder="筛选用户角色">
              <el-option v-for="(v, k) in regRoleOptions" :key="k" :label="v.label" :value="v.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getRegDetail()">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="regTabelData" v-loading="regTableLoading">
          <el-table-column prop="user_id" label="用户ID"></el-table-column>
          <el-table-column prop="user_name" label="用户昵称"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="role" label="用户角色"></el-table-column>
          <el-table-column prop="created_at" label="注册时间"></el-table-column>
        </el-table>
        <el-pagination :total="regPagi.total" :current-page="regPagi.page" :page-size="20" @current-change="getRegDetail"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="线索情况" name="clue">
        <el-form inline>
          <el-form-item label="">
            <el-radio-group
              size="small"
              v-model="clueFastSelectTime"
              @change="selectClueTimeChangeHandler">
              <el-radio-button :label="''">全部</el-radio-button>
              <el-radio-button :label="0">今天</el-radio-button>
              <el-radio-button :label="7">最近7天</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="clueFilterDate"
              type="daterange"
              ref="clueDatePicker"
              @change="clueDataChangeHandler"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="cluePhone" placeholder="搜索手机号码" width="200px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="getClueDetail()">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="clueTabelData" v-loading="clueTableLoading">
          <el-table-column prop="id" label="线索ID"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="created_at" label="线索创建时间"></el-table-column>
        </el-table>
        <el-pagination :total="cluePagi.total" :current-page="cluePagi.page" :page-size="20" @current-change="getClueDetail"></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as Channels from '@/api/channels'
export default {
  data () {
    return {
      detailData: {},
      activePane: 'detail',
      // regi
      regFilterDate: [],
      pickerOptions: {
        shortcuts: [{
          text: '全部',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '今天',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近7天',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      regFastSelectTime: '',
      regPhone: '',
      regRole: '',
      regRoleOptions: [
        {
          label: '全部用户',
          value: 0
        },
        {
          label: '普通用户',
          value: 1
        },
        {
          label: '邦德用户',
          value: 2
        },
        {
          label: '邦女郎',
          value: 3
        },
        {
          label: '企业用户',
          value: 4
        },
        {
          label: '供应商',
          value: 5
        }
      ],
      regTabelData: [],
      regTableLoading: false,
      regPagi: {
        total: 0,
        page: 1
      },
      // clue
      clueFilterDate: [],
      clueFastSelectTime: '',
      cluePhone: '',
      clueTabelData: [],
      clueTableLoading: false,
      cluePagi: {
        total: 0,
        page: 1
      }
    }
  },
  computed: {
    regParams () {
      let params = {}
      params.utm_source = this.detailData.utm_source
      params.start_at = this.regFilterDate[0]
      params.end_at = this.regFilterDate[1]
      params.phone = this.regPhone
      params.role = this.regRole
      params.page = this.regPagi.page

      for (let p in params) {
        if (!params[p]) {
          delete params[p]
        }
      }

      return params
    },
    clueParams () {
      let params = {}
      params.utm_source = this.detailData.utm_source
      params.start_at = this.clueFilterDate[0]
      params.end_at = this.clueFilterDate[1]
      params.phone = this.cluePhone
      params.role = this.clueRole
      params.page = this.cluePagi.page

      for (let p in params) {
        if (!params[p]) {
          delete params[p]
        }
      }

      return params
    }
  },
  methods: {
    convertType2String (type) {
      let str = ''
      if (type == '1') {
        str = '营销'
      } else if (type == '2') {
        str = '活动'
      }
      return str
    },
    getRegDetail (p) {
      if (p) {
        this.regPagi.page = p
      } else {
        this.regPagi.page = 1
      }
      var that = this
      that.regTableLoading = true
      Channels.getRegDetail(this.regParams).then(data => {
        if (data.code == 300000) {
          that.regTableLoading = false
          that.regTabelData = data.data.data
          that.regPagi.total = data.data.total
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getClueDetail (p) {
      if (p) {
        this.cluePagi.page = p
      } else {
        this.cluePagi.page = 1
      }
      var that = this
      that.clueTableLoading = true
      Channels.getClueDetail(this.clueParams).then(data => {
        if (data.code == 300000) {
          that.clueTableLoading = false
          that.clueTabelData = data.data.data
          that.cluePagi.total = data.data.total
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    tabClick (vm) {
      if (vm.paneName == 'reg') {
        this.getRegDetail()
      } else if (vm.paneName == 'clue') {
        this.getClueDetail()
      }
    },
    getSelectTimeArr (val) {
      if (val !== '') {
        val = Math.abs(val)
        const end = new Date();
        const start = new Date();
        const time = start.getTime() - 3600 * 1000 * 24 * val
        start.setTime(time);
        return [start, end]
      } else {
        return ['', '']
      }
    },
    selectRegTimeChangeHandler (newVal) {
      this.$refs.regDatePicker.emitInput(this.getSelectTimeArr(newVal))
    },
    regDataChangeHandler (checkTimeArr) {
      // 选择了日期
      if (checkTimeArr && checkTimeArr.length) {
        this.regFastSelectTime = -1
      }
    },
    selectClueTimeChangeHandler (newVal) {
      this.$refs.clueDatePicker.emitInput(this.getSelectTimeArr(newVal))
    },
    clueDataChangeHandler (checkTimeArr) {
      // 选择了日期
      if (checkTimeArr && checkTimeArr.length) {
        this.clueFastSelectTime = -1
      }
    }
  },
  mounted () {
    Channels.getDetail({utm_source: this.$route.params.utm_source}).then((data) => {
      if (data.code == 300000) {
        this.detailData = data.data
      } else {
        this.$message.error(data.msg)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .el-card {
    margin-bottom: 20px;
    .card-item {
      font-size: 14px;
      line-height: 2;
      color: #666;
    }
  }
  .el-tab-pane {
    .card-item {
      line-height: 2;
      font-size: 12px;
      color: #666;
    }
  }
</style>
