<template>
  <div class="qsWrapper">
    <el-form ref="form" :model="questionForm" label-width="120px" style="width:50%;">
      <el-form-item label="请输入问卷名称">
        <el-input v-model="questionForm.name" @blur="createQuestionAjax"></el-input>
      </el-form-item>
    </el-form>
    <template v-for="(list, index) in questionList">
      <div class="questionWrapper" :key="list.id" v-loading="list.loading">
        <!-- 覆盖层 禁止编辑 -->
        <div class="questionMark" @click="editTips" v-show="!list.isEdit"></div>
        <div class="editBtn">
          <el-button @click="questionEdit(index, $event)" v-text="list.isEdit ? '完成编辑' : '编辑'"></el-button>
        </div>
        <el-row style="margin-top:20px;">
          <el-col :span="8">
            <div class="editBox">
              <edit-tool :editContent="list.content" @retContent="(content, i) => getEditContent(content, index)"></edit-tool>
            </div>
          </el-col>
          <el-col :span="2" style="margin:0 10px;">
            <el-select v-model="list.optionValue" v-bind:disabled="list.questionId != ''"  @change="(i, dex)=>selectChange(i, index)" placeholder="单选题">
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" v-if="list.optionValue !=4" style="margin:0 10px;">
            <el-button :type="list.randomType"  v-model="list.random_answers_order"  @click="randomSwitch(index)">选项随机</el-button>
          </el-col>
          <el-col :span="2"  style="margin:0 10px;">
            <el-input v-model="list.questionOrder" placeholder="编辑序号"></el-input>
          </el-col>
          <el-col :span="2"  style="margin:0 10px;">
            <el-select v-model="list.optionTypeValue" placeholder="请选择" v-if="list.optionValue !=4">
              <el-option
                      v-for="item in optionsType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" style="margin:0 10px;">
            <el-button @click="deleteQuestion(index)" type="danger" size="small" v-permission="'v1.qnr.question.delete'">删除题目</el-button>
          </el-col>
        </el-row>
        <!-- 选项类型  单选 -->
        <template v-for="(item, singleIndex) in list.fillList" v-if="list.optionValue == 0 || list.optionValue == ''">
          <el-row style="line-height:34px;" :key="item.id">
            <el-col :span="8">
              <el-input v-model="item.input" :placeholder="createOptionName(singleIndex)">{{ singleIndex }}</el-input>
            </el-col>
            <el-col :span="1" style="margin:0 5px;">
              <!-- <i :class="item.isLock ? 'el-icon-check' : 'el-icon-close'"></i> -->
              <i class="lock" title="选项固定" :class="item.isLock ? 'lockIcon' : 'unLockIcon'" @click="lockSwitch(index, singleIndex)"></i>
            </el-col>
            <input type="hidden" v-model="list.optionTypeValue">
            <el-col :span="1"  v-if="list.optionTypeValue=='选项文字'">
              <input type="hidden" v-model="list.optionTypeValue">
            </el-col>
            <el-col :span="1" v-if="list.optionTypeValue=='选项图文'|| list.optionTypeValue==1">
              <input type="hidden" v-model="list.optionTypeValue">
              <i title="点击选择图片" class="el-icon-picture-outline" @click="uploadTitleImg(index, singleIndex, 0)"></i>
            </el-col>
            <el-col :span="3">
              <span @click="jumpFn(index, singleIndex, item.option_id)">
                <span v-if="item.next_question">
                  <el-button type="primary" class="el-icon-tiaozhuan"> {{item.next_question=='不跳转' ? '不跳转' : "跳转（"+(item.next_question)+"）"}}</el-button>
                   <input type="hidden" v-model="item.nextQuestionId">
                </span>
                <span v-if="!item.next_question">
                   <span v-if="item.next_question=='不跳转'">
                      <el-button type="primary" class="el-icon-tiaozhuan">不跳转</el-button>
                       </span>
                       <span v-if="item.next_question==''">
                          <el-button type="primary" class="el-icon-tiaozhuan">不跳转</el-button>
                       </span>
                   <input type="hidden" v-model="item.nextQuestionId">
                </span>
              </span>
            </el-col>
            <!-- <el-col :span="3">
               <el-popover trigger="hover" placement="top">
                 <template v-for="(tag, tagIndex) in item.tags">
                   <p :key="tagIndex">{{tag}} <i class="el-icon-delete" @click="deleteTag(tagIndex, singleIndex, index)"></i></p>
                 </template>
                 <div slot="reference" class="name-wrapper">
                   <span class="fl">标签</span>
                 </div>
               </el-popover>
               <div class="fl mgl10">
                 <tag-tree @tagValue="(value, i, j) => getTreeValue(value ,index, singleIndex)"></tag-tree>
               </div>
             </el-col>-->
            <el-col :span="2">
              <el-checkbox :value="item.isFill" @change="item.isFill =! item.isFill">允许填空</el-checkbox>
            </el-col>
            <el-col :span="1"  v-if="list.optionTypeValue=='选项文字'">
              <input type="hidden" v-model="list.optionTypeValue">
            </el-col>
            <el-col :span="3" v-if="list.optionTypeValue=='选项图文'|| list.optionTypeValue==1" v-show="item.miniImg.type">
              <img class="miniImage" :src="item.miniImg.url" v-show="item.miniImg.url != ''" width="100" height="60" @click="lockminiImage(item.miniImg.url)">
              <i class="el-icon-delete deleteIcon" v-show="item.miniImg.url != ''" @click="deleteMiniImg(index, singleIndex, 0)"></i>
            </el-col>
            <el-col :span="2" style="margin-left: 20px">
              <el-button @click="handleTypeHot(index, singleIndex, item.option_id)" v-permission="'v1.qnr.option.delete'" type="danger" size="small">删除</el-button>
            </el-col>
          </el-row>
        </template>
        <!-- 选项类型  多选 -->
        <template v-for="(item, MultipleIndex) in list.fillList" v-if="list.optionValue == 1">
          <el-row style="line-height:34px;" :key="item.id">
            <el-col :span="8">
              <el-input v-model="item.input" :placeholder="createOptionName(MultipleIndex)">{{ MultipleIndex }}</el-input>
            </el-col>
            <el-col :span="1" style="margin:0 5px;">
              <!-- <i :class="item.isLock ? 'el-icon-check' : 'el-icon-close'"></i> -->
              <i class="lock" title="选项固定" :class="item.isLock ? 'lockIcon' : 'unLockIcon'" @click="lockSwitch(index, MultipleIndex)"></i>
            </el-col>
            <input type="hidden" v-model="list.optionTypeValue">
            <el-col :span="1"  v-if="list.optionTypeValue=='选项文字'">
              <input type="hidden" v-model="list.optionTypeValue">
            </el-col>
            <el-col :span="3" v-if="list.optionTypeValue=='选项图文'|| list.optionTypeValue==1">
              <input type="hidden" v-model="list.optionTypeValue">
              <i title="点击选择图片" class="el-icon-picture-outline" @click="uploadTitleImg(index, MultipleIndex, 0)"></i>
            </el-col>
            <el-col :span="3">
              <span @click="jumpFn(index, MultipleIndex, item.option_id)">
                <span v-if="item.next_question">
                  <el-button type="primary" class="el-icon-tiaozhuan"> {{item.next_question=='不跳转' ? '不跳转' : "跳转（"+(item.next_question)+"）"}}</el-button>
                   <input type="hidden" v-model="item.nextQuestionId">
                </span>
                <span v-if="!item.next_question">
                   <span v-if="item.next_question=='不跳转'">
                      <el-button type="primary" class="el-icon-tiaozhuan">不跳转</el-button>
                       </span>
                       <span v-if="item.next_question==''">
                          <el-button type="primary" class="el-icon-tiaozhuan">不跳转</el-button>
                       </span>
                   <input type="hidden" v-model="item.nextQuestionId">
                </span>
              </span>
            </el-col>
            <!--  <el-col :span="3">
                <el-popover trigger="hover" placement="top">
                  <template v-for="(tag, tagIndex) in item.tags">
                    <p :key="tagIndex">{{tag}} <i class="el-icon-delete" @click="deleteTag(tagIndex, MultipleIndex, index)"></i></p>
                  </template>
                  <div slot="reference" class="name-wrapper">
                    <span class="fl">标签</span>
                  </div>
                </el-popover>
                &lt;!&ndash; <div class="fl">标签</div> &ndash;&gt;
                <div class="fl mgl10">
                  <tag-tree @tagValue="(value, i, j) => getTreeValue(value ,index, MultipleIndex)"></tag-tree>
                </div>
              </el-col>-->
            <el-col :span="2" style="margin-left: 20px">
              <el-checkbox :value="item.isFill" @change="item.isFill =! item.isFill">允许填空</el-checkbox>
            </el-col>
            <el-col :span="1" style="margin-left: 20px">
              <el-checkbox :value="item.isMutex" @change="item.isMutex =! item.isMutex">互斥</el-checkbox>
            </el-col>
            <el-col :span="1" style="margin-left: 20px"  v-if="list.optionTypeValue=='选项文字'">
              <input type="hidden" v-model="list.optionTypeValue">
            </el-col>
            <el-col :span="3" style="margin-left: 20px" v-if="list.optionTypeValue=='选项图文'|| list.optionTypeValue==1" v-show="item.miniImg.type">
              <img class="miniImage" :src="item.miniImg.url" v-show="item.miniImg.url != ''" width="100" height="60" @click="lockminiImage(item.miniImg.url)">
              <i class="el-icon-delete deleteIcon" v-show="item.miniImg.url != ''" @click="deleteMiniImg(index, MultipleIndex, 0)"></i>
            </el-col>
            <el-col :span="2" style="margin-left: 20px">
              <el-button @click="handleTypeHot(index, singleIndex, item.option_id)" v-permission="'v1.qnr.option.delete'" type="danger" size="small">删除</el-button>
            </el-col>
          </el-row>
        </template>
        <!-- 矩阵单选题 多选 -->
        <template v-if="list.optionValue == 2 || list.optionValue == 3">
          <el-table
                  :data="list.tabList"
                  border>
            <!-- 表格第一列 -->
            <el-table-column
                    width="260">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{scope.row.opt}}</p>l
                  <div slot="reference" class="name-wrapper">
                    <el-input v-model="scope.row.opt" size="mini" style="width:80px;float:left;"></el-input>
                  </div>
                </el-popover>
                <div  v-if="list.optionTypeValue=='选项文字'">
                  <input type="hidden" title="ddddddddddd" v-model="list.optionTypeValue">
                </div>
                <div v-if="list.optionTypeValue=='选项图文'|| list.optionTypeValue==1">
                     <span class="el-icon-picture-outline tableImgStyle fl"
                           v-if="!scope.row.miniImg.url"
                           @click="uploadTitleImg(index, scope.$index, 1)" title="2222222"></span>
                  <div class="minImage">
                    <img :src="scope.row.miniImg.url" width="100" height="60" style="margin:6px 0 0 3px; cursor: pointer" alt="" @click="lockminiImage(scope.row.miniImg.url)">
                    <i class="el-icon-delete" style="cursor: pointer"  @click="deleteMiniImg(index, scope.$index, 1)"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 表格内容列 -->
            <template v-for="(col, colIndex) in list.cols" v-if="colIndex > 0">
              <el-table-column
                      :key="colIndex"
                      :prop="col.prop"
                      :label="col.laber"
                      :render-header="(h,obj,i) => renderHeader(h,obj,index)"
                      width="150">
                <template slot-scope="scope">
                  <el-button>
                    <!-- <el-popover trigger="hover" placement="top">
                       <template v-for="(tag, tagIndex) in scope.row[col.prop].tags">
                         <p :key="tagIndex">{{tag}} <i class="el-icon-delete" @click="deleteTag(tagIndex, col.prop, scope.$index, index)"></i></p>
                       </template>
                       <div slot="reference" class="name-wrapper">
                         <span>标签</span>
                       </div>
                     </el-popover>-->
                    <!-- <span>{{scope.row[col.prop].name}} <i class="el-icon-delete" v-show="scope.row[col.prop].status" @click="deleteTag(scope.$index, col.prop)"></i></span> -->
                    <tag-tree :tree-position="scope" @tagValue="(value, i) => getTreeValue(value ,index)"></tag-tree>
                    <div v-if="list.optionValue == 3">
                      <!-- 动态添加的 el-checkbox v-model失效  采用@change事件代替 -->
                      <el-checkbox :value="scope.row[col.prop].isMutex" @change="scope.row[col.prop].isMutex = !scope.row[col.prop].isMutex">互斥</el-checkbox>
                    </div>
                  </el-button>
                </template>
              </el-table-column>
            </template>
            <!-- 表格末尾列 -->
            <el-table-column
                    :render-header="(h,obj,i) => renderLastHeader(h,obj,index)"
                    width="200">
            </el-table-column>
            <!-- 表格末尾行 -->
            <div slot="append">
              <el-button type="primary" size="small" style="margin-right: 20px;">
                <i class="el-icon-plus" @click="addRowOption(index)"></i>
              </el-button>
              <el-button type="primary" size="small">
                <i class="el-icon-plus" @click="addRowOptions(index)">批量添加选项</i>
              </el-button>
            </div>
          </el-table>
        </template>
        <template v-if="list.optionValue == 4">
          <div class="fillType">
            <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入内容"
                    v-model="list.fillArea.textarea">
            </el-input>
          </div>
          <div class="fillTagTree">
            <el-popover trigger="hover" placement="top">
              <template v-for="(tag, tagIndex) in list.fillArea.tags">
                <p :key="tagIndex">{{tag}} <i class="el-icon-delete" @click="deleteTag(tagIndex, index)"></i></p>
              </template>
              <div slot="reference" class="name-wrapper">
                <span class="mgl10">标签</span>
              </div>
            </el-popover>
            <tag-tree @tagValue="(value, i) => getTreeValue(value ,index)"></tag-tree>
          </div>
        </template>
        <el-row :key="index" v-if="list.optionValue == 0 || list.optionValue == '' || list.optionValue == 1">
          <el-col :span="2" style="margin-right: 20px;">
            <el-button type="primary" @click="addOption(index)"> <i class="el-icon-plus"></i></el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addOptions(index)"> <i class="el-icon-plus">批量添加选项</i></el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-row></el-row>
    <el-row>
      <el-button type="primary"  v-permission="'v1.qnr.question.create'" @click="addQuestion">新增题目</el-button>
      <!-- <el-button type="primary" @click="submitQuestion">提交</el-button> -->
    </el-row>
    <el-dialog :visible.sync="dialogTableVisible" title="选择跳转题目">
      <el-table :data="selectData" border index>
        <el-table-column property="index" label="序号"></el-table-column>
        <el-table-column property="value" label="题目内容"></el-table-column>
        <el-table-column property="order" label="排序"></el-table-column>
        <el-table-column property="type" label="题目类型"></el-table-column>
        <!-- <el-table-column property="isFill" label="是否必填"></el-table-column> -->
        <el-table-column property="time" label="发布日期" width="200"></el-table-column>
        <el-table-column
                label="操作"
                width="300">
          <template slot-scope="scope">
            <el-button @click="handleJump(scope.row)" size="mini">{{ btnTypeFun(scope.row.btnType) }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddOptionsVisible" style="width:50%;margin:0 auto;">
      <div class="fl jumpBtn">跳转</div>
      <textarea class="addOptionsContent" v-model="textAreaValue" placeholder="每行一个选项，可导入多个选项"></textarea>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOptionsVisible = false">取 消</el-button>
        <el-button @click="submitAddOptions">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="点击选择图片" style="width:40%;margin:0 auto" :visible.sync="dialogUploadVisible"  :close-on-click-modal="false">
      <img :src="fileList.url" style="width:100px;height:100px" alt="">
      <upload-file :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="false" @urlCB="uploadSuccess" :isCover="true"></upload-file>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterUpload"  v-bind:disabled='classificationV'>确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
            :title="editattributes.title"
            :visible.sync="editattributes.dialogVisible"
            v-loading="editattributes.loading"
            :close-on-click-modal="false"
    >
      <div style="text-align: center;    width: 100%;">
        <img :src="editattributes.url" style="    width: 100%;">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import editTool from '@/components/QuillEdit/quillEdit'
import tagTree from './TagTree'
import uploadFile from '@/components/Upload/upload'
import * as api from '@/api/questionaire/questionaire'
import uuid from '@/utils/uuid'

export default {
  name: 'QuestionCreate',
  data () {
    return {
      editattributes: {
        title: '查看大图',
        dialogVisible: false,
        url: '',
        loading: false
      },
      questionForm: {
        name: ''
      },
      cloneList: {},
      iNow: 0,
      fileList: {},
      questionList: [
        {
          id: uuid(),
          questionId: '', // 问题id
          content: '',
          loading: false,
          optionValue: '', // 题目类型
          questionOrder: '',
          optionTypeValue: '0', // 选项图文 or 文本
          randomType: '',
          random_answers_order: '0',
          isEdit: false, // 是否可编辑
          fillList: [
            {
              id: uuid(),
              option_id: '', // 后端返回的选项id
              isLock: false,
              isFill: false,
              isMutex: false,
              nextQuestionId: '', // 选项跳转的id
              next_question: '', // 选项跳转的题号
              input: '',
              tags: [],
              miniImg: {
                type: true,
                url: ''
              }
            },
            {
              id: uuid(),
              option_id: '',
              isLock: false,
              isFill: false,
              isMutex: false,
              nextQuestionId: '',
              next_question: '',
              input: '',
              tags: [],
              miniImg: {
                type: true,
                url: ''
              }
            }
          ],
          tabList: [
            {
              id: uuid(),
              subQuestionId: '',
              miniImg: {
                type: true,
                url: ''
              },
              opt: '题目1',
              opt1: {
                tags: ['2', '1'],
                miniImg: '',
                isMutex: false
              },
              opt2: {
                tags: ['1', '2'],
                miniImg: '',
                isMutex: false
              },
              opt3: {
                tags: ['1', '2'],
                miniImg: '',
                isMutex: false
              }
            },
            {
              id: uuid(),
              subQuestionId: '',
              miniImg: {
                type: true,
                url: ''
              },
              opt: '题目2',
              opt1: {
                tags: ['2', '1'],
                miniImg: '',
                isMutex: false
              },
              opt2: {
                tags: ['1', '2'],
                miniImg: '',
                isMutex: false
              },
              opt3: {
                tags: ['1', '2'],
                miniImg: '',
                isMutex: false
              }
            },
            {
              id: uuid(),
              subQuestionId: '',
              miniImg: {
                type: true,
                url: ''
              },
              opt: '题目3',
              opt1: {
                tags: ['2', '1'],
                miniImg: '',
                isMutex: false
              },
              opt2: {
                tags: ['1', '2'],
                miniImg: '',
                isMutex: false
              },
              opt3: {
                tags: ['1', '2'],
                miniImg: '',
                isMutex: false
              }
            }
          ],
          cols: [
            {
              prop: 'opt',
              laber: ''
            },
            {
              // optionId: '',
              optionIds: [],
              prop: 'opt1',
              laber: '选项1'
            },
            {
              // optionId: '',
              optionIds: [],
              prop: 'opt2',
              laber: '选项2'
            },
            {
              // optionId: '',
              optionIds: [],
              prop: 'opt3',
              laber: '选项3'
            }
          ],
          fillArea: {
            textarea: '',
            tags: [],
            id: ''
          }
        }
      ],
      options: [
        {
          value: '0',
          label: '单选题'
        },
        {
          value: '1',
          label: '多选题'
        },
        {
          value: '2',
          label: '矩阵单选题'
        },
        {
          value: '3',
          label: '矩阵多选题'
        },
        {
          value: '4',
          label: '填空题'
        }
      ],
      optionsType: [
        {
          value: '1',
          label: '选项图文'
        },
        {
          value: '0',
          label: '选项文字'
        }
      ],
      resList: [],
      uploadIndex: {},
      uploadType: 0,
      jumpIndex: {},
      selectData: [
        {
          index: 0,
          value: '不跳转',
          order: 0,
          type: '无跳转',
          isFill: '否',
          time: '2018-04-01',
          btnType: 0,
          id: ''
        },
        {
          index: -1,
          value: '结束问卷',
          order: -1,
          type: '结束问卷',
          isFill: '否',
          time: '2018-04-01',
          btnType: 1,
          id: ''
        }
      ],
      textAreaValue: '',
      addOptionsIndex: 0, // 添加 问题的索引
      addOptionsType: 0, // 添加多个选项的类型 单选多选 0  矩阵1
      currentTableIndex: 0, // 操作当前表格的index
      dialogTableVisible: false,
      dialogAddOptionsVisible: false,
      classificationV: true,
      dialogUploadVisible: false
    }
  },
  created () {
    let id = this.$route.query.id
    let oldStorage = localStorage.getItem('qnrId')
    if (id == '' && oldStorage) {
      localStorage.setItem('qnrId', '')
    } else if (!oldStorage) {
      localStorage.setItem('qnrId', '')
    }
    this.initCreate()
  },
  methods: {
    initCreate () {
      // 判断是创建 还是编辑
      // let type = this.$route.query.type
      let id = this.$route.query.id || localStorage.getItem('qnrId')
      id = id == 'undefined' ? '' : id
      let data = {
        id
      }
      if (id == '') {
        return
      }
      this.questionList.forEach((v, i) => {
        v.loading = true
      })
      api.getQnr(data).then(res => {
        if (res.code === 300000) {
          // 重置 跳转表格
          this.selectData = Object.assign([], this.$options.data().selectData)
          let { question, title, id } = res.data
          this.questionForm.name = title
          this.questionList.length = 0
          // this.selectData = res.data.question
          localStorage.setItem('qnrId', id)
          question.forEach((v, i) => {
            // 格式化跳转列表数据
            let re = /<[^>]+>/g
            let selectObj = {
              index: i + 1,
              value: v.content,
              order: v.order,
              type: '无跳转',
              isFill: '否',
              time: v.created_at,
              btnType: 2,
              id: v.id
            }
            switch (v.question_type) {
            case 0: selectObj.type = '单选题'; break;
            case 1: selectObj.type = '多选题'; break;
            case 2: selectObj.type = '矩阵单选题'; break;
            case 3: selectObj.type = '矩阵多选题'; break;
            case 4: selectObj.type = '填空题'; break;
            }
            selectObj.value = selectObj.value.replace(re, '')
            if (question.length > 1) {
              this.selectData.push(selectObj)
            }
            // optionTypeValue: v.options_show_type== 1 ? '选项图文' : '选项文字'
            let obj = {
              id: uuid(),
              questionId: v.id,
              content: v.content,
              loading: false,
              optionValue: v.question_type.toString(),
              questionOrder: v.order,
              optionTypeValue: v.options_show_type == 1 ? '选项图文' : '选项文字',
              randomType: v.random_answers_order == 1 ? 'primary' : '',
              next_question: v.next_question,
              isEdit: false,
              fillList: [],
              tabList: [],
              cols: [{prop: 'opt', laber: ''}],
              fillArea: {}
            }
            if (v.question_type == 0 || v.question_type == 1) {
              // 单选  多选
              v.options.forEach((o, j) => {
                if (o.next_question_id == -1) {
                  o.next_question_id = -1
                }
                if (!o.next_question_id) {
                  o.next_question_id = 0
                }
                let fillObj = {
                  id: uuid(),
                  option_id: o.id,
                  isLock: o.fixed_order === 1,
                  isFill: o.option_type === 1,
                  isMutex: o.group === 1,
                  input: o.content,
                  tags: [],
                  nextQuestionId: o.next_question_id,
                  next_question: o.next_question,
                  miniImg: {
                    type: true,
                    url: o.image_url
                  }
                }
                obj.fillList.push(fillObj)
              })
            } else if (v.question_type == 2 || v.question_type == 3) {
              // 矩阵单选 矩阵多选
              if (v.sub_questions.length > 0) {
                //  异常处理 从其他数据库导入的数据可能存在编辑情况下，矩阵题目数据为空
                v.sub_questions[0].options.forEach((n, p) => {
                  let colsObj = {
                    optionIds: [],
                    prop: `opt${p + 1}`,
                    laber: n.content
                  }
                  obj.cols.push(colsObj)
                })
              }
              // 将二位数组转化成一维数组
              for (let i = 1; i < obj.cols.length; i++) {
                let tempArr = []
                for (var j = 0; j < v.sub_questions.length; j++) {
                  tempArr.push(v.sub_questions[j].options[i - 1].id)
                }
                obj.cols[i].optionIds = tempArr
              }
              v.sub_questions.forEach((o, j) => {
                let tabObj = {
                  id: uuid(),
                  subQuestionId: o.id,
                  opt: o.content,
                  miniImg: {
                    type: true,
                    url: o.image_url
                  }
                }
                o.options.forEach((n, p) => {
                  tabObj[`opt${p + 1}`] = {
                    tags: ['2', '1'],
                    miniImg: '',
                    isMutex: n.group === 1
                  }
                  // console.log(j, obj.cols.length)
                  // if (j < obj.cols.length - 1) {
                  //   obj.cols[j + 1].optionIds.push(n.id)
                  // }
                  // obj.cols[j + 1].optionIds.push(n.id)
                })
                obj.tabList.push(tabObj)
              })
              // ------------
            } else {
              if (v.options.length == 0) {
                obj.fillArea = {
                  id: '',
                  textarea: '',
                  tags: ''
                }
              } else {
                obj.fillArea = {
                  id: v.options[0].id,
                  textarea: v.options[0].content,
                  tags: v.options[0].tag
                }
              }
            }
            this.questionList.push(obj)
          })
        }
      })
      // console.log(type)
    },
    uploadSuccess (res) {
      if (res.code === 0) {
        let url = res.file_url
        let name = res.file_name
        this.fileList = {
          name: name,
          url: url
        }
        this.classificationV = false
      }
    },
    enterUpload () {
      this.classificationV = true
      let indexObject = this.uploadIndex
      let url = this.fileList.url
      // let type = this.questionList[indexObject.index].optionValue
      let obj
      if (this.uploadType == 0) {
        obj = this.questionList[indexObject.index].fillList[indexObject.rowIndex]
      } else {
        obj = this.questionList[indexObject.index].tabList[indexObject.rowIndex]
      }
      // if (type == '' || type == '1' || type == '2') {
      obj.miniImg.url = url
      // } else {

      // }
      this.dialogUploadVisible = false
    },
    selectChange (i, dex) {
      // i 选项索引  dex 问卷序号
      // console.log(i, dex)
      // 不重置公用属性，只重置列表 表格数据
      let type = this.questionList[dex].optionValue
      if (type == 0 || type == 1) {
        this.$data.questionList[dex].fillList.length = 0
        // Object.assign(this.$data.questionList[dex].fillList, this.$options.data().questionList[0].fillList)
        this.$data.questionList[dex].fillList = Object.assign([], this.$options.data().questionList[0].fillList)
      } else if (type == 4) {
        // Object.assign(this.$data.questionList[dex].fillArea, this.$options.data().questionList[0].fillArea)
        this.$data.questionList[dex].fillArea = Object.assign({}, this.$options.data().questionList[0].fillArea)
      } else {
        this.$data.questionList[dex].cols.length = 0
        this.$data.questionList[dex].tabList.length = 0
        // Object.assign(this.$data.questionList[dex].cols, this.$options.data().questionList[0].cols)
        // Object.assign(this.$data.questionList[dex].tabList, this.$options.data().questionList[0].tabList)
        this.$data.questionList[dex].cols = Object.assign([], this.$options.data().questionList[0].cols)
        this.$data.questionList[dex].tabList = Object.assign([], this.$options.data().questionList[0].tabList)
      }
      this.$data.questionList[dex].optionValue = type;
    },
    renderLastHeader (h, { column, $index }, i) {
      // 编辑最后一列的表头
      // 添加表头操作按钮 jsx写法绑定事件 onClick = {this.fn}
      return (
        <div>
          <el-button type="primary" size="small" style="margin-right: 20px;">
            <i class="el-icon-plus" key={i} data-index={i} onClick={this.addColOption}></i>
          </el-button>
          <el-button type="primary" size="small">
            <i class="el-icon-plus" key={i} data-index={i} onClick={this.addColOptions}>批量添加选项</i>
          </el-button>
        </div>
      )
    },
    renderHeader (h, { column, $index }, i) {
      // 编辑内容每一列的表头
      return (
        <el-popover trigger="hover" placement="top">
          <p>{this.questionList[i].cols[$index].laber}</p>
          <div slot="reference" class="name-wrapper">
            <el-input v-model={this.questionList[i].cols[$index].laber}></el-input>
          </div>
        </el-popover>
        // <el-input v-model={this.questionList[0].cols[$index].laber}></el-input>
      )
    },
    createOptionName (index) {
      return `选项${index + 1}`
    },
    handleTypeHot (index, rowIndex, rowid) {
      // 删除选项
      if (rowid != '') {
        this.$confirm('确定删除该选项题？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteQption({id: rowid}).then(res => {
            if (res.code === 300000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.questionList[index].fillList.splice(rowIndex, 1)
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$confirm('确定删除该选项题？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.questionList[index].fillList.splice(rowIndex, 1)
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
      }
    },
    uploadTitleImg (index, rowIndex, type) {
      // 上传图片
      this.classificationV = true
      this.uploadIndex = {
        index,
        rowIndex
      }
      this.uploadType = type
      let obj
      let indexObject = this.uploadIndex
      if (type == 0) {
        obj = this.questionList[indexObject.index].fillList[indexObject.rowIndex]
      } else {
        obj = this.questionList[indexObject.index].tabList[indexObject.rowIndex]
      }
      if (obj.miniImg.url != '') {
        this.$confirm('确定重新上传图片？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fileList = {}
          this.dialogUploadVisible = true
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
      } else {
        this.fileList = {}
        this.dialogUploadVisible = true
      }
    },
    deleteMiniImg (index, rowIndex, type) {
      this.$confirm('确定删除该图片？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type == 0) {
          this.questionList[index].fillList[rowIndex].miniImg.url = ''
        } else {
          this.questionList[index].tabList[rowIndex].miniImg.url = ''
        }
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
    randomSwitch (index) {
      let o = this.questionList[index]
      let type = o.randomType
      let val = type == '' ? 'primary' : ''
      o.randomType = val
      o.random_answers_order = o.randomType == 'primary' ? 1 : 0
      this.questionList.splice(index, 1, o)
    },
    lockSwitch (index, dex) {
      let status = this.questionList[index].fillList[dex].isLock
      this.questionList[index].fillList[dex].isLock = !status
      // let o = this.questionList[index]
      // let b = o.fillList[dex]
      // b.isLock = !b.isLock
      // o.fillList.splice(dex, b)
      // this.questionList.splice(index, o)
    },
    lockminiImage (img) {
      this.editattributes.dialogVisible = true
      this.editattributes.url = img
    },
    deleteQuestion (index) {
      // 删除题目
      let o = this.questionList[index]
      let data = {}
      this.$confirm('是否删除该题目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (o.questionId == '') {
          // 当前题目数据还没有保存进数据库 页面直接删除
          this.questionList.splice(index, 1)
        } else {
          data = {
            id: o.questionId
          }
          api.deleteQuestion(data).then(res => {
            if (res.code === 300000) {
              this.initCreate()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
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
    getEditContent (content, i) {
      this.questionList[i].content = content
    },
    jumpFn (index, colIndex, optionId) {
      if (optionId) {
        this.jumpOptionId = optionId;
        this.jumpIndex = {index, colIndex}
        this.dialogTableVisible = true
      } else {
        this.$message({
          message: '保存当前题目才能跳转',
          type: 'error'
        })
      }
    },
    editTips () {
      this.$message({
        message: '请在编辑模式下编辑该题目',
        type: 'warning'
      })
    },
    addQuestion () {
      //  添加题目
      this.createQuestion()
    },
    addOption (index) {
      // 添加选项
      this.createOption(index)
    },
    addOptions (index) {
      let arr = this.questionList[index].fillList
      arr.forEach((o, j) => {
        if (o.input == '') {
          arr.splice(j)
        }
      })
      this.dialogAddOptionsVisible = true
      this.addOptionsIndex = index
      this.addOptionsType = 0
    },
    // 添加表格列选项
    addColOption (event) {
      let index = event.target.dataset.index
      let len = this.questionList[index].cols.length
      let newObj = Object.assign({}, this.questionList[index].cols[len - 1])
      let rowObj = this.questionList[index].tabList
      newObj = {
        optionIds: [],
        prop: `opt${len}`,
        laber: `选项${len}`
      }
      // 同步更新行数据中的列
      rowObj.forEach((v, i) => {
        // v[`opt${len}`] = {
        //   tags: [],
        //   isMutex: false
        // }
        this.$set(v, `opt${len}`, {tags: [], isMutex: false})
      })
      // 添加列数据
      this.questionList[index].cols.push(newObj)
    },
    // 添加多列表格选项
    addColOptions (event) {
      this.dialogAddOptionsVisible = true
      this.addOptionsType = 1
      this.currentTableIndex = event.target.dataset.index
    },
    // 添加单行表格数据
    addRowOption (index) {
      // 简单的对象拷贝
      // 如果先添加了列  每行的数据缺失 初始化data数据缺失 需要手动补全
      let obj = this.$options.data().questionList[0].tabList[0]
      let colsObj = this.questionList[index].cols
      let colsLen = colsObj.length - 1
      let oldCols = this.$options.data().questionList[0].cols
      let oldColsLen = oldCols.length - 1
      let len = this.questionList[index].tabList.length
      for (var i = 0; i < colsLen - oldColsLen; i++) {
        this.$set(obj, `opt${oldColsLen + i + 1}`, {tags: [], isMutex: false})
      }
      for (var k in obj) {
        if (typeof obj[k] != 'object') {
          if (obj[k].indexOf('题目') != -1) {
            obj[k] = `题目${len + 1}`
          }
        }
      }
      this.questionList[index].tabList.push(obj)
    },
    // 添加多行表格行数据
    addRowOptions (index) {
      let arr = this.questionList[index].fillList
      arr.forEach((o, j) => {
        if (o.input == '') {
          arr.splice(j)
        }
      })
      this.dialogAddOptionsVisible = true
      this.addOptionsType = 2
      this.addOptionsIndex = index
    },
    createOption (index) {
      // 创建重新初始化的 data => fillList数据
      let obj = this.$options.data().questionList[0].fillList[0]
      this.questionList[index].fillList.push(obj)
    },
    // 创建问题
    createQuestion () {
      let data = this.$options.data().questionList[0]
      data.isEdit = true
      // if (this.iNow == 0) {
      //   // 没有监听到数据变化 直接添加题目
      //   data = this.updataObj(this.questionList[0])
      // } else {
      //   data = this.updataObj(this.cloneList[0])
      // }
      // data.optionValue = ''
      this.questionList.push(data)
    },
    // 获取到标签选择的值
    getTreeValue (value, i, j) {
      let oldObj
      let type = this.questionList[i].optionValue
      if (type == 2 || type == 3) {
        let row = value.pos.$index
        let col = value.pos.column.property
        // 动态添加的列数据 无法深度重置data数据驱动view层
        oldObj = this.questionList[i].tabList[row]
        oldObj[col].tags.push(value.value)
        this.questionList[i].tabList.splice(row, 1, oldObj)
      } else if (type == 4) {
        oldObj = this.questionList[i].fillArea
        oldObj.tags.push(value.value)
      } else {
        // console.log(value, i, j)
        oldObj = this.questionList[i].fillList[j]
        oldObj.tags.push(value.value)
        this.questionList[i].fillList.splice(j, 1, oldObj)
      }
    },
    // 删除标签
    deleteTag (tagIndex, colIndex, rowIndex, index) { // 标签索引，列索引，行索引，表索引
      let obj
      if (arguments.length == 2) {
        obj = this.questionList[arguments[1]].fillArea
        obj.tags.splice(tagIndex, 1)
      } else if (arguments.length == 3) {
        // 单选 多选删除标签
        obj = this.questionList[arguments[2]].fillList[arguments[1]]
        obj.tags.splice(tagIndex, 1)
        this.questionList[arguments[2]].fillList.splice(arguments[1], 1, obj)
      } else {
        // 矩阵单选多选
        obj = this.questionList[index].tabList[rowIndex]
        obj[colIndex].tags.splice(tagIndex, 1)
        this.questionList[index].tabList.splice(rowIndex, 1, obj)
        // console.log(tagIndex, colIndex, rowIndex, index)
      }
    },
    // 问题是否可编辑
    questionEdit (index, ev) {
      // 每次完成编辑都是一次问卷提交
      let o = this.questionList[index]
      let type = o.optionValue
      let questionId = o.questionId == '' ? random16() : o.questionId
      // let subQuestionId
      let data = {}
      let option = {}
      let subQuestion = {}
      let flag = true;
      if (this.questionForm.name == '') {
        // 没有创建问卷题目
        this.$message.error('请先填写问卷题目')
        return
      }
      if (o.isEdit) {
        if (o.optionTypeValue == '选项图文' || o.optionTypeValue == 1) {
          o.optionTypeValue = 1
        } else {
          o.optionTypeValue = 0
        }
        // this.validate(index) // 校验数据 是否满足要求
        if (type == 2 || type == 3) {
          // 矩阵题型
          data = {
            questionnaire_id: localStorage.getItem('qnrId'),
            content: o.content,
            question_type: o.optionValue == '' ? 0 : o.optionValue,
            order: o.questionOrder,
            question_option_type: type == 2 ? 0 : 1,
            options_show_type: o.optionTypeValue,
            random_answers_order: o.randomType == 'primary' ? 1 : 0,
            sub_questions: [] // 子问题数组
          }
          o.tabList.forEach((v, i) => {
            v.subQuestionId = v.subQuestionId == '' ? random16() : v.subQuestionId
            // 判断是选项图文 还是 文本   默认图文 必须有图片+题目  0图文 1文字
            if (o.optionTypeValue == 1) {
              if (v.miniImg.url == '' || v.opt == '') {
                flag = false
              }
            }
            subQuestion = {
              sub_question_id: v.subQuestionId,
              content: v.opt,
              image_url: v.miniImg.url,
              order: i,
              // options_show_type: o.optionTypeValue == 1 ? 0 : 1, 不知道之前小贱为啥取反，先注释在这里
              options_show_type: o.optionTypeValue,
              options: []
            }
            for (let j = 1; j < o.cols.length; j++) {
              subQuestion.options.push({
                option_id: o.cols[j].optionIds[i] ? o.cols[j].optionIds[i] : '',
                content: o.cols[j].laber,
                group: v[`opt${j}`].isMutex ? 1 : 0,
                order: j
              })
            }
            data.sub_questions.push(subQuestion)
          })
          if (flag) {
            api.matrixSelect(questionId, data).then(res => {
              if (res.code === 300000) {
                this.$message.success('保存成功')
                o.isEdit = !o.isEdit
                this.initCreate()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('图文选项不能含有没有图片和文字的题目!')
          }
        } else if (type == 0 || type == 1) {
          // 选择 or 填空题型
          // 构建 data 数据结构
          data = {
            questionnaire_id: localStorage.getItem('qnrId'),
            content: o.content,
            question_type: o.optionValue == '' ? 0 : o.optionValue,
            order: o.questionOrder,
            options_show_type: o.optionTypeValue,
            random_answers_order: o.randomType == 'primary' ? 1 : 0,
            default_next_question_id: 0,
            options: []
          }
          o.fillList.forEach((v, i) => {
            if (v.optionTypeValue == 1) {
              if (v.miniImg.url == '' || v.input == '') {
                flag = false
              }
            }
            if (!v.input) {
              this.$message.error('请把数据填写完整')
              flag = false
            }
            if (v.nextQuestionId == -1) {
              v.nextQuestionId = -1
            }
            if (!v.nextQuestionId) {
              v.nextQuestionId = 0
            }
            option = {
              option_id: v.option_id,
              content: v.input,
              image_url: v.miniImg.url,
              next_question_id: v.nextQuestionId,
              next_question: v.next_question,
              order: i,
              group: v.isMutex ? 1 : 0,
              fixed_order: v.isLock ? 1 : 0,
              option_type: v.isFill ? 1 : 0
            }
            data.options.push(option)
          })
          if (flag) {
            api.normalSelect(questionId, data).then(res => {
              if (res.code === 300000) {
                this.$message.success('保存成功')
                o.isEdit = !o.isEdit
                this.initCreate()
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.$message.error('图文选项不能含有没有图片和文字的题目!')
          }
        } else {
          data = {
            questionnaire_id: localStorage.getItem('qnrId'),
            content: o.content,
            question_type: 4,
            order: o.questionOrder,
            options_show_type: 0,
            random_answers_order: o.randomType == 'primary' ? 1 : 0,
            default_next_question_id: 0,
            options: [{
              option_id: o.fillArea.id,
              content: '',
              image_url: '',
              next_question_id: 0,
              order: 0,
              group: 0,
              fixed_order: 0,
              option_type: 1
            }]
          }
          api.normalSelect(questionId, data).then(res => {
            if (res.code === 300000) {
              this.$message.success('保存成功')
              o.isEdit = !o.isEdit
              this.initCreate()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      } else {
        o.isEdit = !o.isEdit
      }
      this.questionList.splice(index, 1, o)

      function random16 () {
        return new Date().getTime().toString() + (Math.floor(Math.random() * 900) + 100).toString()
      }
    },
    // 提交添加的多行选项
    submitAddOptions () {
      let value = this.textAreaValue
      let getArr = findSwitchLine(value)
      let len = getArr.length || 0
      // 单选 多选 添加多行选项
      if (this.addOptionsType == 0) {
        for (let i = 0; i < len; i++) {
          let o = this.$options.data().questionList[0].fillList[0]
          o.input = getArr[i]
          this.questionList[this.addOptionsIndex].fillList.push(o)
        }
      } else if (this.addOptionsType == 1) {
        let index = this.currentTableIndex // 操作当前表格的索引
        let l = this.questionList[index].cols.length
        let newObj = Object.assign({}, this.questionList[index].cols[len - 1])
        let rowObj = this.questionList[index].tabList
        for (let j = 0; j < len; j++) {
          newObj = {
            optionIds: [],
            prop: `opt${l + j}`,
            laber: `${getArr[j]}`
          }
          this.questionList[index].cols.push(newObj)
        }
        // 同步更新行数据中的列
        rowObj.forEach((value, index) => {
          getArr.forEach((v, i) => {
            // value[`opt${l + i}`] = {
            //   tags: [],
            //   isMutex: false
            // }
            this.$set(value, `opt${l + i}`, {tags: [], isMutex: false})
          })
        })
      } else if (this.addOptionsType == 2) {
        for (let i = 0; i < len; i++) {
          let obj = this.$options.data().questionList[0].tabList[0]
          let colsObj = this.questionList[this.addOptionsIndex].cols
          let colsLen = colsObj.length - 1
          let oldCols = this.$options.data().questionList[0].cols
          let oldColsLen = oldCols.length - 1
          for (var j = 0; j < colsLen - oldColsLen; j++) {
            this.$set(obj, `opt${oldColsLen + j + 1}`, {tags: [], isMutex: false})
          }
          obj.opt = getArr[i]
          this.questionList[this.addOptionsIndex].tabList.push(obj)
        }
      }
      this.dialogAddOptionsVisible = false
      this.textAreaValue = ''
      function findSwitchLine (value, arr = []) {
        let index, first, last
        if (value.indexOf('\n') != -1) {
          index = value.indexOf('\n')
          first = value.substring(0, index)
          last = value.substr(index + 1)
          arr.push(first)
          return findSwitchLine(last, arr)
        } else {
          if (value !== '') {
            arr.push(value)
          }
          return arr
        }
      }
    },
    // submitQuestion () {
    //   //  提交
    // },
    // 更新复制的obj
    updataObj (obj) {
      function updataId (obj) {
        var newobj = obj.constructor === Array ? [] : {}
        for (var i in obj) {
          newobj[i] = typeof obj[i] === 'object' ? updataId(obj[i]) : i == 'id' ? obj[i] = uuid() : obj[i]
        }
        return newobj
      }
      function cloneObj (obj) {
        var newobj = obj.constructor === Array ? [] : {}
        if (typeof obj !== 'object') {
          return;
        } else {
          for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]
          }
        }
        return newobj;
      }
      return updataId(cloneObj(obj))
    },
    validate (index) {
      // 校验当前题目
      let data = this.questionList[index]
      let type = data.optionValue
      console.log(type)
    },
    handleJump (row) {
      console.log(row)
      // --- 选择跳转 写入跳转索引 获取id
      let index = this.jumpIndex.index
      let colIndex = this.jumpIndex.colIndex
      let optionId = this.jumpOptionId
      let id
      let data = {}
      if (row.order == 0) {
        id = 0
      } else if (row.order == -1) {
        id = -1
      } else {
        id = row.id
      }
      data.questionID = id
      api.configJump(optionId, data).then((res) => {
        if (res.code === 300000) {
          this.$message.success('设置跳转成功')
          this.questionList[index].fillList[colIndex].next_question = res.data.next_question
          this.questionList[index].fillList[colIndex].nextQuestionId = res.data.next_question_id
        } else {
          this.$message.error(res.msg)
        }
      })
      this.dialogTableVisible = false
    },
    createQuestionAjax () {
      if (this.questionForm.name == '') {
        // localStorage.clear()
        return
      }
      let id = localStorage.getItem('qnrId')
      let data = {
        id,
        title: this.questionForm.name
      }
      api.editQnr(data).then(res => {
        if (res.code === 300000) {
          // 问卷标题创建完成
          localStorage.setItem('qnrId', res.data.id)
        }
      })
    },
    btnTypeFun (type) {
      let v
      switch (type) {
      case 0: v = '不跳转'; break;
      case 1: v = '结束问卷'; break;
      case 2: v = '选择'; break;
      }
      return v
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    questionList: {
      handler: function (oldVal, newVal) {
        // 整个list变化  第一次变化则备份初始数据
        if (this.iNow == 0) {
          this.cloneList = this.updataObj(oldVal)
          this.iNow++
        }
      },
      deep: true
    },
    questionForm: {
      handler: function (oldVal, newVal) {
        if (newVal.name == '') {
          this.questionList.forEach((v, i) => {
            v.isEdit = false
          })
        } else {
          this.questionList.forEach((v, i) => {
            v.isEdit = true
          })
        }
      },
      deep: true
    },
    '$route' (to, from) {
      if (to.name != 'questionCreate') {
        localStorage.removeItem('qnrId')
      } else {
        let id = this.$route.query.id
        if (id == undefined) {
          id = localStorage.getItem('qnrId')
        }
        localStorage.setItem('qnrId', id)
        if (id == '') {
          Object.assign(this.$data, this.$options.data())
        } else {
          this.initCreate()
        }
      }
    }
  },
  components: {
    'tag-tree': tagTree,
    'edit-tool': editTool,
    'upload-file': uploadFile
  }
}
</script>
<style scoped>
  .el-upload-list{
      display: none!important;
  }
  .el-table .cell, .el-table th div {
    overflow: visible!important;
  }
</style>

<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .container-main {
    position: absolute;
    top: 0;
    left: 0;
    @include base(100%, 100%);
    .wrapper {
      width: 100%;
      padding: 30px;
    }
  }
  .container {
    height: 100%;
    border: 1px solid #eee;
  }
  .questionWrapper {
    padding: 30px 30px 80px;
    position: relative;
    margin: 0 0 30px 0 ;
    border: 1px solid #ccc;
    .questionMark {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 10;
    }
    .editBtn {
      position: absolute;
      right: 30px;
      bottom: 20px;
      z-index: 11;
    }
  }
  .fillType {
    width: 50%;
    display: inline-block;
    vertical-align: top;
  }
  .fillTagTree {
    display: inline-block;
    vertical-align: top;
  }
  .minImage {
    float: left;
  }
 .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    cursor: pointer;
  }
  .editBox {
    height: 300px;
    margin-right: 20px;
  }
  .tableImgStyle {
    font-size: 20px;
    margin: 4px 10px;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .mgl10 {
    margin-left: 10px;
  }
  .mgr100 {
    margin-right: 100px;
  }
  .lockIcon {
    background: url(../../assets/images/icon_fixed.png) no-repeat;
    background-size: cover;
  }
  .unLockIcon {
    background: url(../../assets/images/icon_fixed_nor.png) no-repeat;
    background-size: cover;
  }
  .lock {
    float: left;
    width: 16px;
    height: 16px;
    margin: 10px;
  }
  .miniImage {
    margin: 8px;
  }
  .deleteIcon {
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    top: 28px;
    margin-left: 10px;
  }
  .addOptionsContent {
    width: 80%;
    height: 250px;
    padding: 10px;
    float: left;
    border-radius: 5px;
    margin-bottom: 20px;
    resize: none;
  }
  .jumpBtn {
    margin: 100px 10px 50px 0;
  }
  .el-icon-tiaozhuan{
    width: 154px;
  }
</style>
