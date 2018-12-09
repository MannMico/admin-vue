<template>
  <div>
    <!-- add btn -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      class="add-btn"
      @click="openAddOrEditDialog(1)">添加部门</el-button>
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
        type="expand">
        <template slot-scope="scope">
          <div>
            <Tree
              :treeData="scope.row.identifys"
              childKeyName="childs"
              boxIdName="id"
              @viewIdentity="viewTreeIdentity"
              @editIdentity="editTreeIdentity"
              @editPermission="editTreePermission"
              @deleteIdentity="deleteTreeIdentity"
              @addChildIdentity="addTreeChildIdentity"
            ></Tree>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="70px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" label="部门">
      </el-table-column>
      <el-table-column
        prop="identifys_count"
        label="身份数">
      </el-table-column>
      <el-table-column label="人数" width="80px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.name + '总人数'" placement="top-start">
            <el-button type="text" class="link" @click="linkToAccount(scope.row.id)">
              {{ scope.row && scope.row.users_count }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="viewDetails(0, scope.row)">查看</el-button>
          <el-button size="mini" type="text" @click="openAddOrEditDialog(2, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            @click="openAddOrEditDialog(3, scope.row)">添加身份</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.department.destroy'"
            @click="delItem(0, scope.row)">删除</el-button>
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
    <!-- 查看详情 -->
    <el-dialog
      :title="'查看' + (detail.type === 0 ? '部门': '身份')"
      :visible.sync="detail.dialogVisible"
      >
      <el-form label-width="100px" class="form-wrap">
        <el-form-item label="部门：">{{detail.form.department}}</el-form-item>
        <el-form-item v-if="detail.type !== 0" label="身份：">{{detail.form.role}}</el-form-item>
        <el-form-item label="操作日志：">
          <el-table
            :data="detail.operateLogs"
            border
            style="width: 100%; max-height: 360px; overflow-y: auto;">
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
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加编辑 -->
    <el-dialog
      :title="addOrEditDialogTitle"
      width="420px"
      @close="closeAddOrEditDialog"
      :visible.sync="addOrEdit.dialogType === 0 ? false : true">
      <el-form
        v-if="addOrEdit.dialogType == 1 || addOrEdit.dialogType == 2"
        ref="addOrEditDepartmentDialog"
        :model="addOrEdit.department"
        label-width="100px">
        <el-form-item
          label="名称"
          prop="name"
          :rules="{ required: true, message: '请填写名称', trigger: 'blur' }">
          <el-input v-model="addOrEdit.department.name" style="width: 217px;" placeholder="请填写名称"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-if="addOrEdit.dialogType == 3 || addOrEdit.dialogType == 4"
        ref="addOrEditIdentityDialog"
        :model="addOrEdit.identity"
        label-width="100px">
        <el-form-item
          label="部门"
          prop="department_id"
          :rules="{ required: true, message: '请选择部门', trigger: 'change' }">
          <el-select
            :disabled="addOrEdit.dialogType == 4"
            style="width: 217px;"
            v-model="addOrEdit.identity.department_id"
            placeholder="请选择一级分类"
            >
            <el-option
              v-for="(item, index) in this.$store.getters.departments"
              :key="index"
              :label="item.name"
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="上级身份"
          prop="parent_id"
          :rules="{ required: true, message: '请选择上级身份', trigger: 'change' }">
          <el-select
            :disabled="addOrEdit.dialogType == 4"
            style="width: 217px;"
            v-model="addOrEdit.identity.parent_id"
            placeholder="请选择上级身份"
            >
            <el-option
              v-for="(item, index) in formatIdentifysData"
              :key="index"
              :label="item.name"
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="{ required: true, message: '请填写名称', trigger: 'blur' }">
          <el-input v-model="addOrEdit.identity.name" style="width: 217px;" placeholder="请填写名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddOrEditDialog">取消</el-button>
        <el-button type="primary" @click="ensureAddOrEditDialog">确定</el-button>
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
import { getAllDepartments, getAllPermissions, getAllIdentifys } from '@/views/Common/getGlobalData'
import { getLogs } from '@/api/common'
import * as Identifys from '@/api/accounts/identity'
import MultistageItem from '@/components/Multistage/permission'
import * as _array from 'lodash/array'
import Tree from './Tree'

let addOrEditType2TitleMap = {
  '1': '添加部门',
  '2': '编辑部门',
  '3': '添加身份',
  '4': '编辑身份'
}

export default {
  name: 'Identify',
  components: { MultistageItem, Tree },
  data () {
    return {
      list: {
        tableData: [],
        loading: true,
        totalPage: 1,
        page: 1,
        limit: 10
      },
      detail: {
        dialogVisible: false,
        // type = 0表示部门，type = 1表示身份
        type: 0,
        form: {
          department: '',
          role: ''
        },
        operateLogs: []
      },
      addOrEdit: {
        dialogType: 0, // 参见 addOrEditType2TitleMap
        loading: false,
        department: {
          id: 0, // 部门id
          name: ''
        },
        identity: {
          id: '', // 身份id
          parent_id: 0, // 上级身份id
          department_id: '', // 部门id
          name: ''
        }
      },
      // 权限
      permission: {
        loading: false,
        dialogVisible: false,
        id: 0
      },
      allPermissions: []
    }
  },
  computed: {
    addOrEditDialogTitle () {
      return addOrEditType2TitleMap[this.addOrEdit.dialogType]
    },
    formatIdentifysData () {
      let result = []
      for (let item of this.$store.getters.identifys) {
        if (item.id == this.addOrEdit.identity.department_id) {
          result.push({name: '一级身份', id: 0})
          for (let ele of item.identifys) {
            result.push({
              name: ele.name,
              id: ele.id
            })
          }
        }
      }
      return result
    }
  },
  created () {
    getAllDepartments()
    getAllPermissions()
    getAllIdentifys()
  },
  mounted () {
    this.$nextTick(function () {
      this.getList()
      setTimeout(() => {
        this.getAllPermissions()
      }, 2000)
    })
  },
  methods: {
    linkToAccount (id) {
      if (this.$store.getters.myPermissions.indexOf('v1.adminUser.user.list') == -1) {
        this.$message.error('您没有查看权限')
      } else {
        this.$router.push(`/account?depId=${id}`)
      }
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
    // 获取列表信息
    getList () {
      this.list.loading = true
      Identifys.getIdentifys({page: this.list.page, limit: this.list.limit})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            data = data.data
            // 为里面的identify增加name
            if (data.data.length > 0) {
              for (let i of data.data) {
                this.addDepartmentName(i.identifys, i.name)
              }
            }
            this.list.tableData = data.data
            this.list.totalPage = data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 获得identity的接口childs里面没有department_name，递归添加department_name
    addDepartmentName (arr, name) {
      arr.forEach((v) => {
        v.department_name = name
        if (v.childs) {
          this.addDepartmentName(v.childs, name)
        }
      })
    },
    // 删除部门、身份 ,department_id
    delItem (type, {id, name}, departmentName) {
      // TOOD 根据department_id对应store中身份列表中对应的身份
      let methodsName = ''
      if (type === 0) {
        // 代表删除部门
        methodsName = 'delDepartment'
      } else {
        // 代表删除身份
        methodsName = 'delRole'
      }
      let tips = departmentName ? `${departmentName} / ${name}` : name;
      this.$confirm('是否确认删除<span class="red">' + tips + '</span> ？', '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        // 确认
        Identifys[methodsName](id)
          .then(data => {
            if (data.code === 300000) {
              this.$message.success(`${name} 删除成功！`)
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }).catch(() => {
        // 取消
      })
    },
    // 添加编辑身份和部门的弹窗
    openAddOrEditDialog (type, data) {
      switch (type) {
      case type:
        this.addOrEdit.dialogType = type
        if (type == 2) {
          this.addOrEdit.department.name = data.name
          this.addOrEdit.department.id = data.id
        } else if (type == 3) {
          this.addOrEdit.identity.department_id = data.id
          // 【添加身份】【添加子身份】的时候，显示“上级身份不同”
          if (data.bid) {
            this.addOrEdit.identity.parent_id = data.bid
          }
        } else if (type == 4) {
          this.addOrEdit.identity.department_id = data.department_id
          this.addOrEdit.identity.id = data.bid
          this.addOrEdit.identity.parent_id = data.parent_id
          this.addOrEdit.identity.name = data.name
        }
        getAllIdentifys()
        break
      default:
        this.addOrEdit.dialogType = 0
        getAllIdentifys()
        break
      }
    },
    closeAddOrEditDialog () {
      this.addOrEdit.dialogType = 0
      this.$refs.addOrEditDepartmentDialog && this.$refs.addOrEditDepartmentDialog.resetFields()
      this.$refs.addOrEditIdentityDialog && this.$refs.addOrEditIdentityDialog.resetFields()
      this.addOrEdit.department = {
        id: 0,
        name: ''
      }
      this.addOrEdit.identity = {
        id: '',
        department_id: '',
        name: ''
      }
    },
    ensureAddOrEditDialog () {
      switch (this.addOrEdit.dialogType) {
      case 1:
        Identifys.addDepartment({name: this.addOrEdit.department.name, parent_id: 0}).then((res) => {
          if (res.code == 300000) {
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
        break;
      case 2:
        Identifys.editDepartment({name: this.addOrEdit.department.name, id: this.addOrEdit.department.id}).then((res) => {
          if (res.code == 300000) {
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
        break;
      case 3:
        Identifys.addRole({name: this.addOrEdit.identity.name, parent_id: this.addOrEdit.identity.parent_id, department_id: this.addOrEdit.identity.department_id}).then((res) => {
          if (res.code == 300000) {
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
        break;
      case 4:
        Identifys.editRole({name: this.addOrEdit.identity.name, id: this.addOrEdit.identity.id}).then((res) => {
          if (res.code == 300000) {
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
        break;
      default:
        break;
      }
      this.closeAddOrEditDialog()
    },
    /**
     * 查看详情
     * @param {String} type 0->部门 1-> 身份
     * @param {Number} id 部门、身份id
     */
    viewDetails (type, item) {
      // 清空之前的操作记录
      this.detail.operateLogs = []
      this.detail.type = type
      this.detail.dialogVisible = true
      if (type == 0) {
        this.detail.form = {
          department: item.name,
          role: ''
        }
      } else {
        this.detail.form = {
          department: item.department_name,
          role: item.name
        }
      }
      // 获取操作记录
      let params = {
        page: this.list.page,
        limit: this.list.limit,
        type: 'identify',
        modelId: item.id
      }
      getLogs(params)
        .then(data => {
          if (data.code === 300000) {
            data = data.data
            this.detail.operateLogs = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 打开编辑弹窗
    openEditDialog (type, id, departmentId) {
      this.edit.type = type
      let editType = ''
      if (type === 0) {
        // 部门
        editType = 'department'
        this.edit.dialogVisible = true
      } else {
        // 身份
        editType = 'role'
        this.edit.dialogRoleVisible = true
        this.edit.role.form.department_id = departmentId
      }
      this.edit[editType].form.id = id
    },
    // 打开权限弹窗
    openPermissonDialog (id) {
      if (!id) {
        return this.$message.error(`id不能为空！${id}`)
      }
      this.permission.id = id
      Identifys.getIdentityPermission(id)
        .then(data => {
          if (data.code === 300000) {
            this.permission.dialogVisible = true
            this.formatCheckedPermissions(data.data)
          } else {
            this.$message.error(data.msg)
          }
        })
        .then(data => { getAllIdentifys() })
        .catch(this.errHandler)
    },
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
      Identifys.setIdentityPermission({id: this.permission.id, permissionIds})
        .then(data => {
          if (data.code == 300000) {
            this.$message.success('权限设置成功')
            this.permission.dialogVisible = false
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
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
    // tree
    viewTreeIdentity (item) {
      item.id = item.bid
      this.viewDetails(1, item)
    },
    editTreeIdentity (item) {
      this.openAddOrEditDialog(4, item)
    },
    editTreePermission (item) {
      this.openPermissonDialog(item.bid)
    },
    deleteTreeIdentity (item) {
      item.id = item.bid
      this.delItem(1, item)
    },
    addTreeChildIdentity (item) {
      item.id = item.department_id
      this.openAddOrEditDialog(3, item)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .table-box {
    .el-form.table-expand-form {
      margin-bottom: 10px;
      padding: 10px 20px;
      font-size: 0;
      border: 1px solid #f3f3f3;
      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
      label,
      .el-form-item__label {
        width: 90px;
        color: #99a9bf;
      }
    }
  }
</style>
