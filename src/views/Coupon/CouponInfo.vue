<template>
  <div class="info-wrap">
    <el-row>
      <template>
        <el-tabs v-model="activeTabName" type="card" @tab-click="changeTab">
          <el-tab-pane
            v-for="(item, key, index) in powerTabData"
            :key="index"
            :label="item.label"
            :name="item.name">
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-row>
    <el-row v-if="activeTabName === 'basicInfo' && basicInfoData && basicInfoData.length !== 0">
      <el-row>
        <h4 style="text-derection: under-line">基本信息</h4>
      </el-row>
      <el-row class="coupon-info">
        <el-col :span="12" class="clear">
          <span class="fl" style="margin-left: 20px;">&nbsp;</span>
          <span class="fl ml5">优惠券名称：</span>
          <span class="fl ml5">{{basicInfoData.name}}</span>
        </el-col>
        <el-col :span="12" class="clear">
          <span class="fl" style="margin-left: 20px;">&nbsp;</span>
          <span class="fl ml5">优惠券状态：</span>
          <span class="fl ml5">{{basicInfoData.status | transformStatus}}</span>
        </el-col>
      </el-row>
      <el-row class="coupon-info clear">
        <span class="fl" style="margin-left: 70px;">&nbsp;</span><span class="fl">类型：</span> <p style="width: 200px;" class="fl ml10">{{basicInfoData.type | transformType}}</p>
      </el-row>
      <el-row class="coupon-info clear">
        <span class="fl" style="margin-left: 40px;">&nbsp;</span>
        <span class="fl ml5">发放时间：</span>
        <div class="fl ml10">
          <span>{{basicInfoData.available_from}}</span>
        </div>
        <span class="fl ml10">至</span>
        <div class="fl ml10">
          <span>{{basicInfoData.available_until}}</span>
        </div>
      </el-row>

      <el-row class="coupon-info clear">
        <span class="fl" style="margin-left: 9px;">&nbsp;</span>
        <span class="fl ml5">优惠券有效期：</span>
        <div class="fl ml10">
          <span>{{basicInfoData.valid_from}}</span>
        </div>
        <span class="fl ml10">至</span>
        <div class="fl ml10">
          <span>{{basicInfoData.valid_until}}</span>
        </div>
      </el-row>
      <el-row>
        <span class="fl" style="margin-left: 40px;"></span>
        <span class="fl ml5" style="margin-left: 48px">使用范围：</span>
        <div class="fl ml10">
          <span :style="{'marginLeft' : index === 0 ? 0 : '20px'}" v-for="(item, index) in couponRangeData" :key="index">{{item}}</span>
        </div>
      </el-row>
      <el-row>
        <hr>
      </el-row>
      <el-row>
        <h4 style="text-derection: under-line">面值信息</h4>
      </el-row>
      <el-row class="coupon-info clear" v-if="basicInfoData.type === 2">
        <span class="fl" style="margin-left: 20px;">&nbsp;</span>
        <span class="fl ml5">优惠折扣：</span>
        <span class="fl ml5">{{basicInfoData.discount}}</span>
        <span class="fl ml10">折</span>
      </el-row>
      <el-row class="coupon-info clear" v-else>
        <span class="fl" style="margin-left: 20px;">&nbsp;</span>
        <span class="fl ml5">优惠金额：</span>
        <span class="fl ml5">{{basicInfoData.discount_amount}}</span>
        <span class="fl ml10">元</span>
      </el-row>
      <el-row class="coupon-info clear">
        <span class="fl" style="margin-left: 20px;">&nbsp;</span>
        <span class="fl ml5">使用条件：</span>
        <div class="fl ml10">
          <p v-if="basicInfoData.usage_cond === 1">
            满<span>{{basicInfoData.threshold}}</span> 元可用
          </p>
          <p v-else>无金额限制</p>
        </div>
      </el-row>
      <el-row class="coupon-info clear">
        <span class="fl" style="margin-left: 20px;">&nbsp;</span>
        <span class="fl ml5">发行数量：</span>
        <span class="fl ml5">{{basicInfoData.total_num}}</span>
        <span class="fl ml10">张</span>
      </el-row>
      <el-row class="coupon-info clear">
        <span class="fl" style="margin-left: 20px;">&nbsp;</span>
        <span class="fl ml5">每人限领：</span>
        <span class="fl ml5">{{basicInfoData.restricted_num}}</span>
        <span class="fl ml10">张</span>
      </el-row>
      <el-row>
        <hr>
      </el-row>
      <el-row>
        <h4 style="text-derection: under-line">使用规则</h4>
      </el-row>
      <el-row>
        <span class="fl ml5">{{basicInfoData.usage_rule}}</span>
      </el-row>
      <el-row>
        <h4 style="text-derection: under-line">备注</h4>
      </el-row>
      <el-row>
        <span class="fl ml5">{{basicInfoData.remark}}</span>
      </el-row>
      <el-row>
        <hr>
      </el-row>
      <el-row>
        <el-row>
          <h4 style="text-derection: under-line">操作记录</h4>
        </el-row>
        <el-row v-if="couponBasicTableData && couponBasicTableData.length !==0">
          <template>
            <el-table
              :data="couponBasicTableData"
              height="200"
              style="width: 100%">
              <el-table-column
                prop="created_at"
                label="时间">
              </el-table-column>
              <el-table-column
                prop="operator_id"
                label="操作人">
              </el-table-column>
              <el-table-column
                prop="type"
                label="操作内容">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注">
              </el-table-column>
            </el-table>
          </template>
        </el-row>
      </el-row>
      <el-row style="text-align: center" v-if="basicInfoData.status === 1" v-permission="'v1.coupon.coupon.check'">
        <el-button type="primary" size="small" @click="checkFail">驳回</el-button>
        <el-button type="primary" size="small" @click="checkSuccess">通过</el-button>
      </el-row>
    </el-row>

    <el-row v-if="activeTabName === 'useInfo'">
      <el-row>
        <el-form :inline="true" :model="formFilter" class="demo-form-inline" size="small">
          <el-form-item label="优惠券编码：">
            <el-input v-model="formFilter.couponCode"></el-input>
          </el-form-item>
          <el-form-item label="领取人">
            <el-input v-model="formFilter.user"></el-input>
          </el-form-item>
          <el-form-item label="合同编号">
            <el-input v-model="formFilter.projectCode"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formFilter.status">
              <el-option label="待领取" value="1"></el-option>
              <el-option label="待使用" value="2"></el-option>
              <el-option label="已使用" value="3"></el-option>
              <el-option label="已过期" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="formFilter.orderId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getCouponUseInfo">确认</el-button>
            <el-button type="primary" size="small"  @click="exportCouponUseInfo" v-permission="'v1.coupon.coupon.usage.export'">导出</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <template>
          <el-table
            :data="couponData"
            height="450"
            style="width: 100%">
            <el-table-column
              prop="coupon_code"
              label="优惠券编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="user_id"
              label="领取人">
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="领取时间">
            </el-table-column>
            <el-table-column
              prop="verified_by"
              label="验证人">
            </el-table-column>
            <el-table-column
              prop="order_id"
              label="订单号">
            </el-table-column>
            <el-table-column
              prop="project_code"
              label="项目编号">
            </el-table-column>
            <el-table-column
              prop="verified_at"
              label="使用时间">
            </el-table-column>
          </el-table>
        </template>
        <div class="product-pagination-wrap">
          <div class="product-pagination">
            <el-pagination
              background
              layout="prev, pager, next, total"
              :total="totalNumber"
              :page-size="pageSize"
              @current-change="changeCurrentPage">
            </el-pagination>
          </div>
        </div>
      </el-row>
    </el-row>
    <el-dialog :width="'750px'" title="确定审核" :visible.sync="checkDialog" >
      <div style="text-align: center">
        确定审核吗？
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" @click="checkDialog = false">取消</el-button>
        <el-button type="primary" size="small" @click="isCheck">确定审核</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/coupon/coupon'

export default {
  name: 'couponHome',
  data () {
    return {
      powerTabData: [
        {
          label: '优惠券基本信息',
          name: 'basicInfo'
        },
        {
          label: '领取使用详情',
          name: 'useInfo'
        }
      ],
      activeTabName: 'basicInfo',
      formFilter: {
        couponCode: '',
        user: '',
        projectCode: '',
        status: '',
        orderId: '',
        page: 1,
        limit: 10
      },
      totalNumber: 1,
      pageSize: 1,
      couponData: [],
      basicInfoData: [],
      couponRangeData: [],
      couponBasicTableData: [],
      checkDialog: false
    }
  },
  created () {
    this.getCouponBasicInfo()
    this.getCouponUseInfo()
  },
  filters: {
    transformStatus: function (value) {
      if (!value) {
        return ''
      } else {
        if (value === 1) {
          return '待审核'
        } else if (value === 2) {
          return '待发放'
        } else if (value === 3) {
          return '发放中'
        } else if (value === 4) {
          return '驳回'
        } else if (value === 5) {
          return '已停止'
        } else if (value === 6) {
          return '已结束'
        }
      }
    },
    transformType: function (value) {
      if (!value) {
        return ''
      } else {
        if (value === 1) {
          return '满减券'
        } else if (value === 2) {
          return '满折券'
        } else if (value === 3) {
          return '套餐券'
        }
      }
    }
  },
  methods: {
    getCouponUseInfo () {
      let id = this.$route.params.id
      let params = this.formFilter
      api.couponUseInfo(id, params).then(res => {
        if (res.code === 300000) {
          let data = res.data
          this.totalNumber = Number(data.total)
          this.pageSize = Number(data.per_page)
          this.couponData = data.data
          this.formatStatus(this.couponData)
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
        if (Number(data[i].status) === 1) {
          data[i].status = '待领取'
        } else if (Number(data[i].status) === 2) {
          data[i].status = '待使用'
        } else if (Number(data[i].status) === 3) {
          data[i].status = '已使用'
        } else if (Number(data[i].status) === 4) {
          data[i].status = '已过期'
        }
      }
    },
    getCouponBasicInfo () {
      var id = this.$route.params.id
      api.couponBasicInfo(id).then(res => {
        if (res.code === 300000) {
          let data = res.data
          this.basicInfoData = data
          if (this.basicInfoData.coupon_scopes) {
            this.formatScopes(this.basicInfoData.coupon_scopes)
          }
          this.couponBasicTableData = this.formatLogsData(data.logs)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatLogsData (arr) {
      if (arr.length !== 0) {
        var newArr = []
        for (let i = 0; i < arr.length; i++) {
          var item = {
            created_at: arr[i].created_at,
            operator_id: arr[i].operator_id,
            type: this.formatTypeContent(arr[i].type),
            remark: arr[i].remark
          }
          newArr.push(item)
        }
        return newArr
      } else {
        return []
      }
    },
    formatTypeContent (type) {
      if (type === 1) {
        return '创建'
      } else if (type === 2) {
        return '审核通过'
      } else if (type === 3) {
        return '驳回'
      } else if (type === 4) {
        return '终止'
      } else if (type === 5) {
        return '编辑'
      }
    },
    formatScopes (arr) {
      let newArr = []
      arr.forEach((v, i) => {
        let item = `${v.category.parent.parent.name}/${v.category.parent.name}/${v.category.name}`
        newArr.push(item)
      });
      this.couponRangeData = newArr
    },
    isCheck () {
      let id = this.$route.params.id
      let data = {
        status: 1
      }
      api.couponCheck(id, data).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '审核已通过',
            type: 'success'
          })
          this.checkDialog = false
          this.$router.push({path: '/coupon'})
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
          this.checkDialog = false
        }
      })
    },
    checkSuccess () {
      this.checkDialog = true
    },
    checkFail () {
      let id = this.$route.params.id
      let data = {
        status: 2
      }
      api.couponCheck(id, data).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '审核被驳回',
            type: 'info'
          })
          this.$router.push({path: 'coupon'})
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    changeTab () {
    },
    changeCurrentPage (page) {
      this.formFilter.page = page
      this.getCouponUseInfo()
    },
    exportCouponUseInfo () {
      let id = this.$route.params.id
      let params = {
        couponCode: this.formFilter.couponCode,
        user: this.formFilter.user,
        projectCode: this.formFilter.projectCode,
        status: this.formFilter.status,
        orderId: this.formFilter.orderId
      }
      api.exportUseInfoCoupon(id, params).then(res => {
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
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
$row-distance: 20px;
.fl {
  float: left;
}
.ml10 {
  margin-left: 10px;
}
.ml5 {
  margin-left: 5px;
}
.info-wrap {
  font-size: 14px;
  padding: 10px;
  color: #606266;
  .el-row {
    margin-bottom: $row-distance;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .product-pagination-wrap {
    position: relative;
    width: 100%;
    height: 40px;
    margin-top: 20px;
    .product-pagination {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
}
</style>
