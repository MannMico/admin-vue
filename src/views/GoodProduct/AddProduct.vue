<template>
  <div class="add-product-wrap">
    <div class="main-info-wrap">
      <el-row>
        <h4>基本情况</h4>
      </el-row>
      <el-row class="clear">
        <li>
          <span style="color: red">*</span>
          <span style="margin-left: 105px;">产品状态：</span>
        </li>
        <li>
          <template>
            <el-radio v-model="upRadio" label="未上市">未上市</el-radio>
            <el-radio v-model="upRadio" label="已上市">已上市</el-radio>
          </template>
        </li>
      </el-row>
      <el-row class="clear">
        <li>
          <span style="color: red;">*</span>
          <span style="margin-left: 105px;line-height: 35px;">上市时间：</span>
        </li>
        <li>
          <div class="inline">
            <el-date-picker
              v-model="timeModel"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </li>
      </el-row>
      <el-row>
        <h4>销售情况</h4>
      </el-row>
      <el-row class="clear">
        <li>
          <span style="margin-left: 70px;line-height: 35px;">产品单价（元）：</span>
        </li>
        <li>
          <el-input v-model="priceInput"></el-input>
        </li>
      </el-row>

      <el-row class="clear">
        <li>
          <span style="margin-left: 70px;line-height: 35px;">销售数量（个）：</span>
        </li>
        <li>
          <el-input v-model="saleInput"></el-input>
        </li>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="addMainProduct" v-if="addMainScucess">创建主产品</el-button>
      </el-row>
    </div>
    <div class="child-info-wrap" v-if="canAddChild">
      <el-row>
        <h4 class="mt10">子产品信息</h4>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="addChildProduct">添加子产品</el-button>
      </el-row>
      <el-row v-if="childProductform.length === 0">
        <span style="color: red">
          请务必添加至少一个子产品
        </span>
      </el-row>
      <el-row  v-if="childProductform.length !== 0">
        <div class="child-detail-wrap">
            <ul class="child-detail-content">
              <li>
                <el-button size="small" type="primary" @click="addChildDialog = true">修改</el-button>
                <el-button size="small" type="primary" @click="deleteProductDialog = true">删除</el-button>
              </li>
              <li> <i style="margin-left: 9px"></i>子产品名称：<span>{{childProductform.name}}</span></li>
              <li> <i class="space-1"></i>产品分类：<span>{{childProductform.product_category_name}}/{{childProductform.sub_product_category_name}}</span></li>
              <li> <i class="space-1"></i>产品简介：<span>{{childProductform.description}}</span></li>
              <el-row>
                <li class="detail-img-wrap">
                  <span class="detail-pre-img">效果图：</span>
                  <div class="clear">
                    <img :src="childProductform.design_images" alt="" width="300">
                  </div>
                </li>
              </el-row>
              <el-row>
                <li class="detail-img-wrap">
                  <span class="detail-pre-img">实物图：</span>
                  <div class="clear">
                    <img :src="childProductform.real_images" alt="" width="300">
                  </div>
                </li>
              </el-row>
            </ul>

            <ul class="child-detail-content">
              <h4> 客户信息 </h4>
              <li> <i class="space-5"></i>客户公司名称：<span>{{childProductform.company_name}}</span></li>
              <li> <i class="space-3"></i>联系人：<span>{{childProductform.contact_name}}</span></li>
              <li><i class="space-4"></i>联系方式：<span>{{childProductform.contact_phone}}</span></li>
            </ul>

            <ul class="child-detail-content">
              <h4>任务信息</h4>
              <li> <i class="space-5"></i>关联项目ID：<span>{{childProductform.project_number}}</span></li>
              <li> <i class="space-5"></i>关联项目名称：<span>{{childProductform.project_name}}</span></li>
              <li> <i class="space-4"></i>所属地区：<span>{{childProductform.organize}}</span></li>
              <li> <i class="space-5"></i> 项目经理姓名：<span>{{childProductform.manager_name}}</span></li>
            </ul>
        </div>
      </el-row>
    <el-dialog :width="'80%'" title="提示"  :close-on-click-modal="false" :visible.sync="deleteProductDialog">
      <div style="position: relative;">
        <p class="delete-text"><i class="el-icon-warning" style="width: 20px; color: #E6A23C;"></i>删除该主产品后其包含的子产品信息将一并删除，确定删除吗？</p>
        <div class="delete-btn-wrap">
          <el-button type="primary" size="small" @click="deleteProductDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="isDelete">确定删除</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :width="'760px'"  :close-on-click-modal="false" title="编辑子产品" :visible.sync="addChildDialog">
      <edit-product
        :currentChildId="currentChildId"
        @cancleEditCb="cancleEditCb"
        @isEditCb="isEditCb"
      ></edit-product>
    </el-dialog>

    </div>
  </div>
</template>
<script>

import * as api from '@/api/goodproduct/common';
import upload from '@/components/Upload/upload';
import editProduct from './LkkerEditChild'

export default {
  name: 'addProduct',
  data () {
    return {
      timeModel: '',
      upRadio: '未上市',
      priceInput: '',
      saleInput: '',

      addChildDialog: false,

      organizeSeleteData: [],
      sortProductOptions: [],
      categoryModel: [],
      categoryKey: {
        value: 'id',
        label: 'name',
        children: 'sub_category'
      },
      introduceModel: '',
      productNameModel: '',
      organizeModel: [],
      managerNameModel: '',
      companyNameModel: '',
      contactPersonModel: '',
      contactPhoneModel: '',
      imgResultModel: [],
      imgRealModel: [],
      contactPlatformRadio: '否',

      taskIdModel: '',
      taskIdInfo: [],
      noneTaskIdText: false,

      childProductform: [],
      currentChildId: 0,
      canAddChild: false,

      deleteProductDialog: false,

      formData: {
        productNameModel: '',
        categoryModel: '',
        introduceModel: '',
        contactPlatformRadio: '否',
        organizeModel: [],
        managerNameModel: '',
        companyNameModel: '',
        contactPersonModel: '',
        contactPhoneModel: '',
        taskIdModel: ''
      },
      addMainScucess: true
    }
  },
  created () {
  },
  methods: {
    initSortData () {
      api.getLkkerFilterData().then(res => {
        if (res.code === 300000) {
          let data = res.data
          this.organizeSeleteData = data.organize
          this.category = data.category
          this.sortProductOptions = this.getCategoryDetail(this.category)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    getCategoryDetail (category) { // 双层嵌套对象转化成数组对象的方法
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
    addMainProduct () {
      var data = {
        state: this.upRadio === '未上市' ? '0' : '1',
        up_time: this.timeModel,
        price: this.priceInput,
        sales: this.saleInput
      }
      api.addLkkerMainProduct(data).then(res => {
        if (res.code === 300000) {
          this.canAddChild = true
          this.currentChildId = res.data.id
          this.addMainScucess = false
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    addChildProduct () {
      this.addChildDialog = true
      this.initSortData()
    },
    cancleEditCb () {
      this.addChildDialog = false
    },
    isEditCb (data) {
      this.childProductform = data
      this.addChildDialog = false
    },
    isDelete () {
      var params = this.currentChildId
      api.detaleProduct(params).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '删除主产品成功',
            type: 'success'
          })
          this.deleteDialog = false
          Object.assign(this.$data, this.$options.data())
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
          this.deleteDialog = false
        }
      })
    }
  },
  components: {
    upload,
    editProduct
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
  $row-distance: 15px;
  .mt10 {
    margin-top: 10px;
  }
  .add-product-wrap {
    font-size: 14px;
    color: #5e6161;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .main-info-wrap {
      position: relative;
      padding: 20px;
      border: 1px solid #d8e0e0;
      li {
        float: left;
      }
      .clear {
        &::after{
          content:"";
          display:block;
          visibility:hidden;
          clear:both;
          height:0;
        }
      }
    }
    .child-info-wrap {
      .edit-child-public {
        text-align: right;
        margin-top: 10px;
      }
      .child-detail-wrap {
        border: 1px solid #d8e0e0;
        .child-detail-title {
          padding: $row-distance;
          border-bottom: 1px solid #d8e0e0;
        }
        .child-detail-content {
          padding: $row-distance;
          border-bottom: 1px solid #d8e0e0;
          .space-1 {
            margin-left: 23px;
          }
          .space-3 {
            margin-left: 71px;
          }
          .space-4 {
            margin-left: 57px;
          }
          .space-5 {
            margin-left: 28px;
          }
          li {
            padding: 8px;
          }
          .detail-img-wrap {
            position: relative;
            padding-left: 108px;
            .detail-pre-img {
              position: absolute;
              top: 4px;
              left: 45px;
            }
            .clear {
              min-height: 7px;
              &::after{
                content:"";
                display:block;
                visibility:hidden;
                clear:both;
                height:0;
              }
            }
          }
        }
      }
    }
    .child-dialog-img-wrap {
      position: relative;
        padding-top: 10px;
        .detail-pre-img {
          position: absolute;
          top: 11px;
          left: 25px;
        }
        .clear {
          &::after{
            content:"";
            display:block;
            visibility:hidden;
            clear:both;
            height:0;
          }
        }
    }
    .delete-btn-wrap {
      margin-top: 50px;
      text-align: center;
    }
    .delete-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      top: -45px;
      white-space: nowrap;
    }
  }
</style>
