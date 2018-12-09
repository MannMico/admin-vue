<template>
  <div>
    <!-- main -->
    <template v-if="showType == 0">
      <search-form
        :searchform='formStructure'
        :showFilterBtn="false"
        widgetWidth="200px"
        @queryData="getList"></search-form>
      <p class="link-tips">请在任意链接后面附上utm_source参数。例如，http://www.lkker.com/company?utm_source=19848958968</p>
      <!-- add btn -->
      <el-button
        v-permission="'v1.channel.channel.create'"
        type="primary"
        icon="el-icon-plus"
        size="small"
        class="add-btn"
        @click="openAddOrEditDialog(0)">新建渠道</el-button>
      <el-button
        v-permission="'v1.channel.channel.import'"
        type="primary"
        icon="el-icon-plus"
        size="small"
        class="add-batch-btn"
        @click="openAddOrEditBatchDialog">批量新建渠道</el-button>
      <el-button
        v-permission="'v1.channel.channel.export'"
        type="primary"
        icon="el-icon-download"
        size="small"
        class="add-batch-btn fr"
        @click="exportBatch">批量导出渠道参数</el-button>
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
        <el-table-column prop="channel_type_id" label="渠道类型" :formatter="formatterChannelTypeId">
        </el-table-column>
        <el-table-column prop="name" label="渠道名称">
        </el-table-column>
        <el-table-column prop="account" label="账号">
        </el-table-column>
        <el-table-column prop="plan" label="计划">
        </el-table-column>
        <el-table-column prop="unit" label="单元">
        </el-table-column>
        <el-table-column prop="keyword" label="关键词">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column prop="owner" label="渠道负责人">
        </el-table-column>
        <el-table-column prop="created_at" label="添加时间">
        </el-table-column>
        <el-table-column prop="utm_source" label="utm_source">
        </el-table-column>
        <el-table-column label="操作">
          <router-link
            v-permission="'v1.channel.channel.getbyutmsource'"
            slot-scope="scope"
            :to="`/channel/detail/${scope.row.utm_source}`">查看</router-link>
        </el-table-column>
      </el-table>
      <!-- panigation box -->
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="list.page"
          :page-size="list.limit"
          layout="total, prev, pager, next, jumper"
          :total="list.totalPage">
        </el-pagination>
      </div>
    </template>
    <!-- 批量创建渠道 -->
    <template v-if="showType == 1">
      <el-button type="success" size="small" icon="el-icon-back" style="margin-bottom: 20px;" @click="showType = 0">返回上一步</el-button>
      <h4 style="margin-top: 0;">第一步，请下载模板</h4>
      <el-row style="margin-top: 20px;margin-bottom: 20px;">
        <a href="http://lkker-10041312.file.myqcloud.com/template/%E6%89%B9%E9%87%8F%E6%96%B0%E5%BB%BA%E6%B8%A0%E9%81%93%E6%A8%A1%E6%9D%BF%EF%BC%88%E8%90%A5%E9%94%80%EF%BC%89.xlsx"><el-button>下载《批量新建渠道模板（营销）》</el-button></a>
      </el-row>
      <p class="info">
        注意：
        <br>1）支持xlsx文件上传（请使用Microsoft Office官网excel上传）；
        <br>2）请按照模板规范填写信息，不要删除表头，不要调整表头顺序；
        <br>3）《批量新建渠道模版（营销）》中的必填字段为渠道名称、账号、计划、单元、关键词、负责人；如不填写将无法创建；
        <br>4）当新建失败重新批量新建时，请务必删除已经成功新建的渠道，避免异常情况下重复创建。
      </p>
      <h4 style="margin-bottom: 20px;">第二步：请上传本次需要批量创建的渠道信息</h4>
      <el-upload
        ref="uploadExcel"
        accept="file"
        :on-exceed="uploadExceed"
        :on-success="uploadSucCB"
        :auto-upload="false"
        :action="getUploadUrl()"
        :limit="1"
        :file-list="fileList">
        <el-button size="medium" slot="trigger">选取文件</el-button>
      </el-upload>
      <h4>第三步：确定创建</h4>
      <el-row style="margin-top: 20px;margin-bottom: 20px;">
        <el-button type="primary" @click="uploadFile">确认提交，批量新建</el-button>
      </el-row>

      <h4>第四步：检查批量创建结果</h4>
      <template v-if="sucData !== ''">
        <div style="font-size: 12px; margin-top: 20px; color: #666;">已成功新建{{sucData}}个渠道参数；失败{{failData.length}}条，详情如下：</div>
        <el-table :data="failData">
          <el-table-column label="数据位置" prop="idx"></el-table-column>
          <el-table-column label="失败原因" prop="msg"></el-table-column>
        </el-table>
      </template>
      <div v-else style="font-size: 12px; margin-top: 20px; color: #666;">提交后即可查看结果</div>
    </template>
    <!-- 创建、编辑渠道 -->
    <el-dialog
      :title="addOrEdit.type == 0 ? '新建渠道': '编辑渠道'"
      :visible.sync="addOrEdit.dialogVisible"
      class="dialog-wrap"
      >
      <el-form
        inline
        :model="addOrEdit.form"
        ref="addOrEdit.form"
        label-width="100px">
        <el-row>
          <el-form-item
            label="渠道类型"
            prop="channel_type_id"
            :rules="[
              { required: true, message: '请选择渠道类型', trigger: 'change' }
            ]">
            <el-radio-group v-model="addOrEdit.form.channel_type_id" @change="changeChannelType">
              <el-radio label="1">营销</el-radio>
              <el-radio label="2">活动</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item
          label="渠道名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入推广渠道，如百度、360、搜狗等', trigger: 'blur' }
          ]">
          <el-input
            style="width: 300px"
            v-model="addOrEdit.form.name"
            :maxlength="20"
            placeholder="请输入推广渠道，如百度、360、搜狗等"></el-input>
        </el-form-item>
        <template v-if="addOrEdit.form.channel_type_id == 1">
          <el-form-item
            label="账号"
            prop="account"
            :rules="[
              { required: true, message: '请输入账号', trigger: 'blur' }
            ]">
            <el-input
              style="width: 300px"
              v-model="addOrEdit.form.account"
              :maxlength="20"
              placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item
            label="计划"
            prop="plan"
            :rules="[
              { required: true, message: '请输入计划', trigger: 'blur' }
            ]">
            <el-input
              style="width: 300px"
              v-model="addOrEdit.form.plan"
              :maxlength="20"
              placeholder="请输入计划"></el-input>
          </el-form-item>
          <el-form-item
            label="单元"
            prop="unit"
            :rules="[
              { required: true, message: '请输入单元', trigger: 'blur' }
            ]">
            <el-input
              style="width: 300px"
              v-model="addOrEdit.form.unit"
              :maxlength="20"
              placeholder="请输入单元"></el-input>
          </el-form-item>
          <el-form-item
            label="关键词"
            prop="keyword"
            :rules="[
              { required: true, message: '请输入关键词', trigger: 'blur' }
            ]">
            <el-input
              style="width: 300px"
              v-model="addOrEdit.form.keyword"
              :maxlength="20"
              placeholder="请输入关键词"></el-input>
          </el-form-item>
        </template>
        <el-form-item
          label="负责人"
          prop="owner"
          :rules="[
            { required: true, message: '请输入渠道负责人', trigger: 'blur' }
          ]">
          <el-input
            style="width: 300px"
            v-model="addOrEdit.form.owner"
            placeholder="请输入渠道负责人"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            style="width: 300px"
            type="textarea"
            placeholder="请输入备注"
            v-model="addOrEdit.form.remark"
            ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])">取 消</el-button>
        <el-button
          type="primary"
          :loading="addOrEdit.loading"
          @click="submitForm('addOrEdit.form', 'addChannel')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from '@/components/Form/inline'
import * as Channels from '@/api/channels'
import * as Interface from '@/utils/interface'
import { getToken } from '@/utils/auth'

export default {
  name: 'channelList',
  // 组件
  components: {
    'search-form': SearchForm
  },
  data () {
    return {
      showType: 0,
      formStructure: {
        type: {
          type: 'select',
          label: '渠道类型',
          placeholder: '请选择渠道类型',
          list: [
            {label: '营销', value: '1'},
            {label: '活动', value: '2'}
          ]
        },
        way: {
          type: 'select',
          label: '模糊搜索',
          placeholder: '请选择模糊搜索方式',
          list: [
            {label: '全部', value: ''},
            {label: '渠道名称', value: 'name'},
            {label: '账号', value: 'account'},
            {label: '计划', value: 'plan'},
            {label: '单元', value: 'unit'},
            {label: '关键词', value: 'keyword'},
            {label: '渠道负责人', value: 'owner'}
          ]
        },
        wayInput: {
          type: 'input',
          label: '',
          placeholder: '请输入模糊搜索关键词'
        },
        time: {
          type: 'date',
          label: '添加时间'
        },
        utm_source: {
          type: 'input',
          label: 'utm_source',
          placeholder: '请输入渠道关键字'
        },
        button: {
          type: 'button',
          btnText: '搜索'
        },
        form: {
          name: '',
          time: [],
          utm_source: '',
          wayInput: '',
          way: ''
        }
      },
      list: {
        loading: false,
        tableData: [],
        page: 1,
        limit: 20,
        totalPage: 1
      },
      // 添加、编辑
      addOrEdit: {
        title: '',
        type: 0,
        dialogVisible: false,
        loading: false,
        form: {
          name: '',
          owner: '',
          id: 0,
          channel_type_id: '1',
          keyword: '',
          unit: '',
          plan: '',
          account: '',
          remark: ''
        }
      },
      // 批量添加
      addOrEditBatch: {
        fileUrl: ''
      },
      failData: [],
      sucData: '',
      fileList: []
    }
  },
  computed: {
    // 处理列表数据（分页+筛选）
    searchParams () {
      let search = { ...this.formStructure.form }
      search.time = search.time ? search.time : []
      let pages = {
        page: this.list.page,
        limit: this.list.limit
      }
      let startAt = search.time[0]
      let endAt = search.time[1]
      delete search.time
      // 添加模糊筛选
      switch (search.way) {
      case 'name':
        search.name = search.wayInput
        break
      case 'account':
        search.account = search.wayInput
        break
      case 'plan':
        search.plan = search.wayInput
        break
      case 'unit':
        search.unit = search.wayInput
        break
      case 'keyword':
        search.keyword = search.wayInput
        break
      case 'owner':
        search.owner = search.wayInput
        break
      }
      delete search.way
      delete search.wayInput

      let params = {
        ...search,
        start_at: startAt,
        end_at: endAt,
        ...pages
      }
      for (let key of Object.keys(params)) {
        if (!params[key]) {
          delete params[key]
        }
      }
      return params
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getList()
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
    // changeChannelType
    changeChannelType (val) {
      if (val == 2) {
        this.addOrEdit.form = {
          name: '',
          id: 0,
          channel_type_id: '2',
          remark: ''
        }
      }
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
    },
    // 获取渠道列表
    getList () {
      this.list.loading = true
      Channels.getChannelList(this.searchParams)
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
    // 格式化“渠道类型”
    formatterChannelTypeId (row, column) {
      return ['', '营销', '活动'][row.channel_type_id]
    },
    // 新建 or 编辑渠道
    openAddOrEditDialog (type, row) {
      let addOrEditRef = this.$refs['addOrEdit.form']
      addOrEditRef && addOrEditRef.resetFields()
      this.addOrEdit.type = type
      this.addOrEdit.dialogVisible = true
      if (type == 1) {
        // TODO 暂时没有编辑 -> 从列表中获取详情
        this.addOrEdit.form = row
      } else {
        // 重置新建
        this.addOrEdit.form = {
          name: '',
          owner: '',
          id: 0,
          channel_type_id: '1',
          keyword: '',
          unit: '',
          plan: '',
          account: '',
          remark: ''
        }
      }
    },
    openAddOrEditBatchDialog () {
      this.showType = 1
    },
    // 添加渠道
    addChannel () {
      Channels.addChannel(this.addOrEdit.form)
        .then((data) => {
          if (data.code === 300000) {
            this.$message.success('渠道' + ['新建', '编辑'][this.addOrEdit.type] + '成功！')
            this.resetForm('addOrEdit.form', ['addOrEdit', 'dialogVisible'])
            this.getList()
            this.addOrEdit.dialogVisible = false
          } else {
            this.$message.error(data.msg)
          }
        })
    },
    exportBatch () {
      let params = {...this.searchParams}
      delete params.page
      delete params.limit

      Channels.exportChannelList(params).then((res) => {
        if (!res.code) {
          var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          var downloadElement = document.createElement('a');
          var href = window.URL.createObjectURL(blob); // 创建下载的链接
          downloadElement.href = href;
          downloadElement.download = '批量导出渠道.xlsx'; // 下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 点击下载
          document.body.removeChild(downloadElement); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    getUploadUrl () {
      let url = process.env.BASE_API ? `${process.env.BASE_API}/v1/channel/channels/imports` : 'http://feature-channel-analysis.admin.api.test.lkker.cn/v1/channel/channels/imports'
      return url
    },
    uploadFile () {
      console.log(this.$refs.uploadExcel);
      this.$refs.uploadExcel.headers['Authorization'] = 'Bearer ' + getToken()
      this.$refs.uploadExcel.headers['X-Nonce'] = Interface.getRandomStr();
      this.$refs.uploadExcel.headers['X-Time'] = Interface.getUnixtime();
      let { uploadExcel } = this.$refs
      let config = {
        headers: {
          'X-Nonce': uploadExcel.headers['X-Nonce'],
          'X-Time': uploadExcel.headers['X-Time']
        },
        url: uploadExcel.action,
        method: 'post',
        data: {}
      }
      // uploadExcel.uploadFiles[0].raw
      // config.data[uploadExcel.name] = 'a.xlsx'
      this.$refs.uploadExcel.headers['X-Sign'] = Interface.getSignData(config, process.env.NODE_ENV === 'production' ? 'nTBMFzvVKVL2keCsrzaNeUUC' : 'lkker');
      this.$refs.uploadExcel.submit();
      // console.log('X-Sign=>' + this.$refs.uploadExcel.headers['X-Sign'])
    },
    uploadSucCB (res) {
      if (res.code == 300000) {
        this.sucData = res.data.imported
        this.failData = res.data.failed
      } else {
        this.$message.error(res.msg)
      }
    },
    uploadExceed (params) {
      console.log(params)
      this.$message.warning('最多只能上传一个文件，请删除之前的文件再上传')
    }
  }
}
</script>
<style lang="scss" scoped>
  .link-tips {
    margin-top: 10px;
    font-size: 14px;
    color: #999;
  }
  h4 {
    margin-top: 30px;
    color: #666;
  }
  .info {
    font-size: 12px;
    color: #666;
  }
</style>
