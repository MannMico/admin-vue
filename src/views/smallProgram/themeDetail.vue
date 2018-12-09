<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="主题" prop="name">
        <el-input
                placeholder="请输入标题名称"
                v-model="ruleForm.name"
                clearable style="width: 30%">
        </el-input>
      </el-form-item>
      <el-form-item label="简介" prop="content">
        <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="ruleForm.content">
        </el-input>
      </el-form-item>
      <el-form-item label="选项图片">
        <img :src="ruleForm.cover" class="imgClass" width="200" v-show="ruleForm.cover!='' && !dialogUploadVisible" alt="">
        <el-button type="primary" @click="uploadImageurl(0)">上传图片</el-button>
      </el-form-item>
      <el-form-item label="选择原图">
        <img :src="ruleForm.origin" class="imgClass" width="200" v-show="ruleForm.origin!='' && !dialogUploadVisibleOrigin" alt="">
        <el-button type="primary" @click="uploadImageurl(1)">上传图片</el-button>
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
                v-model="ruleForm.desc">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="btnSubmit('ruleForm')">立即创建</el-button>
      </el-form-item>
      <el-dialog title="上传图片" style="width:40%;margin:0 auto" :visible.sync="dialogUploadVisible">
        <img :src="fileList.url" style="width:100px;height:100px" alt="">
        <upload-file :upfileSize='3072' :upfileType="'image'" :upLimit="10" :upMultiple="false" @urlCB="uploadSuccess" :isCover="true"></upload-file>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取 消</el-button>
          <el-button type="primary" @click="enterUpload">确 定</el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import * as SowingMap from '@/api/miniProgram/sowingMap'
import uploadFile from '@/components/Upload/upload'
export default {
  components: {
    'upload-file': uploadFile
  },
  data () {
    return {
      fileList: {},
      uploadType: 0,
      tableData: [],
      dialogUploadVisible: false,
      dialogUploadVisibleOrigin: false,
      ruleForm: {
        name: '',
        content: '',
        origin: '',
        cover: '',
        status: '1',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20个汉字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50个汉字', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50个汉字', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getList()
  },
  methods: {
    btnSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.ruleForm.cover && !this.ruleForm.origin) {
            this.$message.error('请上传选项图片，和原图')
          } else {
            this.sub()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getList () {
      let type = this.$route.query.type
      let id = this.$route.query.id
      if (type == 1) {
        // 获取主题内容详情页
        SowingMap.getthemesDetails(id)
          .then(data => {
            if (data.code === 300000) {
              let prm = data.data
              this.ruleForm = {
                name: String(prm.title),
                content: String(prm.describe),
                status: String(prm.status),
                desc: prm.remark
              }
              this.ruleForm.cover = prm.cover
              this.ruleForm.origin = prm.origin
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
        // 新增主题内容详情页
        SowingMap.addedtheme({
          title: String(this.ruleForm.name),
          describe: String(this.ruleForm.content),
          cover: this.ruleForm.cover,
          origin: this.ruleForm.origin,
          status: String(this.ruleForm.status),
          remark: String(this.ruleForm.desc)
        })
          .then(data => {
            if (data.code === 300000) {
              this.$router.push('/theme')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      } else {
        // 编辑主题内容详情页
        SowingMap.Edittheme(id, {
          title: String(this.ruleForm.name),
          describe: String(this.ruleForm.content),
          cover: this.ruleForm.cover,
          origin: this.ruleForm.origin,
          status: String(this.ruleForm.status),
          remark: String(this.ruleForm.desc)
        })
          .then(data => {
            if (data.code === 300000) {
              this.$router.push('/theme')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }
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
          this.ruleForm.cover = url
        } else {
          this.ruleForm.origin = url
        }
      }
    },
    enterUpload () {
      this.dialogUploadVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .container-main {
    position: absolute;
    top: 0;
    left: 0;
    @include base(100%, 100%);
  }
  .container {
    height: 100%;
    border: 1px solid #eee;
  }
</style>
