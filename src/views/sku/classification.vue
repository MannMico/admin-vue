<template>
  <div>
    <el-form>
      <el-form-item>
       <div  class="demo-autocomplete">
         <div class="sub-title" style="display: inline-block;float: left;line-height: 40px">分类</div>
         <el-autocomplete
                 class="inline-input"
                 v-model="formInline.searchContent"
                 :fetch-suggestions="querySearch"
                 placeholder="请输入内容"
                 valueKey="name"
                 @select="handleSelect"
                 style="display: inline-block;float: left">
         </el-autocomplete>
       </div>
        状态    <el-select v-model="formInline.status" placeholder="请选择状态">
        <el-option label="上线" value="1"></el-option>
        <el-option label="下线" value="2"></el-option>
      </el-select>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
                v-permission="'v1.sku.category.create'"
                type="primary"
                icon="el-icon-plus"
                size="small"
                class="add-btn"
                @click="openAddOrEditDialog()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
            :span="24"
            :data="list.tableData"
            v-loading="list.loading"
            border
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-for="(tab, index) in props.row.children" :key="index" style="position: relative">
              <el-form-item label="二级分类" style="width: 350px;margin-left: 30px;">
                <span>{{tab.name}}</span>
              </el-form-item>
              <el-form-item label="服务数量" style="width: 150px">
                <router-link :to="{ path: `/sku/seeServiceNum/2/${tab.id}` }">
                  <el-tooltip class="item">
                    <el-button type="text" class="link">
                      {{ tab.spus_count }}
                    </el-button>
                  </el-tooltip>
                </router-link>
              </el-form-item>
              <el-form-item label="状态" style="width: 150px">
                {{tab.status==1 ?'上线':''}}
                {{tab.status==2 ?'下线':''}}
              </el-form-item>
              <el-form-item label="排序" style="width: 150px">
              <span>
                  {{ tab.sort }}
              </span>
              </el-form-item>
              <el-form-item label="操作：" style="width: 380px">
                <el-button
                        type="primary"
                        size="small"
                        v-permission="'v1.sku.category.status'"
                        @click="viewDetails(tab.id, tab.status)">
                  {{tab.status==2 ?'上线':''}}
                  {{tab.status==1 ?'下线':''}}
                </el-button>
                <el-button
                        type="primary"
                        size="small"
                        v-permission="'v1.sku.category.update'"
                        @click="openEditDialog(2, tab.id)">编辑</el-button>
                <el-button
                        type="primary"
                        size="small"
                        v-permission="'v1.sku.category.children'"
                        @click="addRole(3, tab.id, tab.parent_id)">增加子分类</el-button>
                <el-button
                        type="danger"
                        size="small"
                        v-permission="'v1.sku.category.delete'"
                        @click="delItem(tab.id, tab.name, tab.spu_count)">删除</el-button>
              </el-form-item>
              <div v-for="tab1 in tab.children" v-bind:key="tab1.id" >
                <el-form-item label="三级分类" style="width: 350px;margin-left: 60px">
                  <span>   {{ tab1.name }}</span>
                </el-form-item>
                <el-form-item label="服务数量" style="width: 150px">
                  <router-link :to="{ path: `/sku/seeServiceNum/2/${tab1.id}` }">
                    <el-tooltip class="item">
                      <el-button type="text" class="link">
                        {{ tab1.spus_count }}
                      </el-button>
                    </el-tooltip>
                  </router-link>
                </el-form-item>
                <el-form-item label="状态" style="width: 150px">
                <span>
                   {{tab1.status==1 ?'上线':'下线'}}
                </span>
                </el-form-item>
                <el-form-item label="排序" style="width: 150px">
                  <span>   {{ tab1.sort }}</span>
                </el-form-item>
                <el-form-item label="操作：" style="width: 300px">
                  <el-button
                          type="primary"
                          size="small"
                          v-permission="'v1.sku.category.status'"
                          @click="viewDetails(tab1.id, tab1.status)">
                    {{tab1.status==2 ?'上线':'下线'}}
                  </el-button>
                  <el-button
                          type="primary"
                          size="small"
                          v-permission="'v1.sku.category.update'"
                          @click="openEditDialog(3, tab1.id)">编辑</el-button>
                  <el-button
                          type="danger"
                          size="small"
                          v-permission="'v1.sku.category.delete'"
                          @click="delItem(tab1.id, tab1.name, tab1.spu_count)">删除</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name"  label="一级分类" width="250px" align="center">
      </el-table-column>
      <el-table-column prop="spus_count"  label="服务数量" width="200px" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path: `/sku/seeServiceNum/1/${scope.row.id}` }">
            <el-button type="text" class="link">
              {{ scope.row.spus_count }}
            </el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150px"  align="center">
        <template slot-scope="scope">
          {{scope.row.status==1 ?'上线':''}}
          {{scope.row.status==2 ?'下线':''}}
        </template>
      </el-table-column>
      <el-table-column
              prop="sort"
              label="排序"
              width="150px" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
                  type="primary"
                  size="small"
                  v-permission="'v1.sku.category.status'"
                  @click="viewDetails(scope.row.id, scope.row.status)">
            {{scope.row.status==2 ?'上线':''}}
            {{scope.row.status==1 ?'下线':''}}
          </el-button>
          <el-button
                  type="primary"
                  size="small"
                  v-permission="'v1.sku.category.update'"
                  @click="openEditDialog(1, scope.row.id)">编辑</el-button>
          <el-button
                  type="primary"
                  size="small"
                  v-permission="'v1.sku.category.children'"
                  @click="addRole(2, scope.row.id, scope.row.parent_id)">增加子分类</el-button>
          <el-button
                  type="danger"
                  v-permission="'v1.sku.category.delete'"
                  size="small"
                  @click="delItem(scope.row.id, scope.row.name ,scope.row.spu_count)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分类 -->
    <el-dialog
            :title="addOrEdit.title"
            :visible.sync="addOrEdit.dialogVisible"
            width="540px"
            class="dialog-wrap"
            v-loading="addOrEdit.loading"
    >
      <el-form
              class="form-box">
        <el-form-item
                label="分类等级"
                prop="分类等级">
          <el-radio-group v-model="addOrEdit.level" @change="changeHandler" style="margin-left: 10px">
            <el-radio :label="1" v-show="addOrEdit.first">一级分类</el-radio>
            <el-radio :label="2" v-show="addOrEdit.two">二级分类</el-radio>
            <el-radio :label="3" v-show="addOrEdit.three">三级分类</el-radio>
          </el-radio-group>
        </el-form-item>

        <div style="margin-left: 50px" v-show="addOrEdit.classificationVisible2">
          <el-form-item label="一级分类">
            <el-select v-model="addOrEdit.oneClass2" :value="addOrEdit.oneClass2" v-bind:disabled='classificationV' placeholder="请选择一级分类" @change="changeShop">
              <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-show="addOrEdit.classificationVisible3" style="margin-left: 50px">
          <el-form-item label="二级分类" style="width: 300px;">
            <el-select v-model="addOrEdit.twoClass" :value="addOrEdit.twoClass" placeholder="请选择二级分类" @change="changeOneSelect">
              <el-option
                      v-for="item in optionslist"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="名称：" style="margin-left: 50px">
          <el-input v-model="addOrEdit.cla.name"></el-input>
        </el-form-item>
        <el-form-item label="排序：" style="margin-left: 50px">
          <el-input v-model="addOrEdit.cla.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态：" style="margin-left: 50px">
          <el-radio-group v-model="addOrEdit.cla.status">
            <el-radio :label="1">上线</el-radio>
            <el-radio :label="2">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button @click="resetForm()">取 消</el-button>
          <el-button
                  type="primary"
                  :loading="addOrEdit.loading"
                  @click="subOrEdit()">确 定</el-button>
          <el-input style="display: none" v-model="addStatus"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
</div>
</template>
<script>
import * as skuApi from '@/api/skuApi'
export default {
  name: 'skuApi',
  data () {
    return {// 搜索框
      classificationV: false,
      restaurants: [],
      twoClassification: '',
      options: '',
      optionslist: '', // 添加等于1，编辑等于2
      addStatus: 1,
      currentPage4: 1,
      formInline: {
        title: '',
        searchContent: '',
        status: ''
      },
      addOrEdit: {
        dialogVisible: false,
        loading: false,
        classificationVisible2: false,
        classificationVisible3: false,
        oneClass1: '',
        oneClass2: '',
        disabledInput: false,
        twoClass: '',
        level: 1,
        first: true,
        two: true,
        three: true,
        id: '',
        cla: {
          name: '',
          sort: '',
          status: 1,
          parentId: '0'
        }
      },
      list: {
        loading: true,
        total: 1,
        page: 1,
        name: '',
        limit: 10
      },
      add: {
        dialogVisible: false,
        loading: false,
        disabled: false,
        form: {
          addOneOpuses: '',
          status: '',
          sort: '',
          name: ''
        }
      }, // 获取row的key值
      getRowKeys (row) {
        return row.id;
      },
      form: {}, // 要展开的行，数值的元素是row的key值
      expands: []
    }
  },
  created () {
    this.getList()
    this.onelist()
  },
  methods: {
    onelist () {
    // 新建
    // 获取一级分类
      this.addOrEdit.level = 1
      skuApi.getOneClass({})
        .then(data => {
          if (data.code === 300000) {
            this.restaurants = data.data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    selectList () {
      // 获取一级分类
      this.addOrEdit.level = 1
      skuApi.getOneClass({})
        .then(data => {
          if (data.code === 300000) {
            this.options = data.data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 初始化数据
    init () {
      this.addOrEdit.oneClass1 = ''
      this.addOrEdit.oneClass2 = ''
      this.addOrEdit.twoClass = ''
      this.addOrEdit.cla = {
        name: '',
        sort: '',
        status: 1,
        parentId: ''
      }
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      console.log(item);
    },
    // 获取三级列表信息
    expandTwoList (id, index) {
      console.log(id)
      console.log(index)
    // index.expandTwoStatus = !index.expandTwoStatus
    },
    // 添加分类弹窗
    openAddOrEditDialog () {
      this.init()
      this.addStatus = 1
      this.addOrEdit.level = 1
      this.addOrEdit.dialogVisible = true
      this.addOrEdit.first = true
      this.addOrEdit.two = true
      this.addOrEdit.three = true
      this.addOrEdit.disabledInput = false
      this.addOrEdit.classificationVisible1 = true
      this.addOrEdit.classificationVisible2 = false
      this.addOrEdit.classificationVisible3 = false
    },
    // 重置验证的表单
    resetForm () {
      this.addOrEdit.dialogVisible = false
    },
    changeHandler (value) {
      this.addOrEdit.first = true
      this.addOrEdit.two = true
      this.addOrEdit.three = true
      if (value === 1) {
        this.addOrEdit.classificationVisible2 = false
        this.addOrEdit.classificationVisible3 = false
      }
      if (value === 2) {
        this.addOrEdit.classificationVisible2 = true
        this.addOrEdit.classificationVisible3 = false
      }
      if (value === 3) {
        this.addOrEdit.classificationVisible2 = true
        this.addOrEdit.classificationVisible3 = true
      }
    },
    // 一级分类选项
    changeShop (value) {
      this.addOrEdit.cla.parentId = value
      skuApi.getTwoclassification(this.addOrEdit.oneClass2)
        .then(data => {
          if (data.code === 300000) {
            this.optionslist = data.data
            this.addOrEdit.twoClass = ''
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 二级分类选项
    changeOneSelect (value) {
      this.addOrEdit.cla.parentId = value
    },
    onSubmit () {
      this.list.page = 1
      this.getList()
    },
    // 获取列表信息
    getList () {
      this.list.loading = true
      this.addOrEdit.disabledInput = false
      skuApi.getclassification({status: this.formInline.status, name: this.formInline.searchContent})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            data = data.data
            this.list.tableData = data
            this.twoClassification = ''
            this.list.tableData.forEach((v, i) => {
              v.children.forEach((v1, i1) => {
                v1.expandTwoStatus = false
              })
            })
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 修改分类状态
    viewDetails (id, st) {
      let status = st
      let name = ''
      if (st == '1') {
        status = 2
        name = '下线'
      } else {
        status = 1
        name = '上线'
      }
      this.$confirm('是否确认<span class="red">' + name + '</span> ？', '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        skuApi.putStatusClass(id, {status: status})
          .then(data => {
            this.list.loading = false
            if (data.code === 300000) {
              this.$message.success('操作成功')
              this.list.page = 1
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
    // 删除
    delItem (id, name, count) {
      this.$confirm('是否确认删除<span class="red">' + name + '</span> ？', '删除', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        skuApi.deleteOneOpuses(id)
          .then(data => {
            if (data.code === 300000) {
              this.$message.success('操作成功')
              this.list.page = 1
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
    // Todo 少一个一级分类的名称
    // 添加分类
    subOrEdit () {
      let lev = String(this.addOrEdit.level)
      if (lev == 1) {
        this.addOrEdit.cla.parentId = '0'
      }
      this.addOrEdit.cla.level = lev
      let edit = this.addOrEdit.cla
      if (!this.addOrEdit.cla.name) {
        this.$message.error('活动名称不能为空')
        return false
      } else {
        if (isNaN(this.addOrEdit.cla.sort)) {
          this.$message.error('排序必须是数字')
          return false
        } else if (this.addOrEdit.cla.sort == 0) {
          this.$message.error('排序必须大于零')
          return false
        } else {
          let reg = /^(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;
          let num = /^(?:0|\-?[1-9]\d*)$/;
          if (!reg.test(this.addOrEdit.cla.sort)) {
            this.$message.error('排序不能是负数')
            return false
          } else if (this.addOrEdit.cla.sort == '') {
            this.$message.error('排序不能为汉字')
            return false
          } else if (!num.test(this.addOrEdit.cla.sort)) {
            this.$message.error('排序不能是小数')
            return false
          } else {
            if (this.addStatus == 1) {
              skuApi.addOneClassification(Object.assign(edit))
                .then(data => {
                  if (data.code === 300000) {
                    this.$message.success('创建成功')
                    this.addOrEdit.dialogVisible = false
                    this.list.page = 1
                    this.getList()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
                .catch(err => { this.$message.error(err) })
            } else {
              delete this.addOrEdit.cla.level
              let add = this.addOrEdit.cla
              skuApi.editClassContent(this.addOrEdit.id, Object.assign(add))
                .then(data => {
                  if (data.code === 300000) {
                    this.$message.success('编辑成功')
                    this.addOrEdit.dialogVisible = false
                    this.list.page = 1
                    this.getList()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
                .catch(err => { this.$message.error(err) })
            }
          }
        }
      }
    },
    // 编辑
    openEditDialog (level, id) {
      this.addStatus = 2
      this.addOrEdit.dialogVisible = true
      this.addOrEdit.level = level
      if (level == 1) {
        this.addOrEdit.cla.parentId = '0'
        this.addOrEdit.first = true
        this.addOrEdit.two = false
        this.classificationV = false
        this.addOrEdit.three = false
        this.addOrEdit.classificationVisible2 = false
        this.addOrEdit.classificationVisible3 = false
      }
      if (level == 2) {
        this.addOrEdit.cla.parentId = id
        this.addOrEdit.first = false
        this.addOrEdit.two = true
        this.classificationV = false
        this.addOrEdit.three = false
        this.addOrEdit.classificationVisible2 = true
        this.addOrEdit.classificationVisible3 = false
      }
      if (level == 3) {
        this.addOrEdit.cla.parentId = id
        this.addOrEdit.first = false
        this.classificationV = true
        this.addOrEdit.two = false
        this.addOrEdit.three = true
        this.addOrEdit.classificationVisible2 = true
        this.addOrEdit.classificationVisible3 = true
        this.addOrEdit.disabledInput = true
      }
      this.addOrEdit.id = id
      skuApi.getClassContent(id, {})
        .then(data => {
          if (data.code === 300000) {
            data = data.data
            if (this.addOrEdit.level == 2) {
              this.addOrEdit.oneClass2 = data.parent.name
            }
            if (this.addOrEdit.level == 3) {
              this.addOrEdit.oneClass2 = data.parent.parent.name
              this.addOrEdit.oneClass1 = data.parent.parent.name
              this.addOrEdit.twoClass = data.parent.name
              // 获取弹窗里面的二级分类
              skuApi.getTwoclassification(data.parent.parent.id, {})
                .then(data => {
                  if (data.code === 300000) {
                    this.optionslist = data.data
                  } else {
                    this.$message.error(data.msg)
                  }
                })
                .catch(err => { this.$message.error(err) })
            }
            this.addOrEdit.cla = {
              name: data.name,
              sort: data.sort,
              status: data.status,
              parentId: data.parent_id
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 添加子分类
    addRole (level, value, id) {
      this.addOrEdit.disabledInput = false
      this.addStatus = 1
      this.init()
      this.selectList()
      this.addOrEdit.first = true
      this.addOrEdit.two = true
      this.addOrEdit.three = true
      this.addOrEdit.level = level
      this.addOrEdit.cla.parentId = value
      if (level === 2) {
        this.addOrEdit.oneClass2 = value
        this.addOrEdit.classificationVisible2 = true
        this.addOrEdit.classificationVisible3 = false
      }
      if (level === 3) {
        this.addOrEdit.classificationVisible2 = true
        this.addOrEdit.classificationVisible3 = true
        this.addOrEdit.oneClass2 = id
        skuApi.getTwoclassification(id)
          .then(data => {
            if (data.code === 300000) {
              this.optionslist = data.data
              this.addOrEdit.twoClass = value
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }
      this.addOrEdit.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
.sanjiaotop{
position: absolute;
left: 0;
width:30px;
height: 30px;
cursor: pointer;
}
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
