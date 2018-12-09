<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogTipVisible"
  :width="dialogWidth"
  >
    <span>需要注意的是内容是默认不居中的22</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancleClose">取 消</el-button>
      <el-button type="primary" @click="confirmClose">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogTip',
  props: {
    dialogWidth: {
      type: String,
      default: '30%'
    },
    title: {
      type: String,
      default: '提示',
      required: true
    },
    dialogTipVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    // form表单
    dialogForm: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 取消关闭dialog
    cancleClose () {
      this.changeStatus(false)
    },
    // 确定关闭dialog
    confirmClose () {
      this.changeStatus(false)
    },
    // 更改父组件的值
    changeStatus (bool) {
      this.$emit('changeStatus', bool)
    }
  }
}
</script>
