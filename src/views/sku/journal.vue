<template>
  <div>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
      <el-table-column
              fixed
              prop="updated_at"
              label="时间"
              width="200">
      </el-table-column>
      <el-table-column
              prop="operator_name"
              label="操作人"
              width="200">
      </el-table-column>
      <el-table-column
              prop="module"
              label="操作模块"
              width="200">
        <template slot-scope="scope">
          {{scope.row.module==1 ?'分类管理':''}}
          {{scope.row.module==2 ?'服务管理':''}}
        </template>
      </el-table-column>
      <el-table-column
              prop="type"
              label="类型"
              width="200">
        <template slot-scope="scope">
          {{scope.row.type==1 ?'新增':''}}
          {{scope.row.type==2 ?'删除':''}}
          {{scope.row.type==3 ?'修改':''}}
          {{scope.row.type==4 ?'批量修改':''}}
          {{scope.row.type==5 ?'批量删除':''}}
          {{scope.row.type==6 ?'批量新增':''}}
        </template>
      </el-table-column>
      <el-table-column
              prop="remark"
              label="内容">
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px;">
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[10]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="list.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import * as skuApi from '@/api/skuApi'
export default {
  name: 'skuApi',
  data () {
    return {
      currentPage4: 1,
      list: {
        loading: true,
        total: 1,
        page: 1,
        name: '',
        limit: 10
      },
      tableData: []
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    getlist () {
      skuApi.getServiceJourna(this.$route.params.id, {page: this.list.page, limit: 10})
        .then(data => {
          if (data.code === 300000) {
            this.tableData = data.data.data
            this.list.total = data.data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // pageSize 改变时会触发
    handleSizeChange (val) {
      this.list.page = val
      this.getlist()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.list.page = val
      this.getlist()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
