<template>
  <div>
    <search-form
      :searchform='formStructure'
      :showFilterBtn="false"
      widgetWidth="200px"></search-form>
    <!-- add btn -->
    <!-- <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      class="add-btn"
      @click="openAddOrEditDialog(0)">添加</el-button> -->
    <!-- back btn -->
    <div class="back-box">
      <el-button
        type="text"
        v-if="backIdArr.length > 0"
        @click="backHandler">返回上一级</el-button>
    </div>
    <!-- table list -->
    <el-table
      :span="24"
      :data="formatListData"
      v-loading="list.loading"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%"
      class="table-box">
      <el-table-column
        prop="id"
        label="序号"
        width="70px">
      </el-table-column>
      <el-table-column prop="name" label="权限规则"></el-table-column>
      <el-table-column prop="display_name" label="权限名称"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <!-- <el-button
          size="mini"
          type="text"
          @click="openAddOrEditDialog(1, scope.row)">编辑</el-button> -->
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.permission.subPermissions'"
            @click="getSubPermissions(scope.row.id, 0)">下级权限</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.permission.delete'"
            @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- panigation box -->
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="list.page"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="list.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list.totalPage">
      </el-pagination>
    </div>
    <!-- 新建 or 编辑 权限 -->
    <el-dialog
      :title="addOrEdit.type == 0 ? '添加': '编辑'"
      :visible.sync="addOrEdit.dialogVisible"
      class="dialog-wrap"
      >
      <el-form
        :model="addOrEdit.form"
        ref="addOrEdit.form"
        label-width="100px"
        class="form-box"
        >
        <el-form-item
          label="规则"
          prop="name"
          :rules="{ required: true, message: '请填写规则', trigger: 'blur' }">
          <el-input placeholder="请填写规则(如：v1.admin-user.permission.manager)" v-model="addOrEdit.form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="display_name"
          :rules="{ required: true, message: '请填写名称', trigger: 'blur' }">
          <el-input placeholder="请填写名称" v-model="addOrEdit.form.display_name"></el-input>
        </el-form-item>
        <el-form-item
          label="上级规则"
          prop="parent_id"
          :rules="{ required: true, message: '请选择上级规则', trigger: 'change' }">
          <el-select v-model="addOrEdit.form.parent_id" placeholder="请选择上级规则">
            <el-option
              v-for="item in fitPermission"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
          :rules="{ required: true, message: '请填写排序', trigger: 'blur' }">
          <el-input placeholder="请填写排序" v-model="addOrEdit.form.sort"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon" :rules="{ required: true, message: '请选择图标', trigger: 'blur' }">
          <el-input v-model="addOrEdit.form.icon" disabled></el-input>
        </el-form-item>
        <el-form-item label="规则状态" prop="status" :rules="{ required: true, message: '请选择规则状态', trigger: 'change' }">
          <el-radio-group v-model="addOrEdit.form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示" prop="is_show" :rules="{ required: true, message: '请选择是否显示', trigger: 'change' }">
          <el-radio-group v-model="addOrEdit.form.is_show">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="规则描述"
          prop="description"
          :rules="{ required: true, message: '请填写规则描述', trigger: 'blur' }"
          >
          <el-input
            type="textarea"
            placeholder="请填写规则描述"
            v-model="addOrEdit.form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])">取 消</el-button>
        <el-button
          type="primary"
          :loading="addOrEdit.loading"
          @click="submitForm('addOrEdit.form', 'addOrEditHandler')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import SearchForm from '@/components/Form/inline'
import * as Permissions from '@/api/permisson'
import * as _array from 'lodash/array'

export default {
  name: 'Permission',
  // 组件
  components: {
    'search-form': SearchForm
  },
  data () {
    return {
      // 搜索框
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
      list: {
        tableData: [],
        loading: true,
        totalPage: 1,
        id: 0,
        page: 1,
        limit: 10
      },
      addOrEdit: {
        dialogVisible: false,
        type: 0,
        loading: false,
        form: {
          'id': 0,
          'name': '',
          'display_name': '',
          'status': '1',
          'is_show': '1',
          'parent_id': '0',
          'sort': '',
          'icon': 'fa-btc',
          'description': ''
        }
      },
      // 返回上一级的条件
      backIdArr: []
    }
  },
  created () {
    this.$store.dispatch('GetAllPermissions')
  },
  mounted () {
    this.$nextTick(function () {
      this.getList()
    })
  },
  computed: {
    // 格式化返回的列表值，只要用于前端的搜索
    formatListData () {
      let queryString = this.formStructure.form.keywords
      return this.list.tableData.filter(item => {
        let resultId = String(item.id).indexOf(queryString) > -1
        let resultName = item.name.toLowerCase().indexOf(queryString) > -1
        let resultDisplayName = item.display_name.toLowerCase().indexOf(queryString) > -1
        let resultCreatedAt = item.created_at.toLowerCase().indexOf(queryString) > -1
        return resultId || resultName || resultDisplayName || resultCreatedAt
      })
    },
    // TODO 处理全部的权限数据
    fitPermission () {
      // 根据backIdArr中的值，确定上级权限内容
      let allPermissions = this.$store.getters.permissions
      let results = []
      let idsArr = this.backIdArr
      // idsLen => 对应allPermissions中需要for...of...循环的次数
      let idsLen = idsArr.length
      let lastId = _array.last(idsArr)
      if (idsLen === 0) {
        // 顶级权限
        results.push({
          value: '0',
          label: '顶级权限'
        })
      } else if (idsLen === 1) {
        for (let item of allPermissions) {
          results.push({
            value: String(item.id),
            label: item.display_name
          })
        }
      } else if (idsLen === 2) {
        for (let item of allPermissions) {
          if (lastId == item.id) {
            for (let elem of item.childs) {
              results.push({
                value: String(elem.id),
                label: elem.display_name
              })
            }
          }
        }
      } else if (idsLen === 3) {
        for (let item of allPermissions) {
          for (let elem of item.childs) {
            if (elem.childs && elem.childs.length > 0) {
              if (lastId == elem.id) {
                for (let ele of elem.childs) {
                  results.push({
                    value: String(ele.id),
                    label: ele.display_name
                  })
                }
              }
            }
          }
        }
      } else if (idsLen === 4) {
        for (let item of allPermissions) {
          for (let elem of item.childs) {
            if (elem.childs && elem.childs.length > 0) {
              for (let ele of elem.childs) {
                if (lastId == ele.id) {
                  results.push({
                    value: String(ele.id),
                    label: ele.display_name
                  })
                }
              }
            }
          }
        }
      }
      return results
    }
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // pageSize 改变时会触发
    handleSizeChange (size) {
      this.list.limit = size
      if (this.backIdArr.length > 0) {
        this.getSubPermissions(this.list.id, 1, 1)
      } else {
        this.getList()
      }
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.list.page = val
      if (this.backIdArr.length > 0) {
        this.getSubPermissions(this.list.id, 1, 1)
      } else {
        this.getList()
      }
    },
    // 返回上一级
    backHandler () {
      let idsArr = this.backIdArr
      let id = _array.last(idsArr)
      this.backIdArr = _array.dropRight(idsArr)
      if (id === '') {
        // 不是返回顶级权限列表
        this.addOrEdit.form.parent_id = '0'
        this.list.page = 1
        this.list.limit = 10
        this.getList()
      } else {
        this.getSubPermissions(id, 1)
      }
    },
    // 获取列表信息
    getList () {
      this.list.loading = true
      Permissions.getPermissonsList({page: this.list.page, limit: this.list.limit})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            data = data.data
            this.list.tableData = data.data
            this.list.totalPage = data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 打开新建 or 编辑弹窗
    openAddOrEditDialog (type, row) {
      if (type == 0) {
        // 新增
        this.addOrEdit.dialogVisible = true
        let parentId = this.addOrEdit.form.parent_id
        if (parentId) {
          parentId = String(parentId)
        } else {
          parentId = '0'
        }
        this.addOrEdit.form = {
          'id': 0,
          'name': '',
          'display_name': '',
          'status': '1',
          'is_show': '1',
          'parent_id': parentId,
          'sort': '',
          'icon': 'fa-btc',
          'description': ''
        }
      } else {
        // 编辑
        let id = row.id
        if (!id) {
          return this.$message.error('请传入要查询的权限id' + id)
        }
        Permissions.getPermissionDetail(id)
          .then(data => {
            if (data.code === 300000) {
              data = data.data
              this.addOrEdit.dialogVisible = true
              this.addOrEdit.form = {
                'id': data.id,
                'name': data.name,
                'display_name': data.display_name,
                'status': String(data.status),
                'is_show': String(data.is_show),
                'parent_id': String(data.parent_id),
                'sort': data.sort,
                'icon': data.icon || 'fa-btc',
                'description': data.description
              }
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }
      this.addOrEdit.type = type
      // reset form
      this.$refs['addOrEdit.form'] && this.$refs['addOrEdit.form'].resetFields();
    },
    // 添加 or 编辑方法
    addOrEditHandler () {
      this.addOrEdit.loading = true
      let { type } = this.addOrEdit
      let methodsName = ''

      if (type == 0) {
        // 添加
        methodsName = 'addPermission'
      } else {
        // 编辑
        methodsName = 'editPermission'
      }
      Permissions[methodsName](this.addOrEdit.form)
        .then(data => {
          this.addOrEdit.loading = false
          if (data.code === 300000) {
            this.addOrEdit.dialogVisible = false
            this.$message.success(type == 0 ? '权限添加成功' : '编辑成功')
            this.resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])
            this.getList()
            // 权限数据变动之后，需要同步刷新
            this.$store.dispatch('GetAllPermissions')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    /**
     * 获取下级权限
     * @param id 子权限id
     * @param isBack 是否是返回操作
     * @param isPage 是否是子权限列表的分页操作
     */
    getSubPermissions (id, isBack, isPage) {
      if (!id) {
        return this.$message.error('请传入要查询下级权限所需的id' + id)
      }
      if (isBack === 0) {
        // 此处操作为获取下级 => 添加上一步的值
        if (this.backIdArr.length == 0) {
          this.backIdArr.push('')
        } else {
          this.backIdArr.push(this.list.id)
        }
      } else {
        // 次数操作为返回上一级 => 将list中的id更新
      }
      this.list.loading = true
      let param = {
        id,
        search: ''
      }
      if (!isPage) {
        this.list.page = 1
        this.list.limit = 10
      } else {
        // 两种情况：1.每页多少条改变；2.第几页改变
      }
      this.list.id = id
      Permissions.getSubPermissonslist({ ...param, page: this.list.page, limit: this.list.limit })
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            data = data.data
            this.list.tableData = data.data
            this.list.totalPage = data.total
            this.addOrEdit.form.parent_id = String(id)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 删除
    delItem (row) {
      this.$confirm(`是否确认删除<span class="red">${row.display_name}</span>`, '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        // 确认
        Permissions.delPermission(row.id)
          .then(data => {
            if (data.code === 300000) {
              this.$message.success(`${row.display_name}删除成功！`)
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }).catch(() => {
        // 取消
      })
    },
    // 重置验证的表单
    resetForm (formName, dialogTypeArr) {
      this[dialogTypeArr[0]][dialogTypeArr[1]] = false
      this.$refs[formName].resetFields();
    },
    // 提交表单
    submitForm (formName, fnName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this[fnName]()
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-wrap {
    .form-box {
      margin-top: 0;
    }
  }
  .back-box {
    margin-bottom: 10px;
  }
  /* .form-box {
    .el-input, .el-select, .el-cascader {
      width: 300px;
    }
  } */
</style>
