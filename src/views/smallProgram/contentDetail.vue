<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="标题" prop="name">
        <el-input
                placeholder="请输入标题名称"
                v-model="ruleForm.name"
                clearable style="width: 30%">
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="content">
       <div style="height: 500px">
         <quill-edit @retContent="getEditContent" :editorOption="editorOption" :editorUpload=true :editContent="ruleForm.content"></quill-edit>
       </div>
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
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import QuillEdit from '@/components/QuillEdit/quillEdit'
import * as SowingMap from '@/api/miniProgram/sowingMap'
export default {
  components: {
    QuillEdit
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
      fileList2: [],
      ruleForm: {
        name: '',
        status: '1',
        content: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 20个汉字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sub()
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
        // 获取轮播图内容详情页
        SowingMap.getPagedetailspage(id)
          .then(data => {
            if (data.code === 300000) {
              let prm = data.data
              console.log(prm)
              this.ruleForm = {
                name: prm.title,
                status: String(prm.status),
                content: String(prm.content),
                desc: prm.remark
              }
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }
    },
    sub () {
      let id = this.$route.query.id
      if (!id) {
        // 新增轮播详情页
        SowingMap.addedPagedetailspage({
          title: String(this.ruleForm.name),
          content: String(this.ruleForm.content),
          status: String(this.ruleForm.status),
          remark: this.ruleForm.desc
        })
          .then(data => {
            if (data.code === 300000) {
              this.$router.push('/content')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      } else {
        // 编辑轮播详情页
        SowingMap.EditPagedetailspage(id, {
          title: String(this.ruleForm.name),
          content: String(this.ruleForm.content),
          status: String(this.ruleForm.status),
          remark: this.ruleForm.desc
        })
          .then(data => {
            if (data.code === 300000) {
              this.$router.push('/content')
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(this.errHandler)
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    getEditContent (content) {
      this.ruleForm.content = content
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
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
