<template>
  <div style="height: 100%;min-height: 500px;">
    <!-- search form -->
    <search-form
      :showFilterBtn="false"
      widgetWidth="200px"
      :searchform='formStructure'
      @queryData="getList"></search-form>
    <!-- add btn -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      class="add-btn"
      v-permission="'v1.adminUser.user.create'"
      @click="openAddOrEditDialog(0)">添加</el-button>
    <!-- table list -->
    <el-table
      :span="24"
      :data="tableData"
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="70px"
        :index="indexMethod">
      </el-table-column>
      <el-table-column prop="email" label="账号/邮箱" width="240px">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100px">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="140px">
      </el-table-column>
      <el-table-column
        prop="identify"
        label="身份"
        width="170px">
      </el-table-column>
      <el-table-column prop="area" label="区域" width="160px">
      </el-table-column>
      <el-table-column
        prop="organizes"
        label="运营中心"
        width="170px"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="role"
        label="用户组"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80px" :formatter="formatterStatus">
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
          size="mini"
          type="text"
          v-permission="'v1.adminUser.user.show'"
          @click="viewDetails(scope)">查看</el-button>
          <template v-if="scope.row.status == 0">
            <el-button
              size="mini"
              type="text"
              v-permission="'v1.adminUser.user.changeStatus'"
              @click="showDialog(scope, 'status')">正常</el-button>
          </template>
          <template v-else>
            <el-button
              size="mini"
              type="text"
              v-permission="'v1.adminUser.user.changeStatus'"
              @click="showDialog(scope, 'status')">禁用</el-button>
          </template>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.user.update'"
            @click="openAddOrEditDialog(1, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.user.setPassword'"
            @click="showDialog(scope, 'pwd')">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- panigation box -->
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="param.page"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <!-- 重置密码、设置正常、禁用状态 dialog -->
    <el-dialog
      title="重置密码"
      :visible.sync="dialogVisible"
      width="480px"
      class="dialog-box"
      >
      <h5 class="dialog-title">
        <template v-if="whichModule === 'pwd'">是否确认重置密码？</template>
        <template v-else>
          是否确认修改为
          <span class="green" v-if="dialogData.status == 0">正常</span>
          <span class="red" v-else>禁用</span>
          状态？</template>
      </h5>
      <div class="user-info">
        <p class="user-item">姓名：{{ dialogData.name }}</p>
        <p class="user-item">账号：{{ dialogData.email }}</p>
        <p v-if="whichModule === 'pwd'" class="user-item">电话：{{ dialogData.phone }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogHandler">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看账号详情 -->
    <el-dialog
      title="查看"
      :visible="view.dialogDetailVisible"
      width="600px"
      class="dialog-wrap"
      top="5vh"
      :show-close="false"
      v-loading="view.loading"
      >
      <el-form label-width="100px" class="form-wrap">
        <el-form-item label="账号：">{{view.data.email}}</el-form-item>
        <el-form-item label="姓名：">{{view.data.name}}</el-form-item>
        <el-form-item label="电话：">{{view.data.phone}}</el-form-item>
        <el-form-item label="部门：">{{view.data.department}}</el-form-item>
        <el-form-item label="身份：">{{view.data.identify}}</el-form-item>
        <el-form-item label="区域：">{{view.data.area}}</el-form-item>
        <el-form-item label="运营中心：">{{view.data.organizes}}</el-form-item>
        <el-form-item label="用户组：">{{view.data.role}}</el-form-item>
        <el-form-item label="状态：">{{view.data.status == 1 ? '正常' : '禁用'}}</el-form-item>
        <el-form-item label="操作日志：">
          <el-table
            :data="view.operateLogs"
            border
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%; max-height: 200px; overflow-y: auto;">
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="view.dialogDetailVisible = false">取 消</el-button>
          <el-button type="primary" @click="view.dialogDetailVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 创建账号 -->
    <el-dialog
      :title="addOrEdit.title"
      :visible.sync="addOrEdit.dialogVisible"
      width="540px"
      class="dialog-wrap"
      v-loading="addOrEdit.loading"
      >
      <el-form
        :model="addOrEdit.form"
        ref="addOrEdit.form"
        status-icon
        label-width="120px"
        class="form-box">
        <el-form-item
          label="账号"
          prop="email"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]">
          <el-input v-model="addOrEdit.form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name"
          :rules="[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]">
          <el-input v-model="addOrEdit.form.name"  placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phone"
          :rules="[
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ]">
          <el-input v-model="addOrEdit.form.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item
          label="部门"
          prop="departmentId"
          :rules="[
            { required: true, message: '请选择部门', trigger: 'change' }
          ]">
          <el-select v-model="addOrEdit.form.departmentId" placeholder="请选择部门" @change="addOrEdit.form.identifyId = ''">
            <el-option
              v-for="(item, index) in formatdepartmentsData"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="身份"
          prop="identifyId"
          :rules="[
            { required: true, message: '请选择身份', trigger: 'change' }
          ]">
          <el-select v-model="addOrEdit.form.identifyId" placeholder="请选择身份">
            <el-option
              v-for="(item, index) in formatIdentifysData"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="区域"
          prop="area"
          :rules="[
            { required: true, message: '请选择区域', trigger: 'change' }
          ]">
          <el-cascader
            :options="secondLevelCitys"
            :show-all-levels="false"
            expand-trigger="hover"
            v-model="addOrEdit.areaArray"
            @change="areaChange"
          ></el-cascader>
        </el-form-item>
        <!--  prop="organizes" -->
        <el-form-item label="运营中心" class="is-required">
          <el-button type="text" @click="addOrEdit.dialogOrganizesVisible = true">选择</el-button>
          <div>
            <template v-if="dealCheckOrganizes.length">
              <el-tag
                v-for="(item, index) in dealCheckOrganizes"
                :key="index"
                closable
                style="margin-right: 6px;"
                @close="handleOrganizeClose(item.value, item.organizeId)">
                {{formatOrganizesData[item.value]}}
              </el-tag>
            </template>
            <template v-else>
              <el-button type="text" disabled>暂无选择任何城市</el-button>
            </template>
          </div>
        </el-form-item>
        <!-- :rules="[
            { required: true, message: '请选择用户组', trigger: 'change' }
          ]" -->
        <el-form-item
          label="用户组"
          prop="roles"
          >
          <el-select
            v-model="addOrEdit.form.roles"
            placeholder="请选择用户组"
            multiple
            >
            <el-option
              v-for="(item, index) in this.$store.getters.userGroup"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
          :rules="[
            { required: true, message: '请选择状态', trigger: 'change' }
          ]">
          <el-radio-group v-model="addOrEdit.form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])">取 消</el-button>
          <el-button
            type="primary"
            :loading="addOrEdit.loading"
            @click="submitForm('addOrEdit.form', 'addOrEditHandler')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 选择运营中心的弹窗 -->
    <el-dialog
      title="运营中心"
      :visible.sync="addOrEdit.dialogOrganizesVisible"
      width="540px"
      class="dialog-wrap"
      >
      <div class="multistage-box">
        <template v-if="formatOrganizes.length > 0">
          <multistage-item
            v-for="(item, index) in allOrganizes"
            :key="index"
            :multistage="item"
            :formatData="formatOrganizes[index]"
            @checkOrganize="checkOrganize"
            :hasCheckOrganizes="dealCheckOrganizes"
          ></multistage-item>
        </template>
        <template v-else>
          <el-button type="text" disabled>暂无可选择的运营中心</el-button>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEdit.dialogOrganizesVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrEdit.dialogOrganizesVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MultistageItem from '@/components/Multistage/organize'
import * as Accounts from '@/api/accounts/account'
import { getLogs } from '@/api/common'
import SearchForm from '@/components/Form/inline'
import { getCitys, getAllIdentifys, getOrganizes, getUserGroup } from '../Common/getGlobalData'

export default {
  name: 'Account',
  // 组件
  components: {
    'search-form': SearchForm,
    'multistage-item': MultistageItem
  },
  data () {
    return {
      // 搜索框
      formStructure: {
        'email': {
          type: 'input',
          label: '账号',
          placeholder: '请输入账号'
        },
        'button': {
          type: 'button',
          btnText: '搜索'
        },
        form: {
          key: 'email',
          value: '',
          email: ''
        }
      },
      param: {
        page: 1,
        limit: 10
      },
      loading: true,
      tableData: [],
      totalPage: 1,
      // 重置密码、设置正常/禁用状态
      dialogVisible: false,
      dialogData: {},
      whichModule: '', // pwd, status
      // 查看详情相关
      view: {
        dialogDetailVisible: false,
        loading: true,
        data: {},
        operateLogs: []
      },
      // 添加、编辑相关
      addOrEdit: {
        title: '',
        // type = 0 表示添加， type = 1表示编辑
        type: 0,
        dialogVisible: false,
        dialogOrganizesVisible: false,
        loading: false,
        form: {
          id: 0,
          email: '',
          name: '',
          phone: '',
          identifyId: '1233123',
          departmentId: '',
          departmentName: '',
          area: [],
          organizes: [],
          roles: [],
          status: 1
        },
        areaArray: []
      },
      formatOrganizes: [],
      // 所有运营中心数据
      allOrganizes: [],
      // 选中的运营中心
      checkOrganizes: []
    }
  },
  created () {
    getCitys()
    getAllIdentifys()
    getOrganizes()
    getUserGroup()
  },
  /* mounted () {
    this.$nextTick(function () {
      this.getList()
      setTimeout(() => {
        this.dealOrganizesData()
      }, 2000)
    })
  }, */
  // 组件尚未渲染完毕，没有this
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.routerCallback(to, vm)
    })
  },
  // 路由改变前，组件就已经渲染完了（组件复用时使用）
  beforeRouteUpdate (to, from, next) {
    this.routerCallback(to, this)
    next()
  },
  /* watch: {
    '$route' (to, from) {
      if (to.name == 'account') {
        let { depId = 0, identifyId = 0, roleId = 0 } = to.query
        let paramsArr = []
        if (depId != 0) {
          paramsArr = ['department_id', depId]
        } else if (identifyId != 0) {
          paramsArr = ['identify_id', identifyId]
        } else if (roleId != 0) {
          paramsArr = ['role_id', roleId]
        } else {
          // 默认搜索
          paramsArr = ['', '']
        }
        this.formStructure.form.key = paramsArr[0]
        this.formStructure.form.value = paramsArr[1]
        this.getList()
      }
    }
  }, */
  computed: {
    // 根据citys动态生成二级城市结构，用于cascader级联选择器
    secondLevelCitys () {
      let citys = this.$store.getters.citys
      let result = []
      for (let city of citys) {
        // 只取有二级分类得城市
        let childrens = city.citys
        if (childrens && childrens.length) {
          let item = {}
          let subArr = []
          item.id = city.id
          item.value = city.name
          item.label = city.name
          for (let ele of childrens) {
            subArr.push({
              value: ele.name,
              id: ele.id,
              label: ele.name
            })
          }
          item.children = subArr
          result.push(item)
        }
      }
      return result
    },
    // 处理选择后的运营中心，用于展示
    dealCheckOrganizes () {
      let result = []
      let organizes = this.checkOrganizes
      for (let item of organizes) {
        for (let ele of item.citys) {
          result.push({
            value: ele,
            organizeId: item.organizeId
          })
        }
      }
      return result
    },
    // 格式化运营中心数据，用于获取cityid对应的name值
    formatOrganizesData () {
      let organizes = this.$store.getters.organizes
      let result = {}
      for (let item of organizes) {
        for (let ele of item.citys) {
          result[ele.id] = ele.name
        }
      }
      return result;
    },
    // 格式化身份数据
    formatdepartmentsData () {
      return this.$store.getters.identifys
    },
    formatIdentifysData () {
      let result = []
      for (let item of this.$store.getters.identifys) {
        if (item.id == this.addOrEdit.form.departmentId) {
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
  methods: {
    // 组件件内导航守卫callback
    routerCallback (to, vm) {
      let { depId = 0, identifyId = 0, roleId = 0 } = to.query
      let paramsArr = []
      if (depId != 0) {
        paramsArr = ['department_id', depId]
      } else if (identifyId != 0) {
        paramsArr = ['identify_id', identifyId]
      } else if (roleId != 0) {
        paramsArr = ['role_id', roleId]
      } else {
        // 默认搜索
        paramsArr = ['', '']
      }
      vm.formStructure.form.key = paramsArr[0]
      vm.formStructure.form.value = paramsArr[1]
      vm.getList()
      setTimeout(() => {
        vm.dealOrganizesData()
      }, 2000)
    },
    // 处理序号
    indexMethod (index) {
      let { page, limit } = this.param
      return (page - 1) * limit + index + 1;
    },
    // 获取列表数据
    getList () {
      this.loading = true
      // 处理formStructure.form数据
      let params = { ...this.formStructure.form }
      let { email = '', value = '' } = params
      if (value) {
        params.value = value
      } else {
        params.value = email
      }
      if (email) {
        params.key = 'email'
        params.value = email
      }
      delete params.email
      Accounts.getAccountList({ ...this.param, ...params })
        .then(data => {
          this.loading = false
          if (data.code === 300000) {
            data = data.data
            this.dealData(data.data)
            this.totalPage = data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 处理列表数据
    dealData (data) {
      let result = []
      for (let item of data) {
        // 获取每一项
        let { id, email, name, phone, identify = {}, area, organizes = [], role = [], status, department } = item
        let obj = { id, email, name, phone, department, identify, area, organizes, role, status }
        let itemObj = {}
        for (let key of Object.keys(obj)) {
          let cellValue = obj[key] === null ? {} : obj[key]
          let val = ''
          if (key === 'identify') {
            if (cellValue.department && cellValue.department.name) {
              itemObj.department = cellValue.department.name
            }
            val = cellValue.name
            itemObj[key] = val
          } else if (key === 'role') {
            for (let item of cellValue) {
              val += item.name + '、'
            }
            itemObj[key] = val.length > 0 ? val.substr(0, val.length - 1) : ''
          } else if (key === 'organizes') {
            for (let item of cellValue) {
              val += item.name + '、'
            }
            itemObj[key] = val.length > 0 ? val.substr(0, val.length - 1) : ''
          } else {
            itemObj[key] = cellValue
          }
        }
        result.push(itemObj)
      }
      this.tableData = result
    },
    // 打开重置密码的弹窗
    showDialog (scope, type) {
      let cellValue = scope.row
      this.whichModule = type
      this.dialogVisible = true
      this.dialogData = {
        $index: scope.$index,
        ...cellValue
      }
    },
    // 重置密码
    dialogHandler () {
      let id = this.dialogData.id
      if (!id) {
        return this.$message.error('请传入id' + id)
      }
      if (this.whichModule === 'pwd') {
        // 重置密码
        Accounts.resetUserPwd(id)
          .then(data => {
            if (data.code === 300000) {
              this.dialogVisible = false
              this.$message.success('密码重置成功！')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      } else {
        // 更改状态
        let status = Number(!this.dialogData.status)
        let { $index = 0 } = this.dialogData
        Accounts.modifyUserStatus(id, { status })
          .then(data => {
            if (data.code === 300000) {
              this.dialogVisible = false
              this.tableData[$index].status = status
              this.$message.success('状态修改成功！')
            } else {
              this.$message({
                type: 'error',
                dangerouslyUseHTMLString: true,
                message: data.msg
              });
            }
          })
          .catch(err => { this.$message.error(err) })
      }
    },
    // 选择地区时
    areaChange (val) {
      this.addOrEdit.form.area = val[1]
    },
    // 添加账号
    addAccount () {
      this.addOrEdit.title = '添加'
      this.addOrEdit.type = 0
      this.addOrEdit.dialogVisible = true
      this.addOrEdit.form.id = 0
      this.formatOrganizes = []
      // 所有运营中心数据
      this.allOrganizes = []
      // 选中的运营中心
      this.checkOrganizes = []
    },
    // 打开选择运营中心的弹窗
    openAddOrEditDialog (type, row) {
      this.addOrEdit.type = type
      // 数据重置
      this.checkOrganizes = []
      this.addOrEdit.title = ['添加', '编辑'][type]
      // 重置表单状态
      this.$refs['addOrEdit.form'] && this.$refs['addOrEdit.form'].resetFields();
      if (type === 1) {
        // 编辑 -> 获取详情
        Accounts.getUserDetail(row.id)
          .then(data => {
            if (data.code === 300000) {
              data = data.data
              this.addOrEdit.dialogVisible = true
              this.dealDetailData(data)
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.err(err) });
      } else {
        // 新建
        this.addOrEdit.dialogVisible = true
        this.addOrEdit.form = {
          id: 0,
          email: '',
          name: '',
          phone: '',
          identifyId: '',
          area: [],
          organizes: [],
          roles: [],
          status: 1
        }
        this.addOrEdit.areaArray = []
      }
    },
    // 处理详情数据，用于编辑
    dealDetailData (data) {
      // 处理运营中心
      let organizesObj = {}
      for (let item of data.organizes) {
        if (organizesObj[item.organize.organize_id]) {
          // 有此运营中心
          if (organizesObj[item.organize.organize_id].citys.indexOf(item.id) === -1) {
            // 没有此城市
            organizesObj[item.organize.organize_id].citys.push(item.id)
          }
        } else {
          // 没有此项
          organizesObj[item.organize.organize_id] = {
            citys: [item.id]
          }
        }
      }
      let organizes = []
      // 将数组转换为数组格式
      for (let key of Object.keys(organizesObj)) {
        if (organizesObj.hasOwnProperty(key)) {
          organizes.push({
            organizeId: key,
            citys: organizesObj[key].citys
          })
        }
      }
      this.checkOrganizes = organizes
      // console.log('organizes => ' + JSON.stringify(organizes));
      // 处理用户组
      let roles = []
      for (let item of data.role) {
        roles.push(item.id)
      }
      // 处理区域
      let areaArray = []
      for (let item of this.secondLevelCitys) {
        let provice = item.value
        for (let elem of item.children) {
          if (elem.value == data.area) {
            areaArray[0] = provice
            areaArray[1] = elem.value
          }
        }
      }
      this.addOrEdit.areaArray = areaArray
      this.addOrEdit.form = {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        identifyId: data.identify_id,
        departmentId: data.identify.department.id,
        departmentName: data.identify.department.name,
        area: data.area,
        organizes,
        roles,
        status: data.status
      }
    },
    // 添加/编辑事件
    addOrEditHandler () {
      // 判断是否选择了“运营中心”
      if (this.checkOrganizes.length === 0) {
        return this.$message.error('请选择运营中心！')
      }
      let { type } = this.addOrEdit
      let methodsName = ''

      if (type == 0) {
        // 添加
        methodsName = 'addUser'
      } else {
        // 编辑
        methodsName = 'editUser'
      }
      this.addOrEdit.form.organizes = this.checkOrganizes
      Accounts[methodsName](this.addOrEdit.form)
        .then(data => {
          if (data.code === 300000) {
            this.addOrEdit.dialogVisible = false
            this.addOrEdit.loading = false
            this.$message.success(type == 0 ? '账户添加成功' : '编辑成功')
            this.resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])
            this.getList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 查看详情
    viewDetails (scope) {
      this.view.dialogDetailVisible = true
      let id = scope.row.id
      if (!id) {
        return this.$message.error('请传入id' + id);
      }
      this.view.operateLogs = []
      this.view.data = this.tableData[scope.$index]
      /* // 获取账户详情
      Accounts.getUserDetail(id)
        .then(data => {
          this.view.loading = false
          if (data.code === 300000) {
            // TODO 处理数据，符合展示格式
            this.view.data = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.err(err) }); */
      // 获取操作日志
      let params = {
        ...this.param,
        type: 'user',
        modelId: id
      }
      getLogs(params)
        .then(data => {
          if (data.code == 300000) {
            data = data.data
            this.view.operateLogs = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.err(err) })
    },
    // 处理运营中心数据
    dealOrganizesData () {
      let organizes = this.$store.getters.organizes
      let results = []
      for (let key of Object.keys(organizes)) {
        let obj = {}
        obj = {
          isShow: 0,
          ...organizes[key]
        }
        this.formatOrganizes.push({
          checkAll: false,
          indeterminate: false,
          parent_id: 0,
          value: []
        })
        results.push(obj)
      }
      this.allOrganizes = results
    },
    // 子组件选择/取消选择 运营中心
    checkOrganize (organize) {
      console.log('选择运营中心：' + JSON.stringify(organize));
      let organizeArr = this.checkOrganizes
      let organizesLength = organizeArr.length
      let hasExist = false
      let index = 0
      for (let i = 0; i < organizesLength; i++) {
        if (organizeArr[i].organizeId == organize.parent_id) {
          hasExist = true;
          index = i;
          break;
        }
      }
      if (this.checkOrganizes.length == 0) {
        // 没有 => 添加
        this.checkOrganizes.push({
          organizeId: organize.parent_id,
          citys: organize.value
        })
      } else {
        if (hasExist) {
          // 存在
          if (organize.value.length > 0) {
            // 覆盖
            this.$set(this.checkOrganizes, index, {
              organizeId: organize.parent_id,
              citys: organize.value
            })
          } else {
            this.checkOrganizes.splice(index, 1)
          }
        } else {
          // 不存在
          this.checkOrganizes.push({
            organizeId: organize.parent_id,
            citys: organize.value
          })
        }
      }
    },
    // 取消选择某个运营中心
    handleOrganizeClose (organizeItemId, organizeCenterId) {
      let checkOrganizesArr = this.checkOrganizes
      let len = checkOrganizesArr.length
      for (let i = 0; i < len; i++) {
        if (organizeCenterId == checkOrganizesArr[i].organizeId) {
          let allOrganizesIdArr = checkOrganizesArr[i].citys
          for (let item of allOrganizesIdArr) {
            if (item == organizeItemId) {
              // 有，删除数组中该项
              allOrganizesIdArr.splice(allOrganizesIdArr.indexOf(organizeItemId), 1)
              if (allOrganizesIdArr.length > 0) {
                // 如果运营中心下还有其他值 => 更新
                let newOrganize = {
                  organizeId: organizeCenterId,
                  citys: allOrganizesIdArr
                }
                this.$set(this.checkOrganizes, i, newOrganize)
              } else {
                // 没有其他值了 => 删除
                // 删除数组第几项，因为此处this.$delege为undefined（不知道为啥）
                _.pullAt(this.checkOrganizes, i);
              }
            }
          }
          break;
        }
      }
    },
    // 格式化状态
    formatterStatus (row, colum, cellValue) {
      return cellValue == 1 ? '正常' : '禁用'
    },
    // pageSize 改变时会触发
    handleSizeChange (size) {
      this.param.limit = size
      this.getList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (val) {
      this.param.page = val
      this.getList()
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
  @import 'src/styles/mixin.scss';
  .dialog-title {
    @include fontStyle(16px, #333);
    font-weight: 400;
  }
  .dialog-box {
    .user-info {
      margin: 20px 0 -20px 150px;
    }
    .user-item {
      line-height: 40px;
    }
  }
  .form-box {
    .el-input, .el-select, .el-cascader {
      width: 300px;
    }
  }
  .dialog-wrap {
    .form-box {
      margin-top: 0;
    }
    .checkbox-item {
      width: 100%;
      margin-bottom: 10px;
    }
    .el-checkbox-group {
      margin-right: 20px;
    }
    .checkbox-group-item {
      margin-right: 20px;
      margin-left: 0;
    }
    .el-dialog__body {
      padding: 20px 40px;
    }
  }
</style>
