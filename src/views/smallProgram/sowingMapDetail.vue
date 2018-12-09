<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="主题类型" prop="themeType">
        <el-radio-group v-model="ruleForm.related_type">
          <el-radio  label="1">关联主题</el-radio>
          <el-radio  label="2">关联内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="搜索" prop="key">
        <el-input
            placeholder="请输入主题关键词"
            v-model="ruleForm.key"
            clearable style="width: 20%">
        </el-input>
        <el-button type="primary" @click="themesSubmitForm('ruleForm')">搜索</el-button>
      </el-form-item>
      <el-form-item label="关联" prop="content">
        <el-select   v-model="ruleForm.related_id"  placeholder="请选择内容主题">
          <el-option
                  v-for="item in tableData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点击上传">
        <img :src="fileList.url" class="imgClass" v-show="fileList.url && !dialogUploadVisible" alt="">
        <el-button type="primary" @click="uploadImage">上传图片</el-button>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          v-model.number="ruleForm.sort"
          placeholder="请输入排序"
          clearable style="width: 20%"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="说明" prop="desc">
        <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="ruleForm.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="上传图片" style="width:40%;margin:0 auto" :visible.sync="dialogUploadVisible">
      <img :src="fileList.url" style="width:100px;height:100px" alt="">
      <upload-file :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="false" @urlCB="uploadSuccess" :isCover="true"></upload-file>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="enterUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as SowingMap from '@/api/miniProgram/sowingMap'
import uploadFile from '@/components/Upload/upload'
export default {
  data () {
    var checkSort = (rule, value, callback) => {
      if (!value) {
        callback(new Error('排序不能为空'));
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback()
      }
    }
    return {
      fileList: {},
      tableData: [],
      dialogUploadVisible: false,
      ruleForm: {
        related_type: '1',
        key: '',
        related_id: '',
        resource: '',
        sort: '',
        status: '1',
        remark: ''
      },
      rules: {
        related_id: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        related_type: [
          { required: true, message: '请选择主题类型', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态信息', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请填写活动形式', trigger: 'blur' }
        ],
        sort: [
          { validator: checkSort, trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getList()
  },
  methods: {
    themesSubmitForm () {
      let tepe = this.ruleForm.key
      if (!tepe) {
        this.$message.error('主题关键词不能为空');
      } else {
        this.tableData = ''
        this.ruleForm.related_id = ''
        let type = this.ruleForm.related_type
        if (type == 1) {
          this.themesList()
        } else {
          SowingMap.getcontents({page: 1, limit: 100, name: this.ruleForm.key})
            .then(data => {
              if (data.code === 300000) {
                if (data.data.data.length === 0) {
                  this.$message.error('你输入的信息未找到，请重新输入')
                } else {
                  this.tableData = data.data.data
                  this.ruleForm.related_id = data.data.data[0] ? data.data.data[0].id : ''
                }
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(this.errHandler)
        }
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(typeof this.ruleForm.related_id)
          if (this.ruleForm.related_id == '') {
            this.$message.error('请输入关联类型')
          } else {
            this.sub()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    themesList () {
      SowingMap.getThemes({page: 1, limit: 100, name: this.ruleForm.key})
        .then(data => {
          if (data.code === 300000) {
            if (data.data.data.length === 0) {
              this.$message.error('你输入的信息未找到，请重新输入')
            } else {
              this.tableData = data.data.data
              this.ruleForm.related_id = data.data.data[0] ? data.data.data[0].id : ''
            }
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    getList () {
      let type = this.$route.query.type
      let id = this.$route.query.id
      if (type == 1) {
        // 获取轮播详情页
        SowingMap.getSowingMapDetail(id)
          .then(data => {
            if (data.code === 300000) {
              let prm = data.data
              this.ruleForm = {
                related_type: String(prm.related_type),
                related_id: prm.id,
                sort: prm.order,
                status: String(prm.status),
                remark: prm.remark
              }
              this.fileList.url = prm.cover
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }
    },
    sub () {
      let id = this.$route.query.id
      console.log(!id)
      if (!id) {
        // 新增轮播详情页
        SowingMap.getmapDetail({
          relation_type: String(this.ruleForm.related_type),
          relation_id: String(this.ruleForm.related_id),
          cover: this.fileList.url,
          sort: String(this.ruleForm.sort),
          status: String(this.ruleForm.status),
          remark: this.ruleForm.remark
        })
          .then(data => {
            if (data.code === 300000) {
              this.$router.push('/sowingMap')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      } else {
        // 编辑轮播详情页
        SowingMap.getDetail(id, {
          relation_type: String(this.ruleForm.related_type),
          relation_id: String(this.ruleForm.related_id),
          cover: this.fileList.url,
          sort: String(this.ruleForm.sort),
          status: String(this.ruleForm.status),
          remark: this.ruleForm.remark
        })
          .then(data => {
            if (data.code === 300000) {
              this.$router.push('/sowingMap')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
        console.log('2');
      }
    },
    uploadImage () {
      this.dialogUploadVisible = true
    },
    uploadSuccess (res) {
      if (res.code === 0) {
        let url = res.file_url
        let name = res.file_name
        this.fileList = {
          name: name,
          url: url
        }
      }
    },
    enterUpload () {
      this.dialogUploadVisible = false
    }
  },
  components: {
    'upload-file': uploadFile
  }
}
</script>
<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
.imgClass {
  width: 80px;
  height: 80px;
  display: inline-block;
}
</style>
