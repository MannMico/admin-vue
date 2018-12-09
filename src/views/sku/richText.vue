<template>
  <div>
    <el-form ref="form" class="form-box">
      <el-form-item label="内容" prop="content">
        <div style="width:1000px;height: 600px">
          <quill-edit  @retContent="getEditContent" :editorOption="editorOption" :editorUpload=true :editContent="servedialog.content"></quill-edit>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
                type="primary"
                @click="subOrEdit()">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import QuillEdit from '@/components/QuillEdit/supplyQuillEdit'
import * as skuApi from '@/api/skuApi'
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
      content: '',
      servedialog: {
        content: ''
      }
    }
  },
  created () {
    this.getlist()
  },
  methods: {
    getlist () {
      skuApi.getSpus(this.$route.params.id, {})
        .then(data => {
          if (data.code === 300000) {
            this.servedialog.content = data.data.intro
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 更新SPU服务介绍
    subOrEdit () {
      if (!this.servedialog.content) {
        this.$message.error('当前没有编辑任何信息')
        return false
      }
      skuApi.editorSpus(this.$route.params.id, 'spu', {intro: this.servedialog.content})
        .then(data => {
          if (data.code === 300000) {
            this.$message.success('操作成功')
            this.servedialog.dialogVisible = false
            this.$router.push('/service')
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => { this.$message.error(err) })
    },
    // 富文本编辑器
    getEditContent (content) {
      this.servedialog.content = content
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
</style>
