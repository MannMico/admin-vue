<template>
  <div>
    <el-form :model="formInline">
      <el-form-item>
        SPU ID   <el-input v-model="formInline.spuId" placeholder="请输入SPU ID" style="width: 200px;margin-right: 100px"></el-input>
        服务名称  <el-input v-model="formInline.name" placeholder=" 请输入服务名称" style="width: 200px;margin-right: 100px"></el-input>
        状态    <el-select v-model="formInline.status" placeholder="请选择状态" style="width: 300px">
        <el-option label="上线" value="1"></el-option>
        <el-option label="下线" value="2"></el-option>
      </el-select><br>
        <div style="height: 20px"></div>
        分类
        <el-select v-model="formInline.headCategoryId" placeholder="一级" style="width: 200px"  @change="changeShop">
          <el-option
                  v-for="item in oneOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="formInline.secondCategoryId" placeholder="二级" style="width: 200px" @change="changeOneSelect">
          <el-option
                  v-for="item in twoOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="formInline.tailCategoryId" placeholder="三级" style="width: 200px">
          <el-option
                  v-for="item in threeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                class="add-btn"
                @click="editContent(1)">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%;">
      <el-table-column
              prop="id"
              label="SPU ID"
              width="120">
      </el-table-column>
      <el-table-column
              prop="name"
              label="服务名称(SPU)"
              width="250">
      </el-table-column>
      <el-table-column
              prop="category.name"
              label="分类"
              width="250">
      </el-table-column>
      <el-table-column
              prop="status"
              label="状态"
              width="100">
        <template slot-scope="scope">
          {{scope.row.status==1 ?'上线':''}}
          {{scope.row.status==2 ?'下线':''}}
        </template>
      </el-table-column>
      <el-table-column
              prop="skuCount"
              label="服务数量"
              width="100">
      </el-table-column>
      <el-table-column
              prop="sort"
              label="排序"
              width="100">
      </el-table-column>
      <el-table-column
              label="操作"
              width="300">
        <template slot-scope="scope">
          <el-button @click="handleTypeShow(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="handleTypeHot(scope.row)" type="text" size="small">下线</el-button>
          <el-button @click="handleTypeHot(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleTypeHot(scope.row)" type="text" size="small">日志</el-button>
          <el-button @click="handleTypeHot(scope.row)" type="text" size="small">删除</el-button>
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
import * as skuApi from '@/api/skuApi'
export default {
  name: 'skuApi',
  data () {
    return {
      oneOptions: '',
      twoOptions: '',
      threeOptions: '',
      currentPage4: 1,
      list: {
        loading: true,
        total: 1,
        page: 1,
        name: '',
        limit: 10
      },
      formInline: {
        spuId: '',
        name: '',
        status: '',
        headCategoryId: '',
        secondCategoryId: '',
        tailCategoryId: '',
        page: 1,
        limit: 10
      },
      fileList: {},
      topicTypeId: '',
      dialogUploadVisible: false,
      dialogHotVisible: false,
      paginate: {},
      loading: false,
      tableData: []
    }
  },
  created () {
    this.getlist()
    this.onelist()
  },
  methods: {
    // 打开编辑弹窗
    editContent (type, id) {
      this.$router.push({
        name: 'addservice',
        query: {
          type: type,
          id: id
        }
      })
    },
    // 获取一级分类
    onelist () {
      skuApi.getOneClass({})
        .then(data => {
          if (data.code === 300000) {
            this.oneOptions = data.data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 获取服务列表
    getlist () {
      let sev = this.formInline
      skuApi.getService(Object.assign(sev))
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
    // 获取子分类名称
    clide (value, index) {
      skuApi.getTwoclassification(value, {})
        .then(data => {
          if (data.code === 300000) {
            if (index == 1) {
              this.twoOptions = data.data
            }
            if (index == 2) {
              this.threeOptions = data.data
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 获取二级分类
    changeShop (value) {
      let index = 1
      this.clide(value, index)
    },
    // 获取三级分类
    changeOneSelect (value) {
      let index = 2
      this.clide(value, index)
    },
    handleClick (tab, event) {
    },
    // pageSize 改变时会触发
    handleSizeChange (size) {
      this.list.limit = size
      this.getlist()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.list.page = val
      this.getlist()
    },
    onSubmit () {
      this.list.page = 1
      this.getlist()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
