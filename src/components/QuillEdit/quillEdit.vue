<template>
  <div class="editQuill">
    <quill-editor v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
        @change="onEditorChange($event)">
    </quill-editor>
    <el-dialog title="上传图片" style="width:40%;margin:0 auto" :visible.sync="dialogUploadVisible">
      <img :src="fileList.url" style="width:100px;height:100px" alt="">
      <upload-file :upfileSize='3072' :upfileType="'image'" :upLimit="100" :upMultiple="false" @urlCB="uploadSuccess" :isCover="true"></upload-file>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取 消</el-button>
          <el-button type="primary" @click="enterUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import uploadFile from '@/components/Upload/upload'

export default {
  name: 'QuestionList',
  data () {
    return {
      focusUpload: '1',
      dialogUploadVisible: false,
      fileList: {},
      content: this.editContent
    }
  },
  props: {
    // 编辑器默认配置选项，如有需要可以另行配置
    editorOption: {
      type: Object,
      default () {
        return {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              ['image'],
              [{'color': []}]
            ],
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            }
          }
        }
      }
    },
    editorUpload: {
      type: Boolean,
      default () {
        return false
      }
    },
    editContent: {
      type: String,
      default () {
        return '<div>请输入你需要填写的标题</div>'
      }
    }
  },
  watch: {
    editContent (newVal, oldVal) {
      this.content = newVal
    }
  },
  created () {
  },
  mounted () {
    var _this = this
    var imgHandler = async function (image) {
    // 重新定义文本编辑器图片上传功能
      _this.addImgRange = _this.$refs.myQuillEditor.quill.getSelection()
      console.log(_this.focusUpload)
      if (image && _this.focusUpload === '2') {
        _this.dialogUploadVisible = true
      } else {
        _this.$message.error('请把鼠标放在你选中的位置')
      }
    }
    _this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', imgHandler)
  },
  methods: {
    onEditorBlur (quill) {
      this.$emit('retContent', this.content)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
      this.focusUpload = '2'
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
      this.$emit('retContent', html)
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
      let _this = this
      let img = _this.fileList.url
      if (_this.fileList.url == '') {
        this.$message.error('上传图片')
      } else {
        if (_this.editorUpload) {
          let range = this.$refs.myQuillEditor.quill.getSelection();
          let length = range.index;
          this.$refs.myQuillEditor.quill.insertEmbed(length, 'image', img);
        } else {
          let re = /<img.*?(?:>|\/>)/gi
          _this.content = _this.content.replace(re, '')
          _this.content = `<img src=${img} alt="" width="40" height="40">${_this.content}`
        }
        _this.fileList.url = ''
        _this.dialogUploadVisible = false
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  components: {
    'upload-file': uploadFile
  }
}
</script>
<style>
  .quill-editor:not(.bubble) .ql-container,
  .quill-editor:not(.bubble) .ql-container .ql-editor {
    height: 80%;
  }
</style>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .editQuill {
      width: 100%;
      height: 100%;
  }
  .quill-editor,
  .quill-code {
    width: 100%;
    height: 100%;
    float: left;
  }
  .quill-code {
    height: auto;
    border: none;
    > .title {
      border: 1px solid #ccc;
      border-left: none;
      height: 3em;
      line-height: 3em;
      text-indent: 1rem;
      font-weight: bold;
    }
    > code {
      width: 100%;
      margin: 0;
      padding: 1rem;
      border: 1px solid #ccc;
      border-top: none;
      border-left: none;
      border-radius: 0;
      height: 30rem;
      overflow-y: auto;
    }
}
</style>
