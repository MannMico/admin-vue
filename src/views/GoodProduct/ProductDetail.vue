<template>
  <div class="detail-wrap">
    <!-- {{$route.query.id}}
    {{$route.query.tag}} -->
    <!-- <el-row>
      位置：好产品管理 > <span style="color: #3c6;">洛可可好产品管理</span>
    </el-row> -->
    <el-row>
      <el-button size="small" type="primary" style="margin-top: 10px;" @click="editMainProduct()">编辑主产品</el-button>
      <el-button size="small" type="primary" style="margin-top: 10px;" @click="relationDialog = true">关联子产品</el-button>
    </el-row>
    <el-row>
      <div class="detail-infomation" v-if="detailInformationData.length !== 0">
        <h4>基本情况</h4>
          <ul>
            <li>归属方：<span>{{$route.query.tag === 'lkker' ? '洛客' : '洛可可'}}</span> </li>
            <li>主产品编号：<span>{{detailInformationData.number}}</span> </li>
            <li>产品状态：<span>{{detailInformationData.state === 1 ? '已上市' : '未上市'}}</span> </li>
            <li>上市时间：<span>{{detailInformationData.up_time}}</span> </li>
            <li>包含子产品数：<span>{{detailInformationData ? detailInformationData.product.length : ''}}</span> </li>
          </ul>
            <h4 style="margin-top:10px;">销售情况</h4>
            <ul>
              <li>产品累计销量：<span>{{detailInformationData.sales}}</span> </li>
              <li>产品单价（元）：<span>{{detailInformationData.price}}</span> </li>
              <li></li>
              <li></li>
            </ul>
        </div>
    </el-row>
    <el-row v-if="this.$route.query.tag === 'lkker'">
      <el-button size="small" type="primary" @click="addChildProduct">新增子产品</el-button>
    </el-row>

    <el-dialog :width="'760px'" :close-on-click-modal="false" title="新增子产品" :visible.sync="addChildDialog">
      <edit-product
        :currentChildId="currentId"
        @cancleEditCb="cancleAddCb"
        @isEditCb="isAddCb"
      ></edit-product>
    </el-dialog>

    <el-row>
      <div class="child-detail-wrap">
        <h4 class="child-detail-title">子产品情况</h4>
        <div v-for="(item,key,index) in detailInformationData.product" :key="index">
          <ul class="child-detail-content" style="padding-top: 15px;">
            <li style="margin-top: 0">
              <el-button size="small" type="primary" @click="editChildProduct(key)">编辑子产品</el-button>
              <el-button size="small" type="primary" @click="cancleContect(item,index)">取消关联</el-button>
            </li>
            <li> <i style="margin-left: 43px;"></i>子产品名称：<span>{{item.name}}</span></li>
            <li> <i class="space-4"></i>产品分类：<span>{{item.product_category_name}}/{{item.sub_product_category_name}}</span></li>
            <li> <i class="space-4"></i>产品简介：<span>{{item.description}}</span></li>
            <el-row>
              <li class="detail-img-wrap">
                <span class="detail-pre-img space-3">效果图：</span>
                <div class="clear" style="margin-left: 24px">
                  <img style="float: left;" v-for="(imgItem, key, index) in item.design_images" :src="imgItem" :key="index" alt="" width="300">
                </div>
              </li>
            </el-row>
            <el-row>
              <li class="detail-img-wrap">
                <span class="detail-pre-img space-3">实物图：</span>
                <div class="clear" style="margin-left: 24px">
                  <img style="float: left;" v-for="(imgItem, key, index) in item.real_images" :src="imgItem" :key="index" alt="" width="300">
                </div>
              </li>
            </el-row>
          </ul>

          <ul class="child-detail-content">
            <h4> 客户信息 </h4>
            <li> <i class="space-5"></i>客户公司名称：<span>{{item.company_name}}</span></li>
            <li> <i class="space-3"></i>联系人：<span>{{item.contact_name}}</span></li>
            <li><i class="space-4"></i>联系方式：<span>{{item.contact_phone}}</span></li>
          </ul>

          <ul class="child-detail-content">
            <h4>任务信息</h4>
            <li> <i class="space-5"></i>关联项目ID：<span>{{item.project_number}}</span></li>
            <li> <i class="space-5"></i>关联项目名称：<span>{{item.project_name}}</span></li>
            <li> <i class="space-4"></i>所属地区：<span>{{item.organize}}</span></li>
            <li> <i class="space-5"></i> 项目经理姓名：<span>{{item.manager_name}}</span></li>
          </ul>
        </div>
      </div>
    </el-row>

    <el-dialog :width="'80%'" :close-on-click-modal="false" title="提示" :visible.sync="cancleRelationDialog">
      <div style="position: relative;">
        <p class="cancle-relation-text"><i class="el-icon-warning" style="width: 20px; color: #E6A23C;"></i>取消关联后该子产品将无法通过当前主产品查看到，确认取消吗？</p>
        <div class="cancle-relation-btn-wrap">
          <el-button type="primary" size="small" @click="cancleRelationDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="isCancleContact">确定取消关联</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :width="'560px'" :close-on-click-modal="false" title="编辑主产品" :visible.sync="editMainDialog">
      <div style="position: relative;padding: 0 20px;">
        <el-row>
          <el-col :span="10">
            <span style="color: red">*</span>
            <span style="margin-left: 100px;">产品状态：</span>
          </el-col>
          <el-col :span="14">
            <template>
              <el-radio v-model="upRadio" label="未上市">未上市</el-radio>
              <el-radio v-model="upRadio" label="已上市">已上市</el-radio>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" style="margin-top: 10px">
            <span style="color: red;">*</span>
            <span style="margin-left: 100px;">上市时间：</span>
          </el-col>
          <el-col :span="14">
            <div class="inline">
              <el-date-picker
                v-model="timeModel"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span style="margin-left: 70px">产品单价（元）：</span>
          </el-col>
          <el-col :span="14">
            <el-input v-model="priceInput" style="width: 220px"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <span style="margin-left: 70px;">销售数量（个）：</span>
          </el-col>
          <el-col :span="14">
            <el-input v-model="saleInput" style="width: 220px"></el-input>
          </el-col>
        </el-row>
        <el-row style="text-align: right">
          <el-button type="primary" size="small" @click="editMainDialog = false">取 消</el-button>
          <el-button type="primary" size="small" @click="isEditMainProduct">确定保存</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog :width="'760px'" :close-on-click-modal="false" title="编辑子产品" :visible.sync="editChildDialog">
      <div style="position: relative;">
        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>产品名称：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="productNameModel"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>产品分类：</span>
          </el-col>
          <el-col :span="17">
             <div class="block">
              <el-cascader
                :options="sortProductOptions"
                :props="categoryKey"
                v-model="categoryModel">
              </el-cascader>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>产品简介：</span>
          </el-col>
          <el-col :span="14">
            <el-input type="textarea" v-model="introduceModel" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>产品效果图：</span>
          </el-col>
          <el-col :span="17">
            <li class="child-dialog-img-wrap">
              <div>
                <upload
                  :upfileSize='3072'
                  :upfileType="'image'"
                  :upLimit="10"
                  :upMultiple="true"
                  @urlCB="uploadSuccessResult"
                  @removeFile="remveDesignFile"
                  :isCover="false"
                  :editGoodProductLimit='true'
                  :firstFileList="resultfileList"
                  :list-type="'picture'"
                  :info="'支持JPG/PNG格式，单张不超过1.5M>'"></upload>
              </div>
              <!-- <div class="clear">
                <img style="float: left;" v-for="(imgItem, key, index) in imgResultModel" :src="imgItem" :key="index" alt="" width="100">
              </div> -->
            </li>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>产品实物图：</span>
          </el-col>
          <el-col :span="17">
            <li class="child-dialog-img-wrap">
              <div>
                <upload
                  :upfileSize='3072'
                  :upfileType="'image'"
                  :upLimit="10"
                  :upMultiple="true"
                  :firstFileList="realfileList"
                  @urlCB="uploadSuccessReally"
                  @removeFile="remveRealFile"
                  :editGoodProductLimit='true'
                  :isCover="false"
                  :list-type="'picture'"
                  :info="'支持JPG/PNG格式，单张不超过1.5M>'"></upload>
              </div>
              <!-- <div class="clear">
                <img style="float: left;" v-for="(imgItem, key, index) in imgRealModel" :src="imgItem" :key="index" alt="" width="100">
              </div> -->
            </li>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>关联项目ID：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="contactNumberModel"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>关联项目名称：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="contactNameModel"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>签约归属：</span>
          </el-col>
          <el-col :span="17">
            <el-select v-model="organizeModel" placeholder="请选择活动区域"  v-if="$route.query.tag === 'lkker'">
              <el-option v-for="(item, key, index) in organizeSeleteData" :key="index" :label="item.name" :value="item.name">{{item.name}}</el-option>
            </el-select>
            <el-select v-model="organizeModel" placeholder="请选择活动区域"  v-if="$route.query.tag === 'lkk'">
              <el-option v-for="(item, key, index) in organizeSeleteData" :key="index" :label="item" :value="item">{{item}}</el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>项目经理姓名：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="managerNameModel"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>客户公司名称：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="companyNameModel"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>联系人：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="contactPersonModel"></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>联系方式：</span>
          </el-col>
          <el-col :span="17">
            <el-input v-model="contactPhoneModel"></el-input>
          </el-col>
        </el-row>

        <el-row style="text-align: center;padding-top: 10px;">
          <el-button type="primary" size="small" @click="cancleEditFn">取 消</el-button>
          <el-button type="primary" size="small" @click="checkRepeatNameFn">确定修改</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog :width="'80%'" :close-on-click-modal="false" title="添加关联子产品" :visible.sync="relationDialog">
      <div>
        <relation-product
          :id="currentId"
          :mainNumber="mainNumberToRelation"
          :currentTag="currentTag"
          @closeRelation="closeRelationProduct"
          @relationCb="relationCb"
        ></relation-product>
      </div>
    </el-dialog>

    <el-dialog :width="'760px'" :close-on-click-modal="false" title="编辑子产品" :visible.sync="lkkerEditDialog">
      <edit-product
        :editChildInfo="editChildInfo"
        :currentChildId="currentId"
        @cancleEditCb="lkkerCancleEditCb"
        @lkkereditChildSuccess="lkkereditChildSuccess"
      ></edit-product>
    </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/goodproduct/common'
import upload from '@/components/Upload/upload.vue'
import relationProduct from './RelationProduct'
import editProduct from './LkkerEditChild'

export default {
  name: 'productDetail',
  data () {
    return {
      detailInformationData: [],
      cancleRelationParams: {
        type: '0',
        mainId: '1',
        productId: ''
      },
      cancleRelationDialog: false,
      editMainDialog: false,

      upRadio: '未上市',
      timeModel: '',
      priceInput: '',
      saleInput: '',
      mainProductform: {
        state: '',
        up_time: '',
        price: '',
        sales: ''
      },

      currentChildId: 0,
      editChildDialog: false,
      organizeSeleteData: [],
      curChildProductInfo: null,
      category: null,
      sortProductOptions: [],
      categoryModel: [],
      categoryKey: {
        value: 'id',
        label: 'name',
        children: 'sub_category'
      },
      introduceModel: '',
      productNameModel: '',
      contactNumberModel: '',
      contactNameModel: '',
      organizeModel: '',
      managerNameModel: '',
      companyNameModel: '',
      contactPersonModel: '',
      contactPhoneModel: '',
      imgResultModel: [],
      imgRealModel: '',

      currentId: 0,
      currentTag: '',
      mainNumberToRelation: '',
      relationDialog: false,
      currentChildIndex: 0,
      resultfileList: [],
      realfileList: [],

      addChildDialog: false,
      lkkerEditDialog: false,
      editChildInfo: []
    }
  },
  created () {
    this.getChildProductData()
    this.cancleRelationParams.mainId = this.$route.query.id // 主产品id
    this.currentTag = this.$route.query.tag
    this.currentId = Number(this.$route.query.id)
  },
  methods: {
    initSortData () {
      if (this.$route.query.tag === 'lkk') {
        api.getLkkFilterData().then(res => {
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
      } else if (this.$route.query.tag === 'lkker') {
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
      }
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
    getChildProductData () {
      var params = this.$route.query.id
      if (this.$route.query.tag === 'lkk') {
        api.getLkkChildProductData(params).then(res => {
          if (res.code === 300000) {
            this.detailInformationData = res.data
            this.changeProuceSourceData(this.detailInformationData.product)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'info'
            })
          }
        })
      } else if (this.$route.query.tag === 'lkker') {
        api.getLkkerChildProductData(params).then(res => {
          if (res.code === 300000) {
            this.detailInformationData = {}
            this.detailInformationData = res.data
            this.changeProuceSourceData(this.detailInformationData.product)
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
    changeProuceSourceData (sourceData) { // 改原始数据中的图片链接
      for (let i = 0; i < sourceData.length; i++) {
        var designImgArr = sourceData[i].design_images.split('||')
        var realmgArr = sourceData[i].real_images.split('||')
        sourceData[i].design_images = designImgArr
        sourceData[i].real_images = realmgArr
      }
    },
    handleSelectionChange (val) {
      var idArr = []
      for (let i = 0; i < val.length; i++) {
        idArr.push(val[i].id)
      }
      this.relationParams.productId = idArr
    },
    changeCurrentPage (page) {
      this.searchParams.page = page
      this.doSearch()
    },
    // isCancle () {
    //   this.$emit('closeRelation', true)
    // },
    editChildProduct (index) {
      if (this.$route.query.tag === 'lkk') {
        this.editChildDialog = true
        this.initSortData()
        this.curChildProductInfo = this.detailInformationData.product[index]
        this.initChildDialogData(this.curChildProductInfo)
      } else if (this.$route.query.tag === 'lkker') {
        this.lkkerEditDialog = true
        this.editChildInfo = this.detailInformationData.product[index]
      }
    },
    checkRepeatNameFn () {
      var params = {
        id: this.currentChildId,
        name: this.productNameModel
      }
      api.checkRepeatName(params).then(res => {
        if (res.code === 300000) {
          this.isEditChildProduct()
        } else {
          this.$message({
            showClose: true,
            message: '已存在相同的产品名称',
            type: 'info'
          })
        }
      })
    },
    isEditChildProduct () {
      var data = {
        main_id: this.$route.query.id,
        name: this.productNameModel,
        product_category_id: this.categoryModel[0],
        sub_product_category_id: this.categoryModel[1],
        description: this.introduceModel,
        design_images: this.imgResultModel,
        real_images: this.imgRealModel,
        company_name: this.companyNameModel,
        contact_name: this.contactPersonModel,
        contact_phone: this.contactPhoneModel,
        organize: this.organizeModel,
        project_name: this.contactNameModel,
        project_number: this.contactNumberModel,
        manager_name: this.managerNameModel
      }
      api.editLkkChildProduct(this.currentChildId, data).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.getChildProductData()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
      this.editChildDialog = false
    },
    formatFileList (arr) {
      var newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== '') {
          var obj = {
            url: arr[i]
          }
          newArr.push(obj)
        }
      }
      return newArr
    },
    initChildDialogData (data) { // 点击编辑子产品将子产品数据放入表单中
      this.currentChildId = data.id
      this.productNameModel = data.name
      this.categoryModel = []
      this.categoryModel.push(Number(data.product_category_id))
      this.categoryModel.push(Number(data.sub_product_category_id))
      this.introduceModel = data.description
      this.contactNumberModel = data.project_number
      this.contactNameModel = data.project_name
      this.managerNameModel = data.manager_name
      this.organizeModel = data.organize
      this.companyNameModel = data.company_name ? data.company_name : ''
      this.contactPersonModel = data.contact_name ? data.contact_name : ''
      this.contactPhoneModel = data.contact_phone ? data.contact_phone : ''
      this.imgResultModel = data.design_images // 处理图片链接
      this.imgRealModel = data.real_images // 处理图片链接

      this.resultfileList = this.formatFileList(data.design_images)
      this.realfileList = this.formatFileList(data.real_images)
    },
    editMainProduct () {
      this.editMainDialog = true
      this.initSortData()
      this.addSourceData()
    },
    addSourceData () {
      this.upRadio = this.detailInformationData.state === 0 ? '未上市' : '已上市'
      this.timeModel = this.detailInformationData.up_time
      this.priceInput = this.detailInformationData.price
      this.saleInput = this.detailInformationData.sales
    },
    isEditMainProduct () {
      this.getEditMainProductForm()
      var data = this.mainProductform
      if (this.$route.query.tag === 'lkk') {
        api.editLkkMainProduct(this.$route.query.id, data).then(res => {
          if (res.code === 300000) {
            this.editMainDialog = false
            this.getChildProductData()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.$route.query.tag === 'lkker') {
        api.editLkkerMainProduct(this.$route.query.id, data).then(res => {
          if (res.code === 300000) {
            this.editMainDialog = false
            this.getChildProductData()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    getEditMainProductForm () {
      var radioParams = ''
      if (this.upRadio === '未上市') {
        radioParams = '0'
      } else if (this.upRadio === '已上市') {
        radioParams = '1'
      }
      this.mainProductform.state = radioParams
      this.mainProductform.up_time = this.timeModel
      this.mainProductform.price = this.priceInput
      this.mainProductform.sales = this.saleInput
    },
    cancleContect (item, index) {
      this.currentChildIndex = index
      this.cancleRelationParams.productId = item.id
      this.cancleRelationDialog = true
    },
    isCancleContact () {
      var params = this.cancleRelationParams
      if (this.$route.query.tag === 'lkk') {
        api.doRelative(params).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '取消关联成功',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.$route.query.tag === 'lkker') {
        api.dolkkerRelative(params).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '取消关联成功',
              type: 'success'
            })
            this.detailInformationData.product.splice(this.currentChildIndex, 1)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
      this.cancleRelationDialog = false
    },
    uploadSuccessResult (res) {
      if (res.code === 0) {
        this.imgResultModel.push(res.file_url)
      }
    },
    remveDesignFile (files) {
      this.imgResultModel = this.formatImgUrl(files)
    },
    remveRealFile (files) {
      this.imgRealModel = this.formatImgUrl(files)
    },
    formatImgUrl (arr) {
      if (arr.length === 0) {
        return arr
      } else {
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
          newArr.push(arr[i].url)
        }
        return newArr
      }
    },
    uploadSuccessReally (res) {
      if (res.code === 0) {
        this.imgRealModel.push(res.file_url)
      }
    },
    closeRelationProduct () {
      this.relationDialog = false
    },
    relationCb (isrelation) {
      if (isrelation) {
        this.getChildProductData()
        this.relationDialog = false
        this.cancleRelationParams.mainId = this.$route.query.id // 主产品id
      }
    },
    addChildProduct () {
      this.addChildDialog = true
    },
    cancleAddCb () {
      this.addChildDialog = false
      this.getChildProductData()
    },
    cancleEditFn () {
      this.editChildDialog = false
      this.getChildProductData()
    },
    isAddCb () {
      this.addChildDialog = false
      this.getChildProductData()
    },
    lkkerCancleEditCb () {
      this.lkkerEditDialog = false
      this.getChildProductData()
    },
    lkkereditChildSuccess () {
      this.lkkerEditDialog = false
      this.getChildProductData()
    }
  },
  watch: {
    organizeModel (val) {
      // console.log(val)
    },
    categoryModel (val) {
      // console.log(val)
    }
  },
  components: {
    upload,
    relationProduct,
    editProduct
  }
}
</script>
<style lang="scss" scoped>
$row-distance: 15px;
.edit-child-public {
  text-align: right;
  margin-top: 10px;
}
.public-clear {
  &:after{
    content:"";
    display:block;
    visibility:hidden;
    clear:both;
    height:0;
  }
}
.detail-wrap {
    font-size: 14px;
    padding: $row-distance;
    padding-top: 0;
    margin-top: -15px;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .detail-infomation {
      padding: $row-distance;
      border: 1px solid #d8e0e0;
      color: #5e6161;
      ul {
        display: -webkit-flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: $row-distance;
        &:after{
          content:"";
          display:block;
          visibility:hidden;
          clear:both;
          height:0;
        }
        li {
          float: left;
          white-space: nowrap;
          margin-left: 50px;
        }
      }
    }
    .child-detail-wrap {
      border: 1px solid #d8e0e0;
      color: #5e6161;
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
          margin-left: 70px;
        }
        .space-4 {
          margin-left: 57px;
        }
        .space-5 {
          margin-left: 28px;
        }
        li {
          padding: 4px;
          margin-top: 10px;
        }
        .detail-img-wrap {
          position: relative;
          padding-left: 108px;
          .detail-pre-img {
            position: absolute;
            top: 0;
            left: 5px;
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
    .cancle-relation-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      top: -45px;
      white-space: nowrap;
    }
    .cancle-relation-btn-wrap {
      margin-top: 50px;
      text-align: center;
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
}
</style>
