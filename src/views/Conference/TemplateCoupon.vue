<template>
  <div class="template-box index-box">
    <h3 class="template-title">优惠券<i class="el-icon-close" @click="delModuleHandler"></i></h3>
    <div class="index-inner">
      <div class="template-hide">
        <el-form ref="couponForm" :model="couponForm" size="mini" label-width="200px" style="margin-bottom: 110px; width: 530px;">
          <el-form-item label="导航名" prop="navName" :rules="[
              { required: true, message: '请输入导航名'}
            ]">
            <div class="tips-info">5个字以内，导航隐藏后右侧导航区不显示该页面导航</div>
            <el-col :span="14">
              <el-input v-model="couponForm.navName" placeholder="请输入导航名" :maxlength="5"></el-input>
            </el-col>
            <el-col :span="10">
              <el-switch
                v-model="couponForm.isShow"
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
            <el-input v-model="couponForm.bgPic" style="display: none;"></el-input>
            <upload
              upfileType="image"
              :showFileList="true"
              btnTxt="上传背景图"
              btnType="text"
              :CBParams="{key: 'bgPic'}"
              @urlCB="uploadSuccess">
            </upload>
          </el-form-item>
          <el-form-item label="礼物头图" prop="giftPic" :rules="[
              { required: true, message: '请上传礼物头图'}
            ]">
            <div class="tips-info">750*400px</div>
            <el-input v-model="couponForm.giftPic" style="display: none;"></el-input>
            <upload
              upfileType="image"
              :showFileList="true"
              btnTxt="上传图片"
              btnType="text"
              :CBParams="{key: 'giftPic'}"
              @urlCB="uploadSuccess">
            </upload>
          </el-form-item>
          <el-form-item label="领取说明" prop="declare" :rules="[
              { required: true, message: '请输入领取说明'}
            ]">
            <div class="tips-info">50个字</div>
            <el-input type="textarea" v-model="couponForm.declare" placeholder="请输入领取说明" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="优惠券背景色号" prop="backgroundColor" :rules="[
              { required: true, message: '请输入/选择颜色'}
            ]">
            <div class="tips-info">包括需求点标签未点击状态背景色值、提交按钮未点击状态背景色值</div>
            <el-col :span="18">
              <el-input v-model="couponForm.backgroundColor" placeholder="请输入/选择颜色（如：#ffffff）"></el-input>
            </el-col>
            <el-col :span="4" style="height: 40px;">
              <el-color-picker v-model="couponForm.backgroundColor" style="margin-left: 20px;"></el-color-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="点击后优惠券背景色号" prop="backgroundClickColor" :rules="[
              { required: true, message: '请输入/选择颜色'}
            ]">
            <div class="tips-info">包括需求点标签点击后背景色值、提交按钮触发背景色值</div>
            <el-col :span="18">
              <el-input v-model="couponForm.backgroundClickColor" placeholder="请输入/选择颜色（如：#ffffff）"></el-input>
            </el-col>
            <el-col :span="4" style="height: 40px;">
              <el-color-picker v-model="couponForm.backgroundClickColor" style="margin-left: 20px;"></el-color-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="优惠券标题文字色号" prop="mainTxtColor" :rules="[
              { required: true, message: '请输入/选择颜色'}
            ]" style="margin-bottom: 30px;">
            <div class="tips-info">“包括立即领取”文字色值、进度条进度色值、需求点标签未点击状态文字色值、提交按钮未点击状态文字色值</div>
            <el-col :span="18">
              <el-input v-model="couponForm.mainTxtColor" placeholder="请输入/选择颜色（如：#ffffff）"></el-input>
            </el-col>
            <el-col :span="4" style="height: 40px;">
              <el-color-picker v-model="couponForm.mainTxtColor" style="margin-left: 20px;"></el-color-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="优惠券未点击描述文字色号" prop="descTxtColor" :rules="[
              { required: true, message: '请输入/选择颜色'}
            ]">
            <div class="tips-info">“已抢百分比”文字色值、进度条默认色值</div>
            <el-col :span="18">
              <el-input v-model="couponForm.descTxtColor" placeholder="请输入/选择颜色（如：#ffffff）"></el-input>
            </el-col>
            <el-col :span="4" style="height: 40px;">
              <el-color-picker v-model="couponForm.descTxtColor" style="margin-left: 20px;"></el-color-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="优惠券点击后标题文字色号" prop="titleClickColor" :rules="[
              { required: true, message: '请输入/选择颜色'}
            ]" style="margin-bottom: 30px;">
            <div class="tips-info">“去使用”文字色值、“icon_go”色值、需求点标签点击后文字色值、提交按钮触发状态文字色值</div>
            <el-col :span="18">
              <el-input v-model="couponForm.titleClickColor" placeholder="请输入/选择颜色（如：#ffffff）"></el-input>
            </el-col>
            <el-col :span="4" style="height: 40px;">
              <el-color-picker v-model="couponForm.titleClickColor" style="margin-left: 20px;"></el-color-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="优惠券点击后描述文字色号" prop="descTxtClickColor" :rules="[
              { required: true, message: '请输入/选择颜色'}
            ]">
            <el-col :span="18">
              <el-input v-model="couponForm.descTxtClickColor" placeholder="请输入/选择颜色（如：#ffffff）"></el-input>
            </el-col>
            <el-col :span="4" style="height: 40px;">
              <el-color-picker v-model="couponForm.descTxtClickColor" style="margin-left: 20px;"></el-color-picker>
            </el-col>
          </el-form-item>
        </el-form>
        <!-- 优惠券列表 -->
        <div class="guest-list">
          <div class="guest-item"
            :key="'coupon' + index"
            v-for="(item, index) in couponForm.list"
            @click="activeIndex = index">
            <i class="el-icon-close close-btn" @click="delCouponItem(index)"></i>
            <div class="input-item" prop="descTxtClickColor">
              <label class="is-required">优惠券名称</label>
              <el-input class="el-input--mini" placeholder="请输入优惠券名称" v-model="item.name" :maxlength="10"></el-input>
              <div class="tips-info">10字以内</div>
            </div>
            <div class="input-item">
              <label class="is-required vt">优惠券图片</label>
              <div class="tips-info">100*100px</div>
              <el-input v-model="item.coverPic" style="display: none;"></el-input>
              <upload
                style="display: inline-block;"
                upfileType="image"
                :showFileList="true"
                btnTxt="上传图片"
                btnType="text"
                :CBParams="{key: 'coverPic', index}"
                @urlCB="uploadSuccess">
              </upload>
              <div class="tips-info">100*100px</div>
            </div>
            <div class="input-item">
              <label class="is-required">优惠券数量</label>
              <el-input class="el-input--mini" placeholder="请输入优惠券数量" v-model="item.num"></el-input>
              <div class="tips-info"></div>
            </div>
            <div class="input-item time-item">
              <label class="is-required">使用时间段</label>
              <div class="tips-info">限制在大会时间段内</div>
              <div>
                <el-col :span="11">
                  <el-date-picker type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期" v-model="item.start_time" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="11">
                  <el-date-picker type="datetime" size="small" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期" v-model="item.end_time" style="width: 100%;"></el-date-picker>
                </el-col>
              </div>
              <div class="tips-info"></div>
            </div>
            <div class="input-item">
              <label class="is-required">标题</label>
              <el-input class="el-input--mini" placeholder="请输入标题" v-model="item.title" :maxlength="10"></el-input>
              <div class="tips-info">10字以内</div>
            </div>
            <div class="input-item">
              <label class="is-required vt">描述</label>
              <el-input type="textarea" placeholder="请输入描述" v-model="item.desc" :maxlength="28"></el-input>
              <div class="tips-info">28字以内</div>
            </div>
            <div class="input-item">
              <label class="is-required vt">详情头图</label>
              <el-input v-model="item.detailPic" style="display: none;"></el-input>
              <upload
                style="display: inline-block;"
                upfileType="image"
                :showFileList="true"
                btnTxt="上传图片"
                btnType="text"
                :CBParams="{key: 'detailPic', index}"
                @urlCB="uploadSuccess">
              </upload>
              <div class="tips-info">宽750px，高度大于等于600px</div>
            </div>
            <div class="input-item">
              <label class="is-required vt">需求点</label>
              <div class="tags-box">
                <el-tag
                  :key="'demand' + index + i"
                  v-for="(ele, i) in item.demandPoints"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index, ele)"
                  style="margin: 0 10px 10px 0;">
                  {{ele}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="item.inputVisible"
                  v-model="item.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(index)"
                  @blur="handleInputConfirm(index)"
                  :maxlength="9"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(index)">+ 新增需求点</el-button>
              </div>
              <div class="tips-info">最多9个</div>
            </div>
            <div class="input-item">
              <label class="is-required">优惠券顺序</label>
              <el-input class="el-input--mini" placeholder="请输入优惠券顺序" :maxlength="2"  @change="couponListSortHandler" v-model="item.order"></el-input>
            </div>
          </div>
          <el-button size="small" @click="addCoupon">新增优惠券</el-button>
        </div>
        <div class="btn-box">
          <el-button size="small" type="primary" :loading="loading" @click="submitForm('couponForm', 'saveModule')">保存</el-button>
          <el-button v-if="couponForm.id && !couponForm.isReEditStatus" size="small" type="primary" style="margin-left: 20px;" @click="couponForm.isReEditStatus = 1">取消编辑</el-button>
        </div>
      </div>
      <!-- 效果预览 -->
      <div>
        <!-- 优惠券列表预览 -->
        <div class="template-preview" :style="{'backgroundImage': `${couponForm.bgPic ? `url(${couponForm.bgPic})` : '#000'}`}">
          <div class="template_header">
            <div class="header_left">
              <img class="template_logo" :src="theme.desc.logo"/>
              <span class="nav_name" :style="{'color': theme.desc.mainColor}">{{couponForm.navName}}</span>
            </div>
            <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          </div>
          <div class="template_coupon">
            <!-- 头图 -->
            <img class="coupon-gift" :src="couponForm.giftPic ? couponForm.giftPic : defaultImageSrc" alt="优惠券头图">
            <div class="coupon-list">
              <el-carousel :interval="5000" arrow="hover" height="280px">
                <el-carousel-item
                  v-for="(item, index) in formatCouponList"
                  :key="`couponItem${index}`">
                  <div class="coupon-item">
                    <ul>
                      <li
                        v-for="(elem, i) in item"
                        :key="`couponItem-li-${index}-${i}`"
                        :style="{'backgroundColor': (couponForm.backgroundColor ? couponForm.backgroundColor : '#fff')}"
                        @click="addColor(index, i, couponForm.backgroundClickColor, couponForm.titleClickColor, couponForm.descTxtClickColor)">
                        <img
                          class="coupon-cover"
                          :src="elem.coverPic ? elem.coverPic : defaultImageSrc"
                          :alt="elem.name">
                        <div class="coupon-cont">
                          <h6 :style="{'color': (couponForm.mainTxtColor ? couponForm.mainTxtColor : '#333')}">{{elem.title}}</h6>
                          <p :style="{'color': (couponForm.descTxtColor ? couponForm.descTxtColor : '#999')}">{{elem.desc}}</p>
                        </div>
                        <div class="coupon-use">
                          <div class="coupon-circle" :style="{'borderColor': (couponForm.descTxtColor ? couponForm.descTxtColor : '#ccc')}">
                            <div class="coupon-circle-inner" :style="{'borderColor': couponForm.mainTxtColor}">
                              <p :style="{'color': (couponForm.descTxtColor ? couponForm.descTxtColor : '#999')}">已抢50%</p>
                            </div>
                          </div>
                          <p :style="{'color': (couponForm.mainTxtColor ? couponForm.mainTxtColor : '#333')}">立即领取</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="coupon-desc" v-show="couponForm.declare">
              <p class="title" :style="{'color': theme.desc.mainColor}">领取说明</p>
              <p class="cont" :style="{'color': theme.desc.mainColor}">{{couponForm.declare}}</p>
            </div>
          </div>
        </div>
        <!-- 优惠券详情 -->
        <div class="template-preview template-hide" v-if="activeIndex >= 0" :style="{'marginTop': '40px'}">
          <div class="template_header">
            <div class="header_left">
              <img class="template_logo" :src="theme.desc.logo"/>
              <span class="nav_name" :style="{'color': theme.desc.mainColor}">详情</span>
            </div>
            <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          </div>
          <div class="template_coupon">
            <!-- 头图 -->
            <img
              class="coupon-detail-pic"
              :src="(couponForm.list[activeIndex].detailPic ? couponForm.list[activeIndex].detailPic : defaultImageSrc)"
              :alt="(couponForm.list[activeIndex].name ? couponForm.list[activeIndex].name : '优惠券详情图')">
          </div>
          <div class="coupon-detail-form">
            <h6 class="form-header">填写资料</h6>
            <input placeholder="公司名称" readonly/>
            <input placeholder="姓名" readonly/>
            <div class="demand-points">
              <label class="demand-title">需求点</label>
              <div class="points-list">
                <span
                  v-for="(item, index) in couponForm.list[activeIndex].demandPoints"
                  :key="'demandItem' + index"
                  :class="index == 0 ? 'checked' : ''"
                  :style="{'backgroundColor': (couponForm.backgroundColor ? couponForm.backgroundColor : '#555'), 'color': (couponForm.mainTxtColor ? couponForm.mainTxtColor : '#333')}"
                  >
                  {{item}}
                </span>
              </div>
            </div>
            <button class="submit-btn" :style="{'backgroundColor': (couponForm.backgroundColor ? couponForm.backgroundColor : '#fff'), 'color': (couponForm.mainTxtColor ? couponForm.mainTxtColor : '#333')}">提交</button>
            <p class="demand-txt">提交资料后24小时内，将会有专人与您联系</p>
          </div>
        </div>
        <!-- 重新编辑 -->
        <button-re-edit
          v-if="couponForm.isReEditStatus"
          name="优惠券"
          :index="index"
          @setSort="setModuleSort"
          @reEditModule="reEditModule"
          :sort="couponForm.sort"></button-re-edit>
      </div>
    </div>
  </div>
</template>
<script>

import Upload from '@/components/Upload/custom'
import ButtonReEdit from './ButtonReEdit'
import * as Conference from '@/api/conference'
import * as _array from 'lodash/array'

export default {
  name: 'TemplateCoupon',
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
      couponForm: this.data,
      loading: false,
      // 默认图片
      defaultImageSrc: 'https://dummyimage.com/1x1/000',
      // 查看哪个优惠券的详情
      activeIndex: 0
    }
  },
  computed: {
    formatCouponList () {
      let couponList = [ ...this.couponForm.list ]
      couponList.sort(this.compare)
      return _array.chunk(couponList, 3)
    }
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
    // 删除某个需求点
    handleClose (index, ele) {
      this.couponForm.list[index].demandPoints.splice(this.couponForm.list[index].demandPoints.indexOf(ele), 1);
    },
    // 显示添加需求点的input
    showInput (index) {
      this.couponForm.list[index].inputVisible = 1;
      /* this.$nextTick(_ => {
        this.$refs.saveTagInput[index].$refs.input.focus();
      }); */
    },
    // 确认添加新需求点
    handleInputConfirm (index) {
      let inputValue = this.couponForm.list[index].inputValue;
      if (this.couponForm.list[index].demandPoints.length > 9) {
        this.couponForm.list[index].inputVisible = 0;
        this.couponForm.list[index].inputValue = '';
        return this.$message.error('每个优惠券需求点最多添加9个！')
      }
      if (inputValue) {
        this.couponForm.list[index].demandPoints.push(inputValue);
      }
      this.couponForm.list[index].inputVisible = 0;
      this.couponForm.list[index].inputValue = '';
    },
    // 点击后的颜色变化
    addColor (index, i, backgroundClickColor, titleClickColor, descTxtClickColor) {
      console.log(arguments)
    },
    // 上传
    uploadSuccess (fileInfo, extra) {
      let fileUrl = fileInfo.file_url
      let {key, index} = extra
      if (extra.key === 'coverPic' || extra.key === 'detailPic') {
        this.couponForm.list[index][key] = fileUrl
      } else {
        this.couponForm[key] = fileUrl
      }
    },
    // 添加优惠券
    addCoupon () {
      let coupon = {
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
      // 获取list中最大的order值
      let sort = 0
      for (let item of this.couponForm.list) {
        let nowSrot = item.order
        if (sort < nowSrot) {
          sort = nowSrot
        }
      }
      coupon.order = Number(sort) + 1
      this.couponForm.list.push(coupon)
      if (this.couponForm.list.length === 1) {
        this.activeIndex = 0
      }
    },
    // 删除优惠券
    delCouponByIndex (index) {
      this.$message.success('优惠券删除成功！')
      this.activeIndex = this.couponForm.list.length - 2
      this.couponForm.list = this.couponForm.list.filter((item, i) => {
        return i != index
      })
    },
    // 删除优惠券
    delCouponItem (index) {
      this.$confirm('确认删除该优惠券吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 是否需要删除优惠券数据
        let {id} = this.couponForm.list[index]
        if (!id) {
          return this.delCouponByIndex(index)
        }
        Conference.deleteCoupon(id)
          .then(res => {
            if (res.code === 300000) {
              this.delCouponByIndex(index)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(this.errHandler)
      }).catch(() => {})
    },
    // 设置排序
    setModuleSort (val) {
      this.couponForm.sort = val
    },
    // 优惠券列表信息是否填写完整
    listDataIsLegal () {
      let flag = true
      let index = 0
      let fieldJson = {
        name: '请填写%c优惠券名称',
        coverPic: '请上传%c优惠券图片',
        num: '请填写%c优惠券数量',
        start_time: '请选择%c使用开始时间',
        end_time: '请选择%c使用结束时间',
        title: '请填写%c标题',
        desc: '请填写%c描述',
        detailPic: '请上传%c详情头图',
        demandPoints: '请添加%c需求点'
      }
      let errFieldName = ''
      for (let item of this.couponForm.list) {
        index++
        for (let key in item) {
          if (['inputValue', 'inputVisible', 'order'].indexOf(key) === -1) {
            errFieldName = fieldJson[key] || ''
            if (key == 'demandPoints') {
              if (item[key].length === 0) {
                flag = false
                break
              }
            } else if (!item[key]) {
              flag = false
              break
            }
          }
        }
        if (flag == false) {
          break
        }
      }
      if (this.couponForm.list.length === 0) {
        flag = false
      }
      return [flag, errFieldName.replace('%c', `优惠券${index}的`)]
    },
    // 优惠券排序
    couponListSortHandler () {
      this.couponForm.list.sort(this.compare)
    },
    // 重新编辑模块
    reEditModule () {
      this.couponForm.isReEditStatus = 0
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
      Conference.saveModule({ conference_id: this.id, name: this.name, detail: this.couponForm, moduleId: this.couponForm.id })
        .then(res => {
          if (res.code === 300000) {
            this.loading = false
            this.couponForm.id = res.data.id
            this.couponForm.isReEditStatus = 1
            // 为了同步优惠券的id
            this.couponForm.list = res.data.list
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
        this.$emit('delModuleItem', this.index, this.couponForm.id)
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
  .input-item {
    @extend %pr;
    margin-bottom: 20px;
    label {
      @extend %ib;
      padding-right: 12px;
      width: 84px;
      font-size: 14px;
      &:before {
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
  .time-item {
    display: flex;
  }
  .btn-box {
    margin-top: 30px;
  }
  .vt {
    vertical-align: top;
  }
  .guest-item {
    @extend %pr;
    margin: 10px 0;
    padding: 26px 20px 20px;
    border: 1px solid #ddd;
    .close-btn {
      @extend %pa, %ib, %cp;
      top: 8px;
      right: 10px;
      font-size: 20px;
      color: #666;
    }
  }
  .coupon-gift {
    width: 100%;
    height: doubleToPx(400px-80px);
  }
  .coupon-list {
    width: 100%;
  }
  .coupon-item {
    margin: 0 auto;
    @include base(doubleToPx(590px), doubleToPx(710px));
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: doubleToPx(20px);
      @include base(doubleToPx(590px), doubleToPx(150px), #fff);
    }
  }
  .coupon-cover {
    margin: 0 doubleToPx(20px);
    @include base(doubleToPx(100px), doubleToPx(100px));
  }
  .coupon-cont {
    width: doubleToPx(300px);
    border-right: 1px solid #ccc;
    h6 {
      margin-bottom: doubleToPx(8px);
      @include fontStyle(doubleToPx(30px), #333, 1);
      font-weight: 600;
    }
    p {
      @include fontStyle(doubleToPx(22px), #999, doubleToPx(30px));
    }
  }
  .coupon-use {
    @include base(doubleToPx(150px), doubleToPx(150px));
    p {
      @include fontStyle(doubleToPx(24px), #333, doubleToPx(30px), center);
    }
  }
  .coupon-circle {
    @extend %pr;
    margin: 6px auto 4px;
    @include base(doubleToPx(80px), doubleToPx(80px));
    border: 3px solid #ccc;
    border-radius: 50%;
  }
  .coupon-circle-inner {
    @extend %pa;
    top: -3px;
    left: -3px;
    @include base(doubleToPx(80px/2), doubleToPx(80px));
    border: 3px solid #f00;
    border-radius: 100% 0 0 100%/50%;
    border-right: none;
    p {
      margin-top: 6px;
      width: 40px;
      @include fontStyle(doubleToPx(20px), #999, doubleToPx(28px), center);
    }
  }
  .coupon-desc {
    margin: 14px auto 0;
    width: doubleToPx(550px);
    .title {
      margin-bottom: 6px;
      @include fontStyle(doubleToPx(24px), #fff, doubleToPx(34px), center);
    }
    .cont {
      @include fontStyle(doubleToPx(22px), #fff, doubleToPx(32px), center);
    }
  }
  .coupon-detail-pic {
    @include base(100%, doubleToPx(400px));
  }
  .coupon-detail-form {
    margin-top: doubleToPx(30px);
    padding: 0 doubleToPx(44px);
    .form-header {
      margin-bottom: 20px;
      @include fontStyle(doubleToPx(34px), #fff, doubleToPx(40px), center);
    }
    input {
      margin-bottom: 20px;
      width: doubleToPx(660px);
      background: transparent;
      @include fontStyle(doubleToPx(28px), #fff, doubleToPx(44px), left);
      border: 0;
      outline: 0;
      border-bottom: 1px solid #fff;
    }
  }
  .demand-points {
    display: flex;
    justify-content: space-between;
  }
  .demand-title {
    width: doubleToPx(160px);
    @include fontStyle(doubleToPx(28px), #fff, 1);
  }
  .points-list {
    width: doubleToPx(660px-160px);
    span {
      @extend %ib, .vt;
      margin-right: doubleToPx(30px);
      margin-bottom: doubleToPx(20px);
      padding: 0 10px;
      @include base(auto, doubleToPx(52px), #555);
      border-radius: doubleToPx(52px);
      @include fontStyle(doubleToPx(24px), #fff, doubleToPx(52px), center);
      &.checked {
        background: #fff;
        color: #000;
      }
    }
  }
  .submit-btn {
    margin: doubleToPx(20px) auto 0;
    @include base(doubleToPx(660px), doubleToPx(100px), #fff);
    @include fontStyle(doubleToPx(32px), #000, doubleToPx(100px), center);
    border-radius: doubleToPx(12px);
    font-weight: 600;
    letter-spacing: 4px;
    text-indent: 4px;
    @extend %cp;
    border: 0;
    outline: 0;
  }
  .demand-txt {
    margin-top: doubleToPx(20px);
    @include fontStyle(doubleToPx(22px), #fff, 1);
  }
  .index-inner /deep/ .el-form-item__error {
    right: -100px;
  }
  .tags-box {
    @extend %ib, .vt;
    width: 350px;
  }
  .template_coupon {
    margin-top: 15px;
  }
</style>
