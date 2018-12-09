<template>
  <div>
    <el-form :model="formInline">
      <el-form-item>
        SPU ID   <el-input v-model="formInline.spuId" placeholder="请输入SPU ID" style="width: 200px;margin-right: 50px"></el-input>
        服务名称  <el-input v-model="formInline.name" placeholder=" 请输入服务名称" style="width: 200px;margin-right: 50px"></el-input>
        状态
        <el-select v-model="formInline.status" placeholder="请选择状态" style="width: 200px;margin-right: 50px">
        <el-option label="上线" value="1"></el-option>
        <el-option label="下线" value="2"></el-option>
      </el-select>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%;" >
      <el-table-column
              prop="id"
              label="SPU ID"
              width="120" align="center">
      </el-table-column>
      <el-table-column
              prop="name"
              label="服务名称(SPU)"
              width="250" align="center">
      </el-table-column>
      <el-table-column
              prop="category.name"
              label="分类"
              width="250" align="center">
      </el-table-column>
      <el-table-column
              prop="status"
              label="状态"
              width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.status==1 ?'上线':''}}
          {{scope.row.status==2 ?'下线':''}}
        </template>
      </el-table-column>
      <el-table-column
              prop="skuCount"
              label="服务数量"
              width="100" align="center">
      </el-table-column>
      <el-table-column
              prop="sort"
              label="排序"
              width="100" align="center">
      </el-table-column>
      <el-table-column
              label="操作">
        <template slot-scope="scope">
          <router-link :to="{ path: `/sku/seeService/${scope.row.id}` }" style="color: #ffffff">
            <el-button  type="primary" size="small">
              查看
            </el-button>
          </router-link>
          <router-link :to="{ path: `/sku/editors/${scope.row.id}` }" style="color: #ffffff">
            <el-button  type="primary" size="small">
              编辑
            </el-button>
          </router-link>
          <router-link :to="{ path: `/sku/journal/${scope.row.id}` }" style="color: #ffffff">
            <el-button type="primary" size="small">
              日志
            </el-button>
          </router-link>
          <router-link :to="{ path: `/sku/introSpu/${scope.row.id}` }" style="color: #ffffff">
            <el-button type="primary" size="small">
              编辑服务介绍
            </el-button>
          </router-link>
          <el-button @click="viewDetails(scope.row.id, scope.row.status)" type="primary" size="small">
            {{scope.row.status==2 ?'上线':''}}
            {{scope.row.status==1 ?'下线':''}}
          </el-button>
          <el-button @click="handleTypeHot(scope.row.id , scope.row.name)" type="danger" size="small">删除</el-button>
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
      if (this.$route.params.type == 1) {
        this.formInline.headCategoryId = this.$route.params.id
      } else {
        this.formInline.headCategoryId = ''
      }
      if (this.$route.params.type == 2) {
        this.formInline.secondCategoryId = this.$route.params.id
      } else {
        this.formInline.secondCategoryId = ''
      }
      if (this.$route.params.type == 3) {
        this.formInline.tailCategoryId = this.$route.params.id
      } else {
        this.formInline.tailCategoryId = ''
      }
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
    // 修改分类状态
    viewDetails (id, st) {
      let status = st
      if (st == '1') {
        status = 2
      } else {
        status = 1
      }
      skuApi.putStatusService(id, {status: status})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            this.$message.success('操作成功')
            this.list.page = 1
            this.getlist()
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
              this.formInline.secondCategoryId = ''
            }
            if (index == 2) {
              secondCategoryId = ''
              this.formInline.tailCategoryId = ''
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 删除服务接口
    handleTypeHot (id, name) {
      this.$confirm('是否确认删除<span class="red">' + name + '</span> ？', '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        skuApi.deleteService(id)
          .then(data => {
            if (data.code === 300000) {
              this.$message.success('操作成功')
              this.list.page = 1
              this.getlist()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }).catch(() => {
        // 取消
      })
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
    handleSizeChange (page) {
      this.formInline.page = page
      this.getlist()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.formInline.page = val
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
