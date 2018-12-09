<template>
  <div class="relation-wrap">
    <!-- {{$route.query.id}} -->
      <div class="search-wrap">
        <li style="margin-top: 6px;">搜产品</li>
        <li>
          <el-select v-model="searchProduct">
            <el-option label="主产品编号" value="mainNumber"></el-option>
            <el-option label="子产品编号" value="number"></el-option>
            <el-option label="产品名称" value="productName"></el-option>
            <el-option label="洛可可项目名称" value="taskName"></el-option>
            <el-option label="洛可可项目编号" value="tid"></el-option>
            <el-option label="客户名称" value="companyName"></el-option>
          </el-select>
        </li>
        <li>
          <el-input v-model="searchProductDetail"></el-input>
        </li>
        <li style="margin-top: 3px;">
          <el-button type="prim
          ary" size="small" @click="doSearch">搜索</el-button>
        </li>
      </div>
      <p style="margin-top: 20px;"><span style="color: red;">说明：</span>添加关联后，原子产品将适用主产品的统一上市、销量和单价信息；关联后不可取消，请慎重选择</p>
      <div v-if="isShowTable && !noDataTips" class="has-table-wrap">
        <div>
          <template>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                label="全选"
                width="55">
              </el-table-column>
              <el-table-column
                prop="number"
                label="子产品编号"
                width="120">
              </el-table-column>
              <el-table-column
                prop="name"
                label="子产品名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="organize"
                label="归属"
                width="120">
              </el-table-column>
              <el-table-column
                prop="product_category_name"
                label="产品类型"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="task_id"
                label="关联任务/项目信息"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="company_name"
                label="客户名称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                label="所在地区"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </template>
        </div>
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
        <div class="contact-btn-wrap">
          <el-button type="primary" size="small" @click="isCancle">取 消</el-button>
          <el-button type="primary" size="small" @click="isContact">确定关联</el-button>
        </div>
      </div>
      <div v-else class="no-table">
        <span v-if="noDataTips">未搜索到相关数据，请确认信息后重新搜索</span>
      </div>
  </div>
</template>
<script>

import * as api from '@/api/goodproduct/common';

export default {
  name: 'productRelation',
  props: {
    id: {
      type: Number,
      default: 1
    },
    mainNumber: {
      type: String,
      default: ''
    },
    currentTag: {
      type: String,
      default: 'lkker'
    }
  },
  data () {
    return {
      searchProduct: '',
      searchProductDetail: '',
      tableData: [],
      searchParams: {
        mainId: '',
        mainNumber: '',
        productName: '',
        number: '',
        taskName: '',
        companyName: '',
        tid: '',

        page: '1',
        limit: '10'
      },
      totalNumber: 0,
      pageSize: 10,
      isShowTable: false,
      noDataTips: false,
      relationParams: {
        type: '1',
        mainId: '1',
        productIds: []
      }
    }
  },
  created () {
  },
  methods: {
    doSearch () {
      var params = this.searchParams
      if (this.currentTag === 'lkk') {
        api.getLkkRelationSearchData(params).then(res => {
          if (res.code === 300000) {
            var data = res.data
            if (res.data.data.length === 0) {
              this.noDataTips = true
              this.tableData = data.data
            } else {
              this.isShowTable = true
              this.totalNumber = data.total
              this.pageSize = Number(data.per_page)
              this.tableData = data.data
              this.noDataTips = false
            }
          } else {
            this.noDataTips = true
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.currentTag === 'lkker') {
        api.getLkkerRelationSearchData(params).then(res => {
          if (res.code === 300000) {
            var data = res.data
            if (res.data.data.length === 0) {
              this.noDataTips = true
              this.tableData = data.data
            } else {
              this.isShowTable = true
              this.totalNumber = data.total
              this.pageSize = Number(data.per_page)
              this.tableData = data.data
              this.noDataTips = false
            }
          } else {
            this.noDataTips = true
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    handleSelectionChange (val) {
      var idArr = []
      for (let i = 0; i < val.length; i++) {
        idArr.push(val[i].id.toString())
      }
      this.relationParams.productIds = idArr
    },
    changeCurrentPage (page) {
      this.searchParams.page = page
      this.doSearch()
    },
    isCancle () {
      this.$emit('closeRelation', true)
    },
    isContact () {
      var params = this.relationParams
      if (this.currentTag === 'lkk') {
        api.doRelative(params).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '关联成功',
              type: 'success'
            })
            this.$emit('relationCb', true)
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      } else if (this.currentTag === 'lkker') {
        api.dolkkerRelative(params).then(res => {
          if (res.code === 300000) {
            this.$message({
              showClose: true,
              message: '关联成功',
              type: 'success'
            })
            this.$emit('relationCb', true)
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
    initSearchParams () {
      this.searchParams = {
        mainId: this.id,
        mainNumber: '',
        productName: '',
        number: '',
        taskName: '',
        companyName: '',
        tid: '',

        page: '1',
        limit: '10'
      }
    }
  },

  watch: {
    searchProduct (val) {
      this.initSearchParams()
      this.searchParams[val] = this.searchProductDetail
    },
    searchProductDetail (val) {
      this.initSearchParams()
      this.searchParams[this.searchProduct] = val
    },
    id: {
      handler: function (newValue, oldValue) {
        this.relationParams.mainId = newValue
        this.searchParams.mainId = newValue
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.relation-wrap {
  border-radius: 4px;
  .search-wrap{
    &:after{
      content:"";
      display:block;
      visibility:hidden;
      clear:both;
      height:0;
    }
    li {
      float: left;
      margin-left: 12px;
    }
  }
  .has-table-wrap {
    position: relative;
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
    .contact-btn-wrap{
      text-align: center;
      margin-top: 15px;
    }

  }
  .no-table {
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
