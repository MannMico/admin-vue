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
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-permission="'v1.draw.banner.create'"
          @click="editSowingMap(0)"
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
        width="300">
      </el-table-column>
      <el-table-column
        prop="related_type"
        label="关联类型"
        width="120">
        <template slot-scope="scope">
          {{scope.row.related_type==1 ?'关联主题':''}}
          {{scope.row.related_type==2 ?'关联内容':''}}
        </template>
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序"
        width="120">
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
        prop="status"
        label="显示"
        width="120">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="添加时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="view_num"
        label="点击次数"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            v-permission="'v1.draw.banner.update'"
            @click="editSowingMap(1,scope.row.id)"
            type="text"
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
  name: 'sowingMap',
  data () {
    var formData = {
      cover: '',
      related_type: ''
    }
    var rules = {}
    var rule = [{required: true, message: '必填'}]
    var formArr = Object.keys(formData)
    formArr.forEach(function (v) {
      rules[v] = rule
    })
    return {
      // 搜索框
      currentPage4: 1,
      list: {
        loading: true,
        total: 1,
        page: 1,
        name: '',
        limit: 10
      },
      searchContent: '',
      tableData: [],
      formData: formData,
      rules: rules,
      formStructure: {
        'keywords': {
          type: 'input',
          label: '搜索',
          placeholder: 'ID，规则，名称，时间'
        },
        form: {
          keywords: ''
        }
      },
      selectCompany (obj) {
        this.formData.companyId = obj.id
      },
      // 返回上一级的条件
      backIdArr: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    upload1 (file) {
      this.tableData.cover = file.file_url
    },
    // 打开编辑弹窗
    editSowingMap (type, id) {
      this.$router.push({
        name: 'sowingMapDetail',
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
      this.list.loading = true
      SowingMap.getSowingMap({page: this.list.page, name: this.list.name, limit: this.list.limit})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            this.tableData = data.data.data
            this.list.total = data.data.total
            console.log(data.data.total)
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
</style>
