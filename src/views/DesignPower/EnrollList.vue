<template>
  <div>
    <el-form
      :inline="true">
      <el-form-item
        label="报名编号">
        <el-input v-model.number="formData.enrollId"></el-input>
      </el-form-item>
      <el-form-item
        label="真实姓名">
        <el-input v-model="formData.realName"></el-input>
      </el-form-item>
      <el-form-item
        label="昵称">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item
        label="设计范围">
        <el-select v-model="formData.designRange">
          <el-option :value="-1" label="全部"></el-option>
          <el-option v-for="(v, k) in designRange" :key="k" :value="Number(Object.keys(v)[0])" :label="v[Object.keys(v)[0]]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="工作年限">
        <el-select v-model="formData.workYear">
          <el-option :value="-1" label="全部"></el-option>
          <el-option :value="0" label="在校生"></el-option>
          <el-option :value="1" label="1-3年"></el-option>
          <el-option :value="2" label="3-5年"></el-option>
          <el-option :value="3" label="5-8年"></el-option>
          <el-option :value="4" label="8年以上"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="擅长领域">
        <el-cascader
          v-model="formData.category"
          :props="{label: 'name', value: 'id', children: 'subCate'}"
          :options="category"
          ></el-cascader>
      </el-form-item>
      <el-form-item
        label="报名时间">
        <el-date-picker
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="formData.time"></el-date-picker>
      </el-form-item>
      <el-form-item
        label="审核状态">
        <el-select v-model="formData.verifyStatus">
          <el-option :value="-1" label="全部"></el-option>
          <el-option :value="0" label="未审核"></el-option>
          <el-option :value="1" label="审核待定"></el-option>
          <el-option :value="2" label="审核通过"></el-option>
          <el-option :value="3" label="审核拒绝"></el-option>
          <el-option :value="4" label="入围30"></el-option>
          <el-option :value="5" label="入围100"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="邦德等级">
        <el-select v-model="formData.bondLevel">
          <el-option :value="-1" label="全部"></el-option>
          <el-option :value="0" label="等待审核"></el-option>
          <el-option :value="1" label="001"></el-option>
          <el-option :value="2" label="002"></el-option>
          <el-option :value="3" label="003"></el-option>
          <el-option :value="4" label="004"></el-option>
          <el-option :value="5" label="005"></el-option>
          <el-option :value="6" label="006"></el-option>
          <el-option :value="7" label="007"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="筛选范围">
        <el-select v-model="formData.filterRange">
          <el-option :value="-1" label="全部"></el-option>
          <el-option :value="1" label="只看大厂"></el-option>
          <el-option :value="2" label="只看获奖"></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="search(1)">搜索</el-button>
      <el-button @click="multiVerify">批量审核</el-button>
      <el-button @click="exportData">导出</el-button>
    </el-form>
    <el-row>
      <div style="margin-top: 10px; margin-bottom: 10px; color: #333;">
        总报名：{{enrollNumber.total}}  ｜  未审核：{{enrollNumber.s0}}  ｜  初审待定：{{enrollNumber.s1}} ｜ 审核通过： {{enrollNumber.s2}} ｜ 审核拒绝： {{enrollNumber.s3}} ｜ 入围30： {{enrollNumber.s4}} ｜ 入围100： {{enrollNumber.s5}}
      </div>
    </el-row>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"></el-table-column>
      <el-table-column
        label="报名编号/报名时间">
        <template slot-scope="ss">
          <div>{{ss.row.id}}</div>
          <div>{{ss.row.created_at}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="真实姓名/昵称">
        <template slot-scope="ss">
          <div>{{ss.row.real_name}}</div>
          <div>{{ss.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="头像">
        <template slot-scope="ss">
          <img class="table-head-image" :src="ss.row.head_image" alt="head">
        </template>
      </el-table-column>
      <el-table-column
        label="设计范围/擅长领域">
        <template slot-scope="ss">
          <div>{{ss.row.designer_range}}</div>
          <div>{{ss.row.owned_industry}}{{ss.row.sub_industry ? '-' + ss.row.sub_industry : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="邦德等级"
        prop="bond_level"></el-table-column>
      <el-table-column
        label="工作年限"
        prop="work_year"></el-table-column>
      <el-table-column
        label="工作经历"
        prop="workHistory"></el-table-column>
      <el-table-column
        label="教育经历"
        prop="collegeHistory"></el-table-column>
      <el-table-column
        label="最新审核信息">
        <template slot-scope="ss">
          <div>状态: {{getVerifyStatusText(ss.row.verify_status)}}</div>
          <div v-if="ss.row.remark">意见: {{ss.row.remark}}</div>
          <div v-if="ss.row.operateName">审核人: {{ss.row.operateName}}</div>
          <div v-if="ss.row.updated_at">时间: {{ss.row.updated_at}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="ss">
          <el-button type="text" @click="verify(ss)">审核</el-button>
          <el-button type="text" @click="toDetail(ss.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changePage"
      :current-page="pagination.currentPage"
      :total="pagination.totalItem"></el-pagination>
    <el-dialog
      title="设计师合伙人审核"
      :visible.sync="dialogVisible">
      <div>
        <h4>报名信息</h4>
        <div>昵称：{{verifyForm.name}}</div>
        <div>报名编号：{{verifyForm.id}}</div>
        <div>报名时间：{{verifyForm.createdAt}}</div>
      </div>
      <el-form
        ref="verifyForm"
        :rules="rules"
        :model="verifyForm">
        <h4>审核结果</h4>
        <el-form-item
          prop="verifyStatus"
          label="是否通过">
          <el-radio-group v-model="verifyForm.verifyStatus">
            <el-radio :label="1">待定</el-radio>
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="quality"
          v-if="verifyForm.verifyStatus == 1"
          label="是否优质">
          <el-radio-group v-model="verifyForm.quality">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="refuseType"
          v-if="verifyForm.verifyStatus == 3"
          label="拒绝理由">
          <el-select v-model="verifyForm.refuseType">
            <el-option :value="1" label="作品图面不清晰，请重新上传"></el-option>
            <el-option :value="2" label="请上传个人原创作品"></el-option>
            <el-option :value="3" label="请填写您的真实个人信息"></el-option>
            <el-option :value="4" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="refuseReason"
          v-if="verifyForm.verifyStatus == 3 && verifyForm.refuseType == 4"
          label="填写拒绝理由">
          <el-input type="textarea" v-model="verifyForm.refuseReason"></el-input>
        </el-form-item>
        <el-form-item
          prop="remark"
          v-if="verifyForm.verifyStatus == 1 || verifyForm.verifyStatus == 2 || verifyForm.verifyStatus == 3"
          label="备注">
          <el-input type="textarea" v-model="verifyForm.remark"></el-input>
        </el-form-item>
        <div v-if="verifyForm.originCertifyState != 1">
          <h4>邦德认证</h4>
          <el-form-item
            prop="bondVerify"
            label="邦德认证">
            <el-radio-group v-model="verifyForm.bondVerify">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="verifyForm.bondVerify == 1"
            prop="bondLevel"
            label="邦德等级">
            <el-select v-model="verifyForm.bondLevel">
              <el-option :value="1" label="1"></el-option>
              <el-option :value="2" label="2"></el-option>
              <el-option :value="3" label="3"></el-option>
              <el-option :value="4" label="4"></el-option>
              <el-option :value="5" label="5"></el-option>
              <el-option :value="6" label="6"></el-option>
              <el-option :value="7" label="7"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <slot name="footer">
        <el-button type="primary" @click="ensureVerify">确定</el-button>
        <el-button @click="cancelDialog">取消</el-button>
      </slot>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible1">
      <div>
        <h4>初审意见</h4>
        <div v-if="verifyForm.originVerifyStatus == 2">
          <div>设计师身份：邦德{{verifyForm.originBondLevel}}级</div>
          <div>合伙人审核：通过</div>
          <div>审核人：{{verifyForm.originOperateName}}</div>
          <div>审核时间：{{verifyForm.originUpdatedAt}}</div>
        </div>
        <div v-if="verifyForm.originVerifyStatus == 3">
          <div>拒绝理由：{{verifyForm.originRefuseReason}}</div>
          <div>备注：{{verifyForm.originRemark}}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="设计师合伙人审核"
      :visible.sync="dialogVisible2">
      <div>
        <h4>报名信息</h4>
        <div>已选报名人数：{{multiArrId.length}}</div>
      </div>
      <el-form
        ref="multiVerifyForm"
        :rules="rules"
        :model="multiVerifyForm">
        <h4>审核结果</h4>
        <el-form-item
          prop="verifyStatus"
          label="是否通过">
          <el-radio-group v-model="multiVerifyForm.verifyStatus">
            <el-radio :label="1">待定</el-radio>
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="quality"
          v-if="multiVerifyForm.verifyStatus == 1"
          label="是否优质">
          <el-radio-group v-model="multiVerifyForm.quality">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="refuseType"
          v-if="multiVerifyForm.verifyStatus == 3"
          label="拒绝理由">
          <el-select v-model="multiVerifyForm.refuseType">
            <el-option :value="1" label="作品图面不清晰，请重新上传"></el-option>
            <el-option :value="2" label="请上传个人原创作品"></el-option>
            <el-option :value="3" label="请填写您的真实个人信息"></el-option>
            <el-option :value="4" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="refuseReason"
          v-if="multiVerifyForm.verifyStatus == 3 && multiVerifyForm.refuseType == 4"
          label="填写拒绝理由">
          <el-input type="textarea" v-model="multiVerifyForm.refuseReason"></el-input>
        </el-form-item>
        <el-form-item
          prop="remark"
          v-if="multiVerifyForm.verifyStatus == 1 || multiVerifyForm.verifyStatus == 2 || multiVerifyForm.verifyStatus == 3"
          label="备注">
          <el-input type="textarea" v-model="multiVerifyForm.remark"></el-input>
        </el-form-item>
        <div v-if="multiVerifyForm.originCertifyState != 1">
          <h4>邦德认证</h4>
          <el-form-item
            prop="bondVerify"
            label="邦德认证">
            <el-radio-group v-model="multiVerifyForm.bondVerify">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="multiVerifyForm.bondVerify == 1"
            prop="bondLevel"
            label="邦德等级">
            <el-select v-model="multiVerifyForm.bondLevel">
              <el-option :value="1" label="1"></el-option>
              <el-option :value="2" label="2"></el-option>
              <el-option :value="3" label="3"></el-option>
              <el-option :value="4" label="4"></el-option>
              <el-option :value="5" label="5"></el-option>
              <el-option :value="6" label="6"></el-option>
              <el-option :value="7" label="7"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <slot name="footer">
        <el-button type="primary" @click="ensureMultiVerify">确定</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </slot>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      designRange: [],
      category: [],
      tableData: [{
        award: '',
        big_factory: '',
        bond_level: '',
        certify_state: '',
        collegeHistory: '',
        created_at: '',
        designer_range: '',
        head_image: '',
        id: '',
        name: '',
        operateName: '',
        owned_industry: '',
        phone: '',
        quality: '',
        real_name: '',
        refuse_reason: '',
        remark: '',
        updated_at: '',
        user_id: '',
        verify_status: '',
        verify_user: '',
        workHistory: '',
        work_year: ''
      }],
      formData: {
        startTime: '',
        endTime: '',
        time: null,
        verifyStatus: -1,
        filterRange: -1,
        quality: -1,
        enrollId: '',
        userName: '',
        realName: '',
        bondLevel: -1,
        designRange: -1,
        workYear: -1,
        industry: '',
        subIndustry: '',
        category: ['', ''],
        page: 1
      },
      pagination: {
        totalItem: 0,
        currentPage: 1
      },
      rules: {
        name: [
          {required: true, message: '必填项'}
        ],
        id: [
          {required: true, message: '必填项'}
        ],
        createdAt: [
          {required: true, message: '必填项'}
        ],
        verifyStatus: [
          {required: true, message: '必填项'}
        ],
        quality: [
          {required: true, message: '必填项'}
        ],
        remark: [
          {required: true, message: '必填项'}
        ],
        certifyState: [
          {required: true, message: '必填项'}
        ],
        bondLevel: [
          {required: true, message: '必填项'}
        ],
        refuseReason: [
          {required: true, message: '必填项'}
        ],
        refuseType: [
          {required: true, message: '必填项'}
        ],
        bondVerify: [
          {required: true, message: '必填项'}
        ]
      },
      verifyForm: {
        name: '',
        id: '',
        createdAt: '',
        verifyStatus: '',
        quality: '',
        remark: '',
        certifyState: '',
        bondLevel: '',
        refuseReason: '',
        refuseType: '',
        originCertifyState: '',
        bondVerify: ''
      },
      multiArrId: [],
      multiVerifyForm: {
        arrId: [],
        verifyStatus: '',
        remark: '',
        quality: '',
        refuseType: '',
        refuseReason: '',
        bondLevel: '',
        bondVerify: ''
      },
      enrollNumber: {
        total: 0,
        s0: 0,
        s1: 0,
        s2: 0,
        s3: 0,
        s4: 0,
        s5: 0
      }
    }
  },
  methods: {
    toDetail (row) {
      this.$router.push('/design-power/designer/' + row.user_id)
    },
    exportData () {
      var params = Object.assign({}, this.formData)
      if (params.time === null) {
        params.startTime = ''
        params.endTime = ''
      } else {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      }
      params.industry = params.category[0]
      params.subIndustry = params.category[1]
      if (params.enrollId == '') {
        params.enrollId = -1
      }
      if (params.industry == '') {
        params.subIndustry = ''
      }
      delete params.time
      delete params.category
      delete params.page

      request({
        url: '/v1/designer/export-enroll-list',
        type: 'get',
        params: params
      }).then(data => {
      })
    },
    search (page) {
      var params = Object.assign({}, this.formData)
      if (params.time === null) {
        params.startTime = ''
        params.endTime = ''
      } else {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      }
      params.industry = params.category[0]
      params.subIndustry = params.category[1]
      if (params.enrollId == '') {
        params.enrollId = -1
      }
      if (page) {
        params.page = page
        this.pagination.currentPage = page
      }
      if (params.industry == '') {
        params.subIndustry = ''
      }
      delete params.time
      delete params.category

      request({
        url: '/v1/designer/partner-enroll-list',
        type: 'get',
        params: params
      }).then(data => {
        this.tableData = data.data.list.data
        this.pagination.totalItem = data.data.list.total
      })
    },
    handleSelectionChange (arr) {
      var that = this
      this.multiArrId = []
      arr.forEach(function (v) {
        that.multiArrId.push(v.id)
      })
    },
    multiVerify () {
      this.dialogVisible2 = true
      this.multiVerifyForm.arrId = this.multiArrId
    },
    ensureMultiVerify () {
      if (this.multiVerifyForm.refuseType == 1) {
        this.multiVerifyForm.refuseReason = '作品图面不清晰，请重新上传'
      } else if (this.multiVerifyForm.refuseType == 2) {
        this.multiVerifyForm.refuseReason = '请上传个人原创作品'
      } else if (this.multiVerifyForm.refuseType == 3) {
        this.multiVerifyForm.refuseReason = '请填写您的真实个人信息'
      }
      this.$refs['multiVerifyForm'].validate(valid => {
        if (valid) {
          request({
            url: '/v1/designer/batch-enroll-verify',
            method: 'post',
            data: this.multiVerifyForm
          }).then(data => {
            if (data.code == 300000) {
              this.$router.go(0)
            } else {
              this.$message(data.msg)
            }
          })
        }
      })
    },
    verify (obj) {
      var that = this
      if (obj.row.verify_status == 0 || obj.row.verify_status == 1) {
        this.dialogVisible = true
      } else if (obj.row.verify_status == 2 || obj.row.verify_status == 3) {
        this.dialogVisible1 = true
      }
      this.verifyForm.name = obj.row.name
      this.verifyForm.id = obj.row.id
      this.verifyForm.createdAt = obj.row.created_at
      this.verifyForm.bondVerify = ''
      this.verifyForm.quality = obj.row.quality
      this.verifyForm.remark = obj.row.remark
      this.verifyForm.originRemark = obj.row.remark
      this.verifyForm.verifyStatus = obj.row.verify_status
      this.verifyForm.originCertifyState = obj.row.certify_state
      this.verifyForm.originVerifyStatus = obj.row.verify_status
      this.verifyForm.originUpdatedAt = obj.row.updated_at
      this.verifyForm.bondLevel = ''
      this.verifyForm.originBondLevel = obj.row.bond_level
      this.verifyForm.refuseReason = ''
      this.verifyForm.originRefuseReason = obj.row.refuse_reason
      this.verifyForm.refuseType = ''
      this.verifyForm.originOperateName = obj.row.operateName

      var arr = Object.keys(this.verifyForm)
      arr.forEach(function (v, k) {
        if (that.verifyForm[v] === null) {
          that.verifyForm[v] = ''
        }
      })
    },
    ensureVerify () {
      if (this.verifyForm.refuseType == 1) {
        this.verifyForm.refuseReason = '作品图面不清晰，请重新上传'
      } else if (this.verifyForm.refuseType == 2) {
        this.verifyForm.refuseReason = '请上传个人原创作品'
      } else if (this.verifyForm.refuseType == 3) {
        this.verifyForm.refuseReason = '请填写您的真实个人信息'
      }
      this.$refs['verifyForm'].validate(valid => {
        if (valid) {
          request({
            url: '/v1/designer/' + this.verifyForm.id + '/enroll-verify',
            method: 'patch',
            data: this.verifyForm
          }).then(data => {
            this.$router.go(0)
          })
        }
      })
    },
    getVerifyStatusText (num) {
      var str
      switch (num) {
      case 0:
        str = '未审核'
        break
      case 1:
        str = '审核待定'
        break
      case 2:
        str = '审核通过'
        break
      case 3:
        str = '未通过审核'
        break
      }
      return str
    },
    cancelDialog () {
      this.$refs['verifyForm'].resetFields()
      this.dialogVisible = false
    },
    changePage (page) {
      this.search(page)
    }
  },
  mounted () {
    var that = this
    request({
      url: '/v1/designer/partner-enroll-list',
      method: 'get',
      params: {}
    }).then(data => {
      this.tableData = data.data.list.data
      that.pagination.totalItem = data.data.list.total
      for (let p in data.data.designRange) {
        var obj = {}
        obj[p] = data.data.designRange[p]
        that.designRange.push(obj)
      }
      that.category = data.data.categoryData
      that.category.unshift({id: '', name: '全部'})
      // 人数统计
      data.data.enrollNum.forEach(function (v) {
        if (v.verify_status == 0) {
          that.enrollNumber.s0 = v.num
        }
        if (v.verify_status == 1) {
          that.enrollNumber.s1 = v.num
        }
        if (v.verify_status == 2) {
          that.enrollNumber.s2 = v.num
        }
        if (v.verify_status == 3) {
          that.enrollNumber.s3 = v.num
        }
        if (v.verify_status == 4) {
          that.enrollNumber.s4 = v.num
        }
        if (v.verify_status == 5) {
          that.enrollNumber.s5 = v.num
        }
      })
      that.enrollNumber.total = that.enrollNumber.s0 + that.enrollNumber.s1 + that.enrollNumber.s2 + that.enrollNumber.s3 + that.enrollNumber.s4 + that.enrollNumber.s5
    })
  }
}
</script>

<style scoped>
  .table-head-image {
    width: 100px;
    height: 100px;
  }
</style>
