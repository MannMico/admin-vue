<template>
  <el-button type="type" size="size" @click="sendCode" :disabled="isdisabled" style="width: 112px;">{{innerText}}</el-button>
</template>

<script>
import { getVerifyCode } from '@/api/user.js'
export default {
  props: ['type', 'size', 'text', 'phone'],
  data: function () {
    return {
      innerText: '',
      isdisabled: false
    }
  },
  methods: {
    sendCode () {
      if (this.innerText > 0) {
        return
      }
      getVerifyCode({phone: this.phone}).then((res) => {
        if (res.code === 300000) {
          this.$message('发送验证码成功')
          return true
        } else {
          this.$message(res.msg)
          throw res.msg
        }
      }).then(() => {
        this.isdisabled = true
        this.innerText = 30
        let handler = () => {
          this.innerText--
          if (this.innerText < 0) {
            this.innerText = this.text
            this.isdisabled = false
          } else {
            setTimeout(handler, 1000);
          }
        }
        setTimeout(handler, 1000);
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
    this.innerText = this.text
  }
}
</script>

<style scoped>

</style>
