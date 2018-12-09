<template>
  <div class="warp" v-if="powerTabData && powerTabData.length !== 0">
    <el-row class="mt10">
      <router-link to="/bulk-import" v-if="currentTag === 'lkk'">
        <a> <el-button type="primary" size="small">批量导入好产品</el-button> </a>
      </router-link>
      <router-link to="/add-product" v-if="currentTag === 'lkker'">
        <a><el-button type="primary" size="small">新增好产品</el-button> </a>
      </router-link>
    </el-row>
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
    <el-row>
    </el-row>
    <el-form :inline="true" :model="formFilter" class="demo-form-inline" size="small">
      <el-form-item label="上市时间">
        <el-col :span="10">
          <el-button size="small" @click="lastDayFilter" :style="{'backgroundColor': yesterdayBtnFocus, color: yesterdayFontColor}">昨天</el-button>
          <el-button size="small" @click="weekFilter" :style="{'backgroundColor': weekBtnFocus, color: weekFontColor}">近一周</el-button>
          <el-button size="small" @click="monthFilter" :style="{'backgroundColor': monthBtnFocus, color: monthFontColor}">近一个月</el-button>
        </el-col>
        <el-col :span="6">
          <el-date-picker type="date" placeholder="选择日期" v-model="startTimeModel" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="1">&nbsp;&nbsp;至</el-col>
        <el-col :span="7">
          <el-date-picker type="date" placeholder="选择日期" v-model="endTimeModel" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="产品状态">
        <el-select v-model="formFilter.productStatus" placeholder="请选择活动区域">
          <el-option label="全部" value=""></el-option>
          <el-option label="未上市" value="0"></el-option>
          <el-option label="已上市" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="签约归属">
        <el-select v-model="formFilter.organize" placeholder="请选择活动区域" v-if="currentTag === 'lkker'">
          <el-option v-for="(item, key, index) in organizeSeleteData" :key="index" :label="item.name" :value="item.name">{{item.name}}</el-option>
        </el-select>
        <el-select v-model="formFilter.organize" placeholder="请选择活动区域" v-if="currentTag === 'lkk'">
          <el-option v-for="(item, key, index) in organizeSeleteData" :key="index" :label="item" :value="item">{{item}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜产品">
        <el-col :span="12">
          <el-select v-model="searchProduct">
            <el-option label="主产品编号" value="mainNumber"></el-option>
            <el-option label="子产品编号" value="number"></el-option>
            <el-option label="产品名称" value="productName"></el-option>
            <el-option label="任务名称" value="taskName"></el-option>
            <el-option label="客户名称" value="companyName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="11">
          <el-input v-model="searchProductDetail"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="产品分类">
        <div class="block">
          <el-cascader
            :options="sortProductOptions"
            :props="categoryKey"
            v-model="categoryModel">
          </el-cascader>
        </div>
      </el-form-item>
    </el-form>

    <el-row>

      <div class="btn-warp" style="font-size: 14px">
        主产品数：<span>{{product ? product.productCount : ''}}</span>款 &nbsp;&nbsp;|&nbsp;&nbsp; 已上市：<span>{{product ? product.upProductCount : ''}}</span>款 &nbsp;&nbsp;|&nbsp;&nbsp; 未上市：<span>{{product ? product.noUpProductCount : ''}}</span>款
        <el-button size="small" type="primary" class="init-btn" @click="initSearchCondition">重置</el-button>
        <el-button size="small" type="primary" class="search-btn" @click="doSearchProduct">搜索</el-button>
        <el-button size="small" type="primary" class="export-btn" @click="exportTable">导出</el-button>
      </div>
    </el-row>
    <el-row>
      <ul class="product-list-warp" id="myTable">
        <li v-for="(item, key, index) in productData" :key="index">
          <div class="product-title-warp">
            <span>主产品编号：</span> <span>{{item.number}}</span> <span class="ml-60">状态：</span> <span>{{item.state == 0 ? '未上市' : '已上市'}}</span>   <span class="ml-60">最后更新时间：</span>  <span>{{item.updated_at}}</span>  <span class="ml-60">上市时间：</span>  <span>{{item.up_time}}</span>  <div style="display: inline-block" class="ml-60" v-if="item.leftDay">上市倒计时：<span style="color:red">{{item.leftDay}}</span>天</div>  <span  class="special-font view-detail" @click="addDetailId(item.id, item.number, item.product)" >查看</span> <span class="special-font contact-child-product"  @click="relationProduct(item.id, item.number, item)">关联子产品</span> <span v-if="currentTag === 'lkk'"  class="special-font delete-btn" @click="deleteProcuct(item.id)" >删除</span>
          </div>
          <div class="product-content">
            <div class="product-price-wrap">
              <p>
                产品销量：<span v-if="Number(item.sales) !== 0">{{item.sales}}个</span> <span v-else>待完善</span>
              </p>
              <p>
                产品单价：<span v-if="Number(item.price) !== 0">{{item.price}}元</span> <span v-else>待完善</span>
              </p>
            </div>
            <div class="product-detail-wrap">
              <li class="product-detail" v-for="(itemChild, key, index)  in item.product" :key="index">
                <div class="product-col">
                  <p>子产品编号：<span>{{itemChild.number}}</span> </p>
                  <p>子产品名称：<span>{{itemChild.name}}</span></p>
                  <p>产品类型：<span>{{itemChild.product_category_name}}/{{itemChild.sub_product_category_name}}</span></p>
                </div>
                <div class="product-col">
                  <p>任务ID：<span>{{itemChild.project_number}}</span> </p>
                  <p>任务名称：<span>{{itemChild.project_name}}</span></p>
                  <p>所属地区：<span>{{itemChild.organize}}</span></p>
                </div>
                <div class="product-col">
                  <p>客户名称：<span>{{itemChild.company_name}}</span> </p>
                  <p>联系人：<span>{{itemChild.contact_name}}</span></p>
                </div>
              </li>
            </div>
          </div>
        </li>
        <el-row class="mt10">
          <div class="product-pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="productTotal"
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="changeCurrentPage">
            </el-pagination>
          </div>
        </el-row>
      </ul>
    </el-row>
    <el-dialog :width="'80%'" :close-on-click-modal="false" title="添加关联子产品" :visible.sync="relationDialog" >
      <div>
        <relation-product
          :id="currentId"
          :mainNumber="mainNumberToRelation"
          :currentTag="currentTag"
          @closeRelation="closeRelation"
          @relationCb="relationCb"
        ></relation-product>
      </div>
    </el-dialog>
    <el-dialog :width="'80%'" :close-on-click-modal="false" title="提示" :visible.sync="deleteDialog">
      <div style="position: relative;">
        <p class="delete-text"><i class="el-icon-warning" style="width: 20px; color: #E6A23C;"></i>删除该主产品后其包含的子产品信息将一并删除，确定删除吗？</p>
        <div class="delete-btn-wrap">
          <el-button type="primary" size="small" @click="cancleDelete">取 消</el-button>
          <el-button type="primary" size="small" @click="isDelete">确定删除</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import * as api from '@/api/goodproduct/common'
import relationProduct from './RelationProduct'

export default {
  name: 'good-product',
  data () {
    return {
      powerTabData: [
        {
          label: '洛客',
          name: 'lkker'
        },
        {
          label: '洛可可',
          name: 'lkk'
        }
      ],
      activeTabName: 'lkker',
      timerModle: '',
      formFilter: {
        startTime: '',
        endTime: '',
        productStatus: '',
        organize: '',
        category_id: '',
        sub_category_id: '',
        mainNumber: '',
        productName: '',
        number: '',
        taskName: '',
        companyName: '',
        page: '1',
        limit: '10'
      },
      organizeSeleteData: [],
      category: null,
      sortProductOptions: [],
      categoryModel: [],
      startTimeModel: '',
      endTimeModel: '',
      categoryKey: {
        value: 'id',
        label: 'name',
        children: 'sub_category'
      },
      productData: [],
      product: null,
      prev: 1,
      pager: 1,
      next: 1,
      currentPage: 1,
      productTotal: 10,
      pageSize: 10,
      searchProduct: '',
      searchProductDetail: '',
      relationDialog: false,
      currentId: 1,
      mainNumberToRelation: '',
      deleteDialog: false,
      deteleParams: '',
      currentTag: 'lkker',
      isEverSearched: false,
      yesterdayBtnFocus: '#fff',
      yesterdayFontColor: '#606266',
      weekBtnFocus: '#fff',
      weekFontColor: '#606266',
      monthBtnFocus: '#fff',
      monthFontColor: '#606266'
    }
  },
  created () {
    this.getTabByRouter(this.$store.getters.goodProductRouter)
    if (this.powerTabData && this.powerTabData.length) {
      this.currentTag = this.powerTabData[0].name
    }
    this.initProductData()
    this.initProductFilterData()
  },
  methods: {
    getTabByRouter (router) {
      if (router) {
        let tag = router.childs[0].childs
        let newTag = []
        for (let i = 0; i < tag.length; i++) {
          if (tag[i].name === 'v1.goodProduct.lkker') {
            let tagItem = {
              label: '洛客',
              name: 'lkker'
            }
            newTag.push(tagItem)
          } else if (tag[i].name === 'v1.goodProduct.lkk') {
            let tagItem = {
              label: '洛可可',
              name: 'lkk'
            }
            newTag.push(tagItem)
          }
        }
        this.powerTabData = newTag
      } else {
        this.powerTabData = []
        this.powerTabData = newTag
      }
    },
    initProductFilterData () {
      if (this.currentTag === 'lkker') {
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
      } else if (this.currentTag === 'lkk') {
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
      }
    },
    initProductData () {
      let params = this.deleteNullKey(this.formFilter)
      if (this.currentTag === 'lkk') {
        api.getLkkProductList(params).then(res => {
          if (res.code === 300000) {
            let data = res.data
            this.product = data
            this.productTotal = data.total
            this.pageSize = Number(data.per_page)
            this.productData = data.data
            console.log(this.productData)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.currentTag === 'lkker') {
        api.getLkkerProductList(params).then(res => {
          if (res.code === 300000) {
            let data = res.data
            this.product = data
            this.productTotal = data.total
            this.pageSize = Number(data.per_page)
            this.productData = data.data
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
    deleteNullKey (obj) { // 重置之后formlist有时会多出个 '' : '' 删除它
      for (var key in obj) {
        if (key === '') {
          delete obj[key]
        }
      }
      return obj;
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
    changeTab (tabItem) {
      var powerTabData = this.powerTabData
      Object.assign(this.$data, this.$options.data())
      this.powerTabData = powerTabData
      if (tabItem.name === 'lkker') {
        this.currentTag = 'lkker'
      } else {
        this.currentTag = 'lkk'
      }
      this.initProductFilterData()
      this.initProductData()
    },
    formatTime (date) {
      if (date === '' || !date) {
        return ''
      } else {
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y + M + D + h + m + s
      }
    },
    lastDayFilter () {
      let nowDate = new Date()
      let yestodaryTime = nowDate.getTime() - 24 * 60 * 60 * 1000
      this.formFilter.endTime = this.formatYesterDay(nowDate)
      this.formFilter.startTime = this.formatYesterDay(new Date(yestodaryTime))
      this.yesterdayBtnFocus = '#ecf5ff'
      this.yesterdayFontColor = '#409EFF'
      this.weekBtnFocus = '#fff'
      this.weekFontColor = '#606266'
      this.monthBtnFocus = '#fff'
      this.monthFontColor = '#606266'
    },
    formatYesterDay (date) {
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      return Y + M + D + '00:00:00'
    },
    weekFilter () {
      let nowDate = new Date()
      let yestodaryTime = nowDate.getTime() - 24 * 60 * 60 * 1000 * 7
      this.formFilter.endTime = this.formatTime(nowDate)
      this.formFilter.startTime = this.formatTime(new Date(yestodaryTime))
      this.yesterdayBtnFocus = '#fff'
      this.yesterdayFontColor = '#606266'
      this.weekBtnFocus = '#ecf5ff'
      this.weekFontColor = '#409EFF'
      this.monthBtnFocus = '#fff'
      this.monthFontColor = '#606266'
    },
    monthFilter () {
      let nowDate = new Date()
      let yestodaryTime = nowDate.getTime() - 24 * 60 * 60 * 1000 * 30
      this.formFilter.endTime = this.formatTime(nowDate)
      this.formFilter.startTime = this.formatTime(new Date(yestodaryTime))
      this.yesterdayBtnFocus = '#fff'
      this.yesterdayFontColor = '#606266'
      this.weekBtnFocus = '#fff'
      this.weekFontColor = '#606266'
      this.monthBtnFocus = '#ecf5ff'
      this.monthFontColor = '#409EFF'
    },
    doSearchProduct () {
      this.isEverSearched = true
      this.initProductData(this.formFilter)
    },
    initSearchCondition () {
      var powerTabData = this.powerTabData
      var currentTag = this.currentTag
      Object.assign(this.$data, this.$options.data())
      this.currentTag = currentTag
      this.powerTabData = powerTabData
      this.initProductData()
      this.initProductFilterData()
    },
    changeCurrentPage (page) {
      if (!this.isEverSearched) {
        this.formFilter.startTime = ''
        this.formFilter.endTime = ''
      }
      this.currentPage = page
      this.formFilter.page = page
      this.initProductData(this.formFilter)
    },
    addDetailId (id, number, item) {
      this.$router.push({path: 'product-detail', query: {id: id, number: number, tag: this.currentTag, item: item}})
    },
    deleteProcuct (id) {
      this.deteleParams = id
      this.deleteDialog = true
    },
    relationProduct (id, number, item) {
      this.currentId = id
      this.mainNumberToRelation = number.toString()
      this.relationDialog = true
    },
    closeRelation (val) {
      if (val) {
        this.relationDialog = false
      }
    },
    relationCb (val) {
      if (val) {
        this.relationDialog = false
        this.initProductData(this.formFilter)
      }
    },
    cancleDelete () {
      this.deleteDialog = false
    },
    isDelete () {
      var params = this.deteleParams
      api.detaleProduct(params).then(res => {
        if (res.code === 300000) {
          this.$message({
            showClose: true,
            message: '删除主产品成功',
            type: 'success'
          })
          this.formFilter.page = this.currentPage
          this.initProductData(this.formFilter)
          this.deleteDialog = false
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error'
          })
          this.deleteDialog = false
        }
      })
    },
    exportTable () {
      var params = {
        startTime: this.formFilter.startTime,
        endTime: this.formFilter.endTime,
        productStatus: this.formFilter.productStatus,
        organize: this.formFilter.organize,
        category_id: this.formFilter.category_id,
        sub_category_id: this.formFilter.sub_category_id,
        mainNumber: this.formFilter.mainNumber,
        productName: this.formFilter.productName,
        number: this.formFilter.number,
        taskName: this.formFilter.taskName,
        companyName: this.formFilter.companyName
      }
      if (this.currentTag === 'lkker') {
        api.exportLkker(params).then(res => {
          if (res.code === 300000) {
            window.location.href = res.data
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.currentTag === 'lkk') {
        api.exportLkk(params).then(res => {
          if (res.code === 300000) {
            window.location.href = res.data
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  },
  watch: {
    categoryModel (idArr) {
      if (idArr.length !== 0) {
        this.formFilter.category_id = idArr[0].toString()
        this.formFilter.sub_category_id = idArr[1].toString()
      }
    },
    startTimeModel (time) {
      this.formFilter.startTime = this.formatTime(time)
    },
    endTimeModel (time) {
      this.formFilter.endTime = this.formatTime(time)
    },
    searchProduct (val) {
      this.formFilter[val] = this.searchProductDetail
    },
    searchProductDetail (val) {
      this.formFilter[this.searchProduct] = val
    },
    powerTabData (val) {
      if (val.length === 0) {
        this.$message({
          showClose: true,
          message: '没有权限',
          type: 'info'
        })
      }
    }
  },
  components: {
    relationProduct
  }
}
</script>
<style lang="scss" scoped>
$row-distance: 10px;

.ml-60 {
  margin-left: 60px;
}
.mt10 {
  margin-top: $row-distance;
}
  .warp {
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .btn-warp {
      position: relative;
      padding: 10px 0;
      color: red;
      font-size: 14px;
      .search-btn {
        position: absolute;
        top: 10px;
        right: 100px;
      }
      .init-btn {
        position: absolute;
        top: 10px;
        right: 161px;
      }
      .export-btn {
        position: absolute;
        top: 10px;
        right: 40px;
      }
    }
    .product-list-warp {
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 14px;
      .product-title-warp {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        padding-right: 230px;
        background:#ecf5ff;
        border: 1px solid #d8e0e0;
        color: #5e6161;
        .special-font {
          position: absolute;
          top: 10px;
          color: #7D7BFB;
          font-size: 12px;
          cursor: pointer;
        }
        .view-detail {
          right: 134px;
        }
        .contact-child-product {
          right: 63px;
        }
        .delete-btn {
          right: 30px;
        }
      }
      .product-content {
        position: relative;
        padding: 10px 10px 10px 180px;
        background: #FFFFFF;
        border: 1px solid #d8e0e0;
        border-top: none;
        border-bottom: none;
        color: #5e6161;
        .product-price-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          left: 80px;
          p {
            margin-top: 10px;
          }
        }
        .product-detail-wrap {
          .product-detail {
            box-sizing: border-box;
            padding: 10px;
            background: #FFFFFF;
            border: 1px solid #d8e0e0;
            width: 100%;
            display: -webkit-flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            .product-col {
              -webkit-flex: 1;
              p {
                margin-top: 10px;
              }
            }
            border-bottom: none;
            &:last-child {
              border-bottom: 1px solid #d8e0e0;
            }
          }
        }
      }
      .product-pagination {
        display: -webkit-flex;
        justify-content: center;
      }
    }

    .delete-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      top: -45px;
      white-space: nowrap;
    }
    .delete-btn-wrap {
      margin-top: 50px;
      text-align: center;
    }
  }

</style>
