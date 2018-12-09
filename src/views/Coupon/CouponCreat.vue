<template>
  <div class="creat-wrap">
    <el-row>
      <h4 style="text-derection: under-line">基本信息</h4>
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 26px;">*</span>
      <span class="fl ml5">优惠券名称：</span>
      <el-input style="width: 200px;" class="fl ml10" v-model="nameModel"></el-input>
      <span class="fl ml10">优惠券</span>
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 68px;">*</span><span class="fl ml5">类型：</span>
      <el-select v-model="typeModel" placeholder="请选择" class="ml10">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
       <!-- <p style="width: 200px;" class="fl ml10">减满券</p> -->
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 25px;">*</span><span class="fl ml5">优惠券种类：</span>
      <el-cascader
        class="ml10"
        :options="sortOptions"
        v-model="sortModel"
        @change="sortHandleChange">
      </el-cascader>
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 40px;">*</span>
      <span class="fl ml5">领取时间：</span>
      <div class="fl ml10">
        <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="lqStartTimeModel" style="width: 100%;"></el-date-picker>
      </div>
      <span class="fl ml10">至</span>
      <div class="fl ml10">
        <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="lqEndTimeModel" style="width: 100%;"></el-date-picker>
      </div>
    </el-row>

    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 12px;">*</span>
      <span class="fl ml5">优惠券有效期：</span>
      <div class="fl ml10">
        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="valiStartTimeModel" style="width: 100%;"></el-date-picker>
      </div>
      <span class="fl ml10">至</span>
      <div class="fl ml10">
        <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="valiEndTimeModel" style="width: 100%;"></el-date-picker>
      </div>
    </el-row>
    <el-row style="margin-top: 20px;">
      <span class="fl" style="color:red;margin-left: 40px;">*</span>
      <span class="fl ml5">使用范围：</span>
      <div class="fl ml10">
        <!-- <template>
          <el-checkbox-group
            v-model="useRangeModel">
            <el-checkbox v-for="item in useRangeData" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </template> -->
        <template>
          <el-radio v-model="newRangeModel" label="0">无限制</el-radio>
          <el-radio v-model="newRangeModel" label="1">指定分类</el-radio>
        </template>
      </div>
      <div class="fl" style="margin-top: -5px;margin-left: 30px;" v-if="newRangeModel == 1">
        <el-button type="primary" size="small" @click="treeDialog = true">选择分类</el-button>
      </div>
    </el-row>
    <el-row>
      <hr>
    </el-row>

    <el-row>
      <h4 style="text-derection: under-line">面值信息</h4>
    </el-row>
    <el-row class="coupon-info clear" v-if="typeModel == 1 || typeModel == 3">
      <span class="fl" style="color:red;margin-left: 20px;">*</span>
      <span class="fl ml5">优惠金额：</span>
      <el-input style="width: 200px;" class="fl ml10" v-model="discountAmountModel"></el-input>
      <span class="fl ml10">元</span>
    </el-row>
    <el-row class="coupon-info clear" v-if="typeModel == 2">
      <span class="fl" style="color:red;margin-left: 20px;">*</span>
      <span class="fl ml5">优惠折扣：</span>
      <el-input style="width: 200px;" class="fl ml10" v-model="discountModel"></el-input>
      <span class="fl ml10">折</span>
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 20px;margin-top: 3px">*</span>
      <span class="fl ml5" style="margin-top: 3px">使用条件：</span>
      <div class="fl ml10">
        <template>
          <el-radio v-model="useConditionModel" label="1">
            满<el-input style="width: 160px;" class="ml10" :disabled="canUseInput" v-model="useConditionMoneyModel"></el-input>
            <span class="ml10">元可使用</span>
          </el-radio>
          <el-row>
            <el-radio v-model="useConditionModel" label="2">无金额限制 </el-radio>
          </el-row>
        </template>
      </div>
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 20px;">*</span>
      <span class="fl ml5">发行数量：</span>
      <el-input style="width: 200px;" class="fl ml10" v-model="totalNumModel"></el-input>
      <span class="fl ml10">张</span>
    </el-row>
    <el-row class="coupon-info clear">
      <span class="fl" style="color:red;margin-left: 20px;">*</span>
      <span class="fl ml5">每人限领：</span>
      <div class="fl ml10">
        <el-select v-model="restrictedNumModel">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </div>
      <span class="fl ml10">张</span>
    </el-row>
    <el-row>
      <hr>
    </el-row>

    <el-row>
      <h4 style="text-derection: under-line">*使用规则</h4>
    </el-row>
    <el-row>
      <el-input class="coupon-use-rule" type="textarea" v-model="usageRuleModel"></el-input>
    </el-row>
    <el-row>
      <h4 style="text-derection: under-line">*备注</h4>
    </el-row>
    <el-row>
      <el-input type="textarea" placeholder="请概述创建原因" v-model="remarkModel"></el-input>
    </el-row>
    <el-row style="text-align: center">
      <el-button v-if="this.currentTag === 'creat'" type="primary" size="small" @click="creatCancleFn">取消</el-button>
      <el-button v-if="this.currentTag === 'edit'" type="primary" size="small" @click="editCancleFn">取消</el-button>
      <el-button type="primary" size="small" @click="creatCouponFn">确定</el-button>
    </el-row>
    <el-dialog :width="'700px'" title="" :visible.sync="leaveCreatDialog" >
      <div style="text-align: center">
        是否放弃创建优惠券？
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" @click="leaveCeratFn">确定</el-button>
        <el-button type="primary" size="small" @click="leaveCreatDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :width="'700px'" title="" :visible.sync="treeDialog" :modal="editInfo ? false : true">
      <el-row>
        <h3>请选择品类</h3>
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          @check-change="changeCurrentSeleted">
        </el-tree>
      </el-row>
      <el-row>
        <hr>
      </el-row>
      <div>
        <h3>已选择品类</h3>
        <div class="clear">
          <div class="has-seleted-wrap" v-for="(item, index) in hasSelectedData" :key="index">
            <div class="close" @click="deleteSeletedTree(index)">x</div>
            <div class="target-content">{{item.name}}</div>
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" @click="treeDialog = false">取消</el-button>
        <el-button type="primary" size="small" @click="treeDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/coupon/coupon'
const useRangeOptions = [
  {
    label: '设计服务(3w)',
    id: 1
  },
  {
    label: '设计服务(5w)',
    id: 2
  },
  {
    label: '设计服务(8w)',
    id: 3
  },
  {
    label: '10w+设计服务',
    id: 4
  },
  {
    label: '众创服务(1w)',
    id: 5
  },
  {
    label: '众创服务(5k)',
    id: 6
  },
  {
    label: '供应链(3w)',
    id: 7
  }
];
export default {
  props: {
    editInfo: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  name: 'couponHome',
  data () {
    return {
      canUseInput: false,
      lqStartTimeModel: '',
      lqEndTimeModel: '',
      valiStartTimeModel: '',
      valiEndTimeModel: '',
      nameModel: '',
      useRangeModel: [],
      useRangeData: useRangeOptions,

      discountAmountModel: '',
      discountModel: '',
      useConditionModel: '1',
      useConditionMoneyModel: '',
      totalNumModel: '',
      restrictedNumModel: '1',

      usageRuleModel: `1、洛客平台发放的优惠券仅能在洛客平台提交订单时抵减应支付服务费金额，不能进行兑现、找零或其他用途；\n
2、优惠券形式：\n
1）xx年x月x日至x月x日期间，在洛客平台下单服务满xxx万元返xxx优惠券；\n
2）xx年x月x日至x月x日期间，新客下单享受立减xxxx优惠，优惠券使用有效期一个月\n
3、优惠券不可与其他优惠活动同时使用；\n
4、活动期间每个注册用户ID只享受一次返券机会，多笔订单不能累积返券；\n
5、此优惠券适用于产品设计服务，包含外观设计、结构设计、包装设计、logo设计等平台设计服务，不包含研发供应链生产服务。订单交易未成功或者取消订单的用户不返券；下单成功后，平台在2个工作日内将优惠券发放到用户账户。\n
6、平台发放所有优惠券严禁出售，如经发现并证实的，该券将予以作废处理\n
7、优惠券金额不提供服务发票。\n
8、本规则由洛客平台依据国家相关法律法规及规章制度予以解释`,
      remarkModel: '',

      currentTag: 'creat', // creat为创建优惠券页面 edit为编辑优惠券页面，
      leaveCreatDialog: false,
      currentId: 0,
      sortOptions: [
        {
          value: 1,
          label: '平台优惠券'
        },
        {
          value: 2,
          label: '政府优惠券',
          children: [
            {
              value: 1,
              label: '江西省优惠券'
            }
          ]
        }
      ],
      sortModel: [],
      typeModel: [],
      typeOptions: [
        {
          value: '1',
          label: '满减劵'
        },
        {
          value: '2',
          label: '满折券'
        },
        {
          value: '3',
          label: '套餐券'
        }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      newRangeModel: '1',
      treeDialog: false,
      selectedData: [],
      thirdLevelName: [],
      secondLevelName: [],
      firstLevelName: [],
      hasSelectedData: [],
      scopesModel: [],
      kindModel: '',
      subKindModel: '',
      that: ''
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    getCategories () {
      api.getCouponCategory().then(res => {
        if (res.code === 300000) {
          this.treeData = res.data
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    formatParams (data) {
      if (!data.subKind) {
        delete data.subKind
      }
      if (this.typeModel == 1 || this.typeModel == 3) {
        delete data.discount
      }
      if (this.typeModel == 2) {
        delete data.discountAmount
      }
    },
    creatCouponFn () {
      var data = {
        name: this.nameModel,
        type: this.typeModel,
        totalNum: this.totalNumModel,
        discountAmount: Number(this.discountAmountModel), // 不存在即删除字段
        restrictedNum: this.restrictedNumModel,
        availableFrom: this.lqStartTimeModel ? this.lqStartTimeModel : '',
        availableUntil: this.lqEndTimeModel ? this.lqEndTimeModel : '',
        validFrom: this.valiStartTimeModel ? this.valiStartTimeModel : '',
        validUntil: this.valiEndTimeModel ? this.valiEndTimeModel : '',
        usageCond: Number(this.useConditionModel),
        scopes: this.scopesModel, // 不存在传空数组
        remark: this.remarkModel,
        usageRule: this.usageRuleModel,
        threshold: Number(this.useConditionModel) === 1 ? Number(this.useConditionMoneyModel) : 0,

        kind: this.kindModel,
        subKind: this.subKindModel, // 不存在即删除字段
        discount: Number(this.discountModel), // 不存在即删除字段
        isRestrictedScope: Number(this.newRangeModel)
      }
      this.formatParams(data)
      if (this.currentTag === 'creat') {
        api.creatCoupon(data).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '创建成功',
              type: 'success'
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
      } else {
        api.editCoupon(this.currentId, data).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'success'
            })
            this.$emit('editSuccess', true)
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
    editCancleFn () {
      this.$emit('cancleFn', true)
    },
    creatCancleFn () {
      this.leaveCreatDialog = true
    },
    leaveCeratFn () {
      this.$router.push({path: '/coupon'})
    },
    formatTime (str) {
      return str.split(' 至 ')
    },
    formatCouponScopes (arr) {
      if (arr && arr.length !== 0) {
        let newArr = []
        for (let i = 0; i < arr.length; i++) {
          newArr.push(arr[i].scope)
        }
        return newArr
      } else {
        return []
      }
    },
    sortHandleChange () {
    },
    getfirstNameByParentId (data) {
      let firstResult = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.treeData.length; j++) {
          if (this.treeData[j].id === data[i].parent_id) {
            let obj = {
              name: this.treeData[j].name,
              id: this.treeData[j].id,
              parent_id: this.treeData[j].parent_id
            }
            firstResult.push(obj)
          }
        }
      }
      this.firstLevelName = firstResult
    },
    getSecondNameByParentId (data) {
      let secondResult = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < this.treeData.length; j++) {
          let secondChildren = this.treeData[j].children
          for (let z = 0; z < secondChildren.length; z++) {
            if (secondChildren[z].id === data[i].parent_id) {
              let obj = {
                name: secondChildren[z].name,
                id: secondChildren[z].id,
                parent_id: secondChildren[z].parent_id
              }
              secondResult.push(obj)
            }
          }
        }
      }
      this.secondLevelName = secondResult
    },
    formatSeletedDataByLevel (data) {
      let result = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].level === 3) {
          result.push(data[i])
        }
      }
      this.thirdLevelName = result
    },
    changeCurrentSeleted () { // 点击tree 选中节点的回调
      this.selectedData = this.$refs.tree.getCheckedNodes() // 得到选中的节点组成的数组
      this.formatSeletedDataByLevel(this.selectedData) // 创建一个length与selecteData相同的数组hasSelectedData 根据选中节点的parent_id 得到父级以及父父级的name 进行拼接
      this.getSecondNameByParentId(this.thirdLevelName)
      this.getfirstNameByParentId(this.secondLevelName)
      this.mergeNameByLevel(this.firstLevelName, this.secondLevelName, this.thirdLevelName) // hasSelectedData 为已经选中的model
      this.formatScopesModel()
      this.that = this
    },
    formatScopesModel () {
      this.scopesModel = []
      if (this.hasSelectedData && this.hasSelectedData.length !== 0) {
        this.hasSelectedData.forEach((v, i) => {
          this.scopesModel.push(v.id)
        });
      }
    },
    mergeNameByLevel (first, second, third) {
      let result = []
      for (let i = 0; i < first.length; i++) {
        result.push(
          {
            name: `${first[i].name}/${second[i].name}/${third[i].name}`,
            id: third[i].id
          }
        )
      }
      this.hasSelectedData = result
    },
    deleteSeletedTree (index) {
      let targetId = this.hasSelectedData[index].id
      this.hasSelectedData.splice(index, 1)
      this.getDeleteSeletedDataById(targetId)
      this.$refs.tree.setCheckedNodes(this.selectedData)
    },
    getDeleteSeletedDataById (id) { // 根据点击的close的id 删除selectData 中相对应的选项
      let result = []
      this.selectedData.forEach((v, i) => {
        if (v.id !== id && v.id !== this.getSecondId(id) && v.id !== this.getFirstId(this.getSecondId(id))) {
          result.push(v)
        }
      })
      this.selectedData = result
    },
    getSecondId (id) { // 根据第三层id得到第二层id
      for (let i = 0; i < this.treeData.length; i++) {
        let secondChildren = this.treeData[i].children
        for (let j = 0; j < secondChildren.length; j++) {
          let thirdChildren = secondChildren[j].children
          for (let z = 0; z < thirdChildren.length; z++) {
            if (thirdChildren[z].id == id) {
              return thirdChildren[z].parent_id
            }
          }
        }
      }
    },
    getFirstId (id) { // 根据第二层id得到第一层id
      for (let i = 0; i < this.treeData.length; i++) {
        let secondChildren = this.treeData[i].children
        for (let j = 0; j < secondChildren.length; j++) {
          if (secondChildren[j].id == id) {
            return secondChildren[j].parent_id
          }
        }
      }
    },
    formatType (type) {
      if (type === '满折券') {
        return '2'
      } else if (type === '满减券') {
        return '1'
      } else if (type === '套餐券') {
        return '3'
      }
    },
    formatKind (kind, subKind) {
      let result = []
      if (kind) {
        result.push(Number(kind))
      }
      if (subKind) {
        result.push(Number(subKind))
      }
      return result
    },
    getEleById (ids) { // 编辑时根据返回的id渲染选中状态和已选中
      let result = []
      for (let p = 0; p < ids.length; p++) {
        for (let i = 0; i < this.treeData.length; i++) {
          let secondChildren = this.treeData[i].children
          for (let j = 0; j < secondChildren.length; j++) {
            let thirdChildren = secondChildren[j].children
            for (let z = 0; z < thirdChildren.length; z++) {
              if (thirdChildren[z].id == ids[p].category_id) {
                result.push(thirdChildren[z])
              }
            }
          }
        }
      }
      return result
    }
  },
  watch: {
    treeDialog (boolean) {
      if (boolean) { // 打开treedialog弹窗之后才能渲染tree 渲染完tree之后才能使用this.$refs.tree的方法
        this.$nextTick(() => {
          this.$refs.tree.setCheckedNodes(this.thirdLevelName)
        })
      }
    },
    sortModel (model) {
      if (model) {
        this.kindModel = model[0]
        if (model[1]) {
          this.subKindModel = model[1]
        }
      }
    },
    useConditionModel (model) {
      if (Number(model) === 2) {
        this.canUseInput = true
        this.useConditionMoneyModel = ''
      } else if (Number(model) === 1) {
        this.canUseInput = false
      }
    },
    editInfo: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.currentId = newValue.id
          this.currentTag = 'edit'
          this.lqStartTimeModel = this.formatTime(newValue.publish_time)[0]
          this.lqEndTimeModel = this.formatTime(newValue.publish_time)[1]
          this.valiStartTimeModel = this.formatTime(newValue.valid_time)[0]
          this.valiEndTimeModel = this.formatTime(newValue.valid_time)[1]
          this.nameModel = newValue.name
          // this.useRangeModel = this.formatCouponScopes(newValue.coupon_scopes) // TO DO
          this.discountAmountModel = newValue.discount_amount
          this.useConditionModel = newValue.usage_cond.toString()
          this.useConditionMoneyModel = newValue.threshold
          this.totalNumModel = newValue.total_num
          this.restrictedNumModel = newValue.restricted_num
          this.usageRuleModel = newValue.usage_rule ? newValue.usage_rule : ''
          this.remarkModel = newValue.remark
          this.typeModel = this.formatType(newValue.type)
          this.sortModel = this.formatKind(newValue.kind, newValue.sub_kind)
          this.newRangeModel = (newValue.is_restricted_scope).toString()
          this.discountModel = newValue.discount
          setTimeout(() => { // 1s之后才能请求到this.treeData 之后才能渲染tree
            this.formatSeletedDataByLevel(this.getEleById(newValue.coupon_scopes))
            this.getSecondNameByParentId(this.thirdLevelName)
            this.getfirstNameByParentId(this.secondLevelName)
            this.mergeNameByLevel(this.firstLevelName, this.secondLevelName, this.thirdLevelName) // hasSelectedData 为已经选中的model
            this.formatScopesModel()
          }, 1000)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
$row-distance: 10px;
.clear {
  &:after{
    content:"";
    display:block;
    visibility:hidden;
    clear:both;
    height:0;
  }
}
.fl {
  float: left;
}
.ml10 {
  margin-left: 10px;
}
.ml5 {
  margin-left: 5px;
}
.creat-wrap {
  font-size: 14px;
  padding: 10px;
  color: #606266;
  .el-row {
    margin-bottom: $row-distance;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .coupon-info {
    line-height: 2.3;
    vertical-align: middle;
  }
  .coupon-use-rule {
    .el-textarea__inner {
      height: 300px !important;
    }
  }
  .has-seleted-wrap {
    position: relative;
    float: left;
    margin-left: 20px;
    margin-top: 10px;
    padding: 5px 20px 5px 20px;
    border: 1px solid #ccc;
    &:first-child {
      margin-left: 0;
    }
    .close {
      position: absolute;
      top: -3px;
      right: 5px;
      color: #909399;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.coupon-use-rule {
  .el-textarea__inner {
    height: 300px !important;
  }
}
</style>
