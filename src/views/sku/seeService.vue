<template>
  <div>
    <template>
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="详情&SKU" name="first">
          <template>
            <el-form>
              <el-form-item>
                <div v-if="formInline.category" style="display: inline-block">
                  <div style="width: 55px;margin-left:17px;text-align: right;float: left;margin-right: 8px">分类：</div>
                  <el-input v-model="formInline.category.parent.parent.name" style="margin-right:20px;width: 150px" v-bind:disabled="true"></el-input>
                  <el-input v-model="formInline.category.parent.name" style="margin-right:20px;width: 150px" v-bind:disabled="true"></el-input>
                  <el-input v-model="formInline.category.name" style="margin-right:20px;width: 150px" v-bind:disabled="true"></el-input>
                </div>
                项目类型：
                <el-select v-model='formInline.type'  placeholder="项目类型" style="width: 150px;margin-right:20px;" v-bind:disabled="true">
                  <el-option
                          v-for="item in cities"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                *服务名称：
                <el-input v-model="formInline.name" style="margin-right:20px;width: 150px" v-bind:disabled="true"></el-input>
                <div style="margin-left:370px;display: inline-block">
                  *排序：
                  <el-input v-model="formInline.sort" style="width: 150px" v-bind:disabled="true"></el-input>
                </div>
              </el-form-item>
              <el-form-item>
                服务图片
                <img :src="formInline.cover" class="imgClass" v-show="formInline.cover && !dialogUploadVisible" alt="" style="width: 310px;">
              </el-form-item>
              <el-form-item>
                服务简介
                <el-input v-model="formInline.summary" placeholder="请输入服务简介，不超过30个字" style="width: 310px;" v-bind:disabled="true"></el-input>
              </el-form-item>
              <el-form-item>
                *服务价格：
                <el-radio-group v-model="formInline.isStandard">
                  <el-radio :label="1" v-bind:disabled="true">标准定价</el-radio>
                  <el-input  v-model="formInline.price" v-bind:disabled="true"  placeholder="请设置价格" style="width: 120px;margin-right:20px;margin-left: 5px"></el-input>
                  <el-radio :label="0" v-bind:disabled="true">非标准定价</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </template>
          <div style="height: 50px"></div>
          <div class="spu">
            <div style="width: 200px;float: left;margin-right: 10px">
              <template>
                <el-table
                        border
                        :data="formInline.participants"
                        style="width: 100%">
                  <el-table-column
                          align="center"
                          prop="attendantType.name"
                          label="服务参与人">
                    <template slot-scope="scope">
                      {{scope.row.attendantType.name}}
                      {{scope.row.isRequired === 1 ?'必选':'非必选'}}
                      {{scope.row.peopleNum}}个
                      {{scope.row.isNumModifiable === 1 ?'可修改':'不可修改'}}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
            <div style="width: 600px;float: left">
              <template>
                <el-table
                        border
                        align="center"
                        :data="formInline.serviceDetails"
                        style="width: 100%">
                  <el-table-column
                          prop=""
                          label="  周期(天)">
                    <template slot-scope="scope">
                      {{scope.row.period}}天
                      {{scope.row.isPeriodModifiable === 1 ?'可修改':'不可修改'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                          align="center"
                          prop=""
                          label="服务细目">
                    <template slot-scope="scope">
                      {{scope.row.period}}天
                      {{scope.row.isPeriodModifiable === 1 ?'可修改':'不可修改'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                          align="center"
                          prop=""
                          label="产出物">
                    <template slot-scope="scope">
                       <span v-for="tab1 in scope.row.outputs" v-bind:key="tab1.id" style="display: block">
                          {{tab1.name}}
                        {{tab1.isRequired === 1 ?'必选':'非必选'}}
                        {{tab1.num}}个
                        {{tab1.isNumModifiable=== 1 ?'可修改':'不可修改'}}
                        </span>
                    </template>

                  </el-table-column>
                </el-table>
                <div style="height: 20px;clear: both;width: 100%"></div>
                <el-form-item>
                  <el-button type="primary" @click="editorService">编辑服务明细</el-button>
                </el-form-item>
              </template>
            </div>
            <div style="height: 20px;clear: both;width: 100%"></div>
            <div style="border-bottom: 1px dashed #999"></div>
          </div>
          <div style="height: 20px"></div>
          <div style="border-bottom: 1px dashed #999"></div>
          <p style="padding-top: 30px">服务属性设置(SKU)</p>
          <div  style="padding-left: 50px">
            <div style="height: 15px"></div>
            <el-form>
              <el-form-item v-for="(tab, index) in formInline.attributes" :key="index">
                *属性维度
                <el-input v-model="tab.name" placeholder="请输入属性值" style="width: 200px;margin-left: 5px;margin-right: 5px" :disabled="true"></el-input>
                <div style="height: 8px"></div>
                <span style="margin-left: 18px;display: inline-block;float: left"> *属性值</span>
                <div style="display: inline-block;float: left">
                  <div v-for="(item, index1) in tab.values" :key="index1" style="margin-bottom: 10px">
                    <el-input v-model="item.value" placeholder="请输入属性值" :disabled="true"
                              style="width: 200px;margin-left: 5px;margin-right: 5px">
                    </el-input>
                    <el-input v-model="item.summary" placeholder="请输入属性值简介，不超过30个字" :disabled="true"
                              style="width: 300px;margin-left: 5px;margin-right: 5px">
                    </el-input>
                </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <p style="padding-top: 30px">服务属性明细(SKU)</p>
          <div style="height: 20px"></div>
          <div style="padding-left: 50px">
            <el-table
                    :data="formInline.skus"
                    border>
              <el-table-column
                      label="SKU" align="center">
                <template slot-scope="scope">
               <span v-for="tab in scope.row.attributeValues" v-bind:key="tab.id" style="padding:0 10px;display: inline-block;text-align: center">
                {{tab.attribute.name}}( {{tab.value}} )
              </span>
                </template>
              </el-table-column>
              <el-table-column
                      prop="isStandard"
                      label="价格"
                      width="250" align="left">
                <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.isStandard">
                    <el-radio :label="1" v-bind:disabled="true">标准定价</el-radio>
                    <el-input  v-model="scope.row.price" v-bind:disabled="true"  placeholder="请设置价格" style="width: 120px;margin-left: 5px"></el-input>
                    <el-radio :label="0" v-bind:disabled="true">非标准定价</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column
                      prop="sn"
                      label="skuID"
                      width="100" align="center">
              </el-table-column>
              <el-table-column
                      prop="status"
                      label="状态"
                      width="100" align="center">
                <template slot-scope="scope">
                  {{scope.row.status==1 ?'上线':'下线'}}
                </template>
              </el-table-column>
              <el-table-column
                      prop="participants"
                      label="服务参与人"
                      width="200" align="center">
                <template slot-scope="scope">
                <span v-for="tab in scope.row.participants" v-bind:key="tab.id" style="display: block">
                 {{tab.attendantType.name}}
                {{tab.isRequired === 1 ?'必选':'非必选'}}
                {{tab.peopleNum}}个
                {{tab.isNumModifiable === 1 ?'可修改':'不可修改'}}
                </span>
                </template>
              </el-table-column>
              <el-table-column
                      label="服务明细"
                      width="200" align="center">
                <template slot-scope="scope">
                <span v-for="tab in scope.row.serviceDetails" v-bind:key="tab.id" style="display: block">
                 {{tab.name}}
                {{tab.isRequired === 1 ?'必选':'非必选'}}
                </span>
                </template>
              </el-table-column>
              <el-table-column
                      label="周期（天）"
                      width="100" align="center">
                <template slot-scope="scope">
                <span v-for="tab in scope.row.serviceDetails" v-bind:key="tab.id" style="display: block">
               {{tab.period}}天
                {{tab.isPeriodModifiable === 1 ?'可修改':'不可修改'}}
                </span>
                </template>
              </el-table-column>
              <el-table-column
                      label="产出物"
                      width="240" align="center">
                <template slot-scope="scope">
                  <div v-for="tab in scope.row.serviceDetails" v-bind:key="tab.id">
                 <span v-for="tab1 in tab.outputs" v-bind:key="tab1.id" style="display: block">
                    {{tab1.name}}
                    {{tab1.isRequired === 1 ?'必选':'非必选'}}
                    {{tab1.num}}个
                    {{tab1.isNumModifiable=== 1 ?'可修改':'不可修改'}}
               </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="服务介绍" name="second">
          <el-form ref="form"  label-width="80px">
            <div style="height: 20px"></div>
            <el-form-item >
              <el-radio-group v-model="intro">
                <el-radio :label="1" v-bind:disabled="disabledInput">不需要设置服务介绍</el-radio>
                <br>
                <div style="height: 10px"></div>
                <el-radio :label="2" v-bind:disabled="disabledInput">需要设置服务介绍 </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div v-show="grade" style="margin-left: 82px;border: 1px solid #efefef;width: 600px;padding: 30px">
            <el-form ref="form">
              <div style="font-size: 14px;display: inline-block;float: left;margin-right: 10px;line-height: 40px">为这款服务(SPU)设置介绍</div>
              <div style="font-size: 14px;display: inline-block;float: left;height: 40px;overflow: hidden">
                <el-form-item style="margin-bottom: 0">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="previewQuillEdit(1, '')">预览</el-button>
                  </template>
                </el-form-item>
              </div>
            </el-form>
            <div style="height: 1px;display: inline-block;width: 100%"></div>
            <div style="font-size: 14px">为具体服务(SKU)设置介绍</div>
            <div style="height: 30px"></div>
            <el-table
                    :data="formInline.skus"
                    border
                    style="width: 601px">
              <el-table-column
                      label="sku" align="center">
                <template slot-scope="scope">
             <span v-for="tab in scope.row.attributeValues" v-bind:key="tab.id" style="padding:0 10px;display: inline-block;text-align: center">
                {{tab.attribute.name}}( {{tab.value}} )
              </span>
                </template>
              </el-table-column>
              <el-table-column
                      width="100"
                      label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="previewQuillEdit(2, scope.$index)">预览</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <el-dialog
            :title="previewlog.title"
            :visible.sync="previewlog.dialogVisible"
            class="dialog-wrap"
            v-loading="previewlog.loading"
    >
      <div v-html="previewlog.content" style="width:800px;height: 400px;overflow:auto;padding: 20px;word-break:break-all;word-wrap:break-word;">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as skuApi from '@/api/skuApi'
export default {
  data () {
    return {
      formInline2: {
        online: 1,
        classificationVisible01: true,
        limit: 10
      },
      cities: [{
        id: 1,
        name: '好产品打造'
      }, {
        id: 2,
        name: '文创'
      }, {
        id: 3,
        name: '其他'
      }],
      formInline: {
      },
      skusType: true,
      disabledInput: true,
      disabledInputer: false,
      previewlog: {
        content: '',
        title: '',
        dialogVisible: false,
        loading: false
      },
      intro: '',
      grade: false,
      activeName2: 'first'
    };
  },
  created () {
    this.onelist()
  },
  methods: {
    onelist () {
      skuApi.putService(this.$route.params.id, {})
        .then(data => {
          if (data.code === 300000) {
            this.formInline = data.data
            /* this.formInline.skus.forEach(function (v, i) {
              for (var k in v) {
                if (v.status) {
                  v.isStatus = false
                } else {
                  v.isStatus = true
                }
                if (v.type) {
                  v.isType = false
                } else {
                  v.isType = true
                }
              }
            }) */
            console.log(this.formInline.skus)
            // this.intro = (data.data.intro == null ? '1' : '2')
            if (!data.data.intro) {
              this.intro = 1
              this.disabledInput = true
            } else {
              this.intro = 2
              this.disabledInput = true
              this.grade = true
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 预览
    previewQuillEdit (value, index) {
      if (value == 1) {
        if (!this.formInline.intro) {
          this.$message.error('当前没有编辑任何信息')
          return false
        }
        this.previewlog.dialogVisible = true
        this.previewlog.content = this.formInline.intro
      } else {
        if (!this.formInline.skus[index].intro) {
          this.$message.error('当前没有编辑任何信息')
          return false
        }
        this.previewlog.dialogVisible = true
        this.previewlog.content = this.formInline.skus[index].intro
      }
    },
    handleClick (tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .grid-contentlist{
    span{
      display: block;
    }
  }
</style>
