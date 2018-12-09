<template>
  <div class="container-create">
    <!-- 大会全局数据 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="140px" style="width: 580px;">
      <el-form-item label="大会名称" prop="name" :rules="[
          { required: true, message: '请输入大会名称'}
        ]">
        <el-input v-model="ruleForm.name" placeholder="请输入大会名称"></el-input>
      </el-form-item>
      <el-form-item label="可报名时间">
        <el-col :span="11">
          <el-form-item prop="start_time" :rules="[
            { required: true, message: '选择开始时间'}
          ]">
            <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" v-model="ruleForm.start_time" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">——</el-col>
        <el-col :span="11">
          <el-form-item prop="end_time" :rules="[
              { required: true, message: '选择结束时间'}
            ]">
            <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" v-model="ruleForm.end_time" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="正文颜色" prop="desc.mainColor" :rules="[
          { required: true, message: '请输入/选择正文颜色'}
        ]">
        <el-col :span="18">
          <el-input v-model="ruleForm.desc.mainColor" placeholder="请输入/选择正文颜色（如：#ffffff）"></el-input>
        </el-col>
        <el-col :span="4" style="height: 40px;">
          <el-color-picker v-model="ruleForm.desc.mainColor" style="margin-left: 20px;"></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="导航选中字体颜色" prop="desc.navTxtSelectColor" :rules="[
          { required: true, message: '请输入/选择导航选中字体颜色'}
        ]">
        <el-col :span="18">
          <el-input v-model="ruleForm.desc.navTxtSelectColor" placeholder="请输入/选择标导航选中字体颜色（如：#ffffff）"></el-input>
        </el-col>
        <el-col :span="4" style="height: 40px;">
          <el-color-picker v-model="ruleForm.desc.navTxtSelectColor" style="margin-left: 20px;"></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="导航背景颜色" prop="desc.navBgColor" :rules="[
          { required: true, message: '请输入/选择导航背景颜色'}
        ]">
        <el-col :span="18">
          <el-input v-model="ruleForm.desc.navBgColor" placeholder="请输入/选择标导航背景颜色（如：#ffffff）"></el-input>
        </el-col>
        <el-col :span="4" style="height: 40px;">
          <el-color-picker v-model="ruleForm.desc.navBgColor" style="margin-left: 20px;"></el-color-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="上传logo" prop="desc.logo" :rules="[
          { required: true, message: '请上传logo'}
        ]">
        <el-input v-model="ruleForm.desc.logo" style="display: none;"></el-input>
        <upload
          upfileType="image"
          :showFileList="true"
          btnTxt="上传logo"
          btnType="text"
          @urlCB="uploadLogoSuccess"></upload>
      </el-form-item>
      <el-form-item v-show="ruleForm.desc.logo">
        <img :src="ruleForm.desc.logo" width="160" alt="logo">
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading.create"
          @click="submitForm('ruleForm', 'createConference')"
        >
          {{isEditStatus ? '编辑大会' : '创建大会'}}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 具体模板内容 -->
    <div>
      <div
        v-for="(item, index) in formatModuleDataBySort"
        :key="'moduleItem'+index"
        :id="'moduleItem'+index"
        :class="item[1].isReEditStatus ? 're-edit-wrap': ''">
        <template v-if="item[0] == 'index'">
          <template-index
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="index"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-index>
        </template>
        <template v-else-if="item[0] == 'guest'">
          <template-guest
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="guest"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-guest>
        </template>
        <template v-else-if="item[0] == 'schedule'">
          <template-schedule
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="schedule"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-schedule>
        </template>
        <template v-else-if="item[0] == 'address'">
          <template-conncil
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="address"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-conncil>
        </template>
        <template v-else-if="item[0] == 'cooperation'">
          <template-cooperate
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="cooperation"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-cooperate>
        </template>
        <template v-else-if="item[0] == 'coupon'">
          <template-coupon
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="coupon"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-coupon>
        </template>
        <template v-else-if="item[0] == 'introduce'">
          <template-info
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="introduce"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-info>
        </template>
        <template v-else-if="item[0] == 'link'">
          <template-link
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="link"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-link>
        </template>
        <template v-else-if="item[0] == 'enroll'">
          <template-sign
            :data="item[1]"
            :index="index"
            :id="id"
            :theme="ruleForm"
            name="enroll"
            :class="item[1].isReEditStatus ? 're-edit': ''"
            @delModuleItem="delModuleByIndexAndId"></template-sign>
        </template>
      </div>
      <div style="margin: 20px 0;text-align: center;">
        <el-button type="primary" v-if="isShowSortBtn" :loading="loading.sort" @click="saveModuleSort">保存排序</el-button>
      </div>
    </div>
    <!-- 新增模板 -->
    <div class="template-add" v-if="isEditStatus">
      <el-button type="primary" v-show="!isShowTemp" @click="isShowTemp = true">新增模块</el-button>
      <div class="template-select" v-show="isShowTemp">
        <h6 class="template-title">模块选择</h6>
        <ul class="template-all">
          <li><div class="item" @click="addTemplate('index')">首页</div></li>
          <li><div class="item" @click="addTemplate('guest')">嘉宾</div></li>
          <li><div class="item" @click="addTemplate('schedule')">日程</div></li>
          <li><div class="item" @click="addTemplate('address')">会场</div></li>
          <li><div class="item" @click="addTemplate('cooperation')">合作</div></li>
          <li><div class="item" @click="addTemplate('coupon')">优惠券</div></li>
          <li><div class="item" @click="addTemplate('introduce')">简介</div></li>
          <li><div class="item" @click="addTemplate('link')">外链</div></li>
          <li><div class="item" @click="addTemplate('enroll')">报名</div></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>

// 上传组件
import Upload from '@/components/Upload/custom'
import * as _string from 'lodash/string'
import * as Conference from '@/api/conference'

import TemplateIndex from './TemplateIndex'
import TemplateGuest from './TemplateGuest'
import TemplateSchedule from './TemplateSchedule'
import TemplateConncil from './TemplateConncil'
import TemplateCooperate from './TemplateCooperate'
import TemplateCoupon from './TemplateCoupon'
import TemplateInfo from './TemplateInfo'
import TemplateLink from './TemplateLink'
import TemplateSign from './TemplateSign'

export default {
  name: 'TemplateCreate',
  components: {
    upload: Upload,
    // 首页模板
    'template-index': TemplateIndex,
    // 嘉宾
    'template-guest': TemplateGuest,
    // 日程
    'template-schedule': TemplateSchedule,
    // 会场
    'template-conncil': TemplateConncil,
    // 合作
    'template-cooperate': TemplateCooperate,
    // 优惠券
    'template-coupon': TemplateCoupon,
    // 简介
    'template-info': TemplateInfo,
    // 外链
    'template-link': TemplateLink,
    // 报名
    'template-sign': TemplateSign
  },
  data () {
    return {
      // 大会模板id
      id: '0',
      // 大会全局数据
      ruleForm: {
        name: '',
        start_time: '',
        end_time: '',
        desc: {
          // 正文颜色
          mainColor: '',
          // 导航选中字体颜色
          navTxtSelectColor: '',
          // 导航背景色
          navBgColor: '',
          // logo
          logo: ''
        }
      },
      // loading 状态值
      loading: {
        'create': false,
        'sort': false
      },
      // 是否显示所有模块
      isShowTemp: false,
      // 所有模板数据
      moduleData: []
    }
  },
  computed: {
    // 根据排序格式化所有数据
    formatModuleDataBySort () {
      let allData = this.moduleData
      allData.sort(this.compare)
      return allData;
    },
    // 格式化主题字段
    formatRuleForm () {
      let obj = { ...this.ruleForm }
      let result = {}
      for (let key in obj) {
        result[_string.camelCase(key)] = obj[key]
      }
      return result
    },
    // 是否是编辑
    isEditStatus () {
      return this.id != 0
    },
    // 是否展示保存排序的按钮
    isShowSortBtn () {
      let isShow = true
      // 新建
      if (this.moduleData.length === 0) {
        isShow = false
      }
      for (let item of this.moduleData) {
        if (item[1].isReEditStatus != 1) {
          isShow = false
          break
        }
      }
      return isShow
    },
    // 格式化排序参数
    formatSortParam () {
      let result = {}
      for (let item of this.moduleData) {
        result[item[1].id] = item[1].sort
      }
      return result
    }
  },
  created () {
    // 判断是新建还是编辑
    let id = this.$route.params.id
    if (id != 0) {
      // 代表是编辑
      this.getConferenceDetail(id)
    }
  },
  methods: {
    // 数组排序
    compare (x, y) {
      if (x[1].sort < y[1].sort) {
        return -1;
      } else if (x[1].sort > y[1].sort) {
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
    // 创建/编辑大会
    createConference () {
      this.loading.create = true
      let param = this.formatRuleForm
      let {id} = this
      if (id != 0) {
        param.conferenceId = id
      }
      Conference.createConference(param)
        .then(res => {
          if (res.code === 300000) {
            this.loading.create = false
            this.id = res.data
            let tips = '大会创建成功，现在可以选择模板编辑！'
            if (id) {
              tips = '大会编辑成功！'
            }
            this.$message.success(tips)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 获取大会详情
    getConferenceDetail (id) {
      if (!id) {
        return this.$message.error('没有要查询的大会id');
      }
      Conference.getConferenceDetail(id)
        .then(res => {
          if (res.code === 300000) {
            this.setConferenceData(res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 上传logosuccess
    uploadLogoSuccess (fileInfo) {
      this.ruleForm.desc.logo = fileInfo.file_url
    },
    /**
     * 获取每个模块的初始化数据
     * @param {String} type
     * 首页index
       嘉宾guest
       日程schedule
       会场address
       合作cooperation
       优惠券coupon
       简介introduce
       外链link
       报名enroll
     */
    getTemplateData (type, detailItem = {id: 0, detail: {}}) {
      let result = {}
      let detail = detailItem.detail
      switch (type) {
      case 'index':
        // '首页'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 背景图
          bgPic: detail.bgPic || '',
          // 倒计时文案
          countDownText: detailItem.detail.countDownText || '',
          // 倒计时时间
          countDownTime: detailItem.detail.countDownTime || '',
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'guest':
        // '嘉宾'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 一句话描述
          desc: detail.desc || '',
          // 背景图
          bgPic: detail.bgPic || '',
          // 嘉宾列表
          list: detail.list || [{
            // 嘉宾图片
            bgPic: '',
            // 标题(10字)
            title: '',
            // 描述(80字)
            desc: '',
            // 顺序
            order: 1
          }],
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'schedule':
        // '日程'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 背景图
          bgPic: detail.bgPic || '',
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'address':
        // '会场'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 背景图
          bgPic: detail.bgPic || '',
          list: detail.list || [{
            bgPic: '',
            address: '',
            order: 1
          }],
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'cooperation':
        // '合作'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 背景图
          bgPic: detail.bgPic || '',
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'coupon':
        // '优惠券'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 背景图
          bgPic: detail.bgPic || '',
          // 礼物头图
          giftPic: detail.giftPic || '',
          // 领取说明
          declare: detail.declare || '',
          // 优惠券背景色
          backgroundColor: detail.backgroundColor || '',
          // 优惠券点击背景色
          backgroundClickColor: detail.backgroundClickColor || '',
          // 优惠券未点击文字色号
          mainTxtColor: detail.mainTxtColor || '',
          // 优惠券未点击描述文字色号
          descTxtColor: detail.descTxtColor || '',
          // 优惠券点击后标题文字色号
          titleClickColor: detail.titleClickColor || '',
          // 优惠券点击后描述文字色号
          descTxtClickColor: detail.descTxtClickColor || '',
          // 列表
          list: detail.list || [
            {
              // 名称
              name: '',
              // 图片
              coverPic: '',
              // 数量
              num: '',
              // 使用时间段(开始时间)
              start_time: '',
              // 结束时间
              end_time: '',
              // 标题
              title: '',
              // 描述
              desc: '',
              // 详情头图
              detailPic: '',
              // 需求点
              demandPoints: [],
              order: 1,
              inputVisible: 0,
              inputValue: ''
            }
          ],
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'introduce':
        // '简介'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 背景图
          bgPic: detail.bgPic || '',
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'link':
        // '外链'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow === 0 ? 0 : 1,
          // 外链链接
          link: detail.link || '',
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      case 'enroll':
        // '报名'模块
        result = {
          id: detailItem.id,
          // 导航名
          navName: detail.navName || '',
          // 显示/隐藏
          isShow: detail.isShow || '',
          // 背景图
          bgPic: detail.bgPic || '',
          // 报名链接id
          enrollId: detail.enrollId || '',
          // 该模块是不是重新编辑状态
          isReEditStatus: detailItem.id ? 1 : 0,
          // 排序
          sort: detailItem.sort > 0 ? Number(detailItem.sort) : 1
        }
        break;
      }
      return [type, result];
    },
    // 添加一个模块
    addTemplate (type) {
      // 此处加sort是为了新添加的模板保证是最后一个
      // sort要为moduleData中sort最大的值+1
      let sort = 0;
      for (let item of this.moduleData) {
        let nowSrot = item[1].sort
        if (sort < nowSrot) {
          sort = nowSrot
        }
      }
      this.moduleData.push(this.getTemplateData(type, {id: 0, sort: Number(sort) + 1, detail: {}}))
    },
    // 设置返回的详情的数据
    setConferenceData (allData) {
      // 大会主题数据
      let { conference } = allData
      let {id, name, desc} = conference
      this.id = id
      this.ruleForm = {
        name,
        desc,
        start_time: conference.start_at,
        end_time: conference.end_at
      }
      // 各个详情模块的数据
      for (let key in allData) {
        // 将除模板额外的信息过滤掉
        if (key != 'conference' && key != 'coupon') {
          this.moduleData.push(this.getTemplateData(allData[key].name, allData[key]))
        }
      }
    },
    // 保存排序
    saveModuleSort () {
      this.loading.sort = true
      Conference.saveModuleSort({sort: this.formatSortParam})
        .then(res => {
          if (res.code === 300000) {
            this.loading.sort = false
            this.$message.success('模板排序保存成功！')
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 删除模板byIndex
    delModuleByIndex (index) {
      this.$message.success('模板删除成功！')
      this.moduleData = this.moduleData.filter((item, i) => {
        return i != index
      })
    },
    // 删除模板byId
    delModuleByIndexAndId (index, id) {
      if (!id) {
        return this.delModuleByIndex(index)
      }
      Conference.deleteModule(id)
        .then(res => {
          if (res.code === 300000) {
            this.delModuleByIndex(index)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(this.errHandler)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .container-create {
    padding: 20px;
  }
  .template-select {
    margin-top: 20px;
    padding: 10px 20px 20px;
    border: 1px solid #ccc;
  }
  .template-title {
    @include h-title(16px, #333, 30px);
  }
  .template-all {
    display: flex;
    margin-top: 20px;
    li {
      flex: 1;
      text-align: center;
    }
    .item {
      @extend %ib, %cp;
      @include base(80px, 80px);
      font-size: 14px;
      line-height: 80px;
      border: 1px solid #999;
      &:hover {
        background: #f1f1f1;
      }
    }
  }
  .re-edit-wrap {
    @extend %ib;
    margin: 0 10px;
    vertical-align: top;
  }
</style>
