<template>
  <div class="quote-detail-wrap">
    <div>
      <el-row>
        <template>
          <el-tabs v-model="currentTag" type="card" @tab-click="changeTag">
            <el-tab-pane v-for="(item, index) in tagData" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
          </el-tabs>
        </template>
      </el-row>
      <div v-if="currentTag === '详情'">
        <el-row>
          <h4>基本信息</h4>
        </el-row>
        <el-card class="box-card">
          <el-row class="quote-info-wrap" v-if="basicInfoData">
            <div class="info-item-wrap"><span>公司名称：</span> <span>{{basicInfoData.company_name}}</span></div>
            <div class="info-item-wrap"><span>报价单号：</span> <span>{{basicInfoData.id}}</span></div>
            <div class="info-item-wrap"><span>报价单状态：</span> <span>{{basicInfoData.status}}</span></div>
            <div class="info-item-wrap"><span>创建时间：</span> <span>{{basicInfoData.created_at}}</span></div>
            <div class="info-item-wrap"><span>联系人：</span> <span>{{basicInfoData.contact_name}}</span></div>
            <div class="info-item-wrap"><span>联系方式：</span> <span>{{basicInfoData.contact_phone}}</span></div>
            <!-- <div class="info-item-wrap"><span>电子邮箱：</span> <span>{{basicInfoData.email}}</span></div> -->
            <div class="info-item-wrap"><span>报价有效期：</span> <span>{{basicInfoData.valid_until}}</span></div>
            <div class="info-item-wrap"><span>客户网站账号：</span> <span>{{basicInfoData.company_phone}}</span></div>
            <div class="info-item-wrap"><span>创建人：</span> <span>{{basicInfoData.created_by_name}}</span></div>
          </el-row>
        </el-card>
        <el-row v-if="projectData && projectData.length !== 0">
          <div v-for="(item, index) in projectData" :key="index" class="project-table">
            <h4>项目{{index + 1}}</h4>
            <el-card class="box-card">
              <div style="margin: 10px 0;" class="clear">
                <div style="display: inline-block;float: left;margin-top: 5px;">
                  <span style="margin-left: 20px;">项目名称：</span><span>{{projectData[index].name}}</span>
                  <span style="margin-left: 20px;">项目类型：</span><span>{{projectData[index].type | protectTypeTransform}}</span>
                  <span style="margin-left: 20px;">产品名称：</span><span>{{projectData[index].product_name}}</span>
                  <span style="margin-left: 20px;">客户需求书：</span>
                  <!-- <span>{{projectData[index].demand_book}}</span> -->
                </div>
                <el-button v-if="projectData[index].demand_book" type="text" size="small" style="float: left;margin-left: 20px;" @click="downloadBook(projectData[index].demand_book)">下载</el-button>
                <div style="display: inline-block;float: left;margin-left: 20px;">
                  <upload
                    v-if="!projectData[index].demand_book"
                    :upfileSize='3072'
                    :upLimit="10"
                    :upfileType="'file'"
                    :file-list="realfileList"
                    @urlCB="uploadSuccessReally"
                    :textTypeBtn="true"
                    :isCover="true"></upload>
                </div>
              </div>
              <template>
                <el-table
                  border
                  :data="projectData[index].services"
                  style="width: 100%">
                  <el-table-column
                    prop="id"
                    label="序号"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="服务">
                  </el-table-column>
                  <el-table-column
                    label="单价(元)">
                    <template slot-scope="scope">
                      <li v-if="!scope.row.customize_price || scope.row.customize_price == 0">{{ scope.row.price}}</li>
                      <li v-else>{{ scope.row.customize_price}}</li>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    label="购买数量">
                  </el-table-column>
                  <el-table-column
                    label="服务人员(个/名)">
                    <template slot-scope="scope">
                      <li :style="{'border-bottom' : i === (scope.row.service_participants.length - 1) ? 'none' : '1px solid #ebeef5' }" v-for="(presonItem, i) in scope.row.service_participants" :key="i">{{presonItem.name}}：{{presonItem.num}}名</li>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="240"
                    label="服务细目">
                    <template slot-scope="scope">
                      <li style="position: relative; overflow:hidden" v-for="(detailsItem, i) in scope.row.details" :key="i" :style="{'border-bottom' : i === (scope.row.details.length - 1) ? 'none' : '1px solid #ebeef5', 'height' : detailsItem.is_selected == 1 ? (detailsItem.outputs.length <= 1 ? '70px' : detailsItem.outputs.length * 70 + 'px') : 0}">
                        <span class="position-center server-item" v-if="detailsItem.is_selected == 1">{{detailsItem.name}}</span>
                      </li>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="period"
                    label="周期(项/天)">
                    <template slot-scope="scope">
                      <li style="position: relative; overflow:hidden" v-for="(detailsItem, i) in scope.row.details" :key="i" :style="{'border-bottom' : i === (scope.row.details.length - 1) ? 'none' : '1px solid #ebeef5', 'height' : detailsItem.is_selected == 1 ? (detailsItem.outputs.length <= 1 ? '70px' : detailsItem.outputs.length * 70 + 'px') : 0}">
                        <span class="position-center">{{detailsItem.period}}</span>
                      </li>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="240"
                    label="产出物">
                    <template slot-scope="scope">
                      <li style="position: relative; overflow:hidden" v-for="(detailsItem, i) in scope.row.details" :key="i" :style="{'border-bottom' : i === (scope.row.details.length - 1) ? 'none' : '1px solid #ebeef5', 'height' : detailsItem.is_selected == 1 ? (detailsItem.outputs.length <= 1 ? '70px' : detailsItem.outputs.length * 70 + 'px') : 0}">
                        <div v-if="detailsItem.is_selected == 1" style="position: relative;height: 70px" :style="{'border-bottom' : j === (detailsItem.outputs.length - 1) ? 'none' : '1px solid #ebeef5'}" v-for="(outputsItem, j) in detailsItem.outputs" :key="j">
                          <span v-if="outputsItem.is_selected == 1"  class="position-center">{{outputsItem.name}}</span>
                        </div>
                      </li>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <el-row style="margin-top:20px;">
                合计： 服务数量<span style="color: red">{{projectData.length}}</span>个，订单合计<span style="color: red">{{projectData[index].amount}}</span>元，优惠合计<span style="color: red">{{projectData[index].discount_price}}</span>  元。
              </el-row>
            </el-card>
            <!-- <el-row style="width: 300px;margin-top:20px;">
              <template>
                <el-table
                  border
                  :data="projectData[index].participants"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="服务人"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    label="人数">
                  </el-table-column>
                </el-table>
              </template>
            </el-row> -->
          </div>
        </el-row>
        <el-card class="box-card">
          <div>
            <span>备注:</span><span v-if="basicInfoData.remark">{{basicInfoData.remark}}</span>
          </div>
        </el-card>
        <el-card class="box-card" v-if="feedback && feedback.length !== 0">
          <el-row>
            <h4 style="margin-bottom:10px;">反馈原因</h4>
            <div v-for="(item, index) in feedback" :key="index">
              <div style="margin-top:10px;">
                <span>{{item.created_at}}</span><span style="margin-left: 20px;">{{item.text}}</span>
              </div>
            </div>
          </el-row>
        </el-card>
        <el-row style="text-align: center" v-if="basicInfoData">
          <el-button type="primary" size="small" @click="downloadQuote">下载报价单</el-button>
          <router-link :to="`/quote/add-quote/${basicInfoData.id}/edit`">
            <el-button type="primary" size="small" style="margin-left: 20px;">编辑</el-button>
          </router-link>
          <el-button type="primary" size="small" style="margin-left: 20px;" @click="dropQuotation" v-if="basicInfoData.status !== 5" v-permission="'v1.quotation.quotations.drop'">作废</el-button>
        </el-row>
      </div>
      <div>
        <div v-if="currentTag === '操作记录'" v-permission="'v1.quotation.quotations.view.logs'">
          <el-table
            :data="recordTableData"
            style="width: 100%;">
            <el-table-column
              prop="created_at"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="type"
              label="角色">
            </el-table-column>
            <el-table-column
              prop="operator_name"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="content"
              label="操作内容">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/quote/quote'
import upload from '@/components/Upload/upload.vue'
export default {
  name: 'quote-detail',
  data () {
    return {
      currentTag: '详情',
      tagData: [
        {
          label: '详情',
          name: '详情'
        },
        {
          label: '操作记录',
          name: '操作记录'
        }
      ],
      basicInfoData: null,
      recordTableData: [],
      projectData: [],
      participants: [],
      feedback: [],
      realfileList: []
    }
  },
  filters: {
    protectTypeTransform (val) {
      if (val === 1) {
        return '好产品打造'
      } else if (val === 2) {
        return '文创产品'
      } else if (val === 3) {
        return '其他'
      }
    }
  },
  created () {
    this.currentId = this.$route.params.id
    this.getQuoteInfo()
    this.getQuoteLogs()
  },
  methods: {
    getQuoteLogs () {
      api.getQuoteLogs(this.currentId).then(res => {
        if (res.code === 300000) {
          this.recordTableData = res.data
          this.formatType(this.recordTableData)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    getQuoteInfo () {
      api.getQuoteInfo(this.currentId).then(res => {
        if (res.code === 300000) {
          this.basicInfoData = res.data
          this.formatStatus(res.data)
          this.feedback = res.data.feedback
          this.projectData = res.data.projects
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatType (data) {
      for (let i = 0; i < data.length; i++) {
        if (Number(data[i].type) === 1) {
          data[i].type = '运营'
        } else if (Number(data[i].type) === 2) {
          data[i].type = '客户'
        } else if (Number(data[i].type) === 3) {
          data[i].type = '系统'
        } else if (Number(data[i].type) === 4) {
          data[i].type = '设计'
        }
      }
    },
    changeTag (tag) {
      this.currentTag = tag.name
    },
    uploadSuccessReally (obj, kk) {
      var data = {
        demand_book: obj.file_url
      }
      api.updateQuote(this.currentId, data).then(res => {
        if (res.code === 300000) {
          this.getQuoteInfo()
          this.getQuoteLogs()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    dropQuotation () {
      api.dropQuotation(this.currentId).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '作废成功',
            type: 'success'
          })
          this.$router.push({path: '/quote'})
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    downloadBook (bookHref) {
      window.location.href = bookHref
    },
    downloadQuote () {
      window.location.href = this.basicInfoData.pdf_url
    },
    formatStatus (data) {
      if (Number(data.status) === 1) {
        data.status = '待确认'
      } else if (Number(data.status) === 2) {
        data.status = '已确认'
      } else if (Number(data.status) === 3) {
        data.status = '已驳回'
      } else if (Number(data.status) === 4) {
        data.status = '已取消'
      } else if (Number(data.status) === 5) {
        data.status = '已作废'
      }
    }
  },
  watch: {
  },
  components: {
    upload
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 15px;
  .quote-detail-wrap {
    box-sizing: border-box;
    padding: $row-distance;
    font-size: 14px;
    color: #606266;
    .box-card {
      margin: 20px 0;
    }
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .quote-info-wrap {
      box-sizing: border-box;
      line-height: 40px;
      .info-item-wrap {
        display: inline-block;
        margin-left: 60px;
        white-space: nowrap;
        span:nth-child(1) {
          font-weight: bold;
        }
      }
    }
    .position-center {
      display: inline-block;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .server-item {
      width: 230px;
    }
    .clear {
      &:after{
        content:"";
        display:block;
        visibility:hidden;
        clear:both;
        height:0;
      }
    }
  }
</style>
<style lang="scss">
  .project-table {
    .el-table {
      th {
        text-align: center;
      }
      td {
        padding: 0;
        text-align: center;
      }
      .cell {
        padding: 0;
      }
    }
  }
</style>
