<template>
  <div class="template-box index-box">
    <h3 class="template-title">首页<i class="el-icon-close" @click="delModuleHandler"></i></h3>
    <div class="index-inner">
      <!-- 首页模板字段 -->
      <el-form ref="indexForm" :model="indexForm" size="mini" label-width="100px" class="template-hide" style="width: 430px;">
        <el-form-item label="导航名" prop="navName" :rules="[
            { required: true, message: '请输入导航名'}
          ]">
          <div class="tips-info">5个字以内，导航隐藏后右侧导航区不显示该页面导航</div>
          <el-col :span="14">
            <el-input v-model="indexForm.navName" placeholder="请输入导航名" :maxlength="5"></el-input>
          </el-col>
          <el-col :span="10">
            <el-switch
              v-model="indexForm.isShow"
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
          <el-input v-model="indexForm.bgPic" style="display: none;"></el-input>
          <upload
            upfileType="image"
            :showFileList="true"
            btnTxt="上传背景图"
            btnType="text"
            @urlCB="uploadLogoSuccess">
          </upload>
        </el-form-item>
        <el-form-item label="倒计时文案" prop="countDownText" style="margin-bottom: 50px;" :rules="[
            { required: true, message: '请输入倒计时文案，12字以内'}
          ]">
          <div class="tips-info">12个字以内，字体颜色同全局正文颜色，“天”字同全局正文颜色//填了倒计时文案必填开始截止日期，不填倒计时文案该模块不显示</div>
          <el-col :span="14">
            <el-input v-model="indexForm.countDownText" placeholder="请输入倒计时文案，12字以内" :maxlength="12"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="倒计时时间" prop="countDownTime" :rules="[
            { required: indexForm.countDownText ? true: false, message: '请选择倒计时时间'}
          ]">
          <div class="tips-info">字体颜色同标题颜色</div>
          <el-date-picker
            v-model="indexForm.countDownTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择倒计时时间"
            style="width: 192px;"
            :picker-options="pickerOptions"
            @change="timeChangeHandler">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm('indexForm', 'saveModule')">保存</el-button>
          <el-button v-if="indexForm.id && !indexForm.isReEditStatus" size="mini" type="primary" style="margin-left: 20px;" @click="indexForm.isReEditStatus = 1">取消编辑</el-button>
        </el-form-item>
      </el-form>
      <!-- 效果预览 -->
      <div>
        <div class="template-preview" :style="{'backgroundImage': `${indexForm.bgPic ? `url(${indexForm.bgPic})` : '#000'}`}">
          <div class="template_header">
            <div class="header_left">
              <img class="template_logo" :src="theme.desc.logo"/>
              <span class="nav_name" :style="{'color': theme.desc.mainColor}">{{indexForm.navName}}</span>
            </div>
            <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          </div>
          <div class="template_countdown" v-html="countDownResult" :style="{'color': theme.desc.mainColor}"></div>
        </div>
        <!-- 重新编辑 -->
        <button-re-edit
          v-if="indexForm.isReEditStatus"
          name="首页"
          :index="index"
          @setSort="setModuleSort"
          @reEditModule="reEditModule"
          :sort="indexForm.sort"></button-re-edit>
      </div>
    </div>
  </div>
</template>
<script>
import Upload from '@/components/Upload/custom'
import * as Conference from '@/api/conference'
import ButtonReEdit from './ButtonReEdit'

export default {
  name: 'TemplateIndex',
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
      indexForm: this.data,
      loading: false,
      // 限制时间要做大会时间之间
      pickerOptions: {
        disabledDate (time) {
          // return time.getTime() > Date.now();
        }
      }
    }
  },
  computed: {
    countDownResult () {
      let result = '';
      let { countDownText, countDownTime } = this.indexForm;
      if (countDownText && countDownTime) {
        // 计算天数
        let currentTimeStamp = new Date().getTime()
        let checkTimeStamp = new Date(countDownTime).getTime()
        let remainDay = Math.ceil((checkTimeStamp - currentTimeStamp) / 3600 / 1000 / 24)
        result = `${countDownText}<span class="day">${remainDay > 0 ? remainDay : 0}</span>天`;
      }
      return result;
    }
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    uploadLogoSuccess (fileInfo) {
      this.indexForm.bgPic = fileInfo.file_url
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
    // 选择倒计时时间
    timeChangeHandler () {
      console.log(arguments);
    },
    // 保存模板数据
    saveModule () {
      this.loading = true
      if (!this.id) {
        return this.$message.error('编辑的大会不存在！')
      }
      Conference.saveModule({ conference_id: this.id, name: this.name, detail: this.indexForm, moduleId: this.indexForm.id })
        .then(res => {
          if (res.code === 300000) {
            this.loading = false
            this.indexForm.id = res.data.id
            this.indexForm.isReEditStatus = 1
            this.$message.success('模板编辑成功')
          } else {
            this.errHandler(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 设置排序
    setModuleSort (val) {
      this.indexForm.sort = val
    },
    // 重新编辑模块
    reEditModule () {
      this.indexForm.isReEditStatus = 0
    },
    // 删除模块
    delModuleHandler () {
      this.$confirm('确认删除此模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delModuleItem', this.index, this.indexForm.id)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/conference/template.scss';
  .template_countdown /deep/ .day {
    font-size: doubleToPx(48px);
  }
</style>
