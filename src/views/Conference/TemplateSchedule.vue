<template>
  <div class="template-box index-box">
    <h3 class="template-title">日程<i class="el-icon-close" @click="delModuleHandler"></i></h3>
    <div class="index-inner">
      <el-form ref="scheduleForm" :model="scheduleForm" size="mini" class="template-hide" label-width="100px" style="width: 430px;">
        <el-form-item label="导航名" prop="navName" :rules="[
            { required: true, message: '请输入导航名'}
          ]">
          <div class="tips-info">5个字以内，导航隐藏后右侧导航区不显示该页面导航</div>
          <el-col :span="14">
            <el-input v-model="scheduleForm.navName" placeholder="请输入导航名" :maxlength="5"></el-input>
          </el-col>
          <el-col :span="10">
            <el-switch
              v-model="scheduleForm.isShow"
              active-text="显示"
              inactive-text="隐藏"
              :active-value="1"
              :inactive-value="0"
              style="margin-left: 10px;">
            </el-switch>
          </el-col>
        </el-form-item>
        <el-form-item label="背景图" prop="bgPic" :rules="[
            { required: true, message: '请上传背景图'}
          ]">
          <div class="tips-info">宽750px，高大于等于1206px</div>
          <el-input v-model="scheduleForm.bgPic" style="display: none;"></el-input>
          <upload
            style="display: inline-block;"
            upfileType="image"
            :upLimit="1"
            :showFileList="true"
            btnTxt="上传背景图"
            btnType="text"
            @urlCB="uploadSuccess">
          </upload>
        </el-form-item>
        <el-form-item size="medium">
          <el-button size="small" type="primary" :loading="loading" @click="submitForm('scheduleForm', 'saveModule')">保存</el-button>
          <el-button v-if="scheduleForm.id && !scheduleForm.isReEditStatus" size="small" type="primary" style="margin-left: 20px;" @click="scheduleForm.isReEditStatus = 1">取消编辑</el-button>
        </el-form-item>
      </el-form>
      <div>
        <!-- 效果预览 -->
        <div class="template-preview" :style="{'backgroundImage': `${scheduleForm.bgPic ? `url(${scheduleForm.bgPic})` : '#000'}`}">
          <div class="template_header">
            <div class="header_left">
              <img class="template_logo" :src="theme.desc.logo"/>
              <span class="nav_name" :style="{'color': theme.desc.mainColor}">{{scheduleForm.navName}}</span>
            </div>
            <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          </div>
        </div>
        <button-re-edit
          v-if="scheduleForm.isReEditStatus"
          name="日程"
          :index="index"
          @setSort="setModuleSort"
          @reEditModule="reEditModule"
          :sort="scheduleForm.sort"></button-re-edit>
      </div>
    </div>
  </div>
</template>
<script>

import Upload from '@/components/Upload/custom'
import * as Conference from '@/api/conference'
import ButtonReEdit from './ButtonReEdit'

export default {
  name: 'TemplateCooperate',
  props: {
    // 会场id
    id: {
      type: String,
      required: true
    },
    // 第几条数据
    index: {
      type: Number,
      required: true
    },
    // 数据
    data: {
      type: Object,
      required: true
    },
    // 模板对应类型
    name: {
      type: String,
      require: true
    },
    // 主题
    theme: {
      type: Object,
      reuqire: true
    }
  },
  components: {
    upload: Upload,
    buttonReEdit: ButtonReEdit
  },
  data () {
    return {
      scheduleForm: this.data,
      loading: false
    }
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // 重置验证的表单
    resetForm (formName, dialogTypeArr) {
      this[dialogTypeArr[0]][dialogTypeArr[1]] = false
      this.$refs[formName].resetFields();
    },
    uploadSuccess (fileInfo) {
      this.scheduleForm.bgPic = fileInfo.file_url
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
    // 保存模板数据
    saveModule () {
      this.loading = true
      if (!this.id) {
        return this.$message.error('编辑的大会不存在！')
      }
      Conference.saveModule({ conference_id: this.id, name: this.name, detail: this.scheduleForm, moduleId: this.scheduleForm.id })
        .then(res => {
          if (res.code === 300000) {
            this.loading = false
            this.scheduleForm.id = res.data.id
            this.scheduleForm.isReEditStatus = 1
            this.$message.success('模板编辑成功')
          } else {
            this.errHandler(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 设置排序
    setModuleSort (val) {
      this.scheduleForm.sort = val
    },
    // 重新编辑模块
    reEditModule () {
      this.scheduleForm.isReEditStatus = 0
    },
    // 删除模块
    delModuleHandler () {
      this.$confirm('确认删除此模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delModuleItem', this.index, this.scheduleForm.id)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/conference/template.scss';
</style>
