<template>
  <div class="payment-by-public-wrap">
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
          style="width: 100%;">
          <el-table-column
                prop="created_at"
                label="支付时间">
              </el-table-column>
              <el-table-column
                prop="order_id"
                label="订单号">
              </el-table-column>
              <el-table-column
                label="订单付款号">
                <template slot-scope="scope">
                  <router-link :to="`/order-detail/${scope.row.order_id}`">
                    <span>{{scope.row.sn}}</span>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                label="应收金额">
                <template slot-scope="scope">
                  <span>{{scope.row.amount_transfer_payable}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="订单金额">
                <template slot-scope="scope">
                  <span>{{scope.row.order.amount}}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="currentTag == 2 || currentTag == 8"
                prop="status"
                label="状态">
              </el-table-column>
              <el-table-column
                v-if="currentTag == 2 || currentTag == 8"
                prop="money"
                label="实收金额">
              </el-table-column>
              <el-table-column
                v-if="currentTag == 2 || currentTag == 8"
                prop="tn"
                label="流水号">
              </el-table-column>
              <el-table-column
                prop="company_name"
                label="付款公司">
              </el-table-column>
              <el-table-column
                label="联系人">
                <template slot-scope="scope">
                  <span>{{scope.row.order.contact_name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="contact_phone"
                label="联系方式">
                <template slot-scope="scope">
                  <span>{{scope.row.order.contact_phone}}</span>
                </template>
              </el-table-column>
             <el-table-column
                label="凭证">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="viewReceipt(scope.row.receipt)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="operator_name"
                label="处理人">
              </el-table-column>
              <el-table-column
                prop="confirmed_at"
                label="处理时间">
                <!-- TO DO -->
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注">
              </el-table-column>
              <el-table-column
                prop="edit"
                label="操作">
                <template slot-scope="scope">
                  <router-link :to="`public-detail/${scope.row.id}`">
                    <el-button type="text" size="small">查看</el-button>
                  </router-link>
                  <div style="display: inline-block">
                    <el-button type="text" v-permission="'v1.order.order.payment.reject'" size="small" @click="doReject(scope.row)" v-if="scope.row.status === '支付审核中'">驳回</el-button>
                  </div>
                   <!-- v-if="scope.row.status === '支付审核中'" -->
                  <div style="display: inline-block">
                    <el-button v-permission="'v1.order.order.payment.confirmed'" type="text" size="small" @click="doSuccess(scope.row)" v-if="scope.row.status === '支付审核中'">通过</el-button>
                  </div>
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
    <el-dialog :width="'800px'" title="提示" :visible.sync="rejectPayDialog" :close-on-click-modal="false">
      <el-row>
        <el-row>
          <p>是否确认 <span style="color: red">驳回</span> 支付？</p>
          <p style="color: #ccc">
            提示：系统支持部分收款，只要收到钱就不允许驳回，支付金额不足时，也应通过；
          </p>
        </el-row>
        <el-row>
          <p>
            备注<span style="color: red">*</span>
          </p>
          <el-input v-model="remarkModel" type="textarea"></el-input>
          <p style="color: #ccc">备注内容将展示给客户,还请认真填写.</p>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="rejectPayDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="rejectPay">确认</el-button>
        </div>
      </el-row>
    </el-dialog>
    <el-dialog :width="'800px'" title="提示" :visible.sync="successPayDialog" :close-on-click-modal="false">
      <el-row style="padding-left: 20px;">
        <el-row>
          <p>是否确认 <span style="color: green">通过</span> 支付？</p>
        </el-row>
        <el-row v-if="successDialogData">
          <div class="success-item">
            <span>付款公司：</span> <span>{{successDialogData.company_name}}</span>
          </div>
          <div class="success-item">
            <span>订单号：</span> <span>{{successDialogData.order.id}}</span>
          </div>
          <div class="success-item">
            <span>支付单号：</span> <span>{{successDialogData.id}}</span>
          </div>
          <div class="success-item">
            <span>客户登陆账号：</span> <span>{{successDialogData.order.company_phone}}</span>
          </div>
          <div class="success-item">
            <span>应收金额：</span> <span>{{shouldPayMoney}} 元</span>
          </div>
        </el-row>
        <el-row>
          <el-col :span="3" style="margin-top: 3px;">
            交易流水号*：
          </el-col>
          <el-col :span="19">
            <el-input type="text" v-model="tnModel" style="width: 200px;" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" style="margin-top: 3px;">
            实收金额*：
          </el-col>
          <el-col :span="19">
            <el-input type="text" v-model="reciveMoneyModel" style="width: 200px;" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" style="margin-top: 3px;">
            实际收款时间*：
          </el-col>
          <el-col :span="6">
            <template>
              <!-- <div class="block">
                <el-date-picker
                  v-model="reciveTimeModel"
                  type="datetime"
                  size="small"
                  format="yyyy-MM-dd"
                  placeholder="选择日期时间">
                </el-date-picker>
              </div> -->
              <div class="block">
                <el-date-picker
                  v-model="reciveTimeModel"
                  type="date"
                  size="small"
                  format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </template>
          </el-col>
          <el-col :span="12" style="margin-top: 3px;color: #999999">
            提示：请填写银行卡实际收款时间，用于之后对账使用
          </el-col>
        </el-row>
        <el-row>
          <div style="text-align: center;color: red">
            <span v-if="isShowTips === 1">提示：实收金额＞应收金额，溢出{{differenceValue}}元将存入客户余额；</span>
            <span v-if="isShowTips === 2">提示：实收金额＜应收金额，该比支付客户少支付{{differenceValue}}元；</span>
            <span v-if="isShowTips === 3">提示：实收金额不能为空；</span>
          </div>
        </el-row>
        <el-row>
          <div style="text-align: center;margin-top: 20px">
            <el-button type="primary" size="small" @click="successPayDialog = false">取消</el-button>
            <el-button type="primary" size="small" @click="successPay">确认</el-button>
          </div>
        </el-row>
      </el-row>
    </el-dialog>
    <el-dialog :width="'800px'" title="查看凭证" :visible.sync="viewPitureDialog" :close-on-click-modal="false">
      <el-row style="text-align: center;">
        <img :src="currentImg" alt="" width="500" height="500" style="display: inline-block">
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/order/order'
import * as couponApi from '@/api/coupon/coupon'
import searchForm from '@/components/Form/inline'

export default {
  name: 'paymentByPublic',
  data () {
    return {
      currentTag: '8',
      formFilter: {
        'creatTime': {
          type: 'date',
          label: '支付时间'
        },
        'payTime': {
          type: 'date',
          label: '处理时间'
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
              label: '支付审核中',
              value: 1
            },
            {
              label: '支付失败',
              value: 3
            },
            {
              label: '已付款',
              value: 2
            }
          ]
        },
        'tn': {
          type: 'input',
          label: '流水号',
          placeholder: '请输入流水号'
        },
        'company_name': {
          type: 'input',
          label: '付款公司',
          placeholder: '请输入公司名'
        },
        'contact_name': {
          type: 'input',
          label: '联系人',
          placeholder: '请输入客户联系人'
        },
        'contact_phone': {
          type: 'input',
          label: '联系方式',
          placeholder: '请输入联系方式'
        },
        'do_name': {
          type: 'autocomplete',
          label: '处理人',
          placeholder: '请输入客户处理人',
          handleSelect: (item) => {
            this.operator_id = item.id
            // this.createdByParams = item.id
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
          payTime: '',
          order_id: '',
          tn: '',
          status: '',

          company_name: '',
          contact_name: '',
          contact_phone: '',
          do_name: '',
          search: '',
          export: '',

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
          label: '支付审核中',
          name: '1'
        },
        {
          label: '支付失败',
          name: '3'
        },
        {
          label: '已付款',
          name: '2'
        }
      ],
      tableData: [],
      sourceTableData: [],
      rejectPayDialog: false,
      successPayDialog: false,
      viewPitureDialog: false,
      currentImg: '',
      remarkModel: '',
      reciveMoneyModel: '',
      reciveTimeModel: '',
      currentPage: 1,
      productTotal: 10,
      pageSize: 10,
      currentPayId: -1,
      exportAccess: false,
      currentStatus: 8,
      operator_id: '',
      rejectDialogData: null,
      successDialogData: null,
      tnModel: '',
      isShowTips: 0,
      differenceValue: '',
      shouldPayMoney: ''
    }
  },
  created () {
    this.getList()
    this.getAccess(this.$store.getters.myPermissions)
  },
  methods: {
    getAccess (router) {
      router.forEach((v, i) => {
        if (v === 'v1.order.order.payments.export') {
          this.exportAccess = true
        }
      });
    },
    exportTable () {
      if (this.exportAccess) {
        this.formFilter.form.page = this.currentPage
        let param = JSON.parse(JSON.stringify(this.formatFormParams(this.formFilter.form)))
        param.operator_id = this.operator_id
        let rightParam = this.deleteKey(param)
        api.exportPaymentList(rightParam).then(res => {
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
      }
      param.operator_id = this.operator_id
      let rightParam = this.deleteKey(param)
      api.getPaymentsList(rightParam).then(res => {
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
      if (form.payTime) {
        form.begin_confirmed_date = form.payTime[0] ? form.payTime[0] : ''
        form.end_confirmed_date = form.payTime[1] ? form.payTime[1] : ''
      } else {
        form.begin_confirmed_date = ''
        form.end_confirmed_date = ''
      }
      return form
    },
    deleteKey (obj) {
      for (const key in obj) {
        if (key === 'creatTime' || key === 'payTime' || key === 'do_name') {
          delete obj[key]
        }
      }
      return obj
    },
    formatStatus (data) {
      let array = ['', '支付审核中', '已付款', '支付失败']
      data.forEach((v, i) => {
        v.status = array[parseInt(v.status)]
      })
    },
    changeTag (tag) {
      this.getList(Number(tag.name), 1)
      this.currentStatus = Number(tag.name)
    },
    doReject (item) {
      this.rejectPayDialog = true // 弹框
      this.currentPayId = item.id
      this.rejectDialogData = item
    },
    doSuccess (item) {
      this.successPayDialog = true // 弹框
      this.currentPayId = item.id
      this.successDialogData = item
      this.formatShouldPay(this.successDialogData.types)
    },
    formatShouldPay (arr) { // 根据types是否为1 得到shouldPayMoney
      if (arr && arr.length !== 0) {
        arr.forEach((v, i) => {
          if (v.type == 1) {
            this.shouldPayMoney = v.total_payable
          }
        });
      }
    },
    rejectPay () {
      if (this.remarkModel) {
        let param = {
          remark: this.remarkModel
        }
        api.rejectPay(this.currentPayId, param).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            })
            this.getList()
            this.rejectPayDialog = false
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'info'
            })
          }
        })
      } else {
        this.$message.info(`请输入备注信息`)
      }
    },
    successPay () {
      if (this.isShowTips !== 3 || this.isShowTips !== 0) {
        if (this.tnModel) {
          if (this.reciveTimeModel) {
            this.successPayDialog = false
            let param = {
              money: this.reciveMoneyModel,
              tn: this.tnModel,
              actual_received_date: this.formatTime(this.reciveTimeModel)
            }
            api.successPay(this.currentPayId, param).then(res => {
              if (res.code === 300000) {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'info'
                })
              }
            })
          } else {
            this.$message.info(`请输入实际收款时间`)
          }
        } else {
          this.$message.info(`请输入交易流水号`)
        }
      } else {
        this.$message.info(`请输入正确的实收金额`)
      }
    },
    viewReceipt (receipt) {
      this.viewPitureDialog = true
      this.currentImg = receipt
    },
    changeCurrentPage (page) {
      this.getList(this.currentStatus, page)
    },
    vertifyNum (val) {
      var reg = /^[0-9]*$/
      if (reg.test(val) || val == '') {
        return true;
      } else {
        return false
      }
    },
    formatTime (date) {
      if (date === '' || !date) {
        return ''
      } else {
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        return Y + M + D
      }
    }
  },
  watch: {
    reciveMoneyModel (val) {
      if (this.vertifyNum(val)) {
        val = Number(val)
        let shouldPay = this.successDialogData.order.amount_unpaid
        if (val === 0) {
          this.isShowTips = 3
          this.differenceValue = ''
        } else {
          if (val > Number(shouldPay)) {
            this.isShowTips = 1
            this.differenceValue = val - shouldPay
          } else if (val < Number(shouldPay)) {
            this.isShowTips = 2
            this.differenceValue = shouldPay - val
          } else {
            this.isShowTips = 4 // 不显示提示
            this.differenceValue = ''
          }
        }
      } else {
        this.$message.error('实收金额必须为数字')
      }
    }
  },
  components: {
    searchForm
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 20px;
  .payment-by-public-wrap {
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .success-item {
      margin-top: 10px;
    }
  }
</style>
