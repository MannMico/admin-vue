<template>
  <div>
    <!-- add btn -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      class="add-btn"
      v-permission="'v1.adminUser.role.create'"
      @click="openAddOrEditDialog(0)">添加</el-button>
    <!-- table list -->
    <el-table
      :span="24"
      :data="list.tableData"
      v-loading="list.loading"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%"
      class="table-box">
      <el-table-column
        type="index"
        label="序号"
        width="70px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" label="组管理">
      </el-table-column>
      <el-table-column prop="user_count" label="用户数">
        <template slot-scope="scope">
          <router-link :to="{ path: `/account?roleId=${scope.row.id}` }">
            <el-tooltip class="item" effect="dark" :content="`${scope.row.name}-人数：${scope.row.user_count}`" placement="top-start">
              <el-button type="text" class="link">
                {{ scope.row && scope.row.user_count }}
              </el-button>
            </el-tooltip>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.role.show'"
            @click="viewLogs(scope.row.id)">日志</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.role.update'"
            @click="openAddOrEditDialog(1, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.role.set.permissions'"
            @click="openPermissonDialog(scope.row.id)">设置权限</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.role.delete'"
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
    <!-- 查看日志 -->
    <el-dialog
      title="日志"
      :visible.sync="detail.dialogVisible">
      <el-table
        :data="detail.operateLogs"
        border
        v-loading="detail.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        style="width: 100%">
        <el-table-column
          prop="created_at"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="admin_user.name"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="permission.display_name"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="内容">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加/编辑 -->
    <el-dialog
      :title="addOrEdit.type == 0 ? '添加' : '编辑'"
      :visible.sync="addOrEdit.dialogVisible"
      width="600px">
      <el-form
        ref="addOrEdit.form"
        :model="addOrEdit.form"
        label-width="100px"
        >
        <el-form-item
          label="组名称："
          prop="name"
          :rules="{ required: true, message: '请填写组名称', trigger: 'blur' }">
          <el-input
            placeholder="请填写组名称"
            v-model="addOrEdit.form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="成员：">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="addOrEdit.userName"
            :fetch-suggestions="queryRoleBySearch"
            :trigger-on-focus="false"
            valueKey="name"
            placeholder="请输入成员姓名"
            @select="handleSelectRole"
            >
            <template slot-scope="props">
              <div class="name">成员姓名：{{ props.item.name }}</div>
              <span class="phone">电话：{{ props.item.phone }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item
          v-show="addOrEdit.userList.length"
          label="已选成员：">
          <el-table
            :data="addOrEdit.userList"
            border
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%;max-height: 300px;overflow-y: auto;">
            <el-table-column
              prop="identify"
              label="身份"
              :formatter="formatIdentifyRole">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="联系方式">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="delRole(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])">
          取 消
        </el-button>
        <el-button
          type="primary"
          :loading="addOrEdit.loading"
          @click="submitForm('addOrEdit.form', 'addOrEditHandler')">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 权限弹窗 -->
    <el-dialog
      title="设置权限"
      :visible.sync="permission.dialogVisible">
      <multistage-item
        v-for="(item, index) in allPermissions"
        :key="index + 'top'"
        :multistage="item"
      ></multistage-item>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="permission.dialogVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          :loading="permission.loading"
          @click="addPermissions">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import MultistageItem from '@/components/Multistage/permission'
import * as Roles from '@/api/accounts/role'
import { getLogs } from '@/api/common'
import { getUserListBySearch } from '@/api/accounts/organize'
import * as _function from 'lodash/function'
import * as _array from 'lodash/array'

export default {
  name: 'Role',
  components: { MultistageItem },
  data () {
    return {
      list: {
        tableData: [],
        loading: true,
        totalPage: 1,
        page: 1,
        limit: 10
      },
      // 查看详情
      detail: {
        loading: true,
        dialogVisible: false,
        operateLogs: []
      },
      // 添加/编辑
      addOrEdit: {
        // 0：添加，1：编辑
        type: 0,
        loading: false,
        dialogVisible: false,
        form: {
          id: 0,
          name: '',
          userIds: []
        },
        // 每次选中的成员
        userName: '',
        // 已选择的成员列表
        userList: []
      },
      // 权限
      permission: {
        loading: false,
        dialogVisible: false,
        id: 0
      },
      formatPermissions: [],
      allPermissions: []
    }
  },
  created () {
    this.$store.dispatch('GetAllPermissions')
  },
  mounted () {
    this.$nextTick(function () {
      this.getList()
      setTimeout(() => {
        this.getAllPermissions()
      }, 2000)
    })
  },
  computed: {
  },
  methods: {
    // 处理全部权限数据，过滤出前端需要的数据
    getAllPermissions () {
      let allPermission = this.$store.getters.permissions
      let results = []
      for (let item of allPermission) {
        let topLevel = {
          id: item.id,
          level: 1,
          display_name: item.display_name,
          is_show: item.is_show,
          status: item.status,
          childs: [],
          // 是否是展开，默认“不展开”
          isShow: false
        }
        item.childs = item.childs || []
        for (let elem of item.childs) {
          let secondLevel = {
            id: elem.id,
            level: 2,
            display_name: elem.display_name,
            is_show: elem.is_show,
            indeterminate: false,
            status: elem.status,
            parent_id: elem.parent_id,
            childs: [],
            checkAll: false,
            isShow: false,
            values: []
          }
          elem.childs = elem.childs || []
          for (let ele of elem.childs) {
            let threeLevel = {
              id: ele.id,
              level: 3,
              display_name: ele.display_name,
              is_show: ele.is_show,
              status: ele.status,
              parent_id: ele.parent_id,
              childs: []
            }
            secondLevel.childs.push(threeLevel)
          }
          topLevel.childs.push(secondLevel)
        }
        results.push(topLevel)
      }
      this.allPermissions = results
    },
    // 处理allPermissions中的数据，获取选中的值
    getCheckPermissions () {
      let permissions = this.allPermissions
      let results = []
      for (let item of permissions) {
        // 1. 判断childs下有无选中的
        for (let ele of item.childs) {
          if (ele.childs && ele.childs.length > 0) {
            // 还有下级权限
            // 如果values下有值，则连父级id也push进去
            if (ele.values && ele.values.length > 0) {
              results.push(ele.parent_id)
              results.push(ele.id)
              results.push(ele.values)
            }
          } else {
            // 没有下级权限
            // 是否选中
            if (ele.checkAll) {
              results.push(ele.parent_id)
              results.push(ele.id)
            }
          }
        }
      }
      // 将数组处理为一维数组并去重
      results = _array.uniq(_array.flattenDeep(results))
      return results
    },
    // 处理序号
    indexMethod (index) {
      let { page, limit } = this.list
      return (page - 1) * limit + index + 1;
    },
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // pageSize 改变时会触发
    handleSizeChange (size) {
      this.list.limit = size
      this.getList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.list.page = val
      this.getList()
    },
    // 获取列表信息
    getList () {
      this.list.loading = true
      Roles.getRoleList({page: this.list.page, limit: this.list.limit})
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
    // 打开添加、编辑弹窗
    openAddOrEditDialog (type, row) {
      this.addOrEdit.type = type
      // 重置数据
      this.addOrEdit.form = {
        id: 0,
        name: '',
        userIds: []
      }
      this.addOrEdit.userName = ''
      this.addOrEdit.userList = []
      if (type == 1) {
        // 编辑 -> 获取详情
        Roles.getRoleDetail(row.id)
          .then(data => {
            if (data.code === 300000) {
              this.addOrEdit.dialogVisible = true
              // this.addOrEdit.form.userIds = []
              data = data.data
              this.addOrEdit.form = {
                id: data.id,
                name: data.name,
                userIds: []
              }
              for (let item of data.user) {
                let user = {}
                user.id = item.id
                user.name = item.name
                user.identify = item.identify
                user.phone = item.phone
                this.addOrEdit.userList.push(user)
                this.addOrEdit.form.userIds.push(item.id)
              }
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      } else {
        this.addOrEdit.dialogVisible = true
      }
    },
    // 选择成员（姓名、手机号）
    queryRoleBySearch (queryString, cb) {
      if (!queryString) {
        return;
      }
      this.getUserListBySearch(queryString, cb)
    },
    // 通过搜索获取成员请求
    getUserListBySearch: _function.debounce(
      function (queryString, cb) {
        let results = []
        getUserListBySearch({ search: queryString })
          .then(data => {
            if (data.code === 300000) {
              let allRoles = data.data
              results = queryString ? allRoles.filter((role) => {
                //  || (role.phone.indexOf(queryString) != -1)
                return (role.name.indexOf(queryString) != -1)
              }) : queryString
            } else {
              this.$message.error(data.msg)
            }
            cb(results)
          })
          .catch(this.errHandler)
      },
      // 用户停止输入等待的毫秒数
      1200
    ),
    // 选中成员
    handleSelectRole (item) {
      // 是否已经添加过
      let addOrEdit = this.addOrEdit
      let hasItem = false
      for (let user of addOrEdit.userList) {
        if (user.id === item.id) {
          hasItem = true;
          break;
        }
      }
      if (hasItem) {
        this.$message.error('已经添加过了')
      } else {
        addOrEdit.userList.push(item)
        addOrEdit.form.userIds.push(item.id)
      }
    },
    // 添加/编辑事件
    addOrEditHandler () {
      let { type } = this.addOrEdit
      let methodsName = ''

      if (type == 0) {
        // 添加
        methodsName = 'addRole'
      } else {
        // 编辑
        methodsName = 'editRole'
      }

      Roles[methodsName](this.addOrEdit.form)
        .then(data => {
          if (data.code === 300000) {
            this.addOrEdit.dialogVisible = false
            this.addOrEdit.loading = false
            this.$message.success(type == 0 ? '用户组添加成功' : '编辑成功')
            this.resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])
            this.getList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 删除用户
    delRole (index) {
      this.addOrEdit.userList.splice(index, 1)
      this.addOrEdit.form.userIds.splice(index, 1)
    },
    // 查看日志
    viewLogs (id) {
      this.detail.dialogVisible = true
      this.detail.operateLogs = []
      this.detail.loading = true
      let params = {
        page: this.list.page,
        limit: this.list.limit,
        type: 'role',
        modelId: id
      }
      getLogs(params)
        .then(data => {
          this.detail.loading = false
          if (data.code === 300000) {
            data = data.data
            this.detail.operateLogs = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 删除
    delItem (row) {
      this.$confirm(`是否确认删除<span class="red">${row.name}</span>`, '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        // 确认
        Roles.delRole(row.id)
          .then(data => {
            if (data.code === 300000) {
              this.$message.success(`${row.name}删除成功！`)
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
    // 打开权限窗口
    openPermissonDialog (id) {
      if (!id) {
        return this.$message.error(`id不能为空！${id}`)
      }
      this.permission.id = id
      Roles.getRolesPermission(id)
        .then(data => {
          if (data.code === 300000) {
            this.permission.dialogVisible = true
            this.formatCheckedPermissions(data.data)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 格式化返回的权限数据格式
    formatCheckedPermissions (data) {
      // 处理data数据的格式
      let results = []
      for (let item of data) {
        let obj = {}
        obj[item.id] = {}
        if (item.childs && item.childs.length > 0) {
          // 有下级权限
          for (let elem of item.childs) {
            obj[item.id][elem.id] = {
              checkAll: false,
              // 默认关闭
              isShow: false,
              values: []
            }
            if (elem.childs && elem.childs.length > 0) {
              // 三级权限
              let values = []
              for (let ele of elem.childs) {
                values.push(ele.id)
              }
              obj[item.id][elem.id].values = values
            } else {
              // 二级权限
              obj[item.id][elem.id].checkAll = true
            }
          }
        } else {
          // 没有下级权限
        }
        results.push(obj)
      }
      this.setCheckedPermissions(results)
    },
    // 格式化身份
    formatIdentifyRole (row, column, cellValue) {
      return cellValue ? cellValue.name : ''
    },
    // 根据返回的权限值，展示已经选中的权限
    setCheckedPermissions (rulesArr) {
      let permissions = [ ...this.allPermissions ]
      // 重置权限数据
      let result = []
      for (let item of permissions) {
        let topLevel = { ...item }
        // 有设置的权限
        topLevel.childs = []
        topLevel.isShow = false
        for (let rules of rulesArr) {
          for (let key of Object.keys(rules)) {
            // 处理选中的项
            if (rules.hasOwnProperty(key) && item.id == key) {
              // 有该项
              for (let elem of item.childs) {
                let subItem = rules[key][elem.id]
                if (subItem) {
                  // 有对应的数据
                  if (elem.childs && elem.childs.length > 0) {
                    // 有三级权限
                    // 是否是全选
                    if (elem.childs.length == subItem.values.length) {
                      // 是
                      elem.checkAll = true
                    } else {
                      // 不是
                      elem.checkAll = false
                    }
                    elem.values = subItem.values
                  } else {
                    // 没有三级权限
                    elem.checkAll = true
                    elem.values = []
                  }
                } else {
                  // 没有对应的项, 将对应项重置
                  elem.checkAll = false
                  elem.values = []
                  elem.isShow = false
                }
                topLevel.childs.push(elem)
              }
            }
          }
        }
        // 没有设置权限
        if (topLevel.childs && topLevel.childs.length === 0) {
          for (let elem of item.childs) {
            elem.checkAll = false
            elem.values = []
            elem.isShow = false
            topLevel.childs.push(elem)
          }
        }
        result.push(topLevel)
      }
      this.allPermissions = result
    },
    // 设置权限
    addPermissions () {
      let permissionIds = this.getCheckPermissions()
      if (permissionIds.length === 0) {
        return this.$message.error('请选择权限')
      }
      Roles.setRolesPermission({id: this.permission.id, permissionIds})
        .then(data => {
          if (data.code == 300000) {
            this.$message.success('用户组设置权限成功')
            this.permission.dialogVisible = false
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
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
  .my-autocomplete {
    z-index: 2018;
    .el-autocomplete-suggestion li {
      border-bottom: 1px dashed #ccc;
    }
    li {
      line-height: normal;
      padding: 7px;
      line-height: 24px;
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .phone {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
</style>
