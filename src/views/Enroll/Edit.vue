<template>
  <div>
     <el-form :model="enrollForm" ref="enrollForm" label-width="170px" style="width: 600px;">
      <el-form-item label="报名活动名称" prop="name" :rules="[
          { required: true, message: '请输入报名活动名称'}
        ]">
        <el-input v-model="enrollForm.name" placeholder="请输入报名活动名称"></el-input>
      </el-form-item>
      <el-form-item label="可报名时间段" prop="begin_at" required>
        <el-col :span="11">
          <el-form-item prop="begin_at" :rules="[
            { required: true, message: '请选择开始时间'}
          ]">
            <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" v-model="enrollForm.begin_at" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">——</el-col>
        <el-col :span="11">
          <el-form-item prop="end_at" :rules="[
            { required: true, message: '请选择结束时间'}
          ]">
            <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" v-model="enrollForm.end_at" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="报名成功二维码背景图" prop="extra.msgCoderBgPic" :rules="[
          { required: true, message: '请上传报名成功二维码背景图'}
        ]">
        <el-input v-model="enrollForm.extra.msgCoderBgPic" style="display: none;"></el-input>
        <upload
          upfileType="image"
          :showFileList="true"
          btnTxt="上传图片"
          btnType="text"
          :CBParams="{name:'msgCoderBgPic'}"
          @urlCB="uploadSuccess">
        </upload>
      </el-form-item>
      <el-form-item v-if="enrollForm.extra.msgCoderBgPic">
        <img class="has-upload-img" :src="enrollForm.extra.msgCoderBgPic" alt="报名成功二维码背景图">
      </el-form-item>
      <el-form-item label="参会场次" prop="enroll_session" :rules="[
          { type: 'array', required: true, message: '请填写参会场次'}
        ]">
         <el-checkbox-group v-model="enrollForm.enroll_session" style="display: none;"></el-checkbox-group>
        <el-button type="text" size="small" @click="dialogVisible = true">添加场次</el-button>
      </el-form-item>
      <el-form-item v-if="enrollForm.enroll_session.length > 0">
        <ul style="margin-top: -20px;">
          <li
            v-for="(item, index) in enrollForm.enroll_session"
            :key="index"
            v-if="item.name && item.price >= 0"
          >
            <span>{{item.name}}</span><span style="margin-left: 20px;">{{item.price}}元</span>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="角色选择" prop="roles" :rules="[
          { required: true, message: '请添加角色'}
        ]">
        <el-tag
          :key="item"
          v-for="item in enrollForm.roles"
          closable
          :disable-transitions="false"
          @close="handleClose(item,'roles')">
          {{item}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible==3"
          v-model="inputValue"
          ref="saveRoleTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm('roles')"
          @blur="handleInputConfirm('roles')"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput(3,'saveRoleTagInput')">+ 添加角色</el-button>
      </el-form-item>
      <el-form-item label="是否需要文字输入" prop="enable_remark" required>
        <el-switch
          v-model="enrollForm.enable_remark"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item
        label="要求填写的内容"
        prop="remark_name"
        v-show="isNeedRemark"
        :rules="[
          { required: isNeedRemark ? true : false, message: '请填写此内容'}
        ]"
        >
        <el-input type="textarea" v-model="enrollForm.remark_name" placeholder="请输入要求填写的内容"></el-input>
      </el-form-item>
      <el-form-item label="头图" prop="extra.headPic" :rules="[
          { required: true, message: '请上传头图'}
        ]">
        <el-input v-model="enrollForm.extra.headPic" style="display: none;"></el-input>
        <upload
          upfileType="image"
          :showFileList="true"
          btnTxt="上传图片"
          btnType="text"
          :CBParams="{name:'headPic'}"
          @urlCB="uploadSuccess">
        </upload>
      </el-form-item>
      <el-form-item v-if="enrollForm.extra.headPic">
        <img class="has-upload-img" :src="enrollForm.extra.headPic" alt="头图">
      </el-form-item>
      <el-form-item label="页面背景图" prop="extra.bgPic" :rules="[
          { required: true, message: '请上传页面背景图'}
        ]">
        <el-input v-model="enrollForm.extra.bgPic" style="display: none;"></el-input>
        <upload
          upfileType="image"
          :showFileList="true"
          btnTxt="上传图片"
          btnType="text"
          :CBParams="{name:'bgPic'}"
          @urlCB="uploadSuccess">
        </upload>
      </el-form-item>
      <el-form-item v-if="enrollForm.extra.bgPic">
        <img class="has-upload-img" :src="enrollForm.extra.bgPic" alt="页面背景图">
      </el-form-item>
      <el-form-item label="文字颜色" prop="extra.txtColor" :rules="[
          { required: true, message: '请选择或填写文字颜色'}
        ]">
        <el-col :span="18">
          <el-input v-model="enrollForm.extra.txtColor" placeholder="请输入/选择文字颜色（如：#ffffff）"></el-input>
        </el-col>
        <el-col :span="4" style="height: 40px;">
          <el-color-picker v-model="enrollForm.extra.txtColor" style="margin-left: 20px;"></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="按钮提交文字" prop="extra.submitBtnTxt" :rules="[
          { required: true, message: '请选择或填写按钮提交文字'}
        ]">
        <el-input v-model="enrollForm.extra.submitBtnTxt" placeholder="请输入按钮提交文字"></el-input>
      </el-form-item>
      <el-form-item label="按钮颜色" prop="extra.submitBtnColor" :rules="[
          { required: true, message: '请选择或填写按钮颜色'}
        ]">
        <el-col :span="18">
          <el-input v-model="enrollForm.extra.submitBtnColor" placeholder="请输入/选择按钮颜色（如：#ffffff）"></el-input>
        </el-col>
        <el-col :span="4" style="height: 40px;">
          <el-color-picker v-model="enrollForm.extra.submitBtnColor" style="margin-left: 20px;"></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="合作伙伴图" prop="extra.partnerPic" :rules="[
          { required: true, message: '请选择或填写合作伙伴图'}
        ]">
        <el-input v-model="enrollForm.extra.partnerPic" style="display: none;"></el-input>
        <upload
          upfileType="image"
          :showFileList="true"
          btnTxt="上传图片"
          btnType="text"
          :CBParams="{name:'partnerPic'}"
          @urlCB="uploadSuccess">
        </upload>
      </el-form-item>
      <el-form-item v-if="enrollForm.extra.partnerPic">
        <img class="has-upload-img" :src="enrollForm.extra.partnerPic" alt="合作伙伴图">
      </el-form-item>
      <el-form-item label="报名成功后跳转链接" prop="extra.url" :rules="[
          { required: false, message: '请输入链接，不填写跳转到关联大会模板或主页'}
        ]">
        <el-input v-model="enrollForm.extra.url" placeholder="请输入链接，不填写跳转到关联大会模板或主页"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitForm('enrollForm', 'onSubmit')">编辑</el-button>
      </el-form-item>
    </el-form>
    <!-- 参会场次 -->
    <el-dialog
      title="参会场次"
      :visible.sync="dialogVisible"
      width="460px"
      class="dialog-tags">
      <div class="create-tags-box">
        <div class="opera-area">
          <el-tooltip effect="dark" content="添加一项" placement="top">
            <i class="el-icon-plus green" @click="addEnrollSessionItem"></i>
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
            v-for="(item, index) in enrollForm.enroll_session"
            :key="index"
          >
            <el-checkbox
              @click="item.isCheck = !item.isCheck"
              v-model="item.isCheck">
              <label>场次{{index + 1}}</label>
              <el-input
                size="small"
                class="input-bottom-boder"
                placeholder="请输入场次名"
                :maxlength="10"
                v-model="item.name"></el-input>
              <el-input
                size="small"
                class="input-bottom-boder"
                placeholder="请输入金额"
                type="number"
                v-model.number="item.price"></el-input>元
            </el-checkbox>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Upload from '@/components/Upload/custom'
import * as Enroll from '@/api/enroll'
export default {
  name: 'EnrollEdit',
  data () {
    return {
      id: '',
      enrollForm: {
        // 活动名称
        name: '',
        // 可报名开始时间
        begin_at: '',
        // 可报名结束时间
        end_at: '',
        // 场次列表
        enroll_session: [
          /* {
            'name': '',
            'price': 0,
            isCheck: 0
          } */
        ],
        // 角色列表
        roles: [
        ],
        // 是否需要文字输入
        enable_remark: 1,
        // 要求填写的内容
        remark_name: '',
        extra: {
          // 报名成功二维码背景图
          msgCoderBgPic: '',
          // 页面头图
          headPic: '',
          // 页面背景图
          bgPic: '',
          // 文字颜色
          txtColor: '',
          // 按钮提交文字
          submitBtnTxt: '',
          // 按钮颜色
          submitBtnColor: '',
          // 合作伙伴图
          partnerPic: '',
          url: ''
        }
      },
      inputVisible: false,
      inputValue: '',
      loading: false,
      dialogVisible: false
    }
  },
  components: {
    upload: Upload
  },
  computed: {
    isNeedRemark () {
      let result = true
      if (this.enrollForm.enable_remark != 1) {
        result = false
      }
      return result
    }
  },
  created () {
    let { id = '' } = this.$route.params
    if (id) {
      // 获取详情
      this.getEnrollDetail(id)
    }
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // 提示信息
    myMessage (type, tips, cb) {
      let allType = ['success', 'warning', 'info', 'error']
      if (allType.indexOf(type) === -1) {
        return this.$message.error(`message没有type为${type}的方法！`)
      }
      this.$message[type](tips)
      setTimeout(() => {
        cb && cb()
      }, 3000)
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
    // 上传成功
    uploadSuccess () {
      let type = arguments[1].name
      this.enrollForm.extra[type] = arguments[0].file_url
    },
    handleClose (item, type) {
      this.enrollForm[type].splice(this.enrollForm[type].indexOf(item), 1);
    },
    showInput (i, type) {
      this.inputVisible = i;
      this.$nextTick(_ => {
        this.$refs[type].$refs.input.focus();
      });
    },
    handleInputConfirm (type) {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.enrollForm[type].push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 设置表单信息
    setFormValue (data) {
      this.enrollForm = {
        name: data.name || '',
        begin_at: data.begin_at || '',
        end_at: data.end_at || '',
        enroll_session: data.enroll_session || [
          /* {
            'name': '',
            'price': 0,
            isCheck: 0
          } */
        ],
        // 角色列表
        roles: data.roles || [],
        // 是否需要文字输入
        enable_remark: data.enable_remark == 0 ? 0 : 1,
        // 要求填写的内容
        remark_name: data.remark_name || '',
        extra: data.extra || {
          msgCoderBgPic: '',
          headPic: '',
          bgPic: '',
          txtColor: '',
          submitBtnTxt: '',
          submitBtnColor: '',
          partnerPic: ''
        }
      }
    },
    // 获取报名模板详情
    getEnrollDetail (id) {
      if (!id) {
        return this.$message.error('请传入要查询的报名id')
      }
      Enroll.getEnrollDetail(id)
        .then(res => {
          if (res.code === 300000) {
            this.id = id
            this.setFormValue(res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 添加场次
    addEnrollSessionItem () {
      this.enrollForm.enroll_session.push({
        isCheck: 0,
        name: '',
        price: ''
      })
    },
    // 删除选中的标签
    deleteChecked () {
      let result = []
      for (let item of this.enrollForm.enroll_session) {
        if (!item.isCheck) {
          result.push(item)
        }
      }
      /* if (result.length === 0) {
        result.push({
          isCheck: 0,
          name: '',
          price: ''
        })
      } */
      this.enrollForm.enroll_session = result
    },
    // 批量新建标签值得时候 删除全部
    deleteAll () {
      this.$confirm('确定全部删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // 确认
        this.enrollForm.enroll_session = [
          /* {
            'name': '',
            'price': '',
            isCheck: 0
          } */
        ]
      }).catch(() => {
        // 取消
      })
    },
    // 确定编辑
    onSubmit () {
      let { id = '' } = this
      if (!id) {
        return this.$message.error('编辑的报名模板没有对应id')
      }
      let flag = true
      for (let item of this.enrollForm.enroll_session) {
        if (!item.name || item.price === '') {
          flag = false
          break
        }
        delete item.isCheck
      }
      if (!flag) {
        return this.$message.error('请将参会场次信息填写完整！')
      }
      this.loading = true
      Enroll.editEnroll({ id, ...this.enrollForm })
        .then(data => {
          this.loading = false
          if (data.code == 300000) {
            this.myMessage('success', '报名模板编辑成功！', () => {
              this.$router.push({ path: '/enroll/list' })
            })
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .has-upload-img {
    width: 200px;
  }
  .create-tags-box,
  .create-tags-explain {
    display: inline-block;
    width: 274px;
    height: 350px;
    vertical-align: top;
  }
  .create-tags-box {
    padding: 0 10px;
    width: 400px;
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
      margin: 0 10px 0 6px;
      width: 130px;
    }
    label {
      margin-left: 8px;
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
