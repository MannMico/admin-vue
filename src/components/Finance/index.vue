<template>
  <div style="height: 100%;min-height: 500px;">
    <search-form :searchform='formStructure' v-on:queryData="getList"></search-form>
    <el-table
      :span="24"
      :data="tableData"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%">
      <el-table-column prop="apply_time" label="申请时间">
      </el-table-column>
      <el-table-column prop="task_id" label="任务编号">
      </el-table-column>
      <el-table-column prop="company_name" label="客户名称">
      </el-table-column>
      <el-table-column prop="task_name" label="任务名称">
      </el-table-column>
      <el-table-column prop="task_status" label="任务状态">
      </el-table-column>
      <el-table-column prop="withdraw_money" label="请款金额">
      </el-table-column>
      <el-table-column prop="money_type" label="请款类型">
      </el-table-column>
      <el-table-column prop="designer" label="设计师">
      </el-table-column>
      <el-table-column prop="lady_name" label="邦女郎">
      </el-table-column>
      <el-table-column prop="bond_leader_name" label="负责人审核">
      </el-table-column>
      <el-table-column prop="financial_leader_name" label="财务负责人">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column prop="opera" label="操作">
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.page"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="param.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
import searchForm from '@/components/Form/inline'
export default {
  data () {
    return {
      formStructure: {
        'task_id': {
          type: 'input',
          label: '任务编号',
          placeholder: '请输入任务编号'
        },
        'company_name': {
          type: 'input',
          label: '客户名称',
          placeholder: '请输入客户名称'
        },
        'task_name': {
          type: 'input',
          label: '任务名称',
          placeholder: '请输入任务名称'
        },
        'designer': {
          type: 'input',
          label: '设计师',
          placeholder: '请输入设计师'
        },
        'lady_name': {
          type: 'input',
          label: '邦女郎',
          placeholder: '请输入邦女郎'
        },
        'bond_leader_name': {
          type: 'input',
          label: '负责人审核',
          placeholder: '请输入负责人审核'
        },
        'financial_leader_name': {
          type: 'input',
          label: '财务负责人',
          placeholder: '请输入财务负责人'
        },
        'money_type': {
          type: 'select',
          label: '请款类型',
          placeholder: '请款类型',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '首款',
              value: 0
            },
            {
              label: '尾款',
              value: 1
            }
          ]
        },
        'create_time': {
          type: 'date',
          label: '创建时间',
          name1: 'start_time',
          name2: 'end_time'
        },
        'button': {
          type: 'button',
          btnText: '搜索'
        },
        form: {
          task_id: '',
          company_name: '',
          task_name: '',
          designer: '',
          lady_name: '',
          bond_leader_name: '',
          financial_leader_name: '',
          money_type: '',
          create_time: []
        }
      },
      param: {
        page: 1,
        page_size: 10
      },
      loading: true,
      tableData: [],
      panigation: {}
    }
  },
  // 组件
  components: {
    'search-form': searchForm
  },
  mounted () {
    this.$nextTick(function () {
      this.getList()
    })
  },
  // 计算属性
  computed: {
    totalPage: function () {
      return this.panigation.total_count || 0
    }
  },
  methods: {
    // 获取列表数据
    getList: function () {
      this.loading = true
      request({
        url: '/finance-list',
        method: 'get',
        data: { ...this.param, ...this.formStructure.form }
      }).then((data) => {
        if (data.code == 0) {
          this.loading = false
          this.tableData = data.list
          this.panigation = data.panigation
        } else {
          Message({
            message: data.msg,
            type: 'error'
          })
        }
      })
    },
    // pageSize 改变时会触发
    handleSizeChange: function (size) {
      this.param.page_size = size
      this.getList()
    },
    // currentPage 改变时会触发
    handleCurrentChange: function (val) {
      this.param.page = val
      this.getList()
    }
  }
}
</script>

<style lang="scss">
.pagination-box {
  margin: 10px 0;
  text-align: right;
}
</style>
