<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          v-model="searchContent"
          clearable style="width: 20%;">
        </el-input>
        <el-button type="primary"  @click="search">提交</el-button>
      </el-col>
      <el-col :span="12">
        <el-button
          v-permission="'v1.draw.content.create'"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="editContent(0)"
          class="add-btn">添加</el-button>
      </el-col>
    </el-row>
    <el-table
            :span="24"
            :data="tableData"
            v-loading="list.loading"
            border
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="400">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        width="400" style="max-height: 300px;overflow: hidden">
      </el-table-column>
      <el-table-column
        prop="status"
        label="显示"
        width="120">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="添加时间"
        width="240">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click="editContent(1,scope.row.id)"
            type="text"
            v-permission="'v1.draw.content.update'"
            size="small">
            编辑
          </el-button>
        </template>
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
import * as SowingMap from '@/api/miniProgram/sowingMap'
export default {
  data () {
    return {
      // 搜索框
      searchContent: '',
      tableData: [],
      currentPage4: 1,
      list: {
        loading: true,
        total: 1,
        page: 1,
        name: '',
        limit: 10
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 打开编辑弹窗
    editContent (type, id) {
      this.$router.push({
        name: 'contentDetail',
        query: {
          type: type,
          id: id
        }
      })
    },
    search () {
      let tepe = this.searchContent
      this.list.name = tepe
      this.getList()
    },
    getList () {
      console.log('12')
      this.list.loading = true
      SowingMap.getcontents({page: this.list.page, name: this.list.name, limit: this.list.limit})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            console.log(data.data)
            this.tableData = data.data.data
            this.list.total = data.data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.list.page = val
      this.getList(this.list.page)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
.container-main {
  position: absolute;
  top: 0;
  left: 0;
  @include base(100%, 100%);
}
.container {
  height: 100%;
  border: 1px solid #eee;
}
</style>
