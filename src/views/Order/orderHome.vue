<template>
  <div class="order-home-wrap">
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
      <template>
        <el-tabs v-model="currentTag" type="card" @tab-click="changeTag">
          <el-tab-pane v-for="(item, index) in tagData" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>
    </el-row>
    <el-row>
      <template>
         <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="created_at"
            label="下单时间">
          </el-table-column>
          <el-table-column
            prop="id"
            label="订单号">
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态">
          </el-table-column>
          <el-table-column
            prop="services_count"
            label="服务数">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="订单金额">
          </el-table-column>
          <el-table-column
            prop="total_payable"
            label="订单应付">
          </el-table-column>
           <el-table-column
            prop="discount"
            label="订单优惠">
          </el-table-column>
          <el-table-column
            prop="amount_paid"
            label="订单已付金额">
          </el-table-column>
          <el-table-column
            prop="amount_unpaid"
            label="订单剩余应付">
          </el-table-column>
          <el-table-column
            prop="company_name"
            label="公司名称">
          </el-table-column>
          <el-table-column
            prop="manager_name"
            label="负责人">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
             <router-link tag="span" :to="`/order-detail/${scope.row.id}`" v-permission="'v1.order.order.view'">
                <el-button type="text" size="small">查看</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
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

import * as api from '@/api/order/order'
import searchForm from '@/components/Form/inline'

export default {
  name: 'orderHome',
  data () {
    return {
      currentTag: '全部',
      formFilter: {
        'creatTime': {
          type: 'date',
          label: '创建时间'
        },
        'order_id': {
          type: 'input',
          label: '订单号',
          placeholder: '请输入订单号'
        },
        'status': {
          type: 'select',
          label: '状态',
          placeholder: '请选择订单状态',
          list: [
            {
              label: '待付款',
              value: 2
            },
            {
              label: '已付款',
              value: 1
            },
            // {
            //   label: '已退款',
            //   value: '已退款'
            // },
            {
              label: '支付审核中',
              value: 4
            },
            {
              label: '已取消',
              value: 3
            }
          ]
        },
        'company_name': {
          type: 'input',
          label: '客户公司',
          placeholder: '请输入客户公司'
        },
        'manager_id': {
          type: 'input',
          label: '负责人',
          placeholder: '请输入客户负责人'
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
          creatTime: '',
          order_id: '',
          company_name: '',
          manager_id: '',
          status: '',

          page: 1,
          limit: 10
        }
      },
      tagData: [
        {
          label: '全部',
          name: '8'
        },
        {
          label: '待付款',
          name: '2'
        },
        {
          label: '已付款',
          name: '1'
        },
        {
          label: '支付审核中',
          name: '4'
        },
        {
          label: '已取消',
          name: '3'
        }
      ],
      tableData: [],
      sourceTableData: [],
      currentPage: 1,
      productTotal: 10,
      pageSize: 10,
      exportAccess: false,
      currentStatus: 8
    }
  },
  created () {
    this.getList()
    this.getAccess(this.$store.getters.myPermissions)
  },
  methods: {
    getAccess (router) {
      router.forEach((v, i) => {
        if (v === 'v1.order.order.export') {
          this.exportAccess = true
        }
      });
    },
    exportTable () {
      if (this.exportAccess) {
        this.formFilter.form.page = this.currentPage
        let param = JSON.parse(JSON.stringify(this.formatFormParams(this.formFilter.form)))
        let rightParam = this.deleteKey(param)
        api.exportOrderList(rightParam).then(res => {
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
      } else {
        this.$message.info('没有权限')
      }
    },
    getList (status, page) {
      if (page) {
        this.formFilter.form.page = page
      }
      let param = JSON.parse(JSON.stringify(this.formatFormParams(this.formFilter.form)))
      if (status) {
        if (status === 8) {
          param.status = ''
        } else {
          param.status = status
        }
      } else {
        this.formatTagByStatus(this.formFilter.form.status) // 切换搜索条件中的状态时切换相对应的tab选中状态
      }
      let rightParam = this.deleteKey(param)
      api.getOrderList(rightParam).then(res => {
        if (res.code === 300000) {
          this.sourceTableData = res.data.data
          this.formatStatus(this.sourceTableData)
          this.tableData = JSON.parse(JSON.stringify(this.sourceTableData))
          this.productTotal = res.data.total
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
    formatFormParams (form) {
      if (form.creatTime) {
        form.begin_date = form.creatTime[0] ? form.creatTime[0] : ''
        form.end_date = form.creatTime[1] ? form.creatTime[1] : ''
      } else {
        form.begin_date = ''
        form.end_date = ''
      }
      return form
    },
    deleteKey (obj) {
      for (const key in obj) {
        if (key === 'creatTime' || key === 'payTime') {
          delete obj[key]
        }
      }
      return obj
    },
    formatStatus (data) {
      let array = ['', '已付款', '待付款', '已取消', '支付审核中']
      data.forEach((v, i) => {
        v.status = array[parseInt(v.status)]
      })
    },
    formatTagByStatus (status) {
      if (parseInt(status) === 1) {
        this.currentTag = '已付款' // 切换搜索条件中的状态时切换相对应的tab选中状态
      } else if (parseInt(status) === 2) {
        this.currentTag = '待付款'
      } else if (parseInt(status) === 3) {
        this.currentTag = '已取消'
      } else if (parseInt(status) === 4) {
        this.currentTag = '支付审核中'
      }
    },
    changeTag (tag) {
      this.getList(Number(tag.name), 1) // 切换tab请求第一页的相应状态列表
      this.currentStatus = Number(tag.name)
    },
    changeCurrentPage (page) {
      this.getList(this.currentStatus, page)
    }
  },
  components: {
    searchForm
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 20px;
  .order-home-wrap {
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
