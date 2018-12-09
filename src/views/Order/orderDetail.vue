<template>
  <div class="order-detail-wrap">
    <template>
      <el-tabs v-model="tabModel" type="card" @tab-click="tabHandleClick">
        <el-tab-pane label="订单信息" name="first"></el-tab-pane>
        <el-tab-pane label="操作记录" name="second"></el-tab-pane>
      </el-tabs>
    </template>
    <div v-if="tabModel === 'first'">
      <el-row v-if="detailInfo">
        <el-row>
          <h3>订单信息</h3>
        </el-row>
        <el-row>
          <el-card>
            <span class="f-w-b">创建时间:</span> <span class="ml10">{{detailInfo.created_at}}</span>
            <span class="ml50 f-w-b">订单号:</span> <span class="ml10">{{detailInfo.id}}</span>
            <span class="ml50 f-w-b">订单状态:</span> <span class="ml10">{{detailInfo.status}}</span>
            <span class="ml50 f-w-b">订单负责人:</span> <span class="ml10">{{detailInfo.manager}}</span>
            <span class="ml50 f-w-b">报价单号:</span> <span class="ml10">{{detailInfo.quotation_id}}</span>
          </el-card>
        </el-row>
        <el-row>
          <h3>买家信息</h3>
        </el-row>
        <el-row >
          <el-card>
            <span class="f-w-b">公司名称:</span> <span class="ml10">{{detailInfo.company_name}}</span>
            <span class="ml50 f-w-b">联系人:</span> <span class="ml10">{{detailInfo.contact_name}}</span>
            <span class="ml50 f-w-b">联系方式:</span> <span class="ml10">{{detailInfo.contact_phone}}</span>
            <span class="ml50 f-w-b">客户账号:</span> <span class="ml10">{{detailInfo.company_phone}}</span>
          </el-card>
        </el-row>
      </el-row>
      <el-row>
        <h3>支付信息</h3>
      </el-row>
      <el-row>
        <el-card>
          <template>
            <el-table
              :data="paymentsData"
              style="width: 100%">
              <el-table-column
                prop="created_at"
                label="付款时间">
              </el-table-column>
              <el-table-column
                prop="sn"
                label="订单付款号">
              </el-table-column>
              <el-table-column
                prop="status"
                label="支付状态">
              </el-table-column>
              <el-table-column
                prop="total_payable"
                label="应付金额">
              </el-table-column>
              <el-table-column
                prop="amount_paid"
                label="实际支付金额">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注">
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-row>
      <el-row>
        <h3>服务信息</h3>
      </el-row>
      <el-row>
        <el-card>
          <template>
            <el-table
              :data="serviceData"
              class="service-table"
              border
              style="width: 100%">
              <el-table-column
                prop="sub_order_id"
                label="子单号">
              </el-table-column>
              <el-table-column
                prop="status"
                label="子单状态">
              </el-table-column>
              <el-table-column
                prop="project_id"
                label="报价单项目号">
              </el-table-column>
              <el-table-column
                prop="sub_order_id"
                label="服务分类">
                <template slot-scope="scope">
                  <div style="display: inline-block" v-for="(item, index) in scope.row.categories" :key="index">
                    <span v-if="item.level == 1">{{item.name}}/</span>
                    <span v-if="item.level == 2">{{item.name}}/</span>
                    <span v-if="item.level == 3">{{item.name}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="服务名称">
              </el-table-column>
              <el-table-column
                label="属性">
                <template slot-scope="scope">
                  <div style="display: inline-block" v-for="(item, index) in scope.row.attributes" :key="index" v-if="scope.row.attributes.length !== 0">
                    {{item.value}}
                    <span v-if="index !== scope.row.attributes.length - 1">/</span>
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="num"
                label="购买数量">
              </el-table-column>
              <el-table-column
                prop="total_payable"
                label="子单应付金额">
              </el-table-column>
              <el-table-column
                prop="amount_paid"
                label="子单已付金额">
              </el-table-column>
              <el-table-column
                prop="amount_unpaid"
                label="子单剩余支付">
              </el-table-column>
              <el-table-column
                prop="sub_order_id"
                label="任务名称">
                <template slot-scope="scope">
                  <span>{{scope.row.task ? scope.row.task.title  : ''}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="创建人">
                <template slot-scope="scope">
                  <span>{{scope.row.task ? scope.row.task.creator  : ''}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="!scope.row.task_id" type="text" size="small" @click="openDialog(scope.row)">创建任务</el-button>
                  <el-button v-else type="text" size="small" @click="viewDetail(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <ul class="total-wrap" v-if="detailInfo">
              <span class="f-w-b">优惠合计：</span> <span>{{detailInfo.discount}}</span>元
              <span class="ml20 f-w-b">金额合计：</span> <span>{{detailInfo.amount}}</span>元
              <span class="ml20 f-w-b">应付合计：</span> <span>{{detailInfo.total_payable}}</span>元
              <span class="ml20 f-w-b">已付金额：</span> <span>{{detailInfo.amount_paid}}</span>元
              <span class="ml20 f-w-b">待支付：</span> <span>{{detailInfo.amount_unpaid}}</span>元
          </ul>
        </el-card>
      </el-row>
      <el-row>
        <h3>合同信息</h3>
      </el-row>
      <el-row>
        <el-card>
          <upload
            :upfileSize='3072'
            :upLimit="10"
            :upfileType="'file'"
            @urlCB="uploadAgreement"
            :isCover="true"></upload>
          <template>
            <el-table
              :data="agreementTableData"
              style="width: 100%;">
              <el-table-column
                  prop="created_at"
                  label="上传日期">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="合同名称">
                </el-table-column>
                <el-table-column
                  prop="uploaded_name"
                  label="上传人">
                </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-row>
    </div>
    <div v-else>
      <el-card>
          <template>
            <el-table
              :data="opreateData"
              style="width: 100%">
              <el-table-column
                prop="created_at"
                label="时间">
              </el-table-column>
              <el-table-column
                label="类型">
                <template slot-scope="scope">
                  <span>{{scope.row.type | transformType}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="operator_name"
                label="操作人">
              </el-table-column>
              <el-table-column
                label="身份">
                <template slot-scope="scope">
                  <span>{{scope.row.identity_type | transformIdentityType}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="action_content"
                label="操作内容">
              </el-table-column>
              <el-table-column
                prop="detail_content"
                label="详细内容">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注">
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
        </el-card>
    </div>
    <el-dialog :width="'600px'" title="提示" :visible.sync="creatTaskDialog" :close-on-click-modal="false">
      <el-row style="padding-left: 30px;">
        <el-row>
          企业名称：<el-input v-model="companyNameModel" size="small" class="company-input ml20" style="width: 300px;" disabled></el-input>
        </el-row>
        <el-row>
          任务名称：<el-input v-model="taskNameModel" size="small" class="company-input ml20" style="width: 300px;"></el-input>
        </el-row>
        <el-row class="package-wrap">
          选择任务产品包：
          <template>
            <el-radio v-for="(item, index) in scopesData" :key=index v-model="packageModel" :label="item.id">
              {{item.service_packeage_name}}
              <el-input v-if="item.is_love == 1 && packageModel == index + 1" v-model="packageInputModel" size="small" class="company-input ml20" style="width: 100px;"></el-input>
            </el-radio>
          </template>
          <div v-if="currentServiceData" style="color: #ccc;margin-top: 20px;">提示：该子单金额为 <span style="color: red">{{currentServiceData.total_payable}}</span> 元，任务产品包金额不可大于任务签单金额。</div>
        </el-row>
        <!-- <el-row>
          设计任务金额：<el-input v-model="companyMoneyModel" size="small" disabled class="company-input ml20" style="width: 273px;"></el-input>
        </el-row> -->

        <div v-if="creatTaskDialog">
          <el-row>
            <span class="fl">合同：</span>
            <div class="company-input fl ml20">
              <upload
                :upfileSize='3072'
                :upLimit="10"
                :upfileType="'file'"
                @urlCB="uploadAgreementTask"
                :firstFileList="firstFileList"
                :isCover="true"></upload>
            </div>
          </el-row>
          <el-row>
            <span class="fl">上传协议：</span>
            <div class="company-input fl ml20">
              <upload
                :upfileSize='3072'
                :upLimit="10"
                :upfileType="'file'"
                @urlCB="uploadDeal"
                :firstFileList="firstFileList"
                :isCover="true"></upload>
            </div>
          </el-row>
          <el-row>
            <span class="fl">上传需求书：</span>
              <div class="company-input fl ml20">
                <upload
                  :upfileSize='3072'
                  :upLimit="10"
                  :upfileType="'file'"
                  :firstFileList="firstFileList"
                  @urlCB="uploadBook"
                  :isCover="true"></upload>
              </div>
          </el-row>
        </div>
        <el-row style="margin-top: 20px;">
          <span class="fl">任务显示：</span>
          <div class="fl ml20">
            <template>
              <el-radio v-model="taskShowModel" label="1">微信</el-radio>
              <el-radio v-model="taskShowModel" label="2">PC</el-radio>
              <el-radio v-model="taskShowModel" label="3">微信+PC</el-radio>
            </template>
          </div>
        </el-row>
        <el-row>
          <span class="fl">任务板块：</span>
          <div class="fl">
            <div class="block">
              <el-cascader
                :options="sortProductOptions"
                :props="categoryKey"
                size="small"
                v-model="categoryModel">
              </el-cascader>
            </div>
          </div>
        </el-row>
        <el-row>
          <span class="fl" style="margin-top: 6px;">任务开始时间：</span>
          <div class="fl ml20" id="ddsdd">
            <template>
              <div class="block">
                <el-date-picker
                  v-model="taskStartModel"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </template>
          </div>
        </el-row>
        <el-row>
          <span class="fl" style="margin-top: 6px;">任务负责邦女郎：</span>
          <div class="fl ml20">
            <el-autocomplete
              v-model="taskBondModel"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              size="small"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
        </el-row>
        <el-row>
          <span style="color: red;" class="ml20" v-if="missingParamsLock">保存失败！信息填写不完整。</span>
          <span style="color: red;" class="ml20" v-if="notFindBondsLock">保存失败！邦女郎系统账号不存在！</span>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="creatTaskDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="doCreatTask">确认</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/order/order'
import upload from '@/components/Upload/upload.vue'

export default {
  name: 'orderDetail',
  data () {
    return {
      tabModel: 'first',
      detailInfo: null,
      paymentsData: [],
      opreateData: [],
      serviceData: [],
      scopesData: [],
      packageModel: '1',
      packageInputModel: '',
      creatTaskDialog: false,
      companyNameModel: '',
      // companyMoneyModel: '',
      taskShowModel: '1',
      taskStartModel: '',
      taskBondModel: '',
      protocolUrl: '',
      requireUrl: '',
      contractUrl: '',
      sortProductOptions: [],
      categoryKey: {
        value: 'id',
        label: 'name',
        children: 'sub_category'
      },
      categoryModel: [],
      categoryParentModel: '',
      subCategoryModel: '',
      taskNameModel: '',
      currentServiceData: null,
      missingParamsLock: false,
      notFindBondsLock: false,
      isSelectBond: false,
      taskBondIdModel: -1,
      firstFileList: [],
      agreementTableData: [],
      currentPage: 1,
      productTotal: 10,
      pageSize: 10
    }
  },
  filters: {
    transformType (type) {
      let arr = ['', '创建订单', '创建支付单', '审核支付单', '创建任务', '创建任务', '创建任务']
      return arr[type]
    },
    transformIdentityType (type) {
      let arr = ['', '后台用户', '洛客用户', '审核支付单', '创建任务', '创建任务', '创建任务']
      return arr[type]
    }
  },
  created () {
    this.getDetailList()
    this.getPackage()
    this.getSubFilterData()
    this.getOperate()
  },
  methods: {
    tabHandleClick (tab, event) {
      this.tabModel = tab.name
    },
    getSubFilterData () {
      api.getSubFilterData().then(res => {
        if (res.code === 300000) {
          this.sortProductOptions = this.formatCategoryDetail(res.data.category)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    getPackage () {
      api.getPackage().then(res => {
        if (res.code === 300000) {
          this.scopesData = res.data
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatCategoryDetail (category) { // 双层嵌套对象转化成数组对象的方法
      var newCateGoryData = []
      for (var key in category) {
        var subCategoryData = []
        for (var subkey in category[key].sub_category) {
          subCategoryData.push(category[key].sub_category[subkey])
        }
        var newCateGoryDataItem = {
          id: category[key].id,
          name: category[key].name,
          sub_category: subCategoryData
        }
        newCateGoryData.push(newCateGoryDataItem)
      }
      return newCateGoryData
    },
    getOperate (page) {
      let params
      if (page) {
        params = {
          page: page,
          limit: 10
        }
      } else {
        params = {
          page: 1,
          limit: 10
        }
      }
      api.getOperate(this.$route.params.id, params).then(res => {
        if (res.code === 300000) {
          this.opreateData = res.data.data
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
    getDetailList () {
      api.getDetailList(this.$route.params.id).then(res => {
        if (res.code === 300000) {
          this.detailInfo = res.data
          this.formatStatus(this.detailInfo)
          this.paymentsData = this.detailInfo.payments //
          this.formatPaymentStatus(this.paymentsData)
          this.serviceData = this.detailInfo.services
          this.companyNameModel = this.detailInfo.company_name
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatStatus (v) {
      let obj = {
        1: '已付款',
        2: '待付款',
        3: '已取消',
        4: '支付审核中'
      }
      v.status = obj[v.status];
    },
    formatPaymentStatus (data) {
      let array = ['', '待确认', '已确认', '支付失败']
      data.forEach((v, i) => {
        v.status = array[parseInt(v.status)]
      })
    },
    isNumber (obj) {
      var reg = new RegExp('^[0-9]*$')
      return reg.test(obj)
    },
    doCreatTask () {
      if (this.isNumber(this.packageInputModel) || this.packageInputModel === '') {
        let params = {
          service_package_id: this.packageModel,
          price: Number(this.packageInputModel),
          contract_url: this.contractUrl,
          title: this.taskNameModel,
          display_terminal: this.taskShowModel,
          protocol_url: this.protocolUrl,
          require_url: this.requireUrl,
          category_id: this.categoryParentModel,
          sub_category_id: this.subCategoryModel,
          issue_time: this.taskStartModel,
          lady_id: this.taskBondIdModel
        }
        if (!params.price) {
          delete params.price
        }
        if (this.isAllFill()) {
          this.missingParamsLock = false
          if (this.isSelectBond) {
            this.notFindBondsLock = false
          } else {
            this.notFindBondsLock = true
          }
          if (!this.notFindBondsLock) {
            api.creatBondTask(this.currentServiceData.id, params).then(res => {
              if (res.code === 300000) {
                this.creatTaskDialog = false
                this.getDetailList()
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
          this.missingParamsLock = true
        }
      } else {
        this.$message.error('任务产品包输入框必须为数字')
      }
    },
    isAllFill () {
      if (this.taskNameModel !== '' && this.taskShowModel !== '' && this.protocolUrl !== '' && this.requireUrl !== '' && this.categoryParentModel !== '' && this.subCategoryModel !== '' && this.taskStartModel !== '' && this.taskBondModel !== '' && this.contractUrl !== '' && this.packageModel !== '') {
        return true
      } else {
        return false
      }
    },
    uploadDeal (obj, kk) {
      this.protocolUrl = obj.file_url
    },
    uploadBook (obj, kk) {
      this.requireUrl = obj.file_url
    },
    uploadAgreement (obj, kk) {
      let params = {
        name: obj.file_name,
        url: obj.file_url
      }
      api.creatAgreement(this.detailInfo.id, params).then(res => {
        if (res.code === 300000) {
          this.agreementTableData.push(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    uploadAgreementTask (obj, kk) {
      this.contractUrl = obj.file_url
    },
    handleSelect (item) {
      this.isSelectBond = true
      this.taskBondIdModel = item.id
    },
    querySearchAsync (queryString, cb) {
      if (queryString != '' && queryString != undefined) {
        api.getBondsList({name: queryString}).then(res => {
          if (res.code === 300000) {
            let data = res.data
            data.forEach((v, i) => {
              v.value = v.lady_name
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
    openDialog (row) {
      this.creatTaskDialog = true
      // this.companyMoneyModel = row.amount
      this.currentServiceData = row
      this.taskNameModel = '' // 重置数据
      this.taskShowModel = '1'
      this.categoryModel = []
      this.taskStartModel = ''
      this.taskBondModel = ''
      this.firstFileList = []
      this.protocolUrl = ''
      this.requireUrl = ''
      this.contractUrl = ''
      this.packageModel = ''
    },
    viewDetail (row) {
      window.location.href = row.task.url
    },
    changeCurrentPage (page) {
      this.getOperate(page)
      this.currentPage = page
    }
  },
  watch: {
    categoryModel (category) {
      if (category.length !== 0) {
        this.categoryParentModel = category[0].toString()
        this.subCategoryModel = category[1].toString()
      }
    }
  },
  components: {
    upload
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 20px;
  .ml20 {
    margin-left: 20px;
  }
  .ml50 {
    margin-left: 50px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .f-w-b {
    font-weight: bold;
  }
  .order-detail-wrap {
    font-size: 14px;
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .total-wrap {
      margin-top: 20px;
    }
    .company-input {
      display: inline-block;
    }
  }
</style>
<style lang="scss">
.service-table {
  .cell {
    text-align: center;
  }
}
.package-wrap {
  .el-radio {
    margin-top: 10px;
  }
}
</style>
