<template>
  <div class="quote-list-wrap">
    <el-row class="search-wrap">
       <search-form
        :searchform='formFilter'
        :showFilterBtn="true"
        labelWidth='160px'
        key="search1"
        @primaryEvent="exportTable"
        @queryData="getList"></search-form>
    </el-row>
    <el-row>
      <router-link :to="`/quote/add-quote/-1/creat-all`">
        <el-button type="primary" size="small" v-permission="'v1.quotation.quotations.create'">创建报价单</el-button>
      </router-link>
      <router-link to="/quote/drafts" style="margin-left: 20px;">
        <el-button type="text" size="small" v-permission="'v1.quotation.quotations.drafts.list'">查看草稿箱</el-button>
      </router-link>
    </el-row>
    <el-row>
      <template>
        <el-tabs v-model="currentTag" type="card" @tab-click="changeTag">
          <el-tab-pane v-for="(item, index) in tagData" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>
    </el-row>
    <el-row>
      <template>
         <el-table
          :data="outTableData"
          style="width: 100%;height: 43px">
          <el-table-column
                prop="created_at"
                label="日期">
              </el-table-column>
              <el-table-column
                prop="id"
                label="报价单号">
              </el-table-column>
              <el-table-column
                label="项目名称">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="service_count"
                label="服务数">
              </el-table-column>
              <el-table-column
                prop="contact_name"
                label="联系人">
              </el-table-column>
              <el-table-column
                prop="contact_phone"
                label="联系电话">
              </el-table-column>
             <el-table-column
                prop="amount"
                label="报价金额">
              </el-table-column>
              <el-table-column
                prop="created_by_name"
                label="创建人">
              </el-table-column>
              <el-table-column
                prop="edit"
                label="操作">
              </el-table-column>
        </el-table>
      </template>
      <ul v-for="(item, index) in outTableData" :key="index" style="margin-bottom:10px;cursor: pointer">
        <li class="pach-up-wrap" @click.stop="isPackUpTable(index)">
          <span>{{item.company_name}}</span>
          <span style="margin-left:20px;">客户网站登录账号：</span><span>{{item.company_phone}}</span>
          <router-link :to="`/quote/add-quote/${item.id}/creat`">
            <el-button style="margin-left:20px;" type="text" size="small">创建报价</el-button>
          </router-link>
          <div class="is-pack-up" @click.stop="isPackUpTable(index)">
            <span v-text="item.showPackUpBtn ? '收起' : '展开'"></span>
            <i class="el-icon--right"
              :class="{'el-icon-arrow-down': item.showPackUpBtn, 'el-icon-arrow-up': !item.showPackUpBtn}"></i>
          </div>
        </li>
        <li>
          <template>
            <el-table
              :style="{'height': item.showPackUpBtn ? 'auto' : 0}"
              :show-header="false"
              :data="outTableData[index].quotations"
              style="width: 100%">
              <el-table-column
                prop="created_at"
                label="日期">
              </el-table-column>
              <el-table-column
                prop="id"
                label="报价单号">
              </el-table-column>
              <el-table-column
                label="项目名称">
                <template slot-scope="scope">
                  <div style="display: inline-block" v-for="(projectItem, index) in scope.row.projects" :key="index">{{projectItem.name}} <span v-if="index !== scope.row.projects.length - 1">，</span> </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="service_count"
                label="服务数">
              </el-table-column>
              <el-table-column
                prop="contact_name"
                label="联系人">
              </el-table-column>
              <el-table-column
                prop="contact_phone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="报价金额">
              </el-table-column>
              <el-table-column
                prop="created_by_name"
                label="创建人">
              </el-table-column>
              <el-table-column
                prop="edit"
                label="操作">
                <template slot-scope="scope">
                  <router-link :to="`/quote/quote-detail/${scope.row.id}`">
                    <el-button type="text" size="small" v-permission="'v1.quotation.quotations.view'">查看</el-button>
                  </router-link>
                  <router-link :to="`/quote/add-quote/${scope.row.id}/edit`">
                    <el-button type="text" size="small">编辑</el-button>
                  </router-link>
                  <router-link :to="`/quote/add-quote/${scope.row.id}/copy`">
                    <el-button type="text" size="small" v-if="scope.row.status !== '已作废' || scope.row.status !== '已变更'">复制</el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </li>
      </ul>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="productTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changeCurrentPage">
      </el-pagination>
    </el-row>
  </div>
</template>
<script>

import searchForm from '@/components/Form/inline'
import * as api from '@/api/quote/quote'
import * as couponApi from '@/api/coupon/coupon'
// import func from './vue-temp/vue-editor-bridge';

export default {
  name: 'quote-home',
  data () {
    return {
      formFilter: {
        'creatTime': {
          type: 'date',
          label: '创建时间'
        },
        'id': {
          type: 'input',
          label: '报价单号',
          placeholder: '请输入报价单号'
        },
        'status': {
          type: 'select',
          label: '状态',
          placeholder: '请选择报价状态',
          list: [
            {
              label: '待确认',
              value: 1
            },
            {
              label: '已确认',
              value: 2
            },
            {
              label: '已驳回',
              value: 3
            },
            {
              label: '已取消',
              value: 4
            },
            {
              label: '已作废',
              value: 5
            }
          ]
        },
        'company_name': {
          type: 'input',
          label: '客户公司',
          placeholder: '请输入客户公司'
        },
        'contact_name': {
          type: 'input',
          label: '联系人',
          placeholder: '请输入客户联系人'
        },
        'contact_phone': {
          type: 'input',
          label: '联系电话',
          placeholder: '请输入客户联系电话'
        },
        // 'created_by': {
        //   type: 'input',
        //   label: '创建人',
        //   placeholder: '请输入创建人'
        // },
        'created_by': {
          type: 'autocomplete',
          label: '创建人',
          placeholder: '请输入创建人',
          handleSelect: (item) => {
            this.createdByParams = item.id
          },
          fetchSuggestions: function (queryString, cb) {
            if (queryString != '' && queryString != undefined) {
              let params = {
                page: '1',
                limit: '30',
                key: 'name',
                value: queryString
              }
              couponApi.searchPerson(params).then(res => {
                if (res.code === 300000) {
                  let data = res.data.data
                  data.forEach((v, i) => {
                    v.value = v.name
                  })
                  cb(data)
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              let data = []
              cb(data)
            }
          }
        },
        'company_phone': {
          type: 'input',
          label: '网站登陆账号',
          placeholder: '请输入客户网站登陆账号'
        },
        'search': {
          type: 'button',
          btnText: '搜索'
        },
        'export': {
          type: 'primaryButton',
          btnText: '导出'
        },
        form: {
          id: '',
          creatTime: '',
          status: '',
          company_name: '',
          contact_name: '',
          contact_phone: '',
          created_by: '',
          company_phone: '',
          search: '',
          export: '',

          page: 1,
          limit: 10
        }
      },
      sourceTableData: [],
      startTimeModel: '',
      endTimeModel: '',
      currentTag: '全部',
      tagData: [
        {
          label: '全部',
          name: '全部'
        },
        {
          label: '待确认',
          name: '待确认'
        },
        {
          label: '已确认',
          name: '已确认'
        },
        {
          label: '已驳回',
          name: '已驳回'
        },
        {
          label: '已作废',
          name: '已作废'
        },
        {
          label: '已取消',
          name: '已取消'
        },
        {
          label: '已变更',
          name: '已变更'
        }
      ],
      outTableData: [],
      currentPage: 1,
      productTotal: 10,
      pageSize: 10,
      createdByParams: ''
    }
  },
  computed: {
  },
  created () {
    this.initList()
  },
  methods: {
    initList (page) {
      if (page) {
        this.formFilter.form.page = page
      } else {
        this.formFilter.form.page = 1
      }
      let params = JSON.parse(JSON.stringify(this.formFilter.form))
      params.created_by = this.createdByParams
      api.getQuoteHomeList(params).then(res => {
        if (res.code === 300000) {
          this.sourceTableData = res.data.data
          this.formatStatus(this.sourceTableData)
          this.addISshow(this.sourceTableData) // 添加展开收起字段
          this.outTableData = JSON.parse(JSON.stringify(this.sourceTableData))
          this.productTotal = Number(res.data.total)
          this.currentPage = Number(res.data.current_page)
          this.pageSize = Number(res.data.per_page)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatStatus (data) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].quotations.length; j++) {
          if (Number(data[i].quotations[j].status) === 1) {
            data[i].quotations[j].status = '待确认'
          } else if (Number(data[i].quotations[j].status) === 2) {
            data[i].quotations[j].status = '已确认'
          } else if (Number(data[i].quotations[j].status) === 3) {
            data[i].quotations[j].status = '已驳回'
          } else if (Number(data[i].quotations[j].status) === 4) {
            data[i].quotations[j].status = '已取消'
          } else if (Number(data[i].quotations[j].status) === 5) {
            data[i].quotations[j].status = '已作废'
          }
        }
      }
    },
    addISshow (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].showPackUpBtn = false
      }
    },
    formatCreatTime () {
      let params = this.formFilter.form
      for (let key in params) {
        if (key === 'creatTime' && params[key]) {
          params.begin_range = params[key][0]
          params.end_range = params[key][1]
        } else if (key === 'creatTime' && !params[key]) {
          params.begin_range = ''
          params.end_range = ''
        }
      }
      return params
    },
    formatSearchParams () {
      this.formatCreatTime()
      this.deleteCreaTime()
      this.initList()
    },
    deleteCreaTime () {
      let params = this.formFilter.form
      for (let key in params) {
        if (key === 'creatTime') {
          delete params[key]
        }
      }
      return params
    },
    changeTag (tag) {
      if (tag.name === '全部') {
        let sourData = JSON.parse(JSON.stringify(this.sourceTableData))
        for (let i = 0; i < sourData.length; i++) {
          let newData = []
          for (let j = 0; j < sourData[i].quotations.length; j++) {
            newData.push(sourData[i].quotations[j])
            this.outTableData[i].quotations = newData
          }
        }
      } else {
        let sourData = JSON.parse(JSON.stringify(this.sourceTableData))
        for (let i = 0; i < sourData.length; i++) {
          let newData = []
          for (let j = 0; j < sourData[i].quotations.length; j++) {
            if (sourData[i].quotations[j].status === tag.name) {
              newData.push(sourData[i].quotations[j])
            }
            this.outTableData[i].quotations = newData
          }
        }
      }
    },
    getList () {
      this.currentTag = '全部'
      this.formatSearchParams()
    },
    exportTable () {
      api.exportQuotation(this.formFilter.form).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success'
          })
          window.location.href = res.data.url
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    isPackUpTable (index) {
      this.outTableData[index].showPackUpBtn = !this.outTableData[index].showPackUpBtn
    },
    changeCurrentPage (page) {
      // this.formFilter.form.page = Number(page)
      this.initList(parseInt(page))
    }
  },
  watch: {
  },
  components: {
    searchForm
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 10px;
  .quote-list-wrap {
    box-sizing: border-box;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .search-wrap {
      box-sizing: border-box;
      padding: 10px;
      border: 1px dashed #dcdfe6;
    }
    .pach-up-wrap {
      box-sizing: border-box;
      padding: 7px;
      position: relative;
      border-bottom: 1px solid #ebeef5;
      user-select: none;
      background-color: #f1f1f1;
      .is-pack-up {
        position: absolute;
        top: 14px;
        right: 14px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
</style>
