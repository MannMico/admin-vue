<template>
  <div>
    <template>
      <div v-show="showType === 1">
        <search-form
          :searchform='formStructure'
          :showFilterBtn="false"
          labelWidth='160px'
          key="search1"
          @queryData="getList"></search-form>
        <!-- add btn -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          class="add-btn"
          v-permission="'v1.tag.dimension.create'"
          @click="openAddOrEditDialog(0)">新建标签维度</el-button>
        <!-- table list -->
        <el-table
          :span="24"
          :data="list.tableData"
          key="table1"
          v-loading="list.loading"
          border
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          style="width: 100%">
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column
            prop="enabled"
            label="状态"
            :formatter="formatterEnabled">
          </el-table-column>
          <el-table-column
            prop="display"
            label="显示类型"
            :formatter="formatterDisplay">
          </el-table-column>
          <el-table-column
            prop="tag_type"
            label="添加类型"
            :formatter="formatterTagType">
          </el-table-column>
          <el-table-column
            prop="select_type"
            label="选择类型"
            :formatter="formatterSelectType">
          </el-table-column>
          <el-table-column
            prop="object_type_names"
            label="应用对象"
            :formatter="formatterObjectTypeNames">
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
              size="mini"
              type="text"
              @click="viewTags(scope)">查看标签值</el-button>
              <el-button
                size="mini"
                type="text"
                v-permission="'v1.tag.dimension.update'"
                @click="openAddOrEditDialog(1, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="text"
                @click="applyObject(scope.row)">配置应用对象</el-button>
              <template v-if="scope.row.enabled == 1">
                <el-button
                size="mini"
                type="text"
                @click="startOrStopHandler(scope, 0)">停用</el-button>
              </template>
              <template v-else>
                <el-button
                size="mini"
                type="text"
                @click="startOrStopHandler(scope, 1)">启用</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- panigation box -->
        <div class="pagination-box">
          <el-pagination
            key="pagination1"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="list.page"
            :page-sizes="[10, 20]"
            :page-size="list.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="list.totalPage">
          </el-pagination>
        </div>
      </div>
    </template>
    <template>
      <div v-show="showType === 2">
        <el-button type="text" @click="showType = 1">返回</el-button>
        <search-form
          :searchform='tagsFormStructure'
          :showFilterBtn="false"
          key="search2"
          labelWidth='100px'
          @queryData="searchTagsValueList"></search-form>
        <div class="operat-box">
          <!-- add btn -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="tagsAdd.dialogVisible = true">新建标签值</el-button>
          <el-checkbox
            :true-label="1"
            false-label=""
            v-model="tagsFormStructure.form.enabled"
            @change="showHideHandler">隐藏已停用的标签值</el-checkbox>
        </div>
        <p class="checked-tags">已配置标签值（{{tagsList.totalPage}}）</p>
        <!-- table list -->
        <el-table
          :span="24"
          :data="tagsList.tableData"
          v-loading="tagsList.loading"
          border
          key="table1"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          style="width: 100%">
          <el-table-column prop="name" label="标签值名称">
          </el-table-column>
          <el-table-column prop="type" label="类型" :formatter="formatterType">
          </el-table-column>
          <el-table-column prop="objects_count" :sortable="true" label="使用次数">
          </el-table-column>
          <el-table-column
            prop="enabled"
            label="状态"
            :formatter="formatterEnabled">
          </el-table-column>
          <el-table-column
            prop="creator_role"
            label="创建信息">
            <template slot-scope="scope">
              <div>{{formatterCreatorRole(scope.row, 1)}}</div>
              <div>{{formatterCreatorRole(scope.row, 2)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            width="120px">
            <template slot-scope="scope">
              <div
              v-show="!tagsList.isEditRankStatus"
              class="cell"
              title="双击编辑排序"
              @dblclick="tagsList.isEditRankStatus = true"
              >{{scope.row.rank}}</div>
              <el-input
                v-show="tagsList.isEditRankStatus"
                size="small"
                v-model="scope.row.rank"
                placeholder="排序"
                style="max-width: 80px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <template v-if="scope.row.type == 0">
                <el-button
                size="mini"
                type="text"
                v-permission="'v1.tag.tag.update'"
                @click="openEditTagsDialog(scope)">编辑</el-button>
              </template>
              <template v-else-if="scope.row.type == 1">
                <el-button
                size="mini"
                type="text"
                @click="upgradeTag(scope)">升级为标准值</el-button>
              </template>

              <template v-if="scope.row.enabled == 1">
                <el-button
                size="mini"
                type="text"
                @click="startOrStopTagsHandler(scope, 0)">停用</el-button>
              </template>
              <template v-else>
                <el-button
                size="mini"
                type="text"
                @click="startOrStopTagsHandler(scope, 1)">启用</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div
          class="rank-btn-box"
          v-if="tagsList.totalPage > 0">
          <div class="rank-inner">
            <el-button
              v-if="!tagsList.isEditRankStatus"
              size="small"
              type="primary"
              v-permission="'v1.tag.tag.sort'"
              @click="tagsList.isEditRankStatus = true">编辑排序</el-button>
            <el-button
              v-if="tagsList.isEditRankStatus"
              size="small"
              type="primary"
              @click="addRankHandler">保存排序</el-button>
          </div>
        </div>
        <!-- 新建标签值 -->
        <el-dialog
          title="新建标签值"
          :visible.sync="tagsAdd.dialogVisible"
          width="700px"
          class="dialog-tags">
          <div class="create-tags-box">
            <div class="opera-area">
              <el-tooltip effect="dark" content="添加一项" placement="top">
                <i class="el-icon-plus green" @click="addTagItem"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除选中项" placement="top">
                <i class="el-icon-close red" @click="deleteChecked"></i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除全部" placement="top">
                <span
                  class="del-box"
                  @click="deleteAll">
                  <i class="el-icon-more red"></i>
                  <i class="el-icon-close red"></i>
                </span>
              </el-tooltip>
            </div>
            <ul class="tags-list">
              <li
                v-for="(item, index) in tagsAdd.nameList"
                :key="index"
                data-key="index">
                <el-checkbox
                  @click="item.isCheck = !item.isCheck"
                  v-model="item.isCheck">
                  <el-input
                    size="small"
                    class="input-bottom-boder"
                    placeholder="请输入标签名称（10个字以内）"
                    :maxlength="10"
                    v-model="item.value"
                    :tabindex="String(index)"
                    @keyup.enter.native="addTagItem"></el-input>
                </el-checkbox>
              </li>
            </ul>
          </div>
          <div class="create-tags-explain">
            <h5>说明：</h5>
            <ul>
              <li>1.在输入标签值名称后按enter即可快速批量添加；</li>
              <li>2.选中后可修改删除（批量）、全部删除。</li>
            </ul>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelCreateHandler">取 消</el-button>
            <el-button type="primary" :loading="tagsAdd.loading" @click="confirmCreateHandler">确定新建</el-button>
          </span>
        </el-dialog>
        <!-- 编辑标签值 -->
        <el-dialog
          title="编辑标签值"
          :visible.sync="tagsEdit.dialogVisible"
          width="450px">
          <el-form
            :model="tagsEdit.form"
            ref="tagsEdit.form"
            label-width="120px"
            >
            <el-form-item
              label="标签值名称"
              prop="name"
              :rules="[
                { required: true, message: '请填写标签值名称', trigger: 'blur' }
              ]">
              <el-input autofocus v-model="tagsEdit.form.name" placeholder="请填写标签值名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetForm('tagsEdit.form', ['tagsEdit', 'dialogVisible'])">取 消</el-button>
              <el-button
                type="primary"
                :loading="tagsEdit.loading"
                @click="submitForm('tagsEdit.form', 'tagsEditHandler')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </template>
    <template>
      <div v-show="showType === 3">
        <el-button type="text" @click="showType = 1">返回</el-button>
        <el-form
          :model="addOrEdit.form"
          ref="addOrEdit.form"
          label-width="160px">
          <el-form-item
            label="标签维度名称"
            prop="name"
            :rules="[
              { required: true, message: '请输入标签维度名称（10字以内）', trigger: 'blur' }
            ]">
            <el-input
              style="width: 300px"
              v-model="addOrEdit.form.name"
              placeholder="请输入标签维度名称（10字以内）"
              :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item
            label="标签维度显示类型"
            prop="display"
            :rules="[
              { required: true, message: '请选择活动资源', trigger: 'change' }
            ]">
            <el-radio-group v-model="addOrEdit.form.display">
              <el-tooltip class="item" effect="dark" content="选择后，本标签维度下的标签值会在用户端相关页面显示" placement="bottom">
                <el-radio :label="1">显示</el-radio>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="选择后，本标签维度下的标签值将仅供后台使用，用户不会看到" placement="bottom">
                <el-radio :label="0">隐藏</el-radio>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="标签值添加类型"
            prop="tag_type"
            :rules="[
              { required: true, message: '请选择标签值添加类型', trigger: 'change' }
            ]">
            <el-radio-group v-model="addOrEdit.form.tag_type">
              <el-tooltip class="item" effect="dark" content="选择后，打标签时只能系统标准标签库中选择" placement="bottom">
                <el-radio :label="0">仅限标准值</el-radio>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="选择后，打标签时只能由打标签的操作人自己灵活新建" placement="bottom">
                <el-radio :label="1">仅限自定义值</el-radio>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="选择后，打标签时既可以在标签库中选也可以自己新建" placement="bottom">
                <el-radio :label="2">支持标准值和自定义值</el-radio>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="标签值选择类型"
            prop="select_type"
            :rules="[
              { required: true, message: '请选择标签值选择类型', trigger: 'change' }
            ]">
            <el-radio-group v-model="addOrEdit.form.select_type">
              <el-tooltip class="item" effect="dark" content="选择后，本标签维度下的标签值只能单选" placement="bottom">
                <el-radio :label="0">单选</el-radio>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="选择后，本标签维度下的标签值支持多选" placement="bottom">
                <el-radio :label="1">多选</el-radio>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showType = 1">取 消</el-button>
          <el-button type="primary" :loading="addOrEdit.loading" @click="submitForm('addOrEdit.form', 'addOrEditTagDimension', 1)">确 定</el-button>
          <el-button type="primary" :loading="addOrEdit.loading" @click="submitForm('addOrEdit.form', 'addOrEditTagDimension', 2)">保存并去配置标签维度</el-button>
        </span>
      </div>
    </template>
    <template>
      <div v-show="showType === 4">
        <el-button type="text" @click="showType = 1">返回</el-button>
        <div style="margin-bottom: 20px;">请配置应用对象</div>
        <el-table
          border
          v-loading="appliedObjectList.loading"
          :data="appliedObjectList.tableData">
          <el-table-column
            width="150"
            label="应用对象类型"
            prop="object_type_name"></el-table-column>
          <el-table-column
            width="150"
            label="全选">
            <template slot-scope="scope">
              <el-checkbox @change="selectAllObject(scope.row)" v-model="scope.row.checkAll" :indeterminate="scope.row.isIndeterminate">全选</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="应用对象下详细配置"
            prop="categories">
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.checkboxGroupsValue" @change="selectObject(scope.row)">
                <el-checkbox v-for="(v, k) in scope.row.categories" :key="k" :label="v.id">{{v.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-top: 20px;">
          <el-button @click="cancelChangeObject">取消</el-button>
          <el-button @click="changeObject">确定</el-button>
        </el-row>
      </div>
    </template>
  </div>
</template>
<script>

import * as _array from 'lodash/array'
import SearchForm from '@/components/Form/inline'
import * as Tags from '@/api/tag'
import _ from 'lodash'

export default {
  name: 'Tag',
  components: {
    'search-form': SearchForm
  },
  data () {
    return {
      // 表示显示的类型 1-> 标签维度， 2->标签值
      showType: 1,
      // 搜索框
      formStructure: {
        'name': {
          type: 'input',
          label: '标签维度名称',
          placeholder: '请输入维度名称'
        },
        'enabled': {
          type: 'select',
          label: '标签维度状态',
          placeholder: '请选择标签维度状态',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '启用中',
              value: 1
            },
            {
              label: '已停用',
              value: 0
            }
          ]
        },
        'display': {
          type: 'select',
          label: '标签维度显示类型',
          placeholder: '请选择标签维度显示类型',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '显示',
              value: 1
            },
            {
              label: '隐藏',
              value: 0
            }
          ]
        },
        'tag_type': {
          type: 'select',
          label: '标签值添加类型',
          placeholder: '请选择标签值添加类型',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '仅限标准值',
              value: 0
            },
            {
              label: '仅限自定义值',
              value: 1
            },
            {
              label: '支持标准值和自定义值',
              value: 2
            }
          ]
        },
        'select_type': {
          type: 'select',
          label: '标签值选择类型',
          placeholder: '请选择标签值选择类型',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '单选',
              value: 0
            },
            {
              label: '多选',
              value: 1
            }
          ]
        },
        'object_type': {
          type: 'select',
          label: '标签维度应用对象',
          list: [
            {
              label: '全部',
              value: 0
            },
            {
              label: '项目评价',
              value: 1
            },
            {
              label: '设计师资料',
              value: 2
            },
            {
              label: '邦女郎资料',
              value: 3
            },
            {
              label: '设计师作品',
              value: 4
            },
            {
              label: '设计任务',
              value: 5
            },
            {
              label: '众创任务',
              value: 6
            },
            {
              label: '成功案例',
              value: 7
            },
            {
              label: '洛客活动',
              value: 8
            },
            {
              label: '普通用户资料',
              value: 9
            },
            {
              label: '小调查选项',
              value: 10
            }
          ]
        },
        'tag_name': {
          type: 'autocomplete',
          label: '标签值名称',
          placeholder: '请输入标签值名称',
          autocompleteValue: 'name',
          autocompleteValueKey: 'name',
          handleSelect: () => {},
          fetchSuggestions: function (str, cb) {
            Tags.getTagsValuesList({name: str}).then((data) => {
              if (data.code == 300000) {
                cb(data.data.data)
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        },
        'button': {
          type: 'button',
          btnText: '搜索'
        },
        form: {
          name: '',
          enabled: '',
          display: '',
          tag_type: '',
          select_type: '',
          object_type: 0,
          tag_name: ''
        }
      },
      list: {
        loading: false,
        tableData: [],
        page: 1,
        limit: 10,
        totalPage: 1
      },
      // 添加、编辑
      addOrEdit: {
        title: '',
        type: 0,
        loading: false,
        form: {
          id: 0,
          name: '',
          display: '',
          tag_type: '',
          select_type: ''
        }
      },
      // 标签值相关
      tagsFormStructure: {
        'name': {
          type: 'input',
          label: '标签值',
          placeholder: '搜索标签值'
        },
        'type': {
          type: 'select',
          label: '标签值类型',
          placeholder: '标签值类型',
          list: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '自定义',
              value: 1
            },
            {
              label: '标准值',
              value: 0
            }
          ]
        },
        'creator_role': {
          type: 'select',
          label: '创建人类型',
          placeholder: '创建人类型',
          list: [
            {
              label: '全部用户',
              value: ''
            },
            {
              label: '普通客户',
              value: 0
            },
            {
              label: '企业客户',
              value: 4
            },
            {
              label: '设计师',
              value: 1
            },
            {
              label: '邦女郎',
              value: 3
            },
            {
              label: '平台运营',
              value: 2
            },
            {
              label: '码隆',
              value: 5
            }
          ]
        },
        'button': {
          type: 'button',
          btnText: '搜索'
        },
        form: {
          name: '',
          enabled: '',
          type: '',
          creator_role: ''
        }
      },
      tagsList: {
        loading: false,
        tableData: [],
        totalPage: 1,
        isEditRankStatus: false
      },
      tagsAdd: {
        loading: false,
        dialogVisible: false,
        dimension_id: 0,
        name: '',
        nameList: [
          {
            isCheck: false,
            value: ''
          }
        ]
      },
      tagsEdit: {
        loading: false,
        dialogVisible: false,
        form: {
          id: 0,
          name: ''
        }
      },
      // 应用对象页面
      appliedObjectList: {
        loading: false,
        tableData: []
      }
    }
  },
  computed: {
    // 处理列表数据（分页+筛选）
    searchParams () {
      let search = this.formStructure.form
      let pages = {
        page: this.list.page,
        limit: this.list.limit
      }
      let params = {
        ...search,
        ...pages
      }
      for (let key of Object.keys(params)) {
        if (key != 'name' && params[key] === '') {
          delete params[key]
        }
      }
      return params
    },
    // 处理标签值列表筛选数据
    tagsSearchParams () {
      let params = {...this.tagsFormStructure.form}
      for (let key of Object.keys(params)) {
        if (!params[key]) {
          delete params[key]
        }
      }
      return params
    },
    // 批量创建标签值
    formatNameList () {
      let result = []
      for (let item of this.tagsAdd.nameList) {
        result.push({
          isCheck: false,
          value: item.value
        })
      }
      return result
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getList()
      // 获取全部应用对象列表
      Tags.getAllAppliedObjects().then((data) => {
        console.log(data)
        // 处理一下数据
        let tableData = data.data
        // 增加存放checkbox group选值的数组
        tableData.forEach(function (v, k) {
          v.checkboxGroupsValue = []
          v.isIndeterminate = false
          v.checkAll = false
        })
        this.appliedObjectList.tableData = tableData
      })
    })
  },
  methods: {
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
    // 重置验证的表单
    resetForm (formName, dialogTypeArr) {
      this[dialogTypeArr[0]][dialogTypeArr[1]] = false
      this.$refs[formName].resetFields();
    },
    // 提交表单
    // saveType用来做新建|编辑标签里面确定和确定跳转功能的区分 saveType == 1 为save tysaveTypepe == 2为save&jump
    submitForm (formName, fnName, saveType) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (saveType) {
            this[fnName](saveType)
          } else {
            this[fnName]()
          }
        } else {
          return false;
        }
      });
    },
    // 获取列表数据
    getList () {
      this.list.loading = true
      return Tags.getTagsList(this.searchParams)
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
    // 格式化字段显示
    formatterEnabled (row, column) {
      return row.enabled == 1 ? '启用中' : '已停用'
    },
    formatterDisplay (row, column) {
      return row.display == 1 ? '显示' : '隐藏'
    },
    formatterTagType (row, column) {
      return ['仅限标准值', '仅限自定义值', '支持标准值和自定义值'][row.tag_type]
    },
    formatterSelectType (row, column) {
      return row.select_type == 1 ? '多选' : '单选'
    },
    formatterObjectTypeNames (row, column) {
      var arr = _.values(row.object_type_names)
      var str = arr.join('；')
      return str
    },
    formatterType (row, column) {
      return ['标准值', '自定义值'][row.type]
    },
    formatterUsedTimes (row, column) {
      return row.objects_count
    },
    sortUsedTimes (a, b) {
      return a - b
    },
    formatterCreatorRole (row, type) {
      if (type == 1) {
        return ['普通用户', '设计师', '洛客运营', '邦女郎', '企业用户', '码隆'][row.creator_role]
      } else if (type == 2) {
        return row.created_at
      }
    },
    openAddOrEditDialog (type, row) {
      this.addOrEdit.type = type
      this.showType = 3
      if (type == 1) {
        // 编辑 -> 从列表中获取详情
        this.addOrEdit.form = row
      } else {
        // 重置新建
        this.addOrEdit.form = {
          id: 0,
          name: '',
          display: '',
          tag_type: '',
          select_type: ''
        }
      }
    },
    // 升级自定义标签
    upgradeTag (scope) {
      let id = scope.row.id
      let type = 0
      let l = 0
      this.tagsList.tableData.forEach((v, k) => {
        console.log(v)
        if (v.enabled == 1 && v.type == 0) {
          l++
        }
      })
      // 条件为启用中的标签要少于20个
      if (l >= 20) {
        this.$message.error('启用中的标准标签值数量不得超出20个，请先停用不必要的标准标签值')
        return
      }
      this.$confirm('升级行为不可撤销，是否继续？', '提示', {
        confirmButtonText: '确定升级',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Tags.upgradeTag({id: id, type: type}).then((data) => {
          if (data.code == 300000) {
            this.$message({
              type: 'success',
              message: '标签值升级成功'
            })
            this.getTagsList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    },
    // 保存并去配置
    saveAndConfig () {
      // var id = this.addOrEdit.form.id
    },
    // 打开配置应用对象页面
    applyObject (row) {
      this.showType = 4
      this.appliedObjectList.loading = true
      this.appliedObjectList.id = row.id
      Tags.getAppliedObjects({dimensionId: row.id}).then((data) => {
        this.appliedObjectList.loading = false
        let objectData = data.data
        if (data.code == 300000) {
          this.appliedObjectList.tableData.forEach((v) => {
            v.checkboxGroupsValue = []
            v.isIndeterminate = false
            objectData.forEach((vv) => {
              if (v.object_type == vv.object_type) {
                // 过滤掉object_category_id = 0
                if (vv.object_category_id != 0) {
                  v.checkboxGroupsValue.push(vv.object_category_id)
                }
              }
            })
            // 在提交应用对象这个表单的时候，如果某一行全选了，则需要在所选的id数组里面额外增加一项0，这种情况下，后台再次返回这个数据的时候会带上这个0，所以用>=而不用==
            // 发现了bug因为这个全选checkbox table需要知道某一个row的总长度，多了这个0会导致问题，所以在接受数据的时候把这个0过滤掉
            if (v.checkboxGroupsValue.length >= v.categories.length) {
              v.checkAll = true
            } else {
              v.checkAll = false
            }
          })
        }
      })
    },
    // 全选应用对象
    selectAllObject (row) {
      var arr = []
      row.categories.forEach(function (v, k) {
        arr.push(v.id)
      })
      row.checkboxGroupsValue = row.checkAll ? arr : [];
      row.isIndeterminate = false;
    },
    // 选择应用对象
    selectObject (row) {
      let checkedCount = row.checkboxGroupsValue.length;
      row.checkAll = checkedCount === row.categories.length;
      row.isIndeterminate = checkedCount > 0 && checkedCount < row.categories.length;
    },
    // 修改应用对象
    cancelChangeObject () {
      this.showType = 1
      this.getList()
    },
    changeObject () {
      let params = []
      let id = this.appliedObjectList.id
      params = this.formatChangeObjectParams(this.appliedObjectList.tableData)
      Tags.saveAppliedObjects({id: id, data: params}).then((data) => {
        if (data.code == 300000) {
          this.showType = 1
          this.getList()
        }
      })
    },
    // 生成修改应用对象params格式
    formatChangeObjectParams (arr) {
      let newArr = []
      arr.forEach((v) => {
        if (v.checkboxGroupsValue.length > 0) {
          let obj = {}
          obj.object_type = v.object_type
          obj.object_category_id = v.checkboxGroupsValue
          // 如果备选项全部勾选，那么需要在object_category_id增加一个0
          if (v.checkAll) {
            obj.object_category_id.push(0)
          }
          newArr.push(obj)
        }
      })
      return newArr
    },
    // 创建 标签维度
    // saveType用来做新建|编辑标签里面确定和确定跳转功能的区分 saveType == 1 为save saveType == 2为save&jump
    addOrEditTagDimension (saveType) {
      var that = this
      this.addOrEdit.loading = true
      let methodType = 'createTagDimension'
      if (this.addOrEdit.type == 1) {
        // 编辑
        methodType = 'editTagDimension'
      }
      Tags[methodType](this.addOrEdit.form)
        .then(data => {
          this.addOrEdit.loading = false
          if (data.code === 300000) {
            this.$message.success('标签维度' + ['新建', '编辑'][this.addOrEdit.type] + '成功！')
            this.resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])
            if (this.addOrEdit.type == 0) {
              if (saveType == 1) {
                this.getList().then(() => {
                  this.showType = 1
                })
              } else if (saveType == 2) {
                this.getList().then(function () {
                  this.showType = 1
                  that.applyObject({id: that.list.tableData[0].id})
                })
              }
            } else {
              if (saveType == 1) {
                this.getList().then(() => {
                  this.showType = 1
                })
              } else if (saveType == 2) {
                that.applyObject({id: that.addOrEdit.form.id})
              }
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 停用、启用标签维度
    startOrStopHandler (scope, type) {
      let id = scope.row.id
      if (!id) {
        return this.$message.error('请传入要修改的id' + id)
      }
      let tips = [
        '停用后，该标签维度将不会出现在关联应用对象的添加标签处，是否继续？',
        '启用后需重新关联应用对象，是否继续？'
      ]
      this.$confirm(tips[type], '提示', {
        type: 'warning'
      }).then(() => {
        // 确认
        let newItem = {
          ...scope.row
        }
        newItem.enabled = type
        Tags.editTagDimension({id, enabled: type})
          .then(data => {
            if (data.code == 300000) {
              this.$message.success(`标签维度${['停用', '启用'][type]}成功！`)
              // this.list.tableData[scope.$index] = newItem
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
    // 隐藏已经停用的标签值
    showHideHandler (val) {
      this.tagsFormStructure.form.enabled = val
      this.getTagsList()
    },
    // 获取标签值列表
    getTagsList (param = {}) {
      this.tagsList.loading = true
      let search = this.tagsSearch
      let enabled = this.tagsFormStructure.form.enabled

      let params = {
        dimension_id: this.tagsAdd.dimension_id,
        ...search,
        ...param,
        page: 1,
        limit: 10000
      }
      if (enabled == 1) {
        params = _.assign(params, {enabled: enabled})
      }
      if (params.name === '') {
        delete params.name
      }
      if (params.type === '') {
        delete params.type
      }
      if (params.creator_role === '') {
        delete params.creator_role
      }
      Tags.getTagsValuesList(params)
        .then(data => {
          this.tagsList.loading = false
          if (data.code === 300000) {
            data = data.data
            this.tagsList.tableData = data.data
            this.tagsList.totalPage = data.total
            this.tagsAdd.dimension_id = params.dimension_id
            this.tagsAdd.name = params.name
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 查看标签值
    viewTags (scope) {
      this.showType = 2
      this.tagsList.isEditRankStatus = false
      this.getTagsList({
        name: '',
        dimension_id: scope.row.id
      })
    },
    // 搜索标签值
    searchTagsValueList () {
      this.tagsFormStructure.form.enabled = ''
      this.getTagsList({
        name: this.tagsFormStructure.form.name,
        type: this.tagsFormStructure.form.type,
        creator_role: this.tagsFormStructure.form.creator_role
      })
    },
    // 新建标签时创建新标签
    addTagItem () {
      this.tagsAdd.nameList.push({
        isCheck: false,
        value: ''
      })
    },
    // 删除选中的标签
    deleteChecked () {
      let result = []
      for (let item of this.tagsAdd.nameList) {
        if (!item.isCheck) {
          result.push(item)
        }
      }
      if (result.length === 0) {
        result.push({
          isCheck: false,
          value: ''
        })
      }
      this.tagsAdd.nameList = result
    },
    // 批量新建标签值得时候 删除全部
    deleteAll () {
      this.$confirm('确定全部删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // 确认
        this.tagsAdd.nameList = [{
          isCheck: false,
          value: ''
        }]
      }).catch(() => {
        // 取消
      })
    },
    // 取消创建
    cancelCreateHandler () {
      this.tagsAdd.nameList = [{
        isCheck: false,
        value: ''
      }]
      this.tagsAdd.dialogVisible = false
      this.tagsAdd.loading = false
    },
    // 确定创建
    confirmCreateHandler () {
      this.tagsAdd.loading = true
      // 确定是否填入了相同的标签值
      let originArr = this.tagsAdd.nameList
      let result = []
      for (let item of originArr) {
        if (item.value) {
          result.push(item.value)
        }
      }
      // 没有添加
      if (result.length === 0) {
        this.tagsAdd.loading = false
        // 代表原数组与去重后不统一 -> 即添加了相同的元素
        return this.$message.error('请添加标签值！')
      }
      let uniqResult = _array.uniq(result)
      if (result.length !== uniqResult.length) {
        this.tagsAdd.loading = false
        // 代表原数组与去重后不统一 -> 即添加了相同的元素
        return this.$message.error('添加的标签值不能相同！')
      }
      Tags.createTagsList({
        name: [ ...uniqResult ],
        dimension_id: this.tagsAdd.dimension_id,
        // 1.0版本暂时没有更改为'自定义值1'的入口，所以都为'标准值0'
        type: 0
      })
        .then(data => {
          this.tagsAdd.loading = false
          if (data.code === 300000) {
            this.tagsAdd.dialogVisible = false
            this.getTagsList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 标签值编辑弹窗
    openEditTagsDialog (scope) {
      this.tagsEdit.dialogVisible = true
      this.tagsEdit.form = {
        id: scope.row.id,
        name: scope.row.name
      }
    },
    // 编辑标签值
    tagsEditHandler () {
      this.tagsEdit.loading = true
      Tags.editTag(this.tagsEdit.form)
        .then(data => {
          if (data.code === 300000) {
            this.tagsEdit.dialogVisible = false
            this.$message.success('标签值编辑成功！')
            this.getTagsList()
          } else {
            this.$message.error(data.msg)
          }
          this.tagsEdit.loading = false
        })
        .catch(this.errHandler)
    },
    // 启用、停用标签值
    startOrStopTagsHandler (scope, type) {
      let id = scope.row.id
      if (!id) {
        return this.$message.error('请传入要修改的标签id' + id)
      }
      let tips = [
        '停用后，该标签值将不会出现在关联应用对象的添加标签处，是否继续？',
        '启用后，该标签值将立即出现在关联应用对象的添加标签处，是否继续？'
      ]
      let l = 0
      this.tagsList.tableData.forEach((v, k) => {
        console.log(v)
        if (v.enabled == 1 && v.type == 0) {
          l++
        }
      })
      // 条件为启用中的标签要少于20个
      if (l >= 20 && type == 1) {
        this.$message.error('启用中的标准标签值数量不得超出20个，请先停用不必要的标准标签值')
        return
      }
      this.$confirm(tips[type], '提示', {
        type: 'warning'
      }).then(() => {
        Tags.editTag({ id: id, enabled: type })
          .then(data => {
            if (data.code === 300000) {
              this.$message.success(['标签值停用成功！', '标签值启用成功！'][type])
              this.getTagsList()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }).catch(() => {})
    },
    // 保存排序
    addRankHandler () {
      let pairs = []
      let hasEmpty = false
      for (let item of this.tagsList.tableData) {
        if (!item.rank) {
          hasEmpty = true
          break;
        }
        pairs.push({
          id: item.id,
          rank: item.rank
        })
      }
      if (hasEmpty) {
        return this.$message.error('排序值不能为空！')
      }
      Tags.editTagsValuesSort({pairs})
        .then((data) => {
          if (data.code === 300000) {
            this.$message.success('排序编辑成功！')
            this.tagsList.isEditRankStatus = false
            this.getTagsList()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .operat-box {
    display: flex;
    margin: 20px 0 10px;
    justify-content: space-between;
    & > * {
      display: flex;
      align-items: center;
    }
  }
  .checked-tags {
    margin-bottom: 20px;
    font-size: 14px;
    color: #333;
    line-height: 30px;
  }
  .create-tags-box,
  .create-tags-explain {
    display: inline-block;
    @include base(274px, 350px);
    vertical-align: top;
  }
  .create-tags-box {
    margin-right: 20px;
    padding: 0 10px;
    width: 320px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .create-tags-explain {
    h5 {
      font-size: 16px;
      font-weight: 400;
    }
    ul {
      margin: 10px 0;
    }
    font-size: 12px;
    line-height: 26px;
  }
  .opera-area {
    padding-top: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #ccc;
    i {
      font-size: 20px;
      font-weight: 800;
      cursor: pointer;
    }
  }
  .del-box {
    position: relative;
    margin-left: 6px;
    .el-icon-more {
      position: absolute;
      top: 1px;
      left: -8px;
      font-size: 14px;
      font-weight: 400;
      transform: rotate(90deg)
    }
  }
  .tags-list {
    margin-top: 10px;
    max-height: 290px;
    overflow-y: auto;
    li {
      margin-bottom: 10px;
    }
    .el-input {
      width: 240px;
    }
  }
  .el-input__inner {
    border: 0;
    border-bottom: 1px solid #dcdfe6;
  }
  .rank-btn-box {
    position: relative;
    margin-top: 20px;
  }
  .rank-inner {
    position: absolute;
    top: 0;
    right: 0;
    width: 120px + 200px - 10px;
  }
</style>
