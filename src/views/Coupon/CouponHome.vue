<template>
  <div class="coupon-wrap" @click="showPersonWrap = false">
    <div>
      <el-row>
        <div class="select-wrap">
          <el-form :inline="true" :model="formFilter" class="demo-form-inline" size="small">
            <el-form-item label="创建时间：">
              <el-col :span="11">
                <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="startTimeModel" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">至</el-col>
              <el-col :span="11">
                <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="endTimeModel" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="优惠券名称">
              <el-input v-model="formFilter.name" placeholder="输入优惠券名称"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formFilter.status" placeholder="请选择优惠券状态">
                <el-option label="待审核" value="1"></el-option>
                <el-option label="待发放" value="2"></el-option>
                <el-option label="发放中" value="3"></el-option>
                <el-option label="驳回" value="4"></el-option>
                <el-option label="已停止" value="5"></el-option>
                <el-option label="已结束" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建人" style="position: relative">
              <el-input v-model="createdByModel" placeholder="输入创建人" @focus="focusLock"></el-input>
              <ul class="creat-by-wrap" v-if="showPersonWrap">
                <li v-for="(item, index) in createdByData" :key="index" @click.stop="getCreatByModel(index)">{{item.name}}</li>
              </ul>
              <!-- <el-input v-model="formFilter.createdBy" placeholder="输入创建人"></el-input> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchTableData">搜索</el-button>
              <el-button type="primary" size="small" @click="exportTable" v-permission="'v1.coupon.coupon.export'">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
      <el-row>
        <a href=""></a>
        <router-link to="/coupon-creat">
          <el-button type="primary" size="small" v-permission="'v1.coupon.coupon.create'">创建优惠券</el-button>
        </router-link>
        <!-- <el-button type="primary" size="small" @click="verifierDialog = true" v-if="verificateAccess">验证优惠券</el-button> -->
      </el-row>
      <el-row>
        <template>
          <el-table
            :data="couponData"
            height="700"
            style="width: 100%">
            <el-table-column
              label="编号"
              prop="coupon_id"
              width="50">
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="优惠券名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              label="优惠额度">
              <template slot-scope="scope">
                <span v-if="scope.row.type === '满折券'">{{scope.row.discount}}折</span>
                <span v-else>{{scope.row.discount_amount}}元</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="total_num"
              label="发放数量">
            </el-table-column>
            <el-table-column
              prop="coupon_records_count"
              label="领取数量">
            </el-table-column>
            <el-table-column
              prop="coupon_records_usage_count"
              label="使用数量">
            </el-table-column>
            <el-table-column
              prop="publish_time"
              label="领取时间">
            </el-table-column>
            <el-table-column
              prop="valid_time"
              label="有效期">
            </el-table-column>
            <el-table-column
              prop="created_by"
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="reviewed_by"
              label="审核人">
            </el-table-column>
            <el-table-column
              prop="reviewed_at"
              label="审核时间">
            </el-table-column>
            <el-table-column
              prop="doSomething"
              label="操作">
            <template slot-scope="scope">
                <router-link tag="span" :to="`/coupon-info/${scope.row.id}`">
                  <el-button type="text" size="small" v-permission="'v1.coupon.coupon'">详情</el-button>
                </router-link>
                <el-button type="text" size="small" @click="showLink(scope.row)" v-if="scope.row.status === '发放中' || scope.row.status === '已结束' || scope.row.status === '已停止' || scope.row.status === '待发放'">链接</el-button>
                <el-button type="text" size="small" v-permission="'v1.coupon.coupon.stoping'" v-if="scope.row.status === '发放中'" @click="stopProgress(scope.row.id)">停止</el-button>
                <router-link tag="span" :to="`/coupon-info/${scope.row.id}`">
                  <el-button v-permission="'v1.coupon.coupon.check'" v-if="scope.row.status === '待审核'" type="text" size="small">审核</el-button>
                </router-link>
                <el-button type="text" size="small" v-permission="'v1.coupon.coupon.update'" v-if="scope.row.status === '待审核' || scope.row.status === '驳回'" @click="editCouponFn(scope.row)">编辑</el-button>
              </template>
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
      <el-dialog :width="'80%'" title="" :visible.sync="aDialog" :close-on-click-modal="false">
        <div style="text-align: center;word-wrap: break-word">
          连接地址：<span>{{couponLink}}</span>
        </div>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="copyUrl">复制链接</el-button>
          <textarea id="contents" rows="10" cols="10" style="height:0;width:0;opacity: 0;"></textarea>
        </div>
      </el-dialog>

      <el-dialog :width="'530px'" title="验证优惠券" :visible.sync="verifierDialog" :close-on-click-modal="false">
        <div>
          <el-row>
            <span>优惠券编码：</span>
            <el-input style="width: 350px" v-model="couponCodeModel" @blur="getCouponCodeInfo"></el-input>
          </el-row>
          <el-row style="padding-left: 90px">
            <div v-if="couponCodeStatus === '待使用' || couponCodeStatus === '已使用' || couponCodeStatus === '已过期'"  style="color:red">
              优惠券{{couponCodeStatus}}!
            </div>
            <div v-if="couponCodeStatus === '待领取'">
              <span style="color:green">验证成功！</span>
            </div>
            <ul v-if="verifierCouponCodeInfo" class="vertifi-coupon-code-wrap">
              <el-row>
                优惠券名称：<span>{{verifierCouponCodeInfo.name}}</span>
              </el-row>
              <el-row>
                使用范围：<span v-for="(item, index) in verifierCouponCodeInfo.coupon_scopes" :key="index" style="margin-left: 10px;">{{item.label}}</span>
              </el-row>
              <el-row>
                优惠金额：<span>{{verifierCouponCodeInfo.discount_amount}}</span>
              </el-row>
              <el-row>
                使用条件：<span>{{verifierCouponCodeInfo.usage_cond}}</span>
              </el-row>
              <el-row>
                有效期：<span>{{verifierCouponCodeInfo.valid_from}} 至 {{verifierCouponCodeInfo.valid_until}}</span>
              </el-row>
            </ul>
          </el-row>
          <el-row>
            <span style="color: red">*</span>
            <span style="margin-left: 4px;">项目编号：</span>
            <el-input style="width: 350px" v-model="projectCodeModel"></el-input>
          </el-row>
          <el-row style="text-align: center">
            <el-button type="primary" size="small" @click="verifierDialog = false">取消</el-button>
            <el-button type="primary" size="small" @click="isVerifierCoupon">确认使用</el-button>
          </el-row>
        </div>
      </el-dialog>

      <el-dialog :width="'80%'" title="编辑优惠券" :visible.sync="editDialog" >
        <div>
          <coupon-edit
            :editInfo="editInfo"
            @cancleFn="cancleFn"
            @editSuccess="editSuccess"
          ></coupon-edit>
        </div>
      </el-dialog>
      <el-dialog :width="'750px'" title="停止审核" :visible.sync="stopDialog" >
        <div style="text-align: center">
          确定停止审核吗？
        </div>
        <div style="text-align: center;margin-top: 20px">
          <el-button type="primary" size="small" @click="stopDialog = false">取消</el-button>
          <el-button type="primary" size="small" @click="isStopProgress">确定停止</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import * as api from '@/api/coupon/coupon'
import couponEdit from './CouponCreat'
export default {
  name: 'couponHome',
  data () {
    return {
      formFilter: {
        beginRange: '',
        endRange: '',
        name: '',
        createdById: '',
        status: '',
        page: '1',
        limit: '10'
      },
      createdByModel: '',
      createdByData: [],
      startTimeModel: '',
      endTimeModel: '',
      couponData: [],

      pageSize: 1,
      totalNumber: 0,
      aDialog: false,
      couponCodeModel: '',
      verifierDialog: false,
      editDialog: false,

      editInfo: null,
      stopDialog: false,
      currentStopId: 0,
      projectCodeModel: '',
      couponCodeStatus: '',
      verifierCouponCodeInfo: null,
      couponLink: '',
      showPersonWrap: false,
      isSelected: true,
      searchPersonLock: true
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      var params = this.formFilter
      api.initListData(params).then(res => {
        if (res.code === 300000) {
          let data = res.data
          this.couponData = this.formatInitData(data.data)
          this.formatStatus(this.couponData)
          this.formatCouponType(this.couponData)
          this.totalNumber = Number(data.total)
          this.pageSize = Number(data.per_page)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatCouponType (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === 1) {
          arr[i].type = '满减券'
        } else if (arr[i].type === 2) {
          arr[i].type = '满折券'
        } else if (arr[i].type === 3) {
          arr[i].type = '套餐券'
        }
      }
    },
    formatScopes (arr) {
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].scope === 1) {
          let item = {
            label: '设计服务(3w)',
            id: 1
          }
          newArr.push(item)
        } else if (arr[i].scope === 2) {
          let item = {
            label: '设计服务(5w)',
            id: 1
          }
          newArr.push(item)
        } else if (arr[i].scope === 3) {
          let item = {
            label: '设计服务(8w)',
            id: 1
          }
          newArr.push(item)
        } else if (arr[i].scope === 4) {
          let item = {
            label: '10w+设计服务',
            id: 1
          }
          newArr.push(item)
        } else if (arr[i].scope === 5) {
          let item = {
            label: '众创服务(1w)',
            id: 1
          }
          newArr.push(item)
        } else if (arr[i].scope === 6) {
          let item = {
            label: '众创服务(5k)',
            id: 1
          }
          newArr.push(item)
        } else if (arr[i].scope === 7) {
          let item = {
            label: '供应链(3w)',
            id: 1
          }
          newArr.push(item)
        }
      }
      return newArr
    },
    formatStatus (data) {
      for (let i = 0; i < data.length; i++) {
        if (Number(data[i].status) === 1) {
          data[i].status = '待审核'
        } else if (Number(data[i].status) === 2) {
          data[i].status = '待发放'
        } else if (Number(data[i].status) === 3) {
          data[i].status = '发放中'
        } else if (Number(data[i].status) === 4) {
          data[i].status = '驳回'
        } else if (Number(data[i].status) === 5) {
          data[i].status = '已停止'
        } else if (Number(data[i].status) === 6) {
          data[i].status = '已结束'
        }
      }
    },
    formatInitData (data) {
      var newData = []
      for (let i = 0; i < data.length; i++) {
        var item = {
          id: data[i].id,
          created_at: data[i].created_at,
          coupon_id: data[i].id,
          name: data[i].name,
          status: data[i].status,
          type: data[i].type,
          discount_amount: data[i].discount_amount,
          total_num: data[i].total_num,
          restricted_num: data[i].restricted_num,
          coupon_records_count: data[i].coupon_records_count,
          coupon_records_usage_count: data[i].coupon_records_usage_count,
          publish_time: data[i].available_from + ' 至 ' + data[i].available_until,
          valid_time: data[i].valid_from + ' 至 ' + data[i].valid_until,
          created_by: data[i].created_by,
          reviewed_by: data[i].reviewed_by,
          reviewed_at: data[i].reviewed_at,
          remark: data[i].remark,
          threshold: data[i].threshold,
          usage_rule: data[i].usage_rule,
          usage_cond: data[i].usage_cond,
          coupon_scopes: data[i].coupon_scopes,
          link: data[i].link,
          kind: data[i].kind,
          sub_kind: data[i].sub_kind,
          is_restricted_scope: data[i].is_restricted_scope,
          discount: data[i].discount
        }
        newData.push(item)
      }
      return newData
    },
    formatCouponCondition (condition) {
      if (Number(condition) === 1) {
        return '满减'
      } else {
        return '无金额限制'
      }
    },
    searchTableData () {
      this.initData()
    },
    changeCurrentPage (page) {
      this.formFilter.page = page
      this.initData()
    },
    exportTable () {
      var params = {
        beginRange: this.formFilter.beginRange,
        endRange: this.formFilter.endRange,
        name: this.formFilter.name,
        status: this.formFilter.status,
        createdById: this.formFilter.createdById
      }
      api.exportCoupon(params).then(res => {
        if (res.code === 300000) {
          let data = res.data
          window.location.href = data.url
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    isVerifierCoupon () {
      this.verifierDialog = false
      if (this.projectCodeModel !== '' && this.couponCodeModel !== '') {
        var data = {
          couponCode: this.couponCodeModel,
          projectCode: this.projectCodeModel
        }
        api.verifiriCoupon(data).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '验证成功',
              type: 'info'
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
        this.$message({
          showClose: true,
          message: '项目编号与优惠券编码不能为空',
          type: 'info'
        })
      }
    },
    getCouponCodeInfo () {
      // var params = {
      //   couponCode: this.couponCodeModel
      // }
      var code = this.couponCodeModel
      if (code !== '') {
        api.getCouponCodeInfo(code).then(res => {
          if (res.code === 300000) {
            let data = res.data
            if (data) {
              this.verifierCouponCodeInfo = data.coupon
              this.couponCodeStatus = this.formatCouponCodeStatus(data.status)
              this.verifierCouponCodeInfo.coupon_scopes = this.formatScopes(this.verifierCouponCodeInfo.coupon_scopes)
              this.verifierCouponCodeInfo.usage_cond = this.formatCouponCondition(this.verifierCouponCodeInfo.usage_cond)
            }
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
    formatCouponCodeStatus (status) {
      if (Number(status) === 1) {
        status = '待领取'
      } else if (Number(status) === 2) {
        status = '待使用'
      } else if (Number(status) === 3) {
        status = '已使用'
      } else if (Number(status) === 4) {
        status = '已过期'
      }
      return status
    },
    editCouponFn (info) {
      this.editDialog = true
      this.editInfo = info
      console.log(this.editInfo)
    },
    stopProgress (id) {
      this.stopDialog = true
      this.currentStopId = id
    },
    isStopProgress () {
      var id = this.currentStopId
      api.stopProgress(id).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '成功',
            type: 'success'
          })
          this.stopDialog = false
          this.initData()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    cancleFn () {
      this.editDialog = false
    },
    editSuccess () {
      this.editDialog = false
      this.initData()
    },
    showLink (coupon) {
      this.aDialog = true
      this.couponLink = coupon.link
    },
    copyUrl () {
      this.aDialog = false
      var e = document.getElementById('contents') // 获取textarea的id
      e.value = this.couponLink // 把标签的文本内容赋值给textarea
      e.select() // 选择textarea的文本内容
      document.execCommand('Copy') // 执行浏览器复制命令
    },
    getCreatByModel (index) {
      this.createdByModel = this.createdByData[index].name
      this.isSelected = false
      this.showPersonWrap = false
      this.formFilter.createdById = Number(this.createdByData[index].id) // 搜索时同步formFilter.creatBy与createdByModel
    },
    focusLock () {
      this.isSelected = true
    }
  },
  watch: {
    startTimeModel (time) {
      if (time) {
        this.formFilter.beginRange = this.startTimeModel
      } else {
        this.formFilter.beginRange = ''
      }
    },
    endTimeModel (time) {
      if (time) {
        this.formFilter.endRange = this.endTimeModel
      } else {
        this.formFilter.endRange = ''
      }
    },
    createdByModel (person) {
      // this.formFilter.createdById = person
      if (person && this.isSelected && this.searchPersonLock) {
        let params = {
          page: '1',
          limit: '30',
          key: 'name',
          value: person
        }
        api.searchPerson(params).then(res => {
          if (res.code === 300000) {
            let data = res.data
            this.createdByData = data.data
            if (!this.createdByData) {
              this.showPersonWrap = false
              this.formFilter.createdById = -1
            } else if (this.createdByData.length === 1) {
              this.showPersonWrap = true
              this.formFilter.createdById = ''
            } else {
              this.showPersonWrap = true
              this.formFilter.createdById = ''
            }
            this.searchPersonLock = false
            setTimeout(() => {
              this.searchPersonLock = true
            }, 100)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'info'
            })
          }
        })
      }
    }
  },
  components: {
    couponEdit
  }
}
</script>
<style lang="scss" scoped>
$row-distance: 10px;
.coupon-wrap {
  padding: 10px;
  .el-row {
    margin-bottom: $row-distance;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .select-wrap {
    padding: 10px 20px;
    border: 1px dashed #c9c9c9;
    .creat-by-wrap {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      position: absolute;
      top: 34px;
      left: 0;
      z-index: 1;
      background: #ffffff;
      max-height: 200px;
      overflow: auto;
      li {
        box-sizing: border-box;
        padding-left: 12px;
        color: #606266;
        &:hover {
          background: #f5f7fa;
        }
      }
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
  .vertifi-coupon-code-wrap {
    padding-top: 10px;
  }
}
</style>
