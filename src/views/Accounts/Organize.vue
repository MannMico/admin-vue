<template>
  <div>
    <!-- add btn -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="small"
      class="add-btn"
      v-permission="'v1.adminUser.organize.create'"
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
      <el-table-column prop="display_name" label="区域">
      </el-table-column>
      <el-table-column prop="admin_user.name" label="负责人">
      </el-table-column>
      <el-table-column prop="admin_user.phone" label="联系方式">
      </el-table-column>
     <el-table-column prop="citys" label="城市" :formatter="formatterCitys" width="240px">
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.organize.show'"
            @click="viewLogs(scope.row.id)">日志</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.organize.update'"
            @click="openAddOrEditDialog(1, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.organize.setCity'"
            @click="openCityDialog(scope.row.id)">选择城市</el-button>
          <el-button
            size="mini"
            type="text"
            v-permission="'v1.adminUser.organize.delete'"
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
        height="400"
        style="width: 100%;">
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
    <!-- 添加/编辑运营中心 -->
    <el-dialog
      :title="addOrEdit.type == 0 ? '添加': '编辑'"
      :visible.sync="addOrEdit.dialogVisible"
      width='420px'
      >
      <el-form
        ref='addOrEdit.form'
        :model="addOrEdit.form"
        label-width="100px">
        <el-form-item
          label="区域名称"
          prop="displayName"
          :rules="{ required: true, message: '请填写区域名称', trigger: 'blur' }">
          <el-input v-model="addOrEdit.form.displayName" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item
          label="负责人"
          prop="userName"
          :rules="{ required: true, message: '请选择负责人', trigger: 'blur' }">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="addOrEdit.form.userName"
            :fetch-suggestions="queryRoleBySearch"
            :trigger-on-focus="false"
            valueKey="name"
            placeholder="请输入负责人姓名"
            @select="handleSelectRole"
            >
            <template slot-scope="props">
              <div class="name">负责人姓名：{{ props.item.name }}</div>
              <span class="phone">电话：{{ props.item.phone }}</span>
            </template>
          </el-autocomplete>
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
    <!-- 选择城市 -->
    <el-dialog
      title="运营中心"
      :visible.sync="citys.dialogVisible"
      width="540px"
      class="dialog-wrap"
      >
      <el-form label-position="right">
        <el-form-item label="城市">
          <el-autocomplete
            v-model="citys.city"
            :fetch-suggestions="querySearchCity"
            valueKey="name"
            placeholder="请输入搜索的城市名"
            :trigger-on-focus="false"
            @select="handleSelectCity"
            style="width: 300px;"
          >
            <!-- <template slot-scope="props">
              {{ props.item.name }}
            </template> -->
          </el-autocomplete>
        </el-form-item>
        <div class="multistage-box">
          <multistage-item
            v-for="(item, index) in allCitys"
            :key="index"
            :multistage="item"
            :formatData="formatAreas[index]"
            @checkCity="checkCity"
            :hasCheckAreas="dealCheckAreas"
          ></multistage-item>
        </div>
        <el-form-item label="已选择" style="max-height: 100px; overflow: auto;">
          <template v-if="dealCheckAreas.length">
            <el-tag
              v-for="(item, index) in dealCheckAreas"
              :key="index"
              closable
              style="margin-right: 6px;"
              @close="handleCityClose(item.value)">
              {{formatCitysData[item.value]}}
            </el-tag>
          </template>
          <template v-else>
            <el-button type="text" disabled>暂无选择任何城市</el-button>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="citys.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseCitysHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import MultistageItem from '@/components/Multistage/city'
import { getOrganizes } from '../Common/getGlobalData'
import { getLogs } from '@/api/common'
import * as Organizes from '@/api/accounts/organize'
// TOOD 优化此处导出的地方（只导出function和Array）
import * as _ from 'lodash'

export default {
  name: 'Organize',
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
      // 负责人列表
      userList: [],
      // 添加、编辑
      addOrEdit: {
        // type = 0 表示添加， type = 1表示编辑
        type: 0,
        loading: false,
        dialogVisible: false,
        disabled: false,
        form: {
          id: 0,
          displayName: '',
          userName: '',
          userId: 0
        }
      },
      // 选择运营中心
      citys: {
        loading: false,
        dialogVisible: false,
        // 用于输入的城市
        city: '',
        id: 0
      },
      // 所有城市信息
      allCitys: [],
      // 选中的城市
      checkAreas: [],
      formatAreas: []
    }
  },
  created () {
    // 获取运营中心列表数据
    getOrganizes()
  },
  computed: {
    // 处理选中的城市，根据cityId获得对应的name
    dealCheckAreas () {
      let result = []
      let areasArr = this.checkAreas
      for (let item of areasArr) {
        for (let ele of item.cityIds) {
          result.push({
            value: ele
          })
        }
      }
      return result
    },
    // 格式化二级市数据，用于获取cityid对应的name值
    formatCitysData () {
      let citys = this.$store.getters.citys
      let result = {}
      for (let item of citys) {
        for (let ele of item.citys) {
          result[ele.id] = ele.name
        }
      }
      return result;
    },
    // 格式化二级城市数据，用于输入时匹配搜索结果
    formatCitysForSearch () {
      let citys = this.$store.getters.citys
      let result = []
      for (let item of citys) {
        for (let ele of item.citys) {
          result.push({
            value: ele.id,
            name: ele.name,
            provinceId: ele.parent_id
          })
        }
      }
      return result;
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.getList()
      setTimeout(() => {
        this.dealCitysData()
      }, 1500)
    })
  },
  methods: {
    // 处理城市数据
    dealCitysData () {
      /* function* entries (obj) {
        for (let key of Object.keys(obj)) {
          yield [obj[key]]
        }
      } */
      let citys = this.$store.getters.citys
      let results = []
      for (let key of Object.keys(citys)) {
        let obj = {}
        obj = {
          isShow: 0,
          ...citys[key]
        }
        this.formatAreas.push({
          checkAll: false,
          indeterminate: false,
          parent_id: 0,
          value: []
        })
        results.push(obj)
      }
      this.allCitys = results
    },
    // 处理序号
    indexMethod (index) {
      let { page, limit } = this.list
      return (page - 1) * limit + index + 1;
    },
    // 子组件选择/取消选择城市
    checkCity (city) {
      let areasArr = this.checkAreas
      let areasLength = areasArr.length
      let hasExist = false
      let index = 0
      for (let i = 0; i < areasLength; i++) {
        if (areasArr[i].provinceId == city.parent_id) {
          hasExist = true;
          index = i;
          break;
        }
      }
      if (this.checkAreas.length == 0) {
        // 没有 => 添加
        this.checkAreas.push({
          provinceId: city.parent_id,
          cityIds: city.value
        })
      } else {
        if (hasExist) {
          // 存在
          if (city.value.length > 0) {
            // 覆盖
            this.$set(this.checkAreas, index, {
              provinceId: city.parent_id,
              cityIds: city.value
            })
          } else {
            this.checkAreas.splice(index, 1)
          }
        } else {
          // 不存在
          this.checkAreas.push({
            provinceId: city.parent_id,
            cityIds: city.value
          })
        }
      }
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
      Organizes.getOrganizesList({page: this.list.page, limit: this.list.limit})
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
    // 格式化城市
    formatterCitys (row, column, cellValue) {
      let result = ''
      for (let item of cellValue) {
        result += item.name + '、'
      }
      return result ? result.substr(0, result.length - 1) : result
    },
    // 打开添加/编辑弹窗
    openAddOrEditDialog (type, row) {
      this.addOrEdit.type = type
      this.addOrEdit.dialogVisible = true
      if (type == 1) {
        // 编辑需要的数据
        this.addOrEdit.form = {
          id: row.id,
          displayName: row.display_name,
          userId: row.admin_user.id,
          userName: row.admin_user.name
        }
      } else {
        // 新增时，重置数据
        this.addOrEdit.form = {
          id: 0,
          displayName: '',
          userName: '',
          userId: 0
        }
      }
    },
    // 添加/编辑事件
    addOrEditHandler () {
      let { type } = this.addOrEdit
      let methodsName = ''

      if (type == 0) {
        // 添加
        methodsName = 'addOrganize'
      } else {
        // 编辑
        methodsName = 'editOrganize'
      }

      // citys.dialogVisible = false
      Organizes[methodsName](this.addOrEdit.form)
        .then(data => {
          if (data.code === 300000) {
            this.addOrEdit.dialogVisible = false
            this.addOrEdit.loading = false
            this.$message.success(type == 0 ? '区域添加成功' : '编辑成功')
            this.resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])
            this.getList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 查看日志
    viewLogs (id) {
      this.detail.dialogVisible = true
      this.detail.operateLogs = []
      this.detail.loading = true
      let params = {
        page: this.list.page,
        limit: this.list.limit,
        type: 'organize',
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
    // 删除运营中心
    delItem (row) {
      this.$confirm('是否确认删除<span class="red">区域 ' + row.display_name + '</span>', '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        // 确认
        Organizes.delOrganize(row.id)
          .then(data => {
            if (data.code === 300000) {
              this.$message.success(`区域 ${row.display_name} 删除成功！`)
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
    // 打开选择城市弹窗
    openCityDialog (id) {
      if (!id) {
        return this.$message.error('请传入运营中心id！')
      }
      // 每次获取详情前，重置此处字段
      this.checkAreas = []
      this.citys.city = ''
      this.citys.id = id
      // 获取运营中心详情 => 得到选中的城市
      Organizes.getOrganizeDetail(id)
        .then(data => {
          if (data.code === 300000) {
            data = data.data
            this.citys.dialogVisible = true;
            // 处理citys数据
            this.processData(data)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 生成返回的数据，格式化为所需的格式
    processData (data) {
      let results = {}
      for (let item of data.citys) {
        if (results[item.parent_id]) {
          results[item.parent_id].push(item.id)
        } else {
          results[item.parent_id] = []
          results[item.parent_id].push(item.id)
        }
      }
      for (let key in results) {
        if (results.hasOwnProperty(key)) {
          this.checkAreas.push({
            provinceId: Number(key),
            cityIds: results[key]
          })
        }
      }
    },
    // 选择负责人（姓名、手机号）
    queryRoleBySearch (queryString, cb) {
      if (!queryString) {
        return;
      }
      this.getUserListBySearch(queryString, cb)
    },
    // 通过搜索获取负责人请求
    getUserListBySearch: _.debounce(
      function (queryString, cb) {
        let results = []
        Organizes.getUserListBySearch({ search: queryString })
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
    // 筛选条件
    createFilter (queryString) {
      return (city) => {
        return (city.name.indexOf(queryString) != -1);
      }
    },
    // 选择负责人
    handleSelectRole (item) {
      this.addOrEdit.form.userId = item.id
    },
    // 选择城市中输入城市名，获取建议数据
    querySearchCity (queryString, cb) {
      let allCitys = this.formatCitysForSearch
      let results = queryString ? allCitys.filter((city) => {
        return city.name.indexOf(queryString) != -1
      }) : queryString
      // 调用callback返回建议列表的数据
      cb(results)
    },
    // 选择城市
    handleSelectCity (cityItem) {
      let areasArr = this.checkAreas
      let areasLength = areasArr.length
      let hasExist = false
      let index = 0
      for (let i = 0; i < areasLength; i++) {
        if (areasArr[i].provinceId == cityItem.provinceId) {
          hasExist = true;
          index = i;
          break;
        }
      }
      if (this.checkAreas.length == 0) {
        // 没有 => 添加
        this.checkAreas.push({
          provinceId: cityItem.provinceId,
          cityIds: [cityItem.value]
        })
      } else {
        if (hasExist) {
          // 不存在该城市 => 添加
          let citysArr = areasArr[index].cityIds
          if (citysArr.indexOf(cityItem.value) == -1) {
            let newArea = {
              provinceId: cityItem.provinceId,
              cityIds: citysArr.concat(cityItem.value)
            }
            this.$set(this.checkAreas, index, newArea)
          } else {
            // 存在 => 不做处理
          }
        } else {
          // 不存在
          this.checkAreas.push({
            provinceId: cityItem.provinceId,
            cityIds: [cityItem.value]
          })
        }
      }
    },
    // 取消选择某个市
    handleCityClose (cityId) {
      let simulateId = Number(cityId.toString().substr(0, 2))
      let checkAreasArr = this.checkAreas
      let len = checkAreasArr.length
      // let index = 0;
      for (let i = 0; i < len; i++) {
        if (simulateId == checkAreasArr[i].provinceId) {
          let allCitysIdArr = checkAreasArr[i].cityIds
          for (let item of allCitysIdArr) {
            if (item == cityId) {
              // 有，删除数组中该项
              allCitysIdArr.splice(allCitysIdArr.indexOf(cityId), 1)
              if (allCitysIdArr.length > 0) {
                // 如果省份下还有其他值 => 更新
                let newArea = {
                  provinceId: simulateId,
                  cityIds: allCitysIdArr
                }
                this.$set(this.checkAreas, i, newArea)
              } else {
                // 没有其他值了 => 删除
                // 删除数组第几项，因为此处this.$delege为undefined（不知道为啥）
                _.pullAt(this.checkAreas, i);
              }
            }
          }
          break;
        }
      }
    },
    // 选择城市触发请求事件
    chooseCitysHandler () {
      Organizes.chooseCitys(this.citys.id, { areas: this.checkAreas })
        .then(data => {
          if (data.code === 300000) {
            this.$message.success('城市选择成功！')
            this.citys.dialogVisible = false;
            this.getList()
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
      padding: 0 20px;
    }
    .checkbox-group-item {
      margin-right: 20px;
      margin-left: 0;
    }
    .el-dialog__body {
      padding: 20px 40px;
    }
  }
  .my-autocomplete {
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
  .multistage-box {
    margin-bottom: 20px;
    padding: 10px 20px;
    height: 300px;
    border: 1px dashed #eee;
    overflow-y: auto;
  }
</style>
