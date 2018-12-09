<template>
  <div class="uploadd-data-wrap">
    <el-row>
      <div>
        <upload
          :upfileSize='3072'
          :upLimit="10"
          :upfileType="'file'"
          :file-list="realfileList"
          :info="'提示：一次只能上传100条数据'"
          @urlCB="uploadSuccessReally"
          :isCover="true"></upload>
      </div>
    </el-row>
    <el-row v-if="tableData && tableData.length !== 0">
      <template>
          <el-table
            :data="tableData"
            style="width: 100%;">
            <el-table-column
              label="交易时间"
              width="180px"
              prop="id">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.trade_at"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="支付">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.payout"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="收入">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.income"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="币种">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.currency"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="对方户名">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.opposite_account_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="对方账号">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.opposite_account_number"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="对方开户行">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.opposite_bank"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="备注">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              width="170px"
              label="交易流水">
              <template slot-scope="scope">
                <el-input type="text" size="small" v-model="scope.row.transaction_serial_number"></el-input>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <span style="color: red">{{scope.row.msgData}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
    </el-row>
    <el-row class="button-wrap">
      <div style="text-align: center">
        <router-link  to="/payment-water">
          <el-button type="primary">取消</el-button>
        </router-link>
        <el-button v-permission="'v1.collection-record.import'" type="primary" style="margin-left: 30px" @click="importData">保存</el-button>
      </div>
    </el-row>
  </div>
</template>
<script>

import * as api from '@/api/collectionRecords/trade'
import upload from '@/components/Upload/upload.vue'

export default {
  name: 'uploadData',
  data () {
    return {
      realfileList: [],
      tableData: [],
      idModel: '',
      nameModel: '',
      currentFileUrl: '',
      msgData: [],
      uploadLock: false
    }
  },
  created () {
  },
  methods: {
    importData () {
      let param = {
        data: JSON.parse(JSON.stringify(this.tableData)),
        file_url: this.currentFileUrl
      }
      this.deleteMsgData(param.data)
      this.formatCurrency(param.data)
      this.vertifyNullValue(param.data)
      if (this.uploadLock) {
        api.importData(param).then(res => {
          if (res.code == 300000) {
            this.tableData.forEach((v, i) => {
              this.$set(v, 'msgData', '')
            });
            this.$message.success('保存成功')
            this.$router.push({path: '/payment-water'})
          } else if (res.code == 300003) {
            let result = []
            this.tableData.forEach((v, i) => {
              result.push({
                msg: ''
              })
            });
            res.data.failed.forEach((v, i) => {
              result[v.idx].msg = v.msg
            });
            this.tableData.forEach((v, i) => {
              this.$set(v, 'msgData', result[i].msg)
            });
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
    vertifyNullValue (data) {
      for (let i = 0; i < data.length; i++) {
        if (!(data[i].payout || data[i].income)) {
          this.$message.info('收入和支出至少填写一项')
          this.uploadLock = false
          return
        } else if (!data[i].trade_at) {
          this.$message.info('交易时间不能为空')
          this.uploadLock = false
          return
        } else if (!data[i].transaction_serial_number) {
          this.$message.info('交易流水不能为空')
          this.uploadLock = false
          return
        } else {
          this.uploadLock = true
        }
      }
    },
    deleteMsgData (data) {
      data.forEach((v, i) => {
        if (v.msgData || v.msgData === '') {
          delete v.msgData
        }
      });
    },
    formatCurrency (data) { // 人民币只能传0
      data.forEach((v, i) => {
        if (v.currency) {
          v.currency = 0
        }
      });
    },
    uploadSuccessReally (obj, kk) {
      let param = {
        file: obj.file_url
      }
      this.currentFileUrl = obj.file_url
      api.getUploadData(param).then(res => {
        if (res.code == 300000) {
          this.tableData = res.data
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
    tableData: {
      handler: function (newValue, oldValue) {
        if (newValue && newValue.length !== 0) {
          newValue.forEach((v, i) => {
            for (const key in v) {
              if (!v[key]) {
                v[key] = ''
              }
            }
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    upload
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 20px;
  .uploadd-data-wrap {
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .button-wrap {
      margin-top: 20px;
      width: 100%;
    }
  }
</style>
