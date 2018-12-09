<template>
  <div>
    <el-form>
      <el-form-item
              label="请选择时间">
        <el-date-picker
                v-model="filter.time"
                type="daterange"
                unlink-panels
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd" style="width:260px;height:40px; margin-right: 20px">
        </el-date-picker>
        操作人<el-input v-model="formInline.operatorId" placeholder="请输入操作人" style="width:150px;margin-left: 10px;margin-right: 20px"></el-input>
        类型<el-select  v-model="formInline.type"  placeholder="请选择类型" style="margin-left: 10px;margin-right: 20px">
        <el-option label="新增" value="1"></el-option>
        <el-option label="删除" value="2"></el-option>
        <el-option label="修改" value="3"></el-option>
        <el-option label="批量修改" value="4"></el-option>
        <el-option label="批量删除" value="5"></el-option>
      </el-select>
        操作模块<el-select  v-model="formInline.module"  placeholder="请选择操作模块" style="width:150px;margin-left: 10px;margin-right: 20px">
        <el-option label="分类管理" value="1"></el-option>
        <el-option label="服务管理" value="2"></el-option>
      </el-select>
        内容<el-input  v-model="formInline.remark" placeholder="请输入内容" style="width:150px;margin-left: 10px;margin-right: 20px"></el-input>
        <el-button
                type="primary"
                @click="openAddOrEditDialog()">搜索</el-button>
      </el-form-item>
    </el-form>
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
      filter: {
        time: ''
      },
      list: {
        loading: true,
        total: 1,
        page: 1,
        name: '',
        limit: 10
      },
      formInline: {
        beginDate: '',
        endDate: '',
        operatorId: '',
        remark: '',
        type: '',
        module: '',
        page: 1,
        limit: 10
      },
      tableData: []
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    // 获取服务列表
    getlist () {
      let sev = this.formInline
      skuApi.getjournalList(Object.assign(sev))
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
      this.formInline.page = val
      this.getlist()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.formInline.page = val
      this.getlist()
    },
    // 搜索
    openAddOrEditDialog () {
      if (this.filter.time) {
        this.formInline.beginDate = this.filter.time[0]
        this.formInline.endDate = this.filter.time[1]
      } else {
        this.formInline.beginDate = ''
        this.formInline.endDate = ''
      }
      this.formInline.page = 1
      this.getlist()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
