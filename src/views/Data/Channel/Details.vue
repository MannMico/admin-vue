<template>
  <div>
    <div class="search-btn">
      <el-input
        placeholder="输入渠道utm_source"
        v-model="param.utm_source"
        style="width: 200px;"
        @keyup.enter.native="serachDetailsData(1)">
      </el-input>
      <i class="el-icon-search" @click="serachDetailsData(1)"></i>
    </div>
    <el-button @click="exportDetail" icon="el-icon-download">导出</el-button>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      @sort-change="sortChangehandler"
      :default-sort = "{prop: 'pv_num', order: 'descending'}"
      >
      <el-table-column
        label="渠道名称">
          <template slot-scope="scope">
            <router-link :to="'/channel/detail/' + scope.row.utm_source">{{scope.row.channel_name}}</router-link>
          </template>
      </el-table-column>
      <el-table-column
        prop="utm_source"
        label="utm_source">
      </el-table-column>
      <el-table-column
        prop="pv_num"
        label="浏览量（PV）"
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="uv_num"
        label="访客数（UV）"
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="register_num"
        label="注册用户数"
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="clue_num"
        label="收集线索数"
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="visitor_num"
        label="线索访客数"
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="visitor_rate"
        label="线索/访客比率"
        :formatter="formatterRate">
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="productTotal"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="changeCurrentPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import * as Channels from '@/api/channels'

export default {
  name: 'ChannelDetails',
  props: {
    // 时间筛选条件
    filter: {
      type: Object,
      required: true
    },
    // 当前模块
    module: {
      type: String,
      required: true
    }
  },
  data () {
    let tableData = []
    for (let i = 0; i < 10; i++) {
      tableData.push({
        utm_source: 0,
        pv_num: 0,
        uv_num: 0,
        register_num: 0,
        clue_num: 0,
        visitor_num: 0,
        visitor_rate: 0,
        channel_name: '百度'
      })
    }
    return {
      param: {
        sort_column: 'pv_num', // 默认按pv降序搜索
        sort_type: 'desc',
        utm_source: ''
      },
      loading: false,
      tableData: [],
      currentPage: 1,
      productTotal: 10,
      pageSize: 10
    }
  },
  watch: {
    'filter.time': function (newVal, oldVal) {
      if (newVal && newVal.length && this.module === '3') {
        this.serachDetailsData()
      }
    },
    'module': function (newVal, oldVal) {
      // 选择的模块变化
      if (newVal === '3') {
        this.serachDetailsData()
      }
    }
  },
  computed: {
    // 格式化查询参数
    searchParams () {
      let result = {}
      let { filter } = this
      if (filter.time.length > 0) {
        // 选中的日期
        result = {
          begin_at: filter.time[0],
          end_at: filter.time[1]
        }
      }
      result = {
        ...result,
        ...this.param
      }
      for (let key in result) {
        if (!result[key]) {
          delete result[key]
        }
      }
      return result
    }
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    exportDetail () {
      let params = {...this.searchParams, ...this.param, export: 1}
      if (!params.utm_source) {
        delete params.utm_source
      }
      delete params.sort_column
      delete params.sort_type
      Channels.channelDetailExport(params)
        .then((res) => {
          if (res.code == 300000) {
            window.location.href = `${Channels.envVariate}/${res.data.uri}`
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    serachDetailsData (page) {
      if (this.module === '3') {
        this.loading = true
        if (!page) {
          page = 1
        }
        let param = {...this.searchParams, page: page, size: 10}
        Channels.channelDetailsCount(param)
          .then(res => {
            this.loading = false
            if (res.code === 300000) {
              this.tableData = res.data.data
              this.productTotal = res.data.total
              this.pageSize = Number(res.data.per_page)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(this.errHandler)
      }
    },
    // 格式化线索/访客比率
    formatterRate (row, column, cellValue, index) {
      let rate = 0
      if (cellValue > 0) {
        rate = Math.floor(cellValue * 100).toFixed(2) + '%'
      }
      return rate
    },
    // 远程排序事件
    sortChangehandler (column, prop, order) {
      let rules = {
        ascending: 'asc',
        descending: 'desc'
      }
      let { param } = this
      this.param = {
        ...param,
        sort_column: column.prop,
        sort_type: rules[column.order]
      }
      this.serachDetailsData()
    },
    changeCurrentPage (page) {
      this.serachDetailsData(page)
    }
  }
}
</script>
<style lang="scss" scoped>
  .search-btn {
    position: relative;
    display: inline-block;
    .el-icon-search {
      position: absolute;
      top: 12px;
      right: 10px;
    }
  }
</style>
