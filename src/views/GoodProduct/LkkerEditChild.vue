<template>
    <div style="position: relative;" class="wrap">
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
              <upload :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="true" @urlCB="uploadSuccessResult" :editGoodProductLimit="true" :isCover="false" :list-type="'picture'" :info="'文件名称中不要包含“.”'" :firstFileList="designFileList" @removeFile="remveDesignFile"></upload>
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
            <upload :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="true" @urlCB="uploadSuccessReally" :editGoodProductLimit="true" :isCover="false" :list-type="'picture'" :info="'文件名称中不要包含“.”'" :firstFileList="realFileList" @removeFile="remveRealFile"></upload>
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
          <span>是否关联平台任务：</span>
        </el-col>
        <el-col :span="17" class="mt10">
          <template>
            <el-radio v-model="contactPlatformRadio" label="否">否</el-radio>
            <el-radio v-model="contactPlatformRadio" label="是">是</el-radio>
          </template>
        </el-col>
      </el-row>

      <div v-if="contactPlatformRadio === '是'">
        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>关联任务ID：</span>
          </el-col>
          <el-col :span="13">
            <el-input v-model="taskIdModel"></el-input>
          </el-col>
          <el-col :span="4" style="text-align: center; margin-top: 5px;">
            <el-button type="primary" size="small" @click="searchTaskId">搜索</el-button>
          </el-col>
        </el-row>
        <div v-if="taskIdInfo.length !== 0">
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>关联任务状态：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].process}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>产品分类：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].category_name}}/{{taskIdInfo[0].sub_category_name}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>签约归属：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].organize}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>邦女郎负责人：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].lady_name}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>客户公司名称：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].company_name}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>联系人：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].contact_name}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" class="edit-child-public">
              <span style="color: red">*</span>
            </el-col>
            <el-col :span="5" class="edit-child-public">
              <span>联系方式：</span>
            </el-col>
            <el-col :span="17" class="mt10">
              <span>{{taskIdInfo[0].contact_phone}}</span>
            </el-col>
          </el-row>
        </div>
        <el-row v-if="noneTaskIdText" style="text-align: center">
          <span style="color: red">该任务ID不存在或已被占用</span>
        </el-row>

      </div>

      <div v-if="contactPlatformRadio === '否'">
        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>签约归属：</span>
          </el-col>
          <el-col :span="17">
            <el-select v-model="organizeModel" placeholder="请选择活动区域">
              <el-option v-for="(item, key, index) in organizeSeleteData" :key="index" :label="item.name" :value="item.name">{{item.name}}</el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="edit-child-public">
            <span style="color: red">*</span>
          </el-col>
          <el-col :span="5" class="edit-child-public">
            <span>邦女郎负责人：</span>
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
      </div>

      <el-row style="text-align: center;padding-top: 10px;">
        <el-button type="primary" size="small" @click="cancleEditCb">取 消</el-button>
        <el-button type="primary" size="small" @click="isAddChildProduct">确 定</el-button>
      </el-row>
    </div>
</template>
<script>

import * as api from '@/api/goodproduct/common';
import upload from '@/components/Upload/upload';

export default {
  props: {
    editChildInfo: {
      type: Object,
      default: function () {
        return null
      }
    },
    currentChildId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
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

      designFileList: [],
      realFileList: [],
      isPhone: false
    }
  },
  created () {
    this.initSortData()
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
    searchTaskId () {
      let params = {
        number: this.taskIdModel
      }
      api.searchLkkerTask(params).then(res => {
        if (res.code === 300000) {
          let data = res.data
          if (data.length === 0) {
            this.noneTaskIdText = true
            this.taskIdInfo = data
          } else {
            this.noneTaskIdText = false
            this.taskIdInfo = data
          }
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    isAddChildProduct () {
      var params = {
        id: this.currentChildId,
        name: this.productNameModel
      }
      api.checkRepeatName(params).then(res => {
        if (res.code === 300000) {
          this.doAdd()
        } else {
          this.$message({
            showClose: true,
            message: '已存在相同的产品名称',
            type: 'info'
          })
        }
      })
    },
    doAdd () {
      // this.addChildDialog = false
      if (!this.editChildInfo) { // editChildInfo存在就是编辑好产品 不存在就是新增好产品
        var data = null
        if (this.contactPlatformRadio === '否') {
          data = {
            main_id: this.currentChildId,
            name: this.productNameModel,
            product_category_id: this.categoryModel[0] ? this.categoryModel[0] : '',
            sub_product_category_id: this.categoryModel[1] ? this.categoryModel[1] : '',
            description: this.introduceModel,
            design_images: this.imgResultModel,
            real_images: this.imgRealModel,

            company_name: this.companyNameModel,
            contact_name: this.contactPersonModel,
            contact_phone: this.contactPhoneModel,
            organize: this.organizeModel,
            task_id: this.taskIdModel,
            manager_name: this.managerNameModel
          }
        } else {
          data = {
            main_id: this.currentChildId,
            name: this.productNameModel,
            product_category_id: this.categoryModel[0] ? this.categoryModel[0] : '',
            sub_product_category_id: this.categoryModel[1] ? this.categoryModel[1] : '',
            description: this.introduceModel,
            design_images: this.imgResultModel,
            real_images: this.imgRealModel,

            company_name: this.taskIdInfo.length === 0 ? '' : (this.taskIdInfo[0].company_name ? this.taskIdInfo[0].company_name : ''),
            contact_name: this.taskIdInfo.length === 0 ? '' : (this.taskIdInfo[0].contact_name ? this.taskIdInfo[0].contact_name : ''),
            contact_phone: this.taskIdInfo.length === 0 ? '' : (this.taskIdInfo[0].contact_phone ? this.taskIdInfo[0].contact_phone : ''),
            organize: this.taskIdInfo.length === 0 ? '' : this.taskIdInfo[0].organize,
            task_id: this.taskIdInfo.length === 0 ? '' : this.taskIdInfo[0].task_id,
            manager_name: this.taskIdInfo.length === 0 ? '' : (this.taskIdInfo[0].lady_name ? this.taskIdInfo[0].lady_name : '')
          }
        }
        if (this.isPhone) {
          api.addLkkerChildProduct(data).then(res => {
            if (res.code === 300000) {
              let data = res.data
              this.childProductform = data
              this.$emit('isEditCb', this.childProductform)
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
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
            message: '手机号格式不正确',
            type: 'info'
          })
        }
      } else {
        this.checkRepeatNameFn() // 先检测名字在编辑子产品
      }
    },

    checkRepeatNameFn () { // 检测是否重名
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
    isEditChildProduct () { // 执行编辑子产品
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
        manager_name: this.managerNameModel,
        task_id: this.taskIdModel === '' ? '' : this.taskIdModel
      }
      api.editLkkerChildProduct(this.editChildInfo.id, data).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.$emit('lkkereditChildSuccess', true)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'info'
          })
        }
      })
    },
    uploadSuccessResult (res) {
      if (res.code === 0) {
        this.imgResultModel.push(res.file_url)
      }
    },
    formatUpFileList (str) {
      var obj = {
        url: str
      }
      return obj
    },
    remveDesignFile (files) {
      this.imgResultModel = this.formatImgUrl(files)
      this.designFileList = files
    },
    remveRealFile (files) {
      this.imgRealModel = this.formatImgUrl(files)
      this.realFileList = files
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
    cancleEditCb () {
      this.$emit('cancleEditCb', true)
    },
    formatFileList (arr) {
      var newArr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== '') {
          var obj = {
            url: arr[i]
          }
          newArr.push(obj)
        } else {
          return [{url: ''}]
        }
      }
      return newArr
    }
  },
  watch: {
    contactPhoneModel (val) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(val)) {
        this.isPhone = false
      } else {
        this.isPhone = true
      }
    },
    editChildInfo: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.introduceModel = newValue.description
          this.productNameModel = newValue.name
          this.imgResultModel = newValue.design_images
          this.designFileList = this.formatFileList(newValue.design_images)
          this.realFileList = this.formatFileList(newValue.real_images)
          this.imgRealModel = newValue.real_images
          this.categoryModel = []
          this.categoryModel.push(newValue.product_category_id)
          this.categoryModel.push(newValue.sub_product_category_id)
          if (newValue.task_id === '') {
            this.contactPlatformRadio = '否'
            this.organizeModel = newValue.organize
            this.managerNameModel = newValue.manager_name
            this.companyNameModel = newValue.company_name
            this.contactPersonModel = newValue.contact_name
            this.contactPhoneModel = newValue.contact_phone
          } else {
            this.contactPlatformRadio = '是'
            this.taskIdModel = newValue.task_id
            this.taskIdInfo = [{
              company_name: newValue.company_name,
              contact_name: newValue.contact_name,
              contact_phone: newValue.contact_phone,
              organize: newValue.organize,
              lady_name: newValue.lady_name,
              category_name: newValue.product_category_name,
              sub_category_name: newValue.sub_product_category_name,
              task_id: newValue.task_id
            }]
          }
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
.wrap {
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .edit-child-public {
    text-align: right;
    margin-top: 10px;
  }
  .mt10 {
    margin-top: 10px;
  }
}

</style>
