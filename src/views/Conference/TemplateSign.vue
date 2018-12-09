<template>
  <div class="template-box index-box">
    <h3>报名<i class="el-icon-close" @click="delModuleHandler"></i></h3>
    <div class="index-inner">
      <el-form ref="signForm" :model="signForm" size="mini" label-width="100px" class="template-hide" style="width: 430px;">
        <el-form-item label="导航名" prop="navName" :rules="[
            { required: true, message: '请输入导航名'}
          ]">
          <div class="tips-info">5个字以内，导航隐藏后右侧导航区不显示该页面导航</div>
          <el-col :span="14">
            <el-input v-model="signForm.navName" placeholder="请输入导航名"></el-input>
          </el-col>
          <el-col :span="10">
            <el-switch
              v-model="signForm.isShow"
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
          <div class="tips-info">750*1624px（内容安全范围：750*1206px）</div>
          <el-input v-model="signForm.bgPic" style="display: none;"></el-input>
          <upload
            upfileType="image"
            :showFileList="true"
            btnTxt="上传背景图"
            btnType="text"
            @urlCB="uploadSuccess">
          </upload>
        </el-form-item>
        <el-form-item v-show="signForm.bgPic">
          <img :src="signForm.bgPic" width="160" alt="报名背景图">
        </el-form-item>
        <el-form-item label="报名id" prop="enrollId" :rules="[
            { required: true, message: '请输入报名id'}
          ]">
          <el-col :span="14">
            <el-input v-model="signForm.enrollId" placeholder="请输入报名id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="medium">
          <el-button type="primary" :loading="loading" @click="submitForm('signForm', 'saveModule')">保存</el-button>
          <el-button v-if="signForm.id && !signForm.isReEditStatus" size="small" type="primary" style="margin-left: 20px;" @click="signForm.isReEditStatus = 1">取消编辑</el-button>
        </el-form-item>
      </el-form>
      <!-- 效果预览 -->
      <div>
        <div class="template-preview no-template">报名模板</div>
        <!-- 重新编辑 -->
        <button-re-edit
          v-if="signForm.isReEditStatus"
          name="报名"
          :index="index"
          @setSort="setModuleSort"
          @reEditModule="reEditModule"
          :sort="signForm.sort"></button-re-edit>
      </div>
    </div>
  </div>
</template>
<script>

import Upload from '@/components/Upload/custom'
import * as Conference from '@/api/conference'
import ButtonReEdit from './ButtonReEdit'

export default {
  name: 'TemplateSign',
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
      signForm: this.data,
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
      this.signForm.bgPic = fileInfo.file_url
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
      Conference.saveModule({ conference_id: this.id, name: this.name, detail: this.signForm, moduleId: this.signForm.id })
        .then(res => {
          if (res.code === 300000) {
            this.loading = false
            this.signForm.id = res.data.id
            this.signForm.isReEditStatus = 1
            this.$message.success('模板编辑成功')
          } else {
            this.errHandler(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 设置排序
    setModuleSort (val) {
      this.signForm.sort = val
    },
    // 重新编辑模块
    reEditModule () {
      this.signForm.isReEditStatus = 0
    },
    // 删除模块
    delModuleHandler () {
      this.$confirm('确认删除此模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delModuleItem', this.index, this.signForm.id)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  @import 'src/styles/conference/template.scss';
  .template-box {
    margin-bottom: 20px;
    padding: 10px 20px;
    border: 1px solid #ccc;
  }
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    @include h-title(16px, #333, 40px);
    border-bottom: 1px solid #ccc;
    i {
      @extend %cp;
    }
  }
</style>
