<template>
  <div class="public-detail-wrap">
    <div v-if="paymentInfo">
      <el-card>
        <h4>付款单基础信息</h4>
        <div class="public-card">
          <li>
            付款单号: {{paymentInfo.sn}}
          </li>
          <li>
            付款时间: {{paymentInfo.created_at}}
          </li>
          <li>
            状态: {{paymentInfo.status | transformStatus}}
          </li>
          <li>
            财务应收金额: {{paymentInfo.amount_transfer_payable}}元
          </li>
          <li class="pay-details-wrap">
            <span class="pay-details-title">应付明细:</span>
            <div v-for="(item, index) in paymentInfo.payment_order_services" :key="index">
              <p>子单{{item.order_service.sub_order_id}}  应付{{item.total_payable}} 元</p>
            </div>
          </li>
        </div>
      </el-card>
      <el-card style="margin-top: 20px;">
        <h4>客户提交信息</h4>
        <div class="public-card">
          <li>
            付款公司: {{paymentInfo.company_name}}
          </li>
          <li>
            开户行信息: {{paymentInfo.bank}}
          </li>
          <li>
            开户行支行名称: {{paymentInfo.subbranch}}
          </li>
          <li>
            支付凭证:
            <img :src="paymentInfo.receipt" alt="无" style="width: 200px;height: 150px;">
          </li>
        </div>
      </el-card>
      <el-card style="margin-top: 20px;" v-if="paymentInfo.status !== 1">
        <h4>财务收款信息</h4>
        <div class="public-card">
          <li>
            操作人: {{paymentInfo.operator_name}}
          </li>
          <li>
            操作时间: {{paymentInfo.confirmed_at}}
          </li>
          <div v-if="paymentInfo.status !== 3">
            <li>
              交易流水号: {{paymentInfo.sn}}
            </li>
            <li>
              财务实际收款金额: {{paymentInfo.money}}元
            </li>
            <li>
              实际收款时间: {{paymentInfo.actual_received_date}}
            </li>
          </div>
          <li>
            备注: {{paymentInfo.remark}}
          </li>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>

import * as api from '@/api/order/order'

export default {
  name: 'public-detail',
  data () {
    return {
      paymentInfo: null
    }
  },
  filters: {
    transformStatus (status) {
      let arr = ['', '待确认', '已确认', '支付失败']
      return arr[status]
    }
  },
  created () {
  },
  mounted () {
    this.getPaymentDetail()
  },
  methods: {
    getPaymentDetail () {
      api.getPaymentDetail(this.$route.params.id).then(res => {
        if (res.code === 300000) {
          this.paymentInfo = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  watch: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 20px;
  .public-detail-wrap {
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .public-card {
      padding-left: 20px;
      li {
        margin-top: 20px;
        font-size: 14px;
      }
    }
    .pay-details-wrap {
      position: relative;
      padding-left: 70px;
      .pay-details-title {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
</style>
