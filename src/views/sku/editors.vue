<template>
  <div>
    <el-form>
      <div  style="padding-left: 50px">
        <div class="top">
          <el-form-item>
            <div style="width: 55px;margin-right:5px;text-align: right;float: left">分类</div>
            <el-select v-model="Id.headCategoryId" placeholder="一级" style="width: 100px;margin-right: 20px"  @change="changeShop">
              <el-option
                      v-for="item in oneOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="Id.secondCategoryId" placeholder="二级" style="width: 100px;margin-right: 20px" @change="changeOneSelect">
              <el-option
                      v-for="item in twoOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="formInline.categoryId" placeholder="三级" style="width: 100px;margin-right: 50px">
              <el-option
                      v-for="item in threeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
            项目类型
            <el-select v-model='formInline.type'  placeholder="项目类型" style="width: 200px;">
              <el-option
                      v-for="item in cities"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            服务名称
            <el-input v-model="formInline.name" @blur="serviceName"  placeholder="请输入服务名称" style="width: 310px;margin-right: 100px"></el-input>
            排序
            <el-input v-model="formInline.sort" @blur="serviceSort" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item>
            服务图片
            <img :src="formInline.cover" class="imgClass" v-show="formInline.cover && !dialogUploadVisible" alt="" style="width: 310px;">
            <el-button type="primary" @click="uploadImageurl">上传图片</el-button>
            <span>尺寸要求为500x400</span>
          </el-form-item>
          <el-form-item>
            服务简介
            <el-input v-model="formInline.summary" @blur="serviceSummary" placeholder="请输入服务简介，不超过30个字" style="width: 310px;"></el-input>
          </el-form-item>
          <el-radio-group v-model="formInline.isStandard">
            <el-radio :label="1">标准定价</el-radio>
            <el-input  v-model="formInline.price" @blur="servicePrice" v-bind:disabled="!formInline.isStandard"  placeholder="请设置价格" style="width: 200px;margin-left: 5px;margin-right: 50px"></el-input>
            <el-radio :label="0">非标准定价</el-radio>
          </el-radio-group>
        </div>
        <div style="height: 15px"></div>
        <div class="spu" v-show="fpatType">
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
                        align="center"
                        prop=""
                        label="服务细目">
                  <template slot-scope="scope">
                    {{scope.row.name}}
                    {{scope.row.isRequired === 1 ?'必选':'非必选'}}
                  </template>
                </el-table-column>
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
            </template>
          </div>
          <div style="height: 20px;clear: both;width: 100%"></div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="editorService">编辑服务明细</el-button>
        </el-form-item>
        <div style="border-bottom: 1px dashed #999"></div>
      </div>
      <div style="height: 15px"></div>
      <div class="skusheji">
        <p style="padding-top: 30px">服务属性设置(SKU)</p>
        <div  style="padding-left: 50px">
          <div style="height: 15px"></div>
          <div>
            <el-form-item v-for="(tab, index) in formInline.attributes" :key="index">
              *选择属性维度
              <el-select @change="attributeDimension" v-model="tab.id" placeholder="请选择属性名称" style="width: 200px;margin-left: 5px;margin-right: 5px">
                <el-option
                        v-for="item in attributeName"
                        v-bind:disabled="item.disabled"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
              <el-button size="small" type="danger" plain @click="deleteType(index)" style="margin-left: 5px;margin-right: 5px">删除</el-button>
              <div style="height: 8px"></div>
              <div>
                <span style="margin-left: 27px; display: inline-block;float: left; margin-right: 5px;"> *属性名称</span>
                <div style="display: inline-block;float: left">
                  <div v-for="(item, index1) in tab.values" :key="index1"  style="margin-bottom: 10px">
                    <el-input v-model="item.value" placeholder="请输入属性值"
                              style="width: 200px;margin-left: 5px;margin-right: 5px"
                              @blur="postattributeValue(index, index1, tab.id, item.value)">
                    </el-input>
                    <el-input v-model="item.summary" @blur="postattributeSmmary(item.summary)"  placeholder="请输入属性值简介，不超过30个字"
                              style="width: 300px;margin-left: 5px;margin-right: 5px">
                    </el-input>
                    <el-button size="small" type="danger" style="margin-left: 5px;margin-right: 5px" plain @click="deleteVlues(index, index1)">删除</el-button>
                  </div>
                  <el-button size="small" type="primary" @click="addType(index, tab.id)" v-bind:disabled='classificationV2'>添加属性值</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addAttributeType()" v-bind:disabled='classificationV2'>添加属性维度</el-button>
              <el-button type="primary" @click="determine" v-bind:disabled='classificationV2'>保存属性维度</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="skubianji">
        <p style="padding-top: 30px">服务属性明细(SKU)</p>
        <div style="height: 20px"></div>
        <div style="padding-left: 50px">
          <el-table
                  :data="formInline.skus"
                  border>
            <el-table-column
                    label="SKU" align="center">
              <template slot-scope="scope">
              <span v-for="tab in scope.row.attributeValues" v-bind:key="tab.id" style="padding:0 10px;display: block;text-align: center">
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
                  <el-radio :label="1">标准定价</el-radio>
                  <el-input  v-model="scope.row.price" v-bind:disabled="!scope.row.isStandard"  placeholder="请设置价格" style="width: 120px;margin-left: 5px"></el-input>
                  <el-radio :label="0">非标准定价</el-radio>
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
                    width="180" align="center">
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
                    width="180" align="center">
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
                    width="180" align="center">
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
            <el-table-column
                    label="操作"
                    width="200" align="center">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row.id, scope.row.status)" type="primary" size="small"> {{scope.row.status === 1 ?'下线':'上线'}}</el-button>
                <el-button @click="editorsku(scope.row.id)" type="primary" size="small" >编辑细目</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="height: 20px"></div>
        <div style="text-align: center">
          <el-form-item>
            <el-button type="primary"  @click="onSubmit" v-bind:disabled="isSubmit">保存，设置服务介绍</el-button>
          </el-form-item>
        </div>
      </div>
      <el-dialog title="上传图片" style="width:40%;margin:0 auto" :visible.sync="dialogUploadVisible">
        <img :src="fileList.url" style="width:100px;height:100px" alt="">
        <upload-file :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="false" @urlCB="uploadSuccess" :isCover="true"></upload-file>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取 消</el-button>
          <el-button type="primary" @click="enterUpload">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
    <!-- 添加分类spu -->
    <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.dialogVisible"
            width="1100px"
            class="dialog-wrap"
            v-loading="dialog.loading"
            :close-on-click-modal="false">
      <el-form class="service-details">
        <p>*服务细目：</p>
        <div style="border: 1px solid #dcdfe6; width: 1030px;">
          <p class="tableData1"><span>*服务细目</span><span>*细目是否必选</span><span>*周期（天）</span><span>*周期是否可修改</span><span>产出物</span></p>
          <el-form-item v-for="(tab, index1) in formInline.serviceDetails" :key="index1" style="border-top: 1px solid #dcdfe6;padding: 20px;padding-top:0 ;margin-bottom: 0">
            <div style="width: 460px;float: left;border-right: 1px solid #dcdfe6">
              <p class="tableData3"><span style="color:#ffffff">占位符</span></p>
              <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab.name">
              <!--TODO 少一个细目是否必选-->
              <el-select placeholder="请选择" style="width: 90px" v-model="tab.isRequired">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
              <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab.period">
              <el-select  placeholder="请选择" style="width: 90px" v-model="tab.isPeriodModifiable">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
              <el-button type="danger" plain @click="deletingSPU(index1)">删除</el-button>
            </div>
            <div style="float: left;width:490px;padding-left: 18px">
              <p class="tableData3"><span>名称</span><span>是否必选</span><span>数量</span><span>数量是否修改</span></p>
              <el-form-item v-for="(tab1, index2) in tab.outputs" :key="index2">
                <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab1.name">
                <el-select  placeholder="请选择" style="width: 90px" v-model="tab1.isRequired">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
                <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab1.num">
                <el-select  placeholder="请选择" style="width: 90px" v-model="tab1.isNumModifiable">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
                <el-button type="danger" plain @click="deletingSku(index1,index2)" style="margin-left: 15px">删除</el-button>
                <div style="height: 10px"></div>
              </el-form-item>
              <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="small"
                      class="add-btn" @click="addserviceDetails(index1)">
                新增
              </el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  class="add-btn" @click="newserviceDetails">
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-form class="form-box">
        <p style="margin-bottom: 10px;padding-top: 10px">*参与人员：</p>
        <div style="border: 1px solid #dcdfe6; width: 650px;">
          <p class="tableData2"><span>*服务人</span><span>*是否必选</span><span>*人数</span><span>*是否可修改</span><span>操作</span></p>
          <el-form-item v-for="(tab1, index) in formInline.participants" :key="index" style="border-top: 1px solid #dcdfe6;padding: 20px;margin-bottom: 0">
            <el-select  placeholder="请选择" style="width: 125px" v-model="tab1.attendantTypeId">
              <el-option
                      v-for="item in attendants"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
            <el-select  placeholder="请选择" style="width: 125px" v-model="tab1.isRequired">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
            <input type="text" placeholder="请输入" style="width: 125px;height: 38px;border: 1px solid #dcdfe6" v-model="tab1.peopleNum">
            <el-select  placeholder="请选择" style="width: 125px" v-model="tab1.isNumModifiable">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
            <el-button type="danger" plain @click="deletingSP(index)" style="margin-left: 15px">删除</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  class="add-btn" @click="newServicePersonnel">
            新增
          </el-button>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button
                  @click="dialog.dialogVisible = false">取 消</el-button>
          <el-button
                  type="primary"
                  @click="subeditattributesSPU('spu')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑服务属性明细sku -->
    <el-dialog
            :title="editattributes.title"
            :visible.sync="editattributes.dialogVisible"
            width="1100px"
            class="dialog-wrap"
            :close-on-click-modal="false"
            v-loading="editattributes.loading">
      <el-form class="service-details">
        <p>*服务细目：</p>
        <div style="border: 1px solid #dcdfe6; width: 1030px;">
          <p class="tableData1"><span>*服务细目</span><span>*细目是否必选</span><span>*周期（天）</span><span>*周期是否可修改</span><span>产出物</span></p>
          <el-form-item v-for="(tab, index1) in editservice.serviceDetails" :key="index1" style="border-top: 1px solid #dcdfe6;padding: 20px;padding-top:0 ;margin-bottom: 0">
            <div style="width: 460px;float: left;border-right: 1px solid #dcdfe6">
              <p class="tableData3"><span style="color:#ffffff">占位符</span></p>
              <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab.name">
              <!--TODO 少一个细目是否必选-->
              <el-select  placeholder="请选择" style="width: 90px" v-model="tab.isRequired">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
              <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab.period">
              <el-select  placeholder="请选择" style="width: 90px" v-model="tab.isPeriodModifiable">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
              <el-button type="danger" plain @click="deletingAttributesSPU(index1)">删除</el-button>
            </div>
            <div style="float: left;width:490px;padding-left: 18px">
              <p class="tableData3"><span>名称</span><span>是否必选</span><span>数量</span><span>数量是否修改</span></p>
              <el-form-item v-for="(tab1, index2) in tab.outputs" :key="index2">
                <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab1.name">
                <el-select  placeholder="请选择" style="width: 90px" v-model="tab1.isRequired">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
                <input type="text" placeholder="请输入" style="width: 90px;height: 38px;border: 1px solid #dcdfe6" v-model="tab1.num">
                <el-select  placeholder="请选择" style="width: 90px" v-model="tab1.isNumModifiable">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
                <el-button type="danger" plain @click="deletingAttributesSPUOutput(index1,index2)" style="margin-left: 15px">删除</el-button>
                <div style="height: 10px"></div>
              </el-form-item>
              <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="small"
                      class="add-btn" @click="addSkusserviceDetails(index1)">
                新增
              </el-button>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  class="add-btn" @click="editSkusServiceDetails">
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-form class="form-box">
        <p style="margin-bottom: 10px;padding-top: 10px">*参与人员：</p>
        <div style="border: 1px solid #dcdfe6; width: 650px;">
          <p class="tableData2"><span>*服务人</span><span>*是否必选</span><span>*人数</span><span>*是否可修改</span><span>操作</span></p>
          <el-form-item v-for="(tab1, index) in editservice.participants" :key="index" style="border-top: 1px solid #dcdfe6;padding: 20px;margin-bottom: 0">
            <el-select  placeholder="请选择" style="width: 125px" v-model="tab1.attendantTypeId" >
              <el-option
                      v-for="item in attendants"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
            <el-select  placeholder="请选择" style="width: 125px" v-model="tab1.isRequired">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
            <input type="text" placeholder="请输入" style="width: 125px;height: 38px;border: 1px solid #dcdfe6" v-model="tab1.peopleNum">
            <el-select  placeholder="请选择" style="width: 125px" v-model="tab1.isNumModifiable">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
            <el-button type="danger" plain @click="deletingAttributesSKU(index)" style="margin-left: 15px">删除</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  class="add-btn" @click="editSkusServicePersonnel">
            新增
          </el-button>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button
                  @click="editattributes.dialogVisible = false">取 消</el-button>
          <el-button
                  type="primary"
                  @click="subeditattributesSKU('sku')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import QuillEdit from '@/components/QuillEdit/quillEdit'
import * as skuApi from '@/api/skuApi'
import ElForm from '../../../node_modules/element-ui/packages/form/src/form'
import uploadFile from '@/components/Upload/upload'
export default {
  components: {
    ElForm,
    QuillEdit,
    'upload-file': uploadFile
  },
  data () {
    return {
      editorUpload: true,
      editorOption: {
        modules: {
          toolbar: [
            ['image'],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{'list': 'ordered'}, { 'list': 'bullet' }],
            [{'script': 'sub'}, { 'script': 'super' }],
            [{'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      },
      fileList: {},
      dialogUploadVisible: false,
      isSubmit: false,
      classificationV2: false,
      dialog: {
        title: '',
        dialogVisible: false,
        loading: false
      },
      editattributes: {
        title: '',
        input: '',
        dialogVisible: false,
        loading: false
      },
      servedialog: {
        content: '',
        title: '',
        dialogVisible: false,
        loading: false
      },
      oneOptions: '',
      hidePrice: true,
      typeTemplate: [{
        id: '',
        inputArr: [{
          name: '',
          id: ''
        }]
      }],
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
      twoOptions: '',
      threeOptions: '',
      attributeName: '',
      Id: {
        disabledInput: false,
        headCategoryId: '',
        secondCategoryId: ''
      },
      formInline: {
        attributes: [{
          value: '',
          values: [{
            value: '',
            id: '',
            summary: ''
          }]
        }],
        categoryId: '',
        type: '',
        name: '',
        status: 1,
        sort: '',
        isStandard: 1,
        price: '',
        serviceDetails: [{
          name: '',
          isRequired: 1,
          period: '',
          isPeriodModifiable: 1,
          outputs: [{
            name: '',
            isRequired: 1,
            num: '',
            isNumModifiable: 1
          }]
        }],
        //  参与人员
        participants: [{
          attendantTypeId: '',
          isRequired: 1,
          peopleNum: '',
          isNumModifiable: 1
        }],
        skus: []
      },
      editservice: {
        serviceDetails: [{
          name: '',
          isRequired: 1,
          period: '',
          isPeriodModifiable: 1,
          outputs: [{
            name: '',
            isRequired: 1,
            num: '',
            isNumModifiable: 1
          }]
        }],
        //  参与人员
        participants: [{
          attendantTypeId: '',
          isRequired: 1,
          peopleNum: '',
          isNumModifiable: 1
        }]
      },
      attendants: [],
      grade: false,
      flag: true,
      tye: true,
      paramsId: this.$route.params.id,
      fpatType: false,
      contentlist: true,
      // TODO sku编辑明细的ID
      skuID: '',
      activeName2: 'first'
    };
  },
  created () {
    if (this.paramsId != 0) {
      this.getlist()
      this.fpatType = true
    }
    this.aName()
    this.onelist()
    this.attendantsName()
  },
  // skus
  methods: {
    // 更新SPU服务介绍
    getlist () {
      skuApi.getSpus(this.paramsId, {})
        .then(data => {
          if (data.code === 300000) {
            this.formInline = data.data
            this.Id.headCategoryId = data.data.category.parent.parent.id
            this.Id.secondCategoryId = data.data.category.parent.id
            // 获取默认得二级三级分类
            skuApi.getTwoclassification(this.Id.headCategoryId, {})
              .then(data => {
                if (data.code === 300000) {
                  if (data.data.length == 0) {
                    this.$confirm('当前没有子分类确定去创建子分类吗？', {
                      dangerouslyUseHTMLString: true,
                      center: true,
                      type: 'warning'
                    }).then(() => {
                      this.$router.push('/classification')
                        .catch(err => { this.$message.error(err) })
                    }).catch(() => {
                      // 取消
                    })
                  } else {
                    this.twoOptions = data.data
                    skuApi.getTwoclassification(this.Id.secondCategoryId, {})
                      .then(data => {
                        if (data.code === 300000) {
                          if (data.data.length == 0) {
                            this.$confirm('当前没有子分类确定去创建子分类吗？', {
                              dangerouslyUseHTMLString: true,
                              center: true,
                              type: 'warning'
                            }).then(() => {
                              this.$router.push('/classification')
                                .catch(err => { this.$message.error(err) })
                            }).catch(() => {
                              // 取消
                            })
                          } else {
                            this.threeOptions = data.data
                          }
                        } else {
                          this.$message.error(data.msg)
                        }
                      })
                      .catch(err => { this.$message.error(err) })
                  }
                } else {
                  this.$message.error(data.msg)
                }
              })
              .catch(err => { this.$message.error(err) })
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    establish () {
      let reg = /^(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;
      let num = /^(?:0|\-?[1-9]\d*)$/;
      let $price = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
      if (!this.formInline.categoryId) {
        this.$message.error('请选择服务分类')
        this.flag = false
        return;
      }
      if (!this.formInline.type) {
        this.$message.error('请选择服务类型')
        this.flag = false
        return;
      }
      if (!this.formInline.name) {
        this.$message.error('请把服务名称填写完整')
        this.flag = false
        return;
      }
      if (this.formInline.name.length > 9) {
        this.$message.error('服务名称不超过10个字')
        this.flag = false
        return;
      }
      if (isNaN(this.formInline.sort)) {
        this.$message.error('排序必须是数字')
        this.flag = false
        return;
      } else if (this.formInline.sort == 0) {
        this.$message.error('排序必须大于零')
        this.flag = false
        return;
      } else if (!reg.test(this.formInline.sort)) {
        this.$message.error('排序不能是负数')
        this.flag = false
        return;
      } else if (this.formInline.sort == '') {
        this.$message.error('排序不能为汉字')
        this.flag = false
        return;
      } else if (!num.test(this.formInline.sort)) {
        this.$message.error('排序不能是小数')
        this.flag = false
        return;
      }
      if (!this.formInline.cover) {
        this.$message.error('服务图片不能为空')
        this.flag = false
        return;
      }
      if (!this.formInline.summary) {
        this.$message.error('服务简介不能为空')
        this.flag = false
        return;
      }
      if (this.formInline.summary.length > 29) {
        this.$message.error('服务简介不超过30个字')
        this.flag = false
        return;
      }
      if (this.formInline.isStandard == 1) {
        if (!$price.test(this.formInline.price)) {
          this.$message.error('请填写正确的价格')
          this.flag = false
          return false;
        }
      }
      if (this.formInline.isStandard == 0) {
        this.formInline.price = '0'
        this.flag = true
        return true;
      } else {
        this.flag = true
        return true;
      }
    },
    serviceName () {
      if (!this.formInline.name) {
        this.$message.error('请把服务名称填写完整')
      }
      if (this.formInline.name.length > 9) {
        this.$message.error('服务名称不超过10个字')
      }
    },
    serviceSort () {
      let reg = /^(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/;
      let num = /^(?:0|\-?[1-9]\d*)$/;
      if (isNaN(this.formInline.sort)) {
        this.$message.error('排序必须是数字')
      } else if (this.formInline.sort == 0) {
        this.$message.error('排序必须大于零')
      } else if (!reg.test(this.formInline.sort)) {
        this.$message.error('排序不能是负数')
      } else if (this.formInline.sort == '') {
        this.$message.error('排序不能为汉字')
      } else if (!num.test(this.formInline.sort)) {
        this.$message.error('排序不能是小数')
      }
    },
    serviceSummary () {
      if (!this.formInline.summary) {
        this.$message.error('服务简介不能为空')
      }
      if (this.formInline.summary.length > 29) {
        this.$message.error('服务简介不超过30个字')
      }
    },
    servicePrice () {
      let $price = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/;
      if (this.formInline.isStandard == 1) {
        if (!$price.test(this.formInline.price)) {
          this.$message.error('请填写正确的价格')
        }
      }
    },
    // 获取一级分类
    onelist () {
      skuApi.getOneClass({page: 1, limit: 100})
        .then(data => {
          if (data.code === 300000) {
            this.oneOptions = data.data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 新增spu服务细目
    newserviceDetails () {
      if (this.formInline.serviceDetails.length == 0) {
        this.formInline.serviceDetails.push({
          name: '',
          isRequired: '',
          period: '',
          isPeriodModifiable: '',
          outputs: [{
            name: '',
            isRequired: '',
            num: '',
            isNumModifiable: ''
          }]
        })
      } else {
        let opt = this.formInline.serviceDetails.length - 1
        let name = this.formInline.serviceDetails[opt].name
        let isRequired = this.formInline.serviceDetails[opt].isRequired
        let period = this.formInline.serviceDetails[opt].period
        let isPeriodModifiable = this.formInline.serviceDetails[opt].isPeriodModifiable
        let reg = /\S/;
        if (!reg.test(name)) {
          this.$message.error('新增失败！请将已有服务细目补充完成后，再进行添加。')
          return false
        } else if (!reg.test(isRequired)) {
          this.$message.error('新增失败！请将已有服务细目补充完成后，再进行添加。')
          return false
        } else if (!reg.test(period)) {
          this.$message.error('新增失败！请将已有服务细目补充完成后，再进行添加。')
          return false
        } else if (!reg.test(isPeriodModifiable)) {
          this.$message.error('新增失败！请将已有服务细目补充完成后，再进行添加。')
          return false
        } else {
          this.formInline.serviceDetails.push({
            name: '',
            isRequired: '',
            period: '',
            isPeriodModifiable: '',
            outputs: [{
              name: '',
              isRequired: '',
              num: '',
              isNumModifiable: ''
            }]
          })
        }
      }
    },
    // spu服务人员
    newServicePersonnel () {
      if (this.formInline.participants.length == 0) {
        this.formInline.participants.push({
          attendantTypeId: '',
          isRequired: '',
          peopleNum: '',
          isNumModifiable: ''
        })
      } else {
        let opt = (this.formInline.participants.length) - 1
        let attendantTypeId = this.formInline.participants[opt].attendantTypeId
        let isRequired = this.formInline.participants[opt].isRequired
        let peopleNum = this.formInline.participants[opt].peopleNum
        let isNumModifiable = this.formInline.participants[opt].isNumModifiable
        let reg = /\S/;
        if (!reg.test(attendantTypeId)) {
          this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
          return false
        } else if (!reg.test(isRequired)) {
          this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
          return false
        } else if (!reg.test(peopleNum)) {
          this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
          return false
        } else if (!reg.test(isNumModifiable)) {
          this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
          return false
        } else {
          this.formInline.participants.push({
            attendantTypeId: '',
            isRequired: '',
            peopleNum: '',
            isNumModifiable: ''
          })
        }
      }
    },

    // spu产出物
    addserviceDetails (index1) {
      this.formInline.serviceDetails[index1].outputs.push({
        name: '',
        isRequired: '',
        num: '',
        isNumModifiable: ''
      })
    },
    // 预览
    previewQuillEdit (value, index) {
      if (value == 1) {
        this.previewlog.content = this.tableData3.intro
      } else {
        this.previewlog.content = this.tableData3.skus[index].intro
      }
      this.previewlog.dialogVisible = true
    },
    // 删除sku产出物
    deletingSku (index1, index2) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.formInline.serviceDetails[index1].outputs.splice(index2, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 删除服务细目
    deletingSPU (index) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.formInline.serviceDetails.splice(index, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 删除服务人员
    deletingSP (index) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.formInline.participants.splice(index, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 获取服务人列表
    attendantsName () {
      skuApi.getattendants({})
        .then(data => {
          if (data.code === 300000) {
            this.attendants = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 获取一级分类
    aName () {
      skuApi.attributesService({})
        .then(data => {
          if (data.code === 300000) {
            this.attributeName = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 获取子分类
    clide (value, index) {
      skuApi.getTwoclassification(value, {})
        .then(data => {
          if (data.code === 300000) {
            if (data.data.length == 0) {
              this.$confirm('当前没有子分类确定去创建子分类吗？', {
                dangerouslyUseHTMLString: true,
                center: true,
                type: 'warning'
              }).then(() => {
                this.$router.push('/classification')
                  .catch(err => { this.$message.error(err) })
              }).catch(() => {
                // 取消
              })
            } else {
              if (index == 1) {
                this.twoOptions = ''
                this.twoOptions = data.data
              }
              if (index == 2) {
                this.formInline.categoryId = ''
                this.threeOptions = data.data
              }
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 获取二级分类
    changeShop (value) {
      this.formInline.categoryId = ''
      this.Id.secondCategoryId = ''
      let index = 1
      this.clide(value, index)
    },
    // 获取三级分类
    changeOneSelect (value) {
      this.formInline.categoryId = ''
      let index = 2
      this.clide(value, index)
    },
    // 删除属性类型
    deleteType (index) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.formInline.attributes.splice(index, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 删除属性值
    deleteVlues (index, index1) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.formInline.attributes[index].values.splice(index1, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 创建spu需要的id
    webservice () {
      skuApi.addSpus(this.formInline)
        .then(data => {
          if (data.code === 300000) {
            this.paramsId = data.data.id
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 编辑服务明细
    editorService () {
      this.establish()
      if (this.flag) {
        if (this.paramsId != 0) {
          this.dialog.dialogVisible = true
        } else {
          this.webservice()
          this.dialog.dialogVisible = true
        }
      }
    },
    // 编辑sku的细目
    editorsku (id) {
      this.establish()
      if (this.flag) {
        this.skuID = id
        let newObj = deepClone(this.formInline);
        skuApi.putDetailsService(this.paramsId, newObj)
          .then(data => {
            if (data.code === 300000) {
              skuApi.getDetails(id, {})
                .then(data => {
                  if (data.code === 300000) {
                    this.editattributes.dialogVisible = true
                    this.editservice = data.data
                    if (this.editservice.serviceDetails == 0) {
                      this.editservice.serviceDetails.push({
                        name: '',
                        isRequired: 1,
                        period: '',
                        isPeriodModifiable: 1,
                        outputs: [{
                          name: '',
                          isRequired: 1,
                          num: '',
                          isNumModifiable: 1
                        }]
                      })
                    }
                    if (this.editservice.participants.length == 0) {
                      //  参与人员
                      this.editservice.participants.push({
                        attendantTypeId: '',
                        isRequired: 1,
                        peopleNum: '',
                        isNumModifiable: 1
                      })
                    }
                  } else {
                    this.$message.error(data.msg)
                  }
                })
                .catch(err => { this.$message.error(err) })
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }
      function deepClone (currobj) {
        var newobj;
        if (typeof currobj !== 'object') {
          return currobj;
        }
        if (currobj instanceof Array) {
          newobj = [];
        } else {
          newobj = {}
        }
        for (var key in currobj) {
          if (typeof currobj[key] !== 'object' && key != 'id') {
            // 不是引用类型，则复制值
            newobj[key] = currobj[key];
          } else if (key != 'id') {
            // 引用类型，则递归遍历复制对象
            newobj[key] = deepClone(currobj[key])
          }
        }
        return newobj
      }
    },
    // 编辑SKU明细弹窗
    subeditattributesSKU (sku) {
      if (this.editservice.serviceDetails.length === 0 || this.editservice.participants.length === 0) {
        this.$message.error('服务细目，负责人不能少于一项')
        return false
      } else {
        skuApi.postDetails(this.skuID, sku, {serviceDetails: this.editservice.serviceDetails, participants: this.editservice.participants})
          .then(data => {
            if (data.code === 300000) {
              this.$message.success('创建成功')
              this.editattributes.dialogVisible = false
              this.getlist()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }
    },
    // 编辑SPU明细弹窗
    subeditattributesSPU (spu) {
      if (this.formInline.serviceDetails.length === 0 || this.formInline.participants.length === 0) {
        this.$message.error('服务细目，负责人不能少于一项')
        return false
      } else {
        skuApi.postDetails(this.paramsId, spu, {serviceDetails: this.formInline.serviceDetails, participants: this.formInline.participants})
          .then(data => {
            if (data.code === 300000) {
              this.$message.success('创建成功')
              this.dialog.dialogVisible = false
              this.fpatType = true
              this.getlist()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }
    },
    // 删除sku产出物
    deletingAttributesSPUOutput (index1, index2) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.editservice.serviceDetails[index1].outputs.splice(index2, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 删除服务细目
    deletingAttributesSPU (index) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.editservice.serviceDetails.splice(index, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    // 删除服务人员
    deletingAttributesSKU (index) {
      this.$confirm('删除后点击确认按钮保存才能生效哦', {
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        this.editservice.participants.splice(index, 1)
      }).catch(() => {
        this.$message.error('取消成功')
      })
    },
    attributeDimension (row) {
      console.log(row)
    },
    // 添加属性类型
    addAttributeType () {
      this.establish()
      if (this.flag) {
        if (this.formInline.attributes.length == 0) {
          this.formInline.attributes.push({
            value: '',
            values: [{
              value: '',
              id: '',
              summary: ''
            }]
          })
        } else {
          let leg = this.formInline.attributes.length
          if (this.formInline.attributes[leg - 1].id) {
            this.formInline.attributes.push({
              value: '',
              values: [{
                value: '',
                id: '',
                summary: ''
              }]
            })
          } else {
            this.$message.error('请把数据填写完整')
          }
        }
      }
    },
    // 提交属性设置
    determine () {
      this.establish()
      if (this.flag) {
        if (this.paramsId != 0) {
          this.$confirm('确定提交就不能修改添加属性类型？', {
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            let arr = []
            this.formInline.attributes.forEach(function (v) {
              v.values.forEach(function (v1) {
                if (v1.id) {
                  let obj = {};
                  obj.id = v1.id;
                  obj.summary = v1.summary;
                  arr.push(obj);
                }
              })
            })
            skuApi.determine({valueList: arr, spuId: this.paramsId})
              .then(data => {
                if (data.code === 300000) {
                  this.$message.success('创建成功')
                  this.classificationV2 = true
                  this.getlist()
                } else {
                  this.$message.error(data.msg)
                }
              })
              .catch(err => { this.$message.error(err) })
          }).catch(() => {
            this.$message.error('取消成功')
          })
        } else {
          this.webservice()
        }
      }
    },
    // 非标准定价
    standardPricing (index) {
      if (index === 0) {
        this.Id.disabledInput = true
      }
      if (index === 1) {
        this.Id.disabledInput = false
      }
    },
    // 添加属性值
    addType (index, id) {
      this.establish()
      if (this.flag) {
        let arr = this.formInline.attributes[index].values.length
        if (id) {
          if (arr == 0) {
            this.formInline.attributes[index].values.push({
              value: '',
              summary: '',
              id: ''
            })
          } else {
            if (this.formInline.attributes[index].values[arr - 1].value) {
              this.formInline.attributes[index].values.push({
                value: '',
                summary: '',
                id: ''
              })
            } else {
              this.$message.error('请输入属性名称')
            }
          }
        } else {
          this.$message.error('请选择属性名称')
        }
      }
    },
    // 在 Input 失去焦点时触发 blur
    postattributeValue (index, index1, id, name) {
      if (!name) {
        this.$message.error('服务名称不能为空')
      } else if (name.length > 9) {
        this.$message.error('服务名称不超过10个字')
      } else {
        if (id && name) {
          let myObject = {
            attr_id: id,
            value: name
          }
          skuApi.attributesServicevalues(Object.assign(myObject))
            .then(data => {
              if (data.code === 300000) {
                this.formInline.attributes[index].values[index1].id = data.data.id
                this.$message.success('创建成功')
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => { this.$message.error(err) })
        } else {
          this.$message.error('属性名称和属性值不能为空')
        }
      }
    },
    postattributeSmmary (name) {
      if (!name) {
        this.$message.error('属性值简介不能为空')
      }
      if (name.length > 29) {
        this.$message.error('属性值简介不超过30个字')
      }
    },
    // 设置服务介绍
    changeHandler (value) {
      if (value === 0) {
        this.grade = false
      }
      if (value === 1) {
        this.grade = true
      }
    },
    // 重置验证的表单
    subOrEdit () {
      this.dialog.dialogVisible = false
      this.contentlist = true
    },
    // SKU编辑服务明细
    editSkusServiceDetails () {
      if (this.editservice.serviceDetails.length == 0) {
        this.editservice.serviceDetails.push({
          name: '',
          isRequired: '',
          period: '',
          isPeriodModifiable: '',
          outputs: [{
            name: '',
            isRequired: '',
            num: '',
            isNumModifiable: ''
          }]
        })
      } else {
        let opt = this.editservice.serviceDetails.length - 1
        if (opt != -1) {
          let name = this.editservice.serviceDetails[opt].name
          let isRequired = this.editservice.serviceDetails[opt].isRequired
          let period = this.editservice.serviceDetails[opt].period
          let isNumModifiable = this.editservice.serviceDetails[opt].isPeriodModifiable
          let reg = /\S/;
          if (!reg.test(name)) {
            this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
            return false
          } else if (!reg.test(isRequired)) {
            this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
            return false
          } else if (!reg.test(period)) {
            this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
            return false
          } else if (!reg.test(isNumModifiable)) {
            this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
            return false
          } else {
            this.editservice.serviceDetails.push({
              name: '',
              isRequired: '',
              period: '',
              isPeriodModifiable: '',
              outputs: [{
                name: '',
                isRequired: '',
                num: '',
                isNumModifiable: ''
              }]
            })
          }
        }
      }
    },
    // 编辑sku下面的产出物
    addSkusserviceDetails (index1) {
      this.editservice.serviceDetails[index1].outputs.push({
        name: '',
        isRequired: '',
        num: '',
        isNumModifiable: ''
      })
    },
    // 编辑skus服务人员
    editSkusServicePersonnel () {
      if (this.attendants.length == this.editservice.participants.length) {
        this.$message.error('新增失败，超出服务数量')
      } else {
        if (this.editservice.participants.length == 0) {
          this.editservice.participants.push({
            attendantTypeId: '',
            isRequired: '',
            peopleNum: '',
            isNumModifiable: ''
          })
        } else {
          this.editservice.participants.forEach((o) => {
            if (!o.attendantTypeId || !o.isRequired || !o.peopleNum || !o.isNumModifiable) {
              this.$message.error('新增失败！请将已有负责人补充完成后，再进行添加。')
            } else {
              this.editservice.participants.push({
                attendantTypeId: '',
                isRequired: '',
                peopleNum: '',
                isNumModifiable: ''
              })
            }
          })
        }
      }
    },
    // 添加服务编辑
    editorServiceQuillEdit (value) {
      this.servedialog.dialogVisible = true
    },
    // 富文本编辑器
    getEditContent (content) {
      this.servedialog.content = content
    },
    // 重置验证的表单
    resetForm () {
      this.dialog.dialogVisible = false
    },
    // 保存，设置服务介绍
    onSubmit () {
      this.establish()
      if (this.flag) {
        let newObj = deepClone(this.formInline);
        skuApi.getChecking(this.paramsId, {})
          .then(data => {
            if (data.code === 300000) {
              skuApi.putDetailsService(this.paramsId, newObj)
                .then(data => {
                  if (data.code === 300000) {
                    if (this.formInline.skus.length != 0) {
                      let mySkusPrice = []
                      this.formInline.skus.forEach(function (v) {
                        mySkusPrice.push({
                          id: v.id,
                          isStandard: v.isStandard,
                          price: v.price
                        })
                      })
                      skuApi.putPriceValue({skus: Object.assign(mySkusPrice)})
                        .then(data => {
                          if (data.code === 300000) {
                            this.isSubmit = true
                            this.$message.success('操作成功')
                            window.location.href = '/service'
                          } else {
                            this.$message.error(data.msg)
                          }
                        })
                        .catch(err => { this.$message.error(err) })
                    } else {
                      this.isSubmit = true
                      this.$router.push('/service')
                    }
                  } else {
                    this.$message.error(data.msg)
                  }
                })
                .catch(err => { this.$message.error(err) })
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(err => { this.$message.error(err) })
      }
      function deepClone (currobj) {
        var newobj;
        if (typeof currobj !== 'object') {
          return currobj;
        }
        if (currobj instanceof Array) {
          newobj = [];
        } else {
          newobj = {}
        }
        for (var key in currobj) {
          if (typeof currobj[key] !== 'object' && key != 'id') {
            // 不是引用类型，则复制值
            newobj[key] = currobj[key];
          } else if (key != 'id') {
            // 引用类型，则递归遍历复制对象
            newobj[key] = deepClone(currobj[key])
          }
        }
        return newobj
      }
    },
    // sku上架下架接口
    handleClick (id, st) {
      let status = st
      if (st == '1') {
        status = 2
      } else {
        status = 1
      }
      skuApi.putStatusServiceSku(id, {status: status})
        .then(data => {
          if (data.code === 300000) {
            this.$message.success('操作成功')
            this.getlist()
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    uploadImageurl (type) {
      this.fileList = {}
      this.uploadType = type
      this.dialogUploadVisible = true
    },
    uploadSuccess (res) {
      if (res.code === 0) {
        let url = res.file_url
        let name = ''
        this.fileList = {
          name: name,
          url: url
        }
        if (this.uploadType == 0) {
          this.formInline.cover = url
        } else {
          this.formInline.cover = url
        }
      }
    },
    enterUpload () {
      this.dialogUploadVisible = false
    }
  }
};
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  input{
    border-radius: 4px;
    text-indent: 10px;
  }
  .tableData1{
    padding-top: 10px;
    padding-bottom: 10px;
    span{
      &:nth-child(1){
        width: 95px;
      }
      &:nth-child(2){
        width: 129px;
      }
      &:nth-child(4){
        width: 90px;
        margin-left: 5px;
      }
      &:nth-child(4){
        width: 113px;
        margin-left: 2px;
      }
      &:nth-child(5){
        width: 500px;
      }
      font-size: 14px;

      text-align: center;
      display: inline-block;
    }
  }
  .tableData3{
    span{
      &:nth-child(1){
        width: 94px;
      }
      &:nth-child(2){
        width: 95px;
      }
      &:nth-child(3){
        width: 95px;
      }
      &:nth-child(4){
        width: 90px;
        margin-left: 5px;
      }
      font-size: 14px;

      text-align: center;
      display: inline-block;
    }
  }
  .serialNumber{
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    height: 38px;
    margin-right:5px;
    display: inline-block;
    width: 50px;
    text-align: center;
  }
  .tableData2{
    padding-left: 23px;
    padding-top: 10px;
    padding-bottom: 10px;
    span{
      font-size: 14px;
      width: 125px;
      text-align: center;
      display: inline-block;
    }
  }
  .service-details{
    input{
      height: 37px;
      border: 1px solid #dcdfe6;
    }
  }
</style>
