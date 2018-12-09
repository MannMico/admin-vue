<template>
  <div class="add-quote-wrap">
      <h3 style="margin-left: 20px;">基本信息</h3>
      <el-card class="box-card" style="padding-top: 14px;">
        <el-form :inline="true" :model="params" class="demo-form-inline" size="small" v-if="params">
          <el-form-item label="客户网站登录账号:">
            <!-- <el-input v-model="params.account" style="width:100px"></el-input> -->
          <el-autocomplete
            style="width:220px"
            v-model="params.user.phone"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
          </el-form-item>
          <el-form-item label="公司名称:">
            <el-input v-model="params.company_name" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="所在地区:">
            <!-- <el-input v-model="params.location" style="width:200px"></el-input> -->
            <el-cascader
              :options="addressOptions"
              :props="propsOptions"
              @change="changeCity"
              v-model="params.selectedAddress"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="联系人:">
            <el-input v-model="params.contact_name" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式:">
            <el-input v-model="params.contact_phone" placeholder="报价单将发送至该手机号" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱:">
            <el-input v-model="params.contact_email" placeholder="报价单将发送至该邮箱" style="width:220px"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="project-module" v-for="(item, index) in project" :key="index">
        <div class="title project-title">项目{{index + 1}}</div>
        <el-card class="box-card">
          <el-form :inline="true" :model="item.params" class="demo-form-inline" size="small">
            <el-form-item label="项目名称:">
              <el-input v-model="item.params.projectName" style="width:220px"></el-input>
            </el-form-item>
            <el-form-item label="项目类型:">
              <el-select v-model="item.params.productType" style="width:220px">
                <el-option label="好产品打造" value="1"></el-option>
                <el-option label="文创产品" value="2"></el-option>
                <el-option label="其他" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称:">
              <el-input v-model="item.params.productName" style="width:220px"></el-input>
            </el-form-item>
            <el-form-item label="客户需求书:">
              <!-- <el-button type="primary" @click="upload">上传</el-button> -->
              <!-- <span v-if="item.params.file != ''">{{item.params.file.split('/').pop()}}</span> -->
              <upload
                    :upfileSize='3072'
                    :upLimit="10"
                    :upfileType="'file'"
                    @urlCB="(val, params, i) => uploadSuccessReally(val, params, index)"
                    :textTypeBtn="true"
                    :isCover="true"></upload>
            </el-form-item>
            <el-form-item label="购买服务:">
              <el-button type="primary" @click="addService(index)" size="mini">添加服务</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="multipleTable"
            border
            class="main-quota-table"
            tooltip-effect="dark"
            style="width: 100%"
            :data="item.tableData"
            :span-method="objectSpanMethod"
            @selection-change="(val, i) => handleSelectionChange(val, index)">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="classify"
              label="分类"
              width="120">
            </el-table-column>
            <el-table-column
              width="90"
              label="服务spu">
              <template slot-scope="scope">
                <div style="text-align: center">{{scope.row.service}}</div>
              </template>
            </el-table-column>
            <el-table-column
              width="90"
              label="属性">
              <template slot-scope="scope">
                <div style="text-align: center">{{scope.row.attr}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column
              width="110"
              label="服务价格(元)">
              <template slot-scope="scope">
                <div style="text-align: center">{{scope.row.is_standard_price === 1 ? (scope.row.singlePrice ? scope.row.singlePrice : scope.row.price) : '非标准价'}}</div>
              </template>
            </el-table-column> -->
            <el-table-column
              width="140"
              label="订单价格(元)">
              <template slot-scope="scope">
                <div class='asda'> </div>
                <el-input v-if="scope.row.is_standard_price !== 1" v-model="scope.row.setPrice" placeholder="请输入服务价格" size="mini" :disabled="scope.row.is_standard_price == 1 ? true : false" @blur="blurInputToGetDiscount(index)"></el-input>
                <el-input v-if='scope.row.is_standard_price === 1 && scope.row.singlePrice' v-model="scope.row.singlePrice" placeholder="请输入服务价格" size="mini" :disabled="scope.row.is_standard_price == 1 ? true : false" @blur="blurInputToGetDiscount(index)"></el-input>
                <el-input v-if='scope.row.is_standard_price === 1 && !scope.row.singlePrice' v-model="scope.row.price" placeholder="请输入服务价格" size="mini" :disabled="scope.row.is_standard_price == 1 ? true : false" @blur="blurInputToGetDiscount(index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="70"
              label="数量">
              <template slot-scope="scope">
                <!-- <el-input-number v-model="scope.row.sum" @change="handleChange" :min="1" size="mini"></el-input-number> -->
                <el-input v-model="scope.row.sum" size="mini" @blur="blurInputToGetDiscount(index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              width="110"
              prop="address"
              label="订单合计(元)">
              <template slot-scope="scope">
                <p style="text-align: center">{{scope.row.setPrice == '' ? parseInt(scope.row.price) * scope.row.sum : scope.row.setPrice * scope.row.sum}}</p>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="参与服务">
              <template slot-scope="scope">
                <div v-for="(server, index) in scope.row.data.service_participants" :key="index" class="attendService">
                  <el-checkbox v-model="server.partChecked" :disabled="server.is_required == 1 ? true : false">{{server.attendant_type.name}}</el-checkbox>
                  <el-input v-model="server.people_num" :disabled="server.is_modifiable == 1 ? false : true" style="width:50px;" size="mini"></el-input>
                  <div class="text">个</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="260"
              label="服务细目">
              <template slot-scope="scope">
                <div v-for="(server, index) in scope.row.data.service_details" :key="index" class="serviceDetail cell-item" :style="{'height' : server.outputs.length <= 1 ? '70px' : server.outputs.length * 70 + 'px'}">
                  <el-checkbox v-model="server.detailChecked" :disabled="server.is_required == 1 ? true : false">
                      <span style="white-space: pre-wrap;" v-if="server.id != ''">{{server.name}}</span>
                      <el-input v-if="server.id == ''" v-model="server.name" style="width:50px;" size="mini"></el-input>
                  </el-checkbox>
                </div>
                <div @click="doShowSwitch(scope, index)" class="show-switch"><i :class="arrowStyle"></i></div>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="周期(日)">
              <template slot-scope="scope">
                <div v-for="(server, index) in scope.row.data.service_details" :key="index" class="cycle cell-item" :style="{'height' : server.outputs.length <= 1 ? '70px' : server.outputs.length * 70 + 'px'}">
                  <el-input v-model="server.period" style="width:50px;" :disabled="server.is_period_modifiable == 1 ? false : true" size="mini"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="产出物" width="260">
              <template slot-scope="scope">
                <div v-for="(server, index) in scope.row.data.service_details" :key="index" :style="{'height' : server.outputs.length <= 1 ? '70px' : server.outputs.length * 70 + 'px'}" class="serviceDetail outputs-cell-item">
                  <div v-for="(item, index) in server.outputs" :key="index" class="outputs-cell-item">
                    <el-checkbox v-model="item.outChecked" :disabled="item.is_required == 1 ? true : false">
                      <span style="white-space: pre-wrap;" v-if="item.id != ''">{{item.name}}</span>
                      <el-input v-if="item.id == ''" v-model="item.name" style="width:50px;" size="mini"></el-input>
                    </el-checkbox>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="70"
              label="数量">
              <template slot-scope="scope">
                <div v-for="(server, index) in scope.row.data.service_details" :key="index" :style="{'height' : server.outputs.length <= 1 ? '70px' : server.outputs.length * 70 + 'px'}" class="serviceDetail num-cell-item">
                  <div v-for="(item, index) in server.outputs" :key="index" class="num-cell-item">
                    <!-- <el-input-number v-model="item.num" @change="handleChange" :disabled="item.is_num_modifiable == 1 ? false : true" :min="1" size="mini"></el-input-number> -->
                    <!-- <el-input-number v-model="item.num" @change="handleChange" :disabled="item.is_num_modifiable == 1 ? false : true" :min="1" size="mini"></el-input-number> -->
                    <el-input v-model="item.num" size="mini" :disabled="item.is_num_modifiable == 1 ? false : true"></el-input>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="operate">
                <span @click="rowMove(index, scope, 0, 'tableData')">↑</span>
                <span @click="rowMove(index, scope, 1, 'tableData')">↓</span>
                <span @click="delectRow(index, scope, 'tableData')">删除</span>
                <span @click="addDeatil(index, scope, 'tableData')">增加细目</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="new-tab-footer">
            <el-button type="primary" size="mini" @click="delectRows(index)">删除</el-button>
            <span class="ml10">移动至项目</span>
            <el-select class="ml10" v-model="item.moveProject" @focus="clearSelect(index, 0)" @change="(val, i, type) => moveProjectTo(val, index, 0)" placeholder="请选择" size="mini" style="width:100px;">
              <el-option
                v-for="item in projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="ml10">复制至项目</span>
            <el-select class="ml10" v-model="item.copyProject" @focus="clearSelect(index, 1)" @change="(val, i, type) => moveProjectTo(val, index, 1)" placeholder="请选择" size="mini" style="width:100px;">
              <el-option
                v-for="item in projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="rightText" v-if="item.tableData.length > 0 && item.totalDiscount">
              合计： 服务数量<span>&nbsp;{{item.totalDiscount.service_num}}&nbsp;</span>个，
              订单合计<span>&nbsp;{{item.totalDiscount.project_amount}}&nbsp;</span>元
              优惠合计<span>&nbsp;{{item.totalDiscount.discount_price}}&nbsp;</span>元。
               <!-- 合计： 服务数量<span>&nbsp;{{item.totalSum}}&nbsp;</span>个，
              订单合计<span>&nbsp;{{item.totalPrice}}&nbsp;</span>元 -->
              <!-- 优惠合计<span>&nbsp;{{item.totalPlus}}&nbsp;</span>元。 -->
            </div>
          </div>
          <!-- <div style="margin: 20px 0;font-weight: bold;font-size: 18px;">参与人员</div>
          <el-table
            :data="item.attendTable"
            border
            style="width: 30%">
            <el-table-column
              prop="serviceName"
              label="*服务人">
            </el-table-column>
            <el-table-column
              label="*人数">
              <template slot-scope="scope">
                <el-input v-model="scope.row.total" style="width:50px;" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="operate">
                  <span @click="rowMove(index, scope, 0, 'attendTable')">↑</span>
                  <span @click="rowMove(index, scope, 1, 'attendTable')">↓</span>
                  <span @click="delectRow(index, scope, 'attendTable')">删除</span>
                </div>
              </template>
            </el-table-column>
            <div slot="append" class="appendRow">
              <div class="column">
                  <el-autocomplete
                    size="mini"
                    style="width:100px;"
                    v-model="attendService"
                    :fetch-suggestions="querySearchService"
                    placeholder="请输入内容"
                  ></el-autocomplete>
              </div>
              <div class="column">
                <el-input v-model="attendSet" style="width:50px;" size="mini"></el-input>
              </div>
              <div class="column" @click="addRow(index, 'attendTable')">添加</div>
            </div>
          </el-table> -->
        </el-card>
        <br>
      </div>
      <el-card>
        <div>
          <el-button type="primary" size="mini" @click="addmodule">添加项目</el-button>
          <span class="ml10">提示：一个报价单可同时存在多个项目，客户需要打造多个产品时，务必创建为多个项目！</span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="remark-wrap">
          <span class="remark-text">备注</span>
          <el-input class="remark-input" type="textarea" v-model="remarkModel"></el-input>
        </div>
      </el-card>
      <div class="footer-botton">
        <div class="tips" v-if="currentTime">{{currentTime}} 已自动为您存至草稿箱</div>
        <div class="btn">
          <el-button type="primary" size="small" @click="openViewQuote">预览</el-button>
          <el-button type="primary" size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="storeDraft">保存至草稿箱</el-button>
          <el-button type="primary" size="small" @click="enterCustom" :loading="!creatLock">确定，并发送至客户</el-button>
        </div>
      </div>
      <!-- 选择sku弹窗 -->
      <el-dialog title="请选择服务" :visible.sync="dialogFormVisible" width="960px">
        <div v-loading="seviceloading">
          <ul class="skuNav">
            <li v-for="(list, index) in skuData" :key="index" :class="{current: index === skuIndex}" @click="selectSku(index)">{{list.name}}</li>
          </ul>
          <el-collapse accordion v-if="skuData.length > 0">
            <el-collapse-item v-for="(item, firstIndex) in skuData[skuIndex].children" :key="firstIndex">
              <template slot="title">
                <div class="nav-header">
                  <span>{{item.name}}</span>
                  <span>(已选择:{{item.selectTotal}}/{{totalCheck(item)}})</span>
                </div>
              </template>
              <div class="nav-model" :class="{'singleCheck': model.skus.length == 0 ? true : false}" v-for="(model, secondIndex) in item.second_category_spus" :key="secondIndex">
                <template v-if="model.skus.length > 0">
                  <span class="model-name">{{model.name}}:</span>
                  <div class="model-box">
                    <el-checkbox :label="getSkuValue(skusValue.attribute_values, skusValue.price)"
                                  :key="thirdIndex"
                                  :data-id="skusValue.uuid"
                                  v-model="skusValue.checkStatus"
                                  v-for="(skusValue, thirdIndex) in model.skus"
                                  @change="(val, $event, i, j, q, obj) => checkboxChange(val, $event, firstIndex, secondIndex, thirdIndex, skusValue)"
                    ></el-checkbox>
                  </div>
                </template>
                <div class="model-box" v-if="model.skus.length == 0">
                   <el-checkbox v-if="model.skus.length == 0"
                            :data-id="model.uuid"
                            v-model="model.checkStatus"
                            @change="(val, $event, i, j, q, obj) => checkboxChange(val, $event, firstIndex, secondIndex, model)"
                            >
                            {{model.name}} {{model.price}} 元
                            </el-checkbox>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="skuTable-box">
            <div class="title">已选服务</div>
            <el-table :data="skuTable" border>
              <el-table-column property="classify" label="分类"></el-table-column>
              <el-table-column property="service" label="服务" width="130"></el-table-column>
              <el-table-column property="attr" label="属性" width="120"></el-table-column>
              <el-table-column property="price" label="服务价格（元）" width="130"></el-table-column>
              <el-table-column label="数量" width="200">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.sum" :min="1" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="footer" class="footer-botton">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="selectSkuSuccess">确 定</el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="viewQuoteDialog" width="1200px">
        <div v-loading="viewQuoteLoading">
          <div>
            <div id="view-quote-wrap">

            </div>
          </div>
          <div slot="footer" class="footer-botton">
            <el-button @click="viewQuoteDialog = false">取 消</el-button>
            <el-button type="primary" @click="viewQuoteDialog = false">确 定</el-button>
          </div>
        </div>
      </el-dialog>
  </div>
</template>
<script>

import * as api from '@/api/quote/quote'
import uuid from '@/utils/uuid.js'
import address from '@/utils/address.js'
import upload from '@/components/Upload/upload.vue'

export default {
  name: 'add-quote',
  data () {
    return {
      params: {
        user: {},
        selectedAddress: []
      },
      projectOptions: [
        {
          value: '0',
          label: '项目1'
        }
      ],
      operateTableIndex: '',
      project: [
        {
          params: {
            projectName: '',
            productName: '',
            productType: '',
            file: ''
          },
          moveProject: '',
          copyProject: '',
          multipleSelection: [],
          tableData: [],
          attendTable: [],
          totalDiscount: null
        }
      ],
      skuTable: [],
      // sku服务列表数据
      skuData: [],
      skuIndex: 0,
      dialogFormVisible: false,
      viewQuoteDialog: false,
      routeParams: {},
      totalTime: 300,
      //  配置参与人员添加数据
      attendService: '',
      attendSet: '',
      currentTime: '',
      seviceloading: false,
      remarkModel: '',
      // isShowArr: [],
      allShowModel: [],
      arrowStyle: 'el-icon-arrow-up',
      crsfToken: '',
      creatLock: true,
      discountPriceParams: null,
      viewQuoteLoading: true
    }
  },
  computed: {
    addressOptions () {
      let citys = address
      citys.forEach(v => {
        v.children.forEach(v1 => {
          if (v1.children) {
            v1.children.forEach((v2, i) => {
              if (typeof v2 === 'string') {
                v1.children.splice(i, 1, {
                  name: v2
                })
              } else {
                v1.children.splice(i, 1, {
                  name: v2.name
                })
              }
            })
          }
        })
      })
      return citys
    },
    propsOptions () {
      return {
        value: 'name',
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.autoStore()
    // this.createQuote()
    // this.initService()
    this.routeParams = this.$route.params
    if (this.routeParams.id != -1) {
      this.getQuoteInfo()
    }
    this.getCsrfToken()
  },
  methods: {
    getCsrfToken () {
      api.getCsrfToken().then(res => {
        if (res.code === 300000) {
          this.crsfToken = res.data.token
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    doShowSwitch (scope, tableIndex) {
      let isShowArr = this.allShowModel[tableIndex].itemArr
      // let table = document.getElementsByClassName('main-quota-table')[tableIndex]
      let targetIcon = document.getElementsByClassName('main-quota-table')[tableIndex].getElementsByClassName('show-switch')[scope.$index].getElementsByTagName('i')
      isShowArr[scope.$index] = !isShowArr[scope.$index] // 点击收起展开时切换状态
      let cell = document.getElementsByClassName('main-quota-table')[tableIndex].getElementsByClassName('el-table__row')[scope.$index].getElementsByClassName('cell') // 获取当前行每个td下的cell元素
      if (!isShowArr[scope.$index]) { // 如果isShowArr下的对应元素是true就给当前行的所有cell的高度变成50px；否则变成auto
        for (let i = 0; i < cell.length; i++) {
          cell[i].style.height = `45px`
        }
        targetIcon[0].classList.remove('el-icon-arrow-up')
        targetIcon[0].classList.add('el-icon-arrow-down')
      } else {
        for (let i = 0; i < cell.length; i++) {
          cell[i].style.height = `auto`
        }
        targetIcon[0].classList.remove('el-icon-arrow-down')
        targetIcon[0].classList.add('el-icon-arrow-up')
      }
    },
    initShowSwitch (arr) {
      let allShowSwitchLen = document.getElementsByClassName('show-switch').length // 获取所有的show-switch的数量 全部置为false
      for (let index = 0; index < allShowSwitchLen; index++) {
        let targetIcon = document.getElementsByClassName('show-switch')[index].getElementsByTagName('i')
        let cell = document.getElementsByClassName('el-table__row')[index].getElementsByClassName('cell') // 获取当前行每个td下的cell元素
        if (!arr[index]) { // 如果isShowArr下的对应元素是true就给当前行的所有cell的高度变成50px；否则变成auto
          for (let i = 0; i < cell.length; i++) {
            cell[i].style.height = `45px`
          }
          targetIcon[0].classList.remove('el-icon-arrow-up')
          targetIcon[0].classList.add('el-icon-arrow-down')
        } else {
          for (let i = 0; i < cell.length; i++) {
            cell[i].style.height = `auto`
          }
          targetIcon[0].classList.remove('el-icon-arrow-down')
          targetIcon[0].classList.add('el-icon-arrow-up')
        }
      }
    },
    getQuoteInfo () {
      api.getQuoteInfo(this.routeParams.id).then(res => {
        if (res.code === 300000) {
          //  获取详情数据
          let data = res.data
          let projects = data.projects
          this.params = {
            company_district: data.company_district,
            company_name: data.company_name,
            company_province: data.company_province,
            contact_name: data.contact_name,
            contact_phone: data.contact_phone,
            contact_email: data.contact_email,
            created_at: data.created_at,
            id: data.company_id,
            selectedAddress: [data.company_province, data.company_city, data.company_district],
            // location: `${data.company_province}/${data.company_city}/${data.company_district}`,
            updated_at: data.updated_at,
            user: {
              id: data.company_id,
              name: '',
              phone: data.company_phone
            },
            value: data.company_phone
          }
          if (this.routeParams.type !== 'creat') {
            //  创建报价的时候不需要渲染列表
            projects.forEach((v, i) => {
              let obj = this.deepClone(this.project[0])
              obj.params = {
                file: v.demand_book,
                productName: v.product_name,
                productType: v.type == 0 ? '好产品打造' : v.type == 1 ? '文创产品' : '其他',
                projectName: v.name
              }
              v.services.forEach((o, p) => {
                let attr = ''
                let classify = ''
                if (Array.isArray(o.categories)) {
                  o.categories.forEach(v1 => {
                    classify += `${v1.name}`
                  })
                }
                if (o.object_type == 2) {
                  if (Array.isArray(o.attributes)) {
                    o.attributes.forEach(v2 => {
                      attr += `${v2.value}`
                    })
                  }
                } else {
                  attr = ''
                }
                let table = {
                  attr: attr,
                  classify: classify,
                  data: {
                    service_details: [],
                    service_participants: [],
                    checkStatus: true,
                    id: o.object_id,
                    is_standard: o.is_standard_price
                  },
                  price: Number(o.is_standard_price) === 0 ? '非标准价' : o.price,
                  service: o.name,
                  setPrice: o.customize_price,
                  sum: o.num,
                  type: o.object_type
                }
                if (o.object_type == 1) {
                  table.data.skus = []
                }
                o.service_participants.forEach(v3 => {
                  let part = {
                    id: v3.service_id,
                    people_num: v3.num,
                    created_at: v3.created_at,
                    updated_at: v3.updated_at,
                    partChecked: v3.is_selected == 1,
                    attendant_type: {
                      name: v3.name
                    }
                  }
                  table.data.service_participants.push(part)
                })
                o.details.forEach(v4 => {
                  let server = {
                    detailChecked: v4.is_selected == 1,
                    id: v4.service_id,
                    name: v4.name,
                    period: v4.period,
                    is_period_modifiable: v4.is_period_modifiable,
                    outputs: []
                  }
                  v4.outputs.forEach(v5 => {
                    let output = {
                      created_at: v5.created_at,
                      detail_id: v5.detail_id,
                      id: v5.id,
                      is_num_modifiable: v5.is_num_modifiable,
                      is_required: v5.is_required,
                      name: v5.name,
                      num: v5.num,
                      outChecked: v5.is_selected == 1,
                      updated_at: v5.updated_at
                    }
                    server.outputs.push(output)
                  })
                  table.data.service_details.push(server)
                })
                obj.tableData.push(table)
              })
              v.participants.forEach((c, j) => {
                let attendTable = {
                  serviceName: c.name,
                  total: c.num
                }
                obj.attendTable.push(attendTable)
              })
              this.project.push(obj)
            })
            this.project.shift()
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    querySearchAsync (queryString, cb) {
      //  远程搜索
      if (queryString != '' && queryString != undefined) {
        api.getCustomer({phone: queryString}).then(res => {
          if (res.code === 300000) {
            let data = res.data.data
            data.forEach((v, i) => {
              v.value = v.user.phone
            })
            cb(data)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        let data = []
        cb(data)
      }
    },
    querySearchService (queryString, cb) {
      api.getAttendants().then(res => {
        if (res.code === 300000) {
          res.data.forEach((v) => {
            v.value = v.name
          })
          cb(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSelect (item) {
      this.params = item
      // this.params.location = `${item.company_province}/${item.company_district}`
      this.params.selectedAddress = [item.company_province, item.company_city, item.company_district]
    },
    changeCity (val) {
      this.params.company_province = val[0]
      this.params.company_city = val[1]
      this.params.company_district = val[2]
    },
    createQuote () {
      //  创建报价页
      let data = {}
      api.createQuote(data).then(res => {
        if (res.code === 300000) {
          // .....
        }
      })
    },
    initService () {
      api.getServiceList().then(res => {
        if (res.code === 300000) {
          this.seviceloading = false
          this.skuData = res.data
          // 添加已选择数量字段
          this.skuData.forEach(v => {
            v.children.forEach(o => {
              o.selectTotal = 0
              o.second_category_spus.forEach((z) => {
                if (z.skus.length > 0) {
                  z.skus.forEach((p) => {
                    p.uuid = uuid()
                    p.checkStatus = false
                  })
                } else {
                  z.uuid = uuid()
                  z.checkStatus = false
                }
              })
            })
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getSkuValue (arr, price) {
      let str = ''
      arr.forEach((v) => {
        str += `${v.value} `
      })
      return `${str}${price}元`
    },
    selectSku (index) {
      this.skuIndex = index
    },
    totalCheck (obj) {
      let total = 0;
      if (obj.second_category_spus) {
        obj.second_category_spus.forEach((v, i) => {
          if (v.skus.length == 0) {
            total += 1
          } else {
            total += v.skus.length
          }
        })
      }
      return total
    },
    checkboxChange (val, ev, firstIndex, secondIndex, thirdIndex, object) {
      let data = this.skuData
      let index = this.skuIndex
      let firstName = data[index].name
      let secondName = data[index].children[firstIndex].name
      let thirdName = data[index].children[firstIndex].second_category_spus[secondIndex].name
      let skuLen = data[index].children[firstIndex].second_category_spus[secondIndex].skus.length
      let price = skuLen == 0 ? data[index].children[firstIndex].second_category_spus[secondIndex].price : data[index].children[firstIndex].second_category_spus[secondIndex].skus[thirdIndex].price
      let attr = ''
      let labelNode = ev.target.parentNode.parentNode
      let type = 0 // 0 check在spus里  1在sku里
      let uuid = labelNode.getAttribute('data-id')
      let otherData = arguments[arguments.length - 1]
      if (arguments.length == 6) {
        let checkObj = data[index].children[firstIndex].second_category_spus[secondIndex].skus[thirdIndex].attribute_values
        checkObj.forEach((v) => {
          attr += `${v.value} `
        })
        type = 1
      }
      let obj = {
        classify: `${firstName}/${secondName}/${thirdName}`,
        service: `${thirdName}`,
        attr: attr,
        price: price,
        sum: 1,
        uuid: uuid,
        type: type,
        data: otherData
      }
      if (val) {
        this.skuTable.push(obj)
        data[index].children[firstIndex].selectTotal++
      } else {
        // 先到表格查找当前点击的rows
        let findIndex = this.skuTable.findIndex((item) => {
          return item.uuid == uuid
        })
        this.skuTable.splice(findIndex, 1)
        data[index].children[firstIndex].selectTotal--
      }
    },
    selectSkuSuccess () {
      if (this.allShowModel && this.allShowModel.length === 0) {
        let itemObj = {
          itemArr: []
        }
        this.allShowModel.push(itemObj)
      }
      // this.isShowArr = []
      let data = this.project[this.operateTableIndex]
      //  手动添加部分初始值及状态属性
      let totalSum = 0
      let totalPrice = 0
      let totalPlus = 0
      let attendTable = []
      let flag = true
      //  生成项目表
      this.skuTable.forEach((v, i) => {
        v.setPrice = ''
        v.data.service_details.forEach((v2) => {
          // if (v2.is_required == 1) {
          //   v2.detailChecked = true
          // } else {
          //   v2.detailChecked = false
          // }
          v2.detailChecked = true
          v2.outputs.forEach((v4) => {
            // if (v4.is_required == 1) {
            //   v4.outChecked = true
            // } else {
            //   v4.outChecked = false
            // }
            v4.outChecked = true
          })
        })
        v.data.service_participants.forEach((v3) => {
          if (v3.is_required == 1) {
            v3.partChecked = true
          } else {
            v3.partChecked = false
          }
          v3.partChecked = true
        })
        this.allShowModel[this.operateTableIndex].itemArr.push(false)
        // this.isShowArr.push(false)
      })
      this.$nextTick(() => {
        this.getDiscountPrice(this.getDiscountPriceParams(this.operateTableIndex))
      })
      setTimeout(() => { // 所有的下拉状态为收起状态
        this.initShowSwitch(this.allShowModel[this.operateTableIndex].itemArr)
      }, 200)
      //  处理表格重复元素
      var tempArr = this.deepClone(this.skuTable)
      // data.tableData = this.deepClone(this.skuTable)
      tempArr.forEach(o => {
        if (data.tableData.length > 0) {
          data.tableData.forEach(c => {
            if (o.classify == c.classify) {
              flag = false
              this.creatLock = true
              this.$message.error(`当前分类：${o.classify}已存在`)
            }
          })
        }
      })
      if (flag) {
        tempArr.forEach((o, j) => {
          data.tableData.push(o)
          totalSum += parseInt(o.sum)
          totalPrice += parseInt(o.sum) * parseInt(o.price)
        })
      }
      data.tableData.forEach(v => {
        v.data.service_participants.forEach((v3) => {
          // 生成 参与人员表
          let attend = {
            serviceName: v3.attendant_type.name,
            total: v3.people_num
          }
          attendTable.push(attend)
        })
      })
      //  处理表格重复元素 重复key的 total相加
      let newAttend = []
      let el = {}
      attendTable.forEach((o, j) => {
        if (!el[o.serviceName]) {
          el[o.serviceName] = true
          newAttend.push(o)
        } else {
          newAttend.forEach((z, p) => {
            if (z.serviceName == o.serviceName) {
              z.total += o.total
            }
          })
        }
      })
      data.attendTable = newAttend
      data.totalSum = totalSum
      data.totalPrice = totalPrice
      data.totalPlus = totalPlus
      //  生成项目表

      //  attendTable 参与人员表
      this.dialogFormVisible = false
    },
    rowMove (index, scope, type, table) {
      // 项目内容移动 type 0 上移 1下移
      let rowIndex = scope.$index
      let currentRow = scope.row
      let targetIndex
      let targetObject
      let project = this.project
      let len = project[index][table].length
      if (type == 0) {
        if (rowIndex === 0) {
          this.$message.error('当前行无法上移')
          return
        } else {
          targetIndex = rowIndex - 1
        }
      } else {
        if (rowIndex === len - 1) {
          this.$message.error('当前行无法下移')
          return
        } else {
          targetIndex = rowIndex + 1
        }
      }
      targetObject = project[index][table][targetIndex]
      project[index][table].splice(rowIndex, 1, targetObject)
      project[index][table].splice(targetIndex, 1, currentRow)
    },
    delectRow (index, scope, table) {
      // ----删除当前行
      let rowIndex = scope.$index
      let project = this.project
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        project[index][table].splice(rowIndex, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete (index) {
      //  sku表删除行
      let row = this.skuTable[index]
      let type = row.type
      let uuid = row.uuid
      //  删除表格内容，同步取消check勾选
      this.skuData.forEach(v => {
        v.children.forEach(o => {
          o.second_category_spus.forEach((z) => {
            if (type == 1) {
              z.skus.forEach((p) => {
                if (p.uuid == uuid) {
                  p.checkStatus = false
                }
              })
            } else {
              if (z.uuid == uuid) {
                z.checkStatus = false
              }
            }
          })
        })
      })
      this.skuTable.splice(index, 1)
    },
    delectRows (index) {
      // ----删除多选行
      let project = this.project
      let selected = project[index].multipleSelection
      let indexArr = []
      let table = this.project[index].tableData
      selected.forEach((v, i) => {
        indexArr.push(v.rowIndex)
      })
      if (indexArr.length == 0) {
        this.$message.error('当前暂未选择任何行数据')
        return
      }
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        indexArr.forEach((o, j) => {
          table.splice(o, 1, null)
        })
        this.project[index].tableData = table.filter(item => {
          return item != null
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addDeatil (index, scope, table) {
      let rowIndex = scope.$index
      let project = this.project
      let row = project[index][table][rowIndex]
      let addRow
      // 对addRow的数据手动重置
      addRow = {
        created_at: new Date(),
        detailChecked: false,
        id: '',
        is_period_modifiable: 1,
        is_required: 0,
        name: '',
        object_id: '',
        object_type: '',
        period: '',
        updated_at: new Date(),
        outputs: [{
          created_at: new Date(),
          detail_id: '',
          id: '',
          is_num_modifiable: 1,
          is_required: 0,
          name: '',
          num: '',
          outChecked: false,
          updated_at: new Date()
        }]
      }
      row.data.service_details.push(addRow)
    },
    addRow (index, table) {
      // ----
      let project = this.project[index]
      let flag = true
      let dex
      if (this.attendService == '' || this.attendSet == '') {
        this.$message.error('服务人或人数不能为空！')
        return
      }
      if (isNaN(this.attendSet)) {
        this.$message.error('参与人数必须是数字')
        return
      }
      project[table].forEach((v, i) => {
        if (v.serviceName == this.attendService) {
          this.attendSet = parseInt(this.attendSet) + parseInt(v.total)
          flag = false
          this.creatLock = true
          dex = i
        }
      })
      if (flag) {
        project[table].push({
          serviceName: this.attendService,
          total: this.attendSet
        })
      } else {
        project[table][dex].total = this.attendSet
      }
      this.attendService = ''
      this.attendSet = ''
    },
    moveProjectTo (val, index, type) {
      // type 0 移动 1复制 val 选项框的值 index当前操作表索引
      let selected = this.project[index].multipleSelection
      let indexArr = []
      let operateArr = []
      let table = this.project[index].tableData
      // 获取到选中行的索引
      selected.forEach((v, i) => {
        indexArr.push(v.rowIndex)
      })
      if (selected.length == 0) {
        this.$message.error('当前暂未选择行')
        return false
      } else if (val == index) {
        this.$message.error('不能复制/移动到当前表')
        return false
      } else {
        //  ---
        if (type === 0) {
          // 移动
          indexArr.forEach((o, j) => {
            var el = table.splice(o, 1, null)[0]
            operateArr.push(el)
          })
          this.$nextTick(() => {
            this.getDiscountPrice(this.getDiscountPriceParams(index, val))
          })
        } else if (type === 1) {
          // 复制
          indexArr.forEach((o, j) => {
            var el = this.deepClone(table[o])
            operateArr.push(el)
          })
          this.$nextTick(() => {
            this.getDiscountPrice(this.getDiscountPriceParams(index, val))
          })
        }
        setTimeout(() => { // 所有的下拉状态为收起状态
          this.initShowSwitch(this.allShowModel[this.operateTableIndex].itemArr)
        }, 200)
      }
      this.$refs.multipleTable[index].clearSelection()
      this.project[index].multipleSelection.length = 0;
      // 处理 原来的数组
      this.project[index].tableData = table.filter(item => {
        return item != null
      })
      // 将操作的数据 插入目标对象中
      operateArr.forEach((el, index) => {
        this.project[val].tableData.push(el)
      })
    },
    getDiscountPriceParams (index, val) { // val 选项框的值 index当前操作表索引
      let discountParams = []
      let operateToParams = []
      let data = null
      let currentOperateArr = this.project[index].tableData
      currentOperateArr.forEach((v, i) => {
        var discountParamsItem = {
          object_type: v.data.service_details[0].object_type,
          object_id: v.data.service_details[0].object_id,
          num: v.sum,
          customize_price: v.setPrice
        }
        discountParams.push(discountParamsItem)
      });
      if (val || val === 0) { // 复制或者移动
        let operateTo = this.project[val].tableData
        operateTo.forEach((v, i) => {
          let operateToParamsItem = {
            object_type: v.data.service_details[0].object_type,
            object_id: v.data.service_details[0].object_id,
            num: v.sum,
            customize_price: v.setPrice
          }
          operateToParams.push(operateToParamsItem)
        });
        data = {
          projects: [
            {
              index: `${index}%`, // 返回的数据是对象套对象的形式 如果返回数据的key为0，1时 得到的res.data被强转成了数组
              services: discountParams
            },
            {
              index: `${val}%`,
              services: operateToParams
            }
          ]
        }
      } else { // 输入框blur后
        data = {
          projects: [
            {
              index: `${index}%`,
              services: discountParams
            }
          ]
        }
      }
      return data
    },
    getDiscountPrice (data) {
      api.getDiscountPrice(data).then(res => {
        if (res.code === 300000) {
          let data = res.data
          for (const key in data) { // 处理返回的对象 删除key中的% 向project中的totalDiscount中添加数据
            if (data.hasOwnProperty(key)) {
              let keyIndex = Number(key.substr(0, key.length - 1))
              this.project[keyIndex].totalDiscount = data[key]
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    blurInputToGetDiscount (index) {
      this.getDiscountPrice(this.getDiscountPriceParams(index))
    },
    clearSelect (index, type) {
      var obj = this.project[index]
      if (type == 0) {
        obj.moveProject = ''
      } else {
        obj.copyProject = ''
      }
    },
    deepClone (obj) {
      let objClone = Array.isArray(obj) ? [] : {}
      if (typeof obj === 'object') {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deepClone(obj[key])
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    },
    handleChange () {},
    handleSelectionChange (val, index) {
      // 找到选中行的行索引
      this.project[index].tableData.forEach((v, i) => {
        val.forEach((o, j) => {
          if (o == v) {
            o.rowIndex = i
          }
        })
      })
      this.project[index].multipleSelection = val;
    },
    addService (index) {
      this.seviceloading = true
      this.dialogFormVisible = true
      this.operateTableIndex = index
      this.skuTable = []
      this.initService()
    },
    autoStore () {
      // 每五分钟自动保存一次报价
      var timer
      clearTimeout(timer)
      timer = setInterval(() => {
        this.totalTime--
        if (this.totalTime <= 0) {
          this.sumit(0)
          this.totalTime = 300
        }
      }, 1000)
    },
    addmodule () {
      // 增加新项目
      let newObj = Object.assign({}, this.$options.data().project[0])
      this.project.push(newObj)
      let itemObj = {
        itemArr: []
      }
      this.allShowModel.push(itemObj)
    },
    cancel () {},
    storeDraft () {
      this.sumit(0)
    },
    openViewQuote () {
      this.sumit(0, true)
    },
    getViewQuote (id) {
      api.getViewQuote(id).then(res => {
        if (res.code === 300000) {
          let viewQuote = document.getElementById('view-quote-wrap')
          viewQuote.innerHTML = res.data.html
          this.viewQuoteLoading = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    enterCustom () {
      this.creatLock = false
      this.sumit(1)
    },
    uploadSuccessReally (obj, params, i) {
      var currentProject = this.project[i]
      currentProject.params.file = obj.file_url
      this.project.splice(i, 1, currentProject)
    },
    getCurrentTime () {
      var date = new Date()
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      this.currentTime = Y + M + D + h + m + s
    },
    sumit (type, isview) {
      //  保存当前数据到草稿箱
      // let {value, company_name, contact_name, contact_phone, company_province, company_district, id} = this.params
      let params = this.params
      let flag = true
      // 校验基本信息
      for (let k in params) {
        if (k != 'created_at' && k != 'updated_at') {
          if (params[k] == '' || params[k] == null) {
            this.$message.error('基本信息不能为空')
            flag = false
            this.creatLock = true
            return
          }
        }
      }
      let data = {
        company_phone: params.user.phone,
        company_id: params.id ? params.id : '',
        company_name: params.company_name ? params.company_name : '',
        contact_name: params.contact_name ? params.contact_name : '',
        contact_phone: params.contact_phone ? params.contact_phone : '',
        contact_email: params.contact_email ? params.contact_email : '',
        company_province: params.selectedAddress[0],
        company_city: params.selectedAddress[1],
        company_district: params.selectedAddress[2],
        status: type, // 保存草稿传0 确定传1
        projects: [],
        id: this.routeParams.type == 'edit' ? this.routeParams.id : '',
        remark: this.remarkModel,
        token: this.crsfToken
      }
      this.project.forEach((v, i) => {
        let projectParams = v.params
        let productType
        for (let f in projectParams) {
          if (projectParams[f] == '' || projectParams[f] == null) {
            this.$message.error(`项目${i + 1}基本信息不能为空`)
            flag = false
            this.creatLock = true
            return
          }
        }
        if (projectParams.productType == '好产品打造') {
          productType = 1
        } else if (projectParams.productType == '文创产品') {
          productType = 2
        } else if (projectParams.productType == '其他') {
          productType = 3
        } else {
          productType = projectParams.productType
        }
        let obj = {
          name: projectParams.projectName,
          type: productType,
          product_name: projectParams.productName,
          demand_book: projectParams.file,
          services: []
          // projectParticipants: []
        }
        v.tableData.forEach((item, index) => {
          let type
          if (item.data.skus) {
            // ...存在sku字段  当前是spu
            type = 1
          } else {
            type = 2
          }
          let service = {
            name: item.service,
            object_type: type, // 1spu 2 sku
            object_id: item.data.id, // spu sku id
            num: item.sum,
            customize_price: item.setPrice,
            is_standard_price: item.data.is_standard,
            sort: index,
            participants: [],
            serviceDetails: []
          }
          item.data.service_participants.forEach((o, j) => {
            let participant = {
              name: o.attendant_type.name,
              num: o.people_num,
              is_selected: o.partChecked ? 1 : 0
            }
            service.participants.push(participant)
          })
          item.data.service_details.forEach((z, p) => {
            let serviceDetail = {
              is_selected: z.detailChecked ? 1 : 0,
              name: z.name,
              is_customized: z.id == '' ? 1 : 0,
              period: z.period,
              is_period_modifiable: z.is_period_modifiable,
              outputs: []
            }
            z.outputs.forEach((c, n) => {
              let output = {
                is_selected: c.outChecked ? 1 : 0,
                name: c.name,
                num: c.num,
                is_required: c.is_required,
                is_num_modifiable: c.is_num_modifiable
              }
              serviceDetail.outputs.push(output)
            })
            service.serviceDetails.push(serviceDetail)
          })
          obj.services.push(service)
        })
        // v.attendTable.forEach((b, q) => {
        //   let projectParticipant = {
        //     name: b.serviceName,
        //     num: b.total,
        //     sort: q
        //   }
        //   obj.projectParticipants.push(projectParticipant)
        // })
        data.projects.push(obj)
      })
      if (flag) {
        api.createQuote(data).then(res => {
          if (res.code === 300000) {
            if (type == 0) {
              if (isview) {
                this.viewQuoteDialog = true
                // this.$message.success('当前报价单已保存草稿')
                this.getViewQuote(res.data.id)
                this.getCsrfToken()
              } else {
                this.$message.success('保存草稿成功')
                this.$nextTick(() => {
                  this.getCurrentTime()
                })
              }
            } else if (type == 1) {
              this.$message.success('已成功发送至客户端')
              setTimeout(() => {
                this.$router.push({path: '/quote'})
              }, 500);
            }
            this.creatLock = true
          } else {
            this.getCsrfToken()
            this.$message.error(res.msg)
            this.creatLock = true
          }
        })
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
    }
  },
  watch: {
    project: {
      handler (newValue, oldValue) {
        let newArr = []
        newValue.forEach((v, i) => {
          newArr.push({
            value: i,
            label: `项目${i + 1}`
          })
        })
        //  监听 project=>下table里面数量，价格变化，则重新计算总价，总数，优惠价格
        newValue.forEach((o, j) => {
          let totalPlus = 0 // 优惠价格
          let totalPrice = 0 // 原始总价
          let totalSum = 0
          let newPrice = 0 // 改变后的新价格
          let attendTable = []
          o.tableData.forEach((z, p) => {
            totalSum += parseInt(z.sum)
            if (z.price !== '非标准价') {
              totalPrice += parseInt(z.sum) * parseInt(z.price)
            }
            if (z.setPrice != '') {
              newPrice += parseInt(z.sum) * parseInt(z.setPrice)
            } else {
              if (z.price === '非标准价') {
                this.$message.info('非标准价下必须填写订单价格')
              } else {
                newPrice += parseInt(z.sum) * parseInt(z.price)
              }
            }
            //  重新计算参与人数
            z.data.service_participants.forEach(v3 => {
              let attend = {
                serviceName: v3.attendant_type.name,
                total: v3.people_num
              }
              attendTable.push(attend)
            })
          })
          o.tableData.forEach(c => {
            c.singlePrice = c.data.price // 同步复制和创建 的数据结构
            c.is_standard_price = c.data.is_standard
          })
          totalPlus = totalPrice - newPrice
          o.totalPlus = totalPlus
          o.totalPrice = newPrice
          o.totalSum = totalSum
          // 重新计算参与人数
          // let newAttend = []
          // let el = {}
          // attendTable.forEach(item => {
          //   if (!el[item.serviceName]) {
          //     el[item.serviceName] = true
          //     newAttend.push(item)
          //   } else {
          //     newAttend.forEach(z => {
          //       if (z.serviceName == item.serviceName) {
          //         z.total += item.total
          //       }
          //     })
          //   }
          // })
          // o.attendTable = newAttend
        })
        this.projectOptions = newArr
      },
      deep: true
    }
  },
  components: {
    upload
  }
}
</script>
<style lang="scss" scoped>
  .ml10 {
    margin-left: 10px;
  }
  $row-distance: 10px;
  .add-quote-wrap {
    .box-card {
      margin-top: 20px;
    }
    font-size: 14px;
    .el-row {
      margin-bottom: $row-distance;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .project-module {
    .title {
      margin: 10px 0;
      font-weight: bold;
      font-size: 18px;
    }
    .project-title {
      margin: 20px;
    }
    .tab-footer {
      margin: 15px 0 30px 0;
      padding: 10px;
      border: 1px dotted #ccc;
      .rightText{
        float: right;
        span {
          color: red;
        }
      }
    }
    .new-tab-footer {
      margin: 0 0 30px 0;
      padding: 20px;
      border: 1px solid #ebeef5;
      border-top: none;
      .rightText{
        float: right;
        span {
          color: red;
          font-size: 18px;
        }
      }
    }
    .attendService {
      font-size: 0;
      padding: 10px 0;
      margin-bottom: 5px;
    }
    .serviceDetail, .cycle {
       font-size: 0;
       padding: 10px 0;
       border-bottom: 1px solid #ebeef5;
       margin-bottom: 5px;
       .el-input {
         display: inline-block;
         vertical-align: top;
         margin: 0 4px;
       }
       .text {
         display: inline-block;
         vertical-align: top;
         font-size: 14px;
       }
    }
    .operate {
      text-align: center;
      span {
        cursor: pointer;
        margin: 0 5px;
      }
    }
  }
  .footer-botton {
     margin: 40px auto 10px;
     text-align: center;
    .tips {
       margin: 0 auto 5px;
    }
    .btn {
      margin: 0 auto;
    }
    .add-project {
      text-align: left;
      margin: 15px 0;
      padding: 10px;
      border: 1px dotted #ccc;
    }
  }
  .remark-wrap {
    position: relative;
    box-sizing: border-box;
    padding-left: 40px;
    .remark-text {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .skuNav {
    box-sizing: border-box;
    margin: -20px 0 30px;
    width: 100%;
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    li {
      flex: 1;
      font-size: 14px;
      cursor: pointer;
      box-sizing: border-box;
      white-space: nowrap;
      text-align: center;
      border:1px solid rgba(220,223,230,1);
      height:36px;
      line-height: 36px;
      &.current {
        color: #666;
        background:rgba(230,241,252,1);
        border:1px solid rgba(163,208,253,1);
        color:rgba(25,137,250,1);
      }
    }
  }
  .nav-header {
    width: 100%;
    height: 100%;
    background-color: #f1f1f1;
    span {
      margin-left: 10px;
    }
  }
  .nav-model {
    position: relative;
    border: 1px solid #f1f1f1;
    padding-left: 100px;
    margin: 10px 0;
    .model-name {
      position: absolute;
      top: 15px;
      left: 20px;;
      font-weight: bold;
      color:rgba(96,98,102,1);
    }
    // >span {
    //   font-weight: bold;
    //   margin: 10px 0 10px 20px;
    // }
    .model-box {
      padding: 5px 15px 15px;
    }
  }
  .skuTable-box {
    .title {
      font-weight: bold;
      margin: 10px 0;
    }
  }
  .appendRow {
    display: flex;
    .column {
      flex: 1;
      height: 48px;
      line-height: 48px;
      padding-left: 10px;
      border-right: 1px solid #ebeef5;
      &:nth-child(3) {
        border: none;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="scss">
  .el-collapse-item {
    margin-bottom: 5px;
  }
  .nav-model {
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
    }
    .el-checkbox {
      margin-left: 20px;
      margin-top: 10px;
      flex: 0 0 33.3333%;
    }
    &.singleCheck {
      margin: 10px 0;
      .el-checkbox__label {
        font-weight: bold;
        color: #303133;
      }
    }
  }
  .skuTable-box {
    th {
      text-align: center;
      background:rgba(248,248,248,1);
    }
    td {
      text-align: center;
    }
  }
  .main-quota-table {
    .el-input__inner {
      text-align: center;
      padding: 0 6px;
    }
    .el-table__body-wrapper {
      overflow-y: hidden;
    }
    .el-table__row {
      td:nth-child(1) {
        .cell {
          text-align: center;
          .el-checkbox__inner {
            margin-left: 3px;
          }
        }
      }
      td:nth-child(10),td:nth-child(11),td:nth-child(12),td:nth-child(9) {
        padding: 0 0 15px 0;
        .cell {
          padding: 0;
        }
        position: relative;
        .show-switch {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 670px;
          height: 15px;
          background:rgba(245,247,250,1);
          color: rgba(197,199,206,1);
          z-index: 100;
          cursor: pointer;
          text-align: center;
          i {
            position: relative;
            top: -4px;
          }
        }
        .cell-item,.num-cell-item,.outputs-cell-item {
          height: 70px;
          box-sizing: border-box;
          position: relative;
          margin: 0;
          padding: 0;
        }
      }
      td:nth-child(11) {
        .el-checkbox__label {
          display: inline-block;
          box-sizing: border-box;
          width: 220px;
          overflow: hidden;
        }
        .el-checkbox__input {
          vertical-align: top;
          margin-top: 4px;
        }
        .el-checkbox {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      td:nth-child(9) {
        .el-checkbox__label {
          display: inline-block;
          box-sizing: border-box;
          width: 230px;
          overflow: hidden;
        }
        .el-checkbox__input {
          vertical-align: top;
          margin-top: 4px;
        }
        .el-checkbox {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      td:nth-child(10) {
        .el-input {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
        }
      }
      td:nth-child(12) {
        // .el-input-number {
        //   position: absolute;
        //   left: 50%;
        //   top: 50%;
        //   transform: translate(-50%, -50%);
        //   margin: 0;
        // }
        .cell {
          padding: 0;
        }
        .el-input__inner {
          width: 100%;
        }
        .el-input {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          padding: 0 10px 0 4px;
        }
      }
    }
    thead {
      .cell {
        margin: 0 auto;
        text-align: center;
      }
      th:nth-child(1) {
        .el-checkbox__inner {
          margin-left: 3px;
        }
      }
    }
  }
  .demo-form-inline {
    .el-upload,.el-upload-list {
      vertical-align: top;
    }
    .el-upload-list {
      display: inline-block;
      .el-upload-list__item {
        margin-top: 4px;
      }
    }
  }
</style>
