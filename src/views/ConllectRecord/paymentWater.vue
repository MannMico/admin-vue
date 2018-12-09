<template>
  <div class="payment-water-wrap">
    <el-row class="search-wrap">
       <search-form
        :searchform='formFilter'
        :showFilterBtn="true"
        labelWidth='160px'
        key="search1"
        @primaryEvent="exportTable"
        @queryData="getList"></search-form>
    </el-row>
    <el-row style="position: relative">
      <template>
        <el-tabs v-model="currentTag" type="card" @tab-click="changeTag">
          <el-tab-pane v-for="(item, index) in tagData" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>
      <router-link to="/upload-data">
        <el-button size="small" type="primary" class="submit-data" v-permission="'v1.collection-record.upload'">上传数据</el-button>
      </router-link>
    </el-row>
    <el-row>
      <template>
         <el-table
          :data="tableData"
          ref="multipleTable"
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
              prop="trade_at"
              label="交易时间">
            </el-table-column>
            <el-table-column
              prop="payout"
              label="支付">
            </el-table-column>
            <el-table-column
              prop="income"
              label="收入">
            </el-table-column>
            <el-table-column
              prop="currency"
              label="币种">
              <template slot-scope="scope">
                <span>{{scope.row.currency === 0 ? '人民币' : ''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="opposite_account_name"
              label="对方户名">
            </el-table-column>
            <el-table-column
              prop="opposite_account_number"
              label="对方账号">
            </el-table-column>
            <el-table-column
              prop="opposite_bank"
              label="对方开户行">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="transaction_serial_number"
              label="交易流水">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
            <el-table-column
              label="订单号">
              <template slot-scope="scope">
                <router-link to="/order">
                  <el-button size="small" type="text" style="white-space: normal;word-break: break-all;" v-if="scope.row.status === '已确认'">{{scope.row.payment ? scope.row.payment.order_id : ''}}</el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              label="订单付款号">
              <template slot-scope="scope">
                <router-link to="/order">
                  <el-button size="normal" style="white-space: normal;word-break: break-all;" type="text" v-if="scope.row.status === '已确认'">{{scope.row.payment ? scope.row.payment.sn : ''}}</el-button>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="uploaded_name"
              label="上传人">
            </el-table-column>
            <el-table-column
              prop="uploaded_at"
              label="上传时间">
            </el-table-column>
            <el-table-column
              prop="operated_name"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="operated_at"
              label="操作时间">
            </el-table-column>
            <el-table-column
              prop="operated_remark"
              label="操作备注">
            </el-table-column>
            <el-table-column
              prop="edit"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="doDownload(scope.row)" size="small">下载</el-button>
                <el-button v-permission="'v1.order.order.payment.confirmed'" type="text" @click="doSuccess(scope.row)" v-if="scope.row.status === '待确认'" size="small">通过</el-button>
                <el-button v-permission="'v1.order.order.payment.reject'" type="text" @click="doDelete(scope.row)" v-if="scope.row.status === '待确认'" size="small">作废</el-button>
              </template>
            </el-table-column>
        </el-table>
      </template>
    </el-row>
    <el-row>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="productTotal"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="changeCurrentPage">
        </el-pagination>
      </el-row>
    <el-row>
      <template>
        <el-checkbox v-model="isAllChecked">全选</el-checkbox>
      </template>
      <el-button v-permission="'v1.order.order.payment.reject'" style="margin-left: 20px;" type="text" size="normal" @click="fillMultipleDelete">作废</el-button>
      <div v-if="totalData" style="display: inline-block;margin-left: 50px;font-size: 14px;">
        <span>合计：支出{{totalData.allPayout}}元,</span>
        <span>收入：{{totalData.allIncome}}元。</span>
        <span>待确认支出{{totalData.waitPayout}}元,</span>
        <span>待确认收入{{totalData.waitIncome}}元。</span>
        <span>已确认支出{{totalData.hasPayout}}元，</span>
        <span>已确认收入{{totalData.hasIncome}}元。</span>
        <span>作废支出{{totalData.deletePayout}}元,</span>
        <span>作废收入{{totalData.deleteIncome}}元。</span>
      </div>
    </el-row>
    <el-dialog :width="'800px'" title="提示" :visible.sync="multiDeleteDialog" :close-on-click-modal="false">
      <el-row style="padding-left: 50px;">
        <el-row>
          <p>是否确认驳回？</p>
        </el-row>
        <el-row>
          <el-col :span="2" style="margin-top: 3px;">
            原因：
          </el-col>
          <el-col :span="20">
            <el-select v-model="multiRejectReasonModel" placeholder="请选择原因" size="small">
              <el-option v-for="(item, index) in deleleReasonData" :key="index"  :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-input v-model="multiCustomReasonModel" placeholder="输入原因" type="textarea"></el-input>
        </el-row>
        <el-row>
          <span style="color: red" v-if="cannotMultiDeleteLock">保存失败！请填写作废原因。</span>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="multiDeleteDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="multiDeletePay">确认</el-button>
        </div>
      </el-row>
    </el-dialog>
    <el-dialog :width="'800px'" title="提示" :visible.sync="deleteDialog" :close-on-click-modal="false">
      <el-row style="padding-left: 50px;">
        <el-row>
          <p>是否确认驳回？</p>
        </el-row>
        <el-row>
          <el-col :span="2" style="margin-top: 3px;">
            原因：
          </el-col>
          <el-col :span="20">
            <el-select v-model="rejectReasonModel" placeholder="请选择原因" size="small">
              <el-option v-for="(item, index) in deleleReasonData" :key="index"  :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-input v-model="customReasonModel" placeholder="输入原因" type="textarea"></el-input>
        </el-row>
        <el-row>
          <span style="color: red" v-if="cannotDeleteLock">保存失败！请填写作废原因。</span>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="deleteDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="deletePay(2)">确认</el-button>
        </div>
      </el-row>
    </el-dialog>
    <el-dialog :width="'600px'" title="提示" :visible.sync="successDialog" :close-on-click-modal="false">
      <el-row style="padding-left: 50px;">
        <el-row>
          <p>是否确认该交易流水？</p>
        </el-row>
        <el-row>
          <el-col :span="6" style="margin-top: 3px;">
            填写订单付款号：
          </el-col>
          <el-col :span="16">
            <el-autocomplete
                size="small"
                style="width:300px;"
                placeholder="请输入内容"
                v-model="snModel"
                :fetch-suggestions="querySearchService"
                @select="handleSelect"
              ></el-autocomplete>
          </el-col>
        </el-row>
        <el-row v-if="orderInfoData">
          <el-row>
            <span>订单号：</span> <span>{{orderInfoData.order.id}}</span>
          </el-row>
          <el-row>
            <span>公司信息：</span><span>{{orderInfoData.order.company_name}}</span>
          </el-row>
          <el-row>
            <span>联系人：</span><span>{{orderInfoData.order.contact_name}}</span>
          </el-row>
          <el-row v-if="successByStatusLock">
            <span style="color: red">该订单号{{orderInfoData.status}},不可再次通过。</span>
          </el-row>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="successDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="deletePay(1)">确认</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/collectionRecords/trade'
import searchForm from '@/components/Form/inline'

export default {
  name: 'paymentWater',
  data () {
    return {
      currentTag: '全部',
      formFilter: {
        'tradeTime': {
          type: 'date',
          label: '交易时间'
        },
        'uploadTime': {
          type: 'date',
          label: '上传时间'
        },
        'operateTime': {
          type: 'date',
          label: '操作时间'
        },
        'opposite_account_name': {
          type: 'input',
          label: '对方户名',
          placeholder: '请输入对方户名'
        },
        'opposite_bank': {
          type: 'input',
          label: '对方开户行',
          placeholder: '请输入对方开户行'
        },
        'transaction_serial_number': {
          type: 'input',
          label: '交易流水号',
          placeholder: '请输入交易流水号'
        },
        'order_id': {
          type: 'input',
          label: '订单号',
          placeholder: '订单号'
        },
        'sn': {
          type: 'input',
          label: '订单付款号',
          placeholder: '请输入订单付款号'
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
          tradeTime: '',
          uploadTime: '',
          operateTime: '',
          opposite_account_name: '',
          opposite_bank: '',
          transaction_serial_number: '',
          order_id: '',
          sn: '',
          status: '',
          search: '',
          page: 1,
          limit: 10
        }
      },
      tagData: [
        {
          label: '全部',
          name: '3'
        },
        {
          label: '待确认',
          name: '0'
        },
        {
          label: '已确认',
          name: '1'
        },
        {
          label: '作废',
          name: '2'
        }
      ],
      tableData: [
        {
          operated_remark: '1'
        }
      ],
      totalData: null,
      currentPayId: -1,
      // currentTn: -1,
      successDialog: false,
      deleteDialog: false,
      customReasonModel: '',
      rejectReasonModel: '',
      cannotDeleteLock: false,
      multiRejectReasonModel: '',
      multiCustomReasonModel: '',
      cannotMultiDeleteLock: false,
      multiDeleteDialog: false,
      deleleReasonData: [],
      isAllChecked: false,
      deleteWaterParams: [],
      orderInfoData: null,
      successByStatusLock: false,
      snModel: '',
      currentPage: 1,
      productTotal: 10,
      pageSize: 10,
      currentStatus: 3,
      exportAccess: false
    }
  },
  created () {
    this.getList()
    this.getTotalData()
    this.getDeleteReasonList()
    this.getAccess(this.$store.getters.myPermissions)
  },
  methods: {
    getAccess (router) {
      router.forEach((v, i) => {
        if (v === 'v1.collection-record.exports') {
          this.exportAccess = true
        }
      });
    },
    getList (status, page) {
      if (page) {
        this.formFilter.form.page = page
      }
      let param = JSON.parse(JSON.stringify(this.formatFormParams(this.formFilter.form)))
      if (status === 0 || status) {
        if (status === 3) {
          delete param.status
        } else {
          param.status = status
        }
      }
      let rightParam = this.deleteKey(param)
      api.getTradeList(rightParam).then(res => {
        if (res.code == 300000) {
          this.tableData = res.data.data
          this.formatStatus(this.tableData)
          this.productTotal = Number(res.data.total)
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
    getTotalData () {
      api.getTotalData().then(res => {
        if (res.code == 300000) {
          this.totalData = this.formatTotalData(res.data)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatTotalData (data) {
      if (data && data.length !== 0) {
        let result = {
          allIncome: '',
          allPayout: '',
          waitIncome: '',
          waitPayout: '',
          hasIncome: '',
          hasPayout: '',
          deleteIncome: '',
          deletePayout: ''
        }
        data.forEach((v, i) => {
          if (v.status === -1) {
            result.allIncome = v.income_count
            result.allPayout = v.payout_count
          } else if (v.status === 0) {
            result.waitIncome = v.income_count
            result.waitPayout = v.payout_count
          } else if (v.status === 1) {
            result.hasIncome = v.income_count
            result.hasPayout = v.payout_count
          } else if (v.status === 2) {
            result.deleteIncome = v.income_count
            result.deletePayout = v.payout_count
          }
        });
        return result
      }
    },
    formatFormParams (form) {
      if (form.tradeTime) {
        form.trade_start = form.tradeTime[0] ? form.tradeTime[0] : ''
        form.trade_end = form.tradeTime[1] ? form.tradeTime[1] : ''
      } else {
        form.trade_start = ''
        form.trade_end = ''
      }
      if (form.uploadTime) {
        form.upload_start = form.uploadTime[0] ? form.uploadTime[0] : ''
        form.upload_end = form.uploadTime[1] ? form.uploadTime[1] : ''
      } else {
        form.upload_start = ''
        form.upload_end = ''
      }
      if (form.operateTime) {
        form.operate_start = form.operateTime[0] ? form.operateTime[0] : ''
        form.operate_end = form.operateTime[1] ? form.operateTime[1] : ''
      } else {
        form.operate_start = ''
        form.operate_end = ''
      }
      return form
    },
    deleteKey (obj) {
      for (const key in obj) {
        if (key === 'tradeTime' || key === 'uploadTime' || key === 'operateTime') {
          delete obj[key]
        }
        if (obj[key] === '') {
          delete obj[key]
        }
      }
      return obj
    },
    formatStatus (data) {
      let array = ['待确认', '已确认', '作废']
      data.forEach((v, i) => {
        v.status = array[parseInt(v.status)]
      })
    },
    getDeleteReasonList () {
      api.searchDeleteReason().then(res => {
        if (res.code == 300000) {
          this.deleleReasonData = res.data
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    exportTable () {
      if (this.exportAccess) {
        let param = JSON.parse(JSON.stringify(this.formatFormParams(this.formFilter.form)))
        let rightParam = this.deleteKey(param)
        api.exportTradeList(rightParam).then(res => {
          if (res.code === 300000) {
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
    changeTag (tag) {
      this.getList(Number(tag.name), 1)
      this.currentStatus = Number(tag.name)
    },
    doSuccess (item) {
      this.snModel = '' // 重置弹窗
      this.orderInfoData = null
      this.successDialog = true // 弹框
      this.currentPayId = item.id
      // this.currentTn = item.transaction_serial_number
    },
    doDelete (item) {
      this.rejectReasonModel = '' // 重置弹窗
      this.customReasonModel = ''
      this.deleteDialog = true // 弹框
      this.currentPayId = item.id
    },
    querySearchService (queryString, cb) {
      if (queryString != '' && queryString != undefined) {
        api.getOrderInfo({sn: queryString}).then(res => {
          if (res.code === 300000) {
            let data = res.data.data
            data.forEach((v, i) => {
              v.value = v.sn
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
    },
    handleSelect (val) {
      this.orderInfoData = val
      if (val && val.status) {
        this.formatOrderStatus(val)
      }
      if (this.orderInfoData.status === '支付审核中') {
        this.successByStatusLock = false
      } else {
        this.successByStatusLock = true
      }
    },
    formatOrderStatus (v) {
      let obj = {
        1: '支付审核中',
        2: '已付款',
        3: '支付失败'
      }
      v.status = obj[v.status];
    },
    doDownload (item) {
      window.location.href = item.file_url
    },
    deletePay (status) { // 通过作废为同一个接口 status : 1为通过 2为废弃
      let params = [
        {
          id: this.currentPayId,
          cancel_reason: this.rejectReasonModel,
          operated_remark: this.customReasonModel,
          payment_id: this.orderInfoData ? this.orderInfoData.id : '',
          status
        }
      ]
      this.deleteReasonKey(params)
      if (status === 1) {
        if (this.orderInfoData) {
          if (!this.successByStatusLock) {
            api.deleteTradeList(params).then(res => {
              if (res.code == 300000) {
                this.getList()
                this.successDialog = false
              } else {
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'info'
                })
              }
            })
          }
        } else {
          this.$message.info('请选择待确认的订单付款号')
        }
      } else if (status === 2) {
        if (this.rejectReasonModel && this.customReasonModel) {
          this.deletePaymentId(params)
          api.deleteTradeList(params).then(res => {
            if (res.code == 300000) {
              this.getList()
              this.deleteDialog = false
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'info'
              })
            }
          })
        } else {
          this.cannotDeleteLock = true
        }
      }
    },
    deletePaymentId (params) {
      params.forEach((v, i) => {
        if (v.payment_id) {
          delete v.payment_id
        }
      });
    },
    deleteReasonKey (params) { // 删除空key
      params.forEach((v, i) => {
        for (const key in v) {
          if (!v[key]) {
            delete v[key]
          }
        }
      });
    },
    handleSelectionChange (val) {
      this.deleteWaterParams = []
      this.multipleSelection = val
      if (val && val.length !== 0) {
        val.forEach((v, i) => {
          this.deleteWaterParams.push({
            id: v.id,
            cancel_reason: this.multiRejectReasonModel,
            operated_remark: this.multiCustomReasonModel,
            sn: v.payment && v.payment.sn ? v.payment.sn : '',
            status: 2
          })
        });
      }
    },
    fillMultipleDelete () {
      if (this.deleteWaterParams.length === 0) {
        this.$message.info('至少选择一条数据')
      } else {
        this.multiRejectReasonModel = '' // 重置弹窗数据
        this.multiCustomReasonModel = ''
        this.multiDeleteDialog = true
      }
    },
    multiDeletePay () {
      if (this.multiCustomReasonModel && this.multiRejectReasonModel) {
        this.deleteReasonKey(this.deleteWaterParams)
        api.deleteTradeList(this.deleteWaterParams).then(res => {
          if (res.code == 300000) {
            this.getList()
            this.multiDeleteDialog = false
            this.isAllChecked = false
            this.$message({
              showClose: true,
              message: '作废成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'info'
            })
          }
        })
      } else {
        this.cannotMultiDeleteLock = true
      }
    },
    changeCurrentPage (page) {
      this.getList(this.currentStatus, page)
    }
  },
  watch: {
    isAllChecked (checked) {
      if (checked) {
        var rows = this.tableData
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    multiCustomReasonModel (val) {
      this.deleteWaterParams.forEach((v, i) => {
        v.operated_remark = val
      });
      if (val) {
        this.cannotMultiDeleteLock = false
      }
    },
    multiRejectReasonModel (val) {
      this.deleteWaterParams.forEach((v, i) => {
        v.cancel_reason = val
      });
      if (val) {
        this.cannotMultiDeleteLock = false
      }
    },
    customReasonModel (val) {
      if (val) {
        this.cannotDeleteLock = false
      }
    },
    rejectReasonModel (val) {
      if (val) {
        this.cannotDeleteLock = false
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
  .payment-water-wrap {
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .submit-data {
      position: absolute;
      top: 0;
      left: 320px;
    }
  }
</style>
