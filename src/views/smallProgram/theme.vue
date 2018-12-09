<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          v-model="searchContent"
          clearable style="width: 20%;">
        </el-input>
        <el-button type="primary"  @click="search()">提交</el-button>
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-permission="'v1.draw.theme.create'"
          @click="editTheme(0)"
          class="add-btn">添加</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
        type="index"
        prop="number"
        label="序号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="400">
      </el-table-column>
      <el-table-column
              prop="cover"
              label="图片"
              width="300">
        <template slot-scope="obj">
          <img :src="obj.row.cover" alt="" width="300" height="300">
        </template>
      </el-table-column>
      <el-table-column
              prop="origin"
              label="原图"
              width="150">
        <template slot-scope="obj">
          <img :src="obj.row.origin" alt="" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="添加时间"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            v-permission="'v1.draw.theme.update'"
            @click="editTheme(1,scope.row.id)"
            type="primary">
            编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
              label="操作"
              width="100"
              prop="top">
        <template slot-scope="scope">
          <el-button
                  v-permission="'v1.draw.theme.create'"
                  @click="setTop(scope.row.id , scope.row.top==0 ?'置顶':'取消置顶')"
                  type="primary">
            {{scope.row.top==0 ?'置顶':'取消置顶'}}
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
    editTheme (type, id) {
      this.$router.push({
        name: 'themeDetail',
        query: {
          type: type,
          id: id
        }
      })
    },
    setTop (id, num) {
      console.log(num)
      if (num === '置顶') {
        num = 1
      } else {
        num = 0
      }
      // 置顶
      SowingMap.Edittheme(id, {
        top: String(num)
      })
        .then(data => {
          if (data.code === 300000) {
            this.getList()
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    search () {
      this.getList()
    },
    getList () {
      this.list.loading = true
      SowingMap.gettheme({page: this.list.page, name: this.searchContent, limit: this.list.limit})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
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
