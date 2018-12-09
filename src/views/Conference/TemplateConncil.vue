<template>
  <div class="template-box index-box">
    <h3 class="template-title">会场<i class="el-icon-close" @click="delModuleHandler"></i></h3>
    <div class="index-inner">
      <div class="template-hide">
        <el-form ref="conncilForm" :model="conncilForm" size="mini" label-width="100px" style="width: 430px;">
          <el-form-item label="导航名" prop="navName" :rules="[
              { required: true, message: '请输入导航名'}
            ]">
            <div class="tips-info">5个字以内，导航隐藏后右侧导航区不显示该页面导航</div>
            <el-col :span="14">
              <el-input v-model="conncilForm.navName" placeholder="请输入导航名" :maxlength="5"></el-input>
            </el-col>
            <el-col :span="10">
              <el-switch
                v-model="conncilForm.isShow"
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
            <el-input v-model="conncilForm.bgPic" style="display: none;"></el-input>
            <upload
              upfileType="image"
              :showFileList="true"
              btnTxt="上传背景图"
              btnType="text"
              :CBParams="{key: 'bgPic'}"
              @urlCB="uploadSuccess">
            </upload>
          </el-form-item>
        </el-form>
        <!-- 会场列表 -->
        <div class="guest-list">
          <div
            class="guest-item"
            v-for="(item, index) in conncilForm.list"
            :key="'conncilItem' + index">
            <i class="el-icon-close close-btn" @click="delConncilItem(index)"></i>
            <div class="input-item">
              <label>会场{{index+1}}</label>
            </div>
            <div class="input-item">
              <label class="is-required vt">会场图片</label>
              <el-input v-model="item.bgPic" style="display: none;"></el-input>
              <upload
                style="display: inline-block;"
                upfileType="image"
                :upLimit="1"
                :showFileList="true"
                :key="'upload' + index"
                btnTxt="上传图片"
                btnType="text"
                :CBParams="{key: 'address', index}"
                @urlCB="uploadSuccess">
              </upload>
            </div>
            <div class="input-item">
              <label class="is-required vt">会场地址</label>
              <el-input type="textarea" placeholder="请输入会场地址" v-model="item.address" :maxlength="100"></el-input>
              <div class="tips-info">100字以内</div>
            </div>
            <div class="input-item">
              <label>会场顺序</label>
              <el-input class="el-input--mini" placeholder="请输入会场顺序" :maxlength="2" v-model="item.order" @change="conncilListSortHandler"></el-input>
              <div class="tips-info">数字越小越靠前</div>
            </div>
          </div>
          <el-button size="small" @click="addConncilItem">新增会场</el-button>
        </div>
        <div class="btn-box">
          <el-button size="small" type="primary" :loading="loading" @click="submitForm('conncilForm', 'saveModule')">保存</el-button>
          <el-button v-if="conncilForm.id && !conncilForm.isReEditStatus" size="small" type="primary" style="margin-left: 20px;" @click="conncilForm.isReEditStatus = 1">取消编辑</el-button>
        </div>
      </div>
      <div>
        <!-- 效果预览 -->
        <div class="template-preview" :style="{'backgroundImage': `${conncilForm.bgPic ? `url(${conncilForm.bgPic})` : '#000'}`}">
          <div class="template_header">
            <div class="header_left">
              <img class="template_logo" :src="theme.desc.logo"/>
              <span class="nav_name" :style="{'color': theme.desc.mainColor}">{{conncilForm.navName}}</span>
            </div>
            <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          </div>
          <div class="template_conncil">
            <el-carousel :interval="5000" arrow="hover" height="480px">
              <el-carousel-item v-for="(item, index) in conncilForm.list" :key="'conncilItem'  + index">
                <div class="conncil_item" v-show="item.bgPic">
                  <img :src="item.bgPic" :alt="item.address">
                  <div class="conncil_info">
                    <p class="conncil_address" :style="{'color': theme.desc.mainColor}">会场地址</p>
                    <p class="conncil_address_info" :style="{'color': theme.desc.mainColor}">{{item.address}}</p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <!-- 重新编辑 -->
        <button-re-edit
          v-if="conncilForm.isReEditStatus"
          name="会场"
          :index="index"
          @setSort="setModuleSort"
          @reEditModule="reEditModule"
          :sort="conncilForm.sort"></button-re-edit>
      </div>
    </div>
  </div>
</template>
<script>

import Upload from '@/components/Upload/custom'
import * as Conference from '@/api/conference'
import ButtonReEdit from './ButtonReEdit'

export default {
  name: 'TemplateSchedule',
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
      conncilForm: this.data,
      loading: false
    }
  },
  computed: {
    /* formatConncilList () {
      let conncilList = [ ...this.conncilForm.list ]
      conncilList.sort(this.compare)
      return conncilList
    } */
  },
  methods: {
    // 数组排序
    compare (x, y) {
      if (x.order < y.order) {
        return -1;
      } else if (x.order > y.order) {
        return 1;
      } else {
        return 0;
      }
    },
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // 重置验证的表单
    resetForm (formName, dialogTypeArr) {
      this[dialogTypeArr[0]][dialogTypeArr[1]] = false
      this.$refs[formName].resetFields();
    },
    // 上传成功
    uploadSuccess (fileInfo, extra) {
      // 会场
      let fileUrl = fileInfo.file_url
      let {key, index} = extra
      if (extra.key == 'address') {
        this.conncilForm.list[index].bgPic = fileUrl
      } else {
        this.conncilForm[key] = fileUrl
      }
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
    // 新增会场
    addConncilItem () {
      let conncil = {
        // 图片
        bgPic: '',
        // 会场地址
        address: '',
        order: 1
      }
      let sort = 0
      for (let item of this.conncilForm.list) {
        let nowSrot = item.order
        if (sort < nowSrot) {
          sort = nowSrot
        }
      }
      conncil.order = Number(sort) + 1
      this.conncilForm.list.push(conncil)
    },
    // 删除会场
    delConncilItem (index) {
      console.log(111);
      this.$confirm('确认删除该会场吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.conncilForm.list = this.conncilForm.list.filter((item, i) => {
          return i != index
        })
      }).catch(() => {
      })
    },
    // 嘉宾列表信息是否填写完整
    listDataIsLegal () {
      let flag = true
      let index = 0
      for (let item of this.conncilForm.list) {
        index++
        for (let key in item) {
          if (['order'].indexOf(key) === -1) {
            if (!item[key]) {
              flag = false
              break
            }
          }
        }
        if (flag == false) {
          break
        }
      }
      if (this.conncilForm.list.length === 0) {
        flag = false
      }
      return [flag, `请上传会场${index}的会场图片`]
    },
    // 保存模板数据
    saveModule () {
      if (!this.id) {
        return this.$message.error('编辑的大会不存在！')
      }
      let result = this.listDataIsLegal()
      let isPass = result[0]
      let errMsg = result[1]
      if (!isPass) {
        return this.$message.warning(errMsg)
      }
      this.loading = true
      Conference.saveModule({ conference_id: this.id, name: this.name, detail: this.conncilForm, moduleId: this.conncilForm.id })
        .then(res => {
          if (res.code === 300000) {
            this.loading = false
            this.conncilForm.id = res.data.id
            this.conncilForm.isReEditStatus = 1
            this.$message.success('模板编辑成功')
          } else {
            this.errHandler(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 嘉宾顺序排序
    conncilListSortHandler () {
      this.conncilForm.list.sort(this.compare)
    },
    // 设置排序
    setModuleSort (val) {
      this.conncilForm.sort = val
    },
    // 重新编辑模块
    reEditModule () {
      this.conncilForm.isReEditStatus = 0
    },
    // 删除模块
    delModuleHandler () {
      this.$confirm('确认删除此模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delModuleItem', this.index, this.conncilForm.id)
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/conference/template.scss';
  .vt {
    vertical-align: top;
  }
  .guest-item {
    @extend %pr;
    margin: 10px 0;
    padding: 20px 10px 10px;
    border: 1px solid #ddd;
    .close-btn {
      @extend %pa, %ib, %cp;
      top: 6px;
      right: 10px;
      font-size: 20px;
      color: #666;
    }
  }
  .input-item {
    @extend %pr;
    margin-bottom: 20px;
    label {
      @extend %ib;
      padding-right: 12px;
      width: 70px;
      font-size: 14px;
      &.is-required:before {
        content: '*';
        margin-right: 4px;
        color: #f56c6c;
      }
    }
    .el-input {
      width: 160px;
    }
    .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    .tips-info {
      left: 0;
    }
    .el-textarea {
      width: 280px;
    }
  }
  .btn-box {
    margin-top: 30px;
  }
  .template_guest {
    margin-top: doubleToPx(80px);
    overflow: hidden;
  }
  .guest_desc {
    @include h-title(doubleToPx(34px), #fff, doubleToPx(34px), center);
  }
  .guest_box {
    @extend %pr;
    margin: doubleToPx(80px) auto doubleToPx(20px);
    @include base(doubleToPx(600px), doubleToPx(600px));
  }
  .guest_img {
    @include base(100%, 100%);
  }
  .guest_info {
    @extend %pa, %tc;
    bottom: 0;
    left: 0;
    padding: doubleToPx(16px) doubleToPx(600px-394px)/2;
    @include base(doubleToPx(394px), auto, rgba(0, 0, 0, .6));
    color: #fff;
  }
  .guest_name {
    font-size: doubleToPx(26px);
    line-height: doubleToPx(40px);
  }
  .guest_title {
    font-size: doubleToPx(22px);
    line-height: doubleToPx(34px);
  }
  .guest_list {
    padding-left: doubleToPx(35px);
    height: doubleToPx(198px);
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    img {
      @extend %ib;
      margin-right: doubleToPx(16px);
      @include base(doubleToPx(180px), doubleToPx(180px));
      border: doubleToPx(4px) solid transparent;
      &.active {
        border-color: #fff;
      }
    }
  }
  .template_conncil {
    margin: doubleToPx(80px) auto 0;
    width: doubleToPx(660px);
    // 重置跑马灯样式
    /* .el-carousel__indicator {
      padding: 0 5px;
    }
    .el-carousel__button {
      @include base(doubleToPx(10px), doubleToPx(10px));
      border-radius: 50%;
    } */
  }
  .conncil_item {
    img {
      @include base(doubleToPx(660px), doubleToPx(660px));
    }
  }
  .conncil_info {
    margin: doubleToPx(30px) auto 0;
    width: doubleToPx(550px);
  }
  .conncil_address {
    margin-bottom: doubleToPx(30px-10px);
    @include fontStyle(doubleToPx(34px), #fff, 1, center);
    font-weight: 600;
  }
  .conncil_address_info {
    @include fontStyle(doubleToPx(22px), #fff, doubleToPx(36px), center);
  }
</style>
