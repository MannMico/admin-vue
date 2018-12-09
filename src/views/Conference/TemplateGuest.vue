<template>
  <div class="template-box index-box">
    <h3 class="template-title">嘉宾<i class="el-icon-close" @click="delModuleHandler"></i></h3>
    <div class="index-inner">
      <div class="template-hide">
        <el-form ref="guestForm" :model="guestForm" size="mini" label-width="100px" style="width: 430px;">
          <el-form-item label="导航名" prop="navName" :rules="[
              { required: true, message: '请输入导航名'}
            ]">
            <div class="tips-info">5个字以内，导航隐藏后右侧导航区不显示该页面导航</div>
            <el-col :span="14">
              <el-input v-model="guestForm.navName" placeholder="请输入导航名" :maxlength="5"></el-input>
            </el-col>
            <el-col :span="10">
              <el-switch
                v-model="guestForm.isShow"
                active-text="显示"
                inactive-text="隐藏"
                :active-value="1"
                :inactive-value="0"
                style="margin-left: 10px;">
              </el-switch>
            </el-col>
          </el-form-item>
          <el-form-item label="一句话描述" prop="desc" :rules="[
              { required: false, message: '请输入一句话描述'}
            ]">
            <div class="tips-info">20个字以内</div>
            <el-input v-model="guestForm.desc" placeholder="请输入一句话描述" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="背景图" prop="bgPic" :rules="[
              { required: true, message: '请上传背景图'}
            ]">
            <div class="tips-info">750*1624px（内容安全范围：750*1206px）</div>
            <el-input v-model="guestForm.bgPic" style="display: none;"></el-input>
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
        <!-- 嘉宾列表 -->
        <div class="guest-list">
          <div
            class="guest-item"
            v-for="(item, index) in guestForm.list"
            :key="'guestItem' + index">
            <i class="el-icon-close close-btn" @click="delGuestItem(index)"></i>
            <div class="input-item">
              <label class="is-required vt">嘉宾{{index+1}}</label>
              <el-input style="display: none;"></el-input>
              <upload
                style="display: inline-block;"
                upfileType="image"
                :upLimit="1"
                :showFileList="true"
                :key="'upload' + index"
                btnTxt="上传图片"
                btnType="text"
                :CBParams="{key: 'guest', index}"
                @urlCB="uploadSuccess">
              </upload>
              <div class="tips-info">600*600px</div>
            </div>
            <div class="input-item">
              <label>标题</label>
              <el-input class="el-input--mini" placeholder="请输入标题" :maxlength="10" v-model="item.title"></el-input>
              <div class="tips-info">10字以内</div>
            </div>
            <div class="input-item">
              <label class="vt">描述</label>
              <el-input type="textarea" placeholder="请输入描述" :maxlength="45" v-model="item.desc"></el-input>
              <div class="tips-info">45字以内</div>
            </div>
            <div class="input-item">
              <label>嘉宾顺序</label>
              <el-input class="el-input--mini" placeholder="请输入嘉宾顺序" :maxlength="2" v-model="item.order" @change="guestListSortHandler"></el-input>
              <div class="tips-info">数字越小越靠前</div>
            </div>
          </div>
          <el-button size="small" @click="addGuestItem">新增嘉宾</el-button>
        </div>
        <div class="btn-box">
          <el-button size="small" type="primary" :loading="loading" @click="submitForm('guestForm', 'saveModule')">保存</el-button>
          <el-button v-if="guestForm.id && !guestForm.isReEditStatus" size="small" type="primary" style="margin-left: 20px;" @click="guestForm.isReEditStatus = 1">取消编辑</el-button>
        </div>
      </div>
      <div>
        <!-- 效果预览 -->
        <div class="template-preview" v-if="activeIndex >= 0" :style="{'backgroundImage': `${guestForm.bgPic ? `url(${guestForm.bgPic})` : '#000'}`}">
          <div class="template_header">
            <div class="header_left">
              <img class="template_logo" :src="theme.desc.logo"/>
              <span class="nav_name" :style="{'color': theme.desc.mainColor}">{{guestForm.navName}}</span>
            </div>
            <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          </div>
          <div class="template_guest">
            <h6 class="guest_desc" :style="{'color': theme.desc.mainColor}">{{guestForm.desc}}</h6>
            <div class="guest_box" v-show="guestForm.list[activeIndex].bgPic">
              <img class="guest_img"
                :src="guestForm.list[activeIndex].bgPic ? guestForm.list[activeIndex].bgPic: ''"
                :alt="guestForm.list[activeIndex].title ? guestForm.list[activeIndex].title: ''"/>
              <div class="guest_info" v-show="guestForm.list[activeIndex].title || guestForm.list[activeIndex].desc">
                <p class="guest_name" :style="{'color': theme.desc.mainColor}">{{guestForm.list[activeIndex].title}}</p>
                <p class="guest_title"
                  v-for="(elem, i) in guestForm.list[activeIndex].desc.split('\n')"
                  :key="i"
                  :style="{'color': theme.desc.mainColor}"
                  >{{elem}}</p>
              </div>
            </div>
            <div class="guest_list clearfix">
              <img
                v-for="(item, index) in guestForm.list"
                :key="'guestImg' + index"
                :class="{'active': index == activeIndex}"
                v-show="item.bgPic"
                :src="item.bgPic"
                :alt="item.title"
                @click="activeIndex = index">
            </div>
          </div>
        </div>
        <!-- 重新编辑 -->
        <button-re-edit
          v-if="guestForm.isReEditStatus"
          name="嘉宾"
          :index="index"
          @setSort="setModuleSort"
          @reEditModule="reEditModule"
          :sort="guestForm.sort"></button-re-edit>
      </div>
    </div>
  </div>
</template>
<script>

import Upload from '@/components/Upload/custom'
import * as Conference from '@/api/conference'
import ButtonReEdit from './ButtonReEdit'

export default {
  name: 'TemplateGuest',
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
      guestForm: this.data,
      loading: false,
      // 选中嘉宾数组的哪一项
      activeIndex: 0
    }
  },
  computed: {
    /* formatGuestList () {
      let guestList = [ ...this.guestForm.list ]
      guestList.sort(this.compare)
      return guestList
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
    // 上传成功
    uploadSuccess (fileInfo, extra) {
      // 嘉宾
      let fileUrl = fileInfo.file_url
      let {key, index} = extra
      if (extra.key == 'guest') {
        this.guestForm.list[index].bgPic = fileUrl
      } else {
        this.guestForm[key] = fileUrl
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
    // 嘉宾顺序排序
    guestListSortHandler () {
      this.guestForm.list.sort(this.compare)
    },
    // 设置排序
    setModuleSort (val) {
      this.guestForm.sort = val
    },
    // 重新编辑模块
    reEditModule () {
      this.guestForm.isReEditStatus = 0
    },
    // 删除嘉宾
    delGuestItem (index) {
      this.$confirm('确认删除该嘉宾吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activeIndex = this.guestForm.list.length - 2
        this.guestForm.list = this.guestForm.list.filter((item, i) => {
          return i != index
        })
      }).catch(() => {
      })
    },
    // 添加嘉宾
    addGuestItem () {
      let guest = {
        // 嘉宾图片
        bgPic: '',
        // 标题(10字)
        title: '',
        // 描述(80字)
        desc: '',
        // 顺序
        order: 1
      }
      // 获取list中最大的order值
      let sort = 0
      for (let item of this.guestForm.list) {
        let nowSrot = item.order
        if (sort < nowSrot) {
          sort = nowSrot
        }
      }
      guest.order = Number(sort) + 1
      this.guestForm.list.push(guest)
      if (this.guestForm.list.length === 1) {
        this.activeIndex = 0
      }
    },
    // 嘉宾列表信息是否填写完整
    listDataIsLegal () {
      let flag = true
      let index = 0
      for (let item of this.guestForm.list) {
        index++
        for (let key in item) {
          if (['title', 'desc', 'order'].indexOf(key) === -1) {
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
      if (this.guestForm.list.length === 0) {
        flag = false
      }
      return [flag, `请上传嘉宾${index}的嘉宾图片`]
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
      Conference.saveModule({ conference_id: this.id, name: this.name, detail: this.guestForm, moduleId: this.guestForm.id })
        .then(res => {
          if (res.code === 300000) {
            this.loading = false
            this.guestForm.id = res.data.id
            this.guestForm.isReEditStatus = 1
            this.$message.success('模板编辑成功')
          } else {
            this.errHandler(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 删除模块
    delModuleHandler () {
      this.$confirm('确认删除此模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delModuleItem', this.index, this.guestForm.id)
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
      top: 8px;
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
  .index-inner /deep/ .el-form-item__error {
    right: -100px;
  }
</style>
