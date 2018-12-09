<template>
  <!-- 菜单栏 -->
  <el-aside
    width="220px"
    :class="{'aside-collapse': $store.getters.isCollapse}"
    :style="{'background': $store.getters.themeColor}">
    <div class="user-info">
      <img
        class="user-avatar"
        :src="$store.getters.avatar">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{$store.getters.name}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix" command="password">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item class="clearfix" command="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="slogan" v-show="$store.getters.isCollapse">LKKER</div>
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="$route.path"
      :unique-opened="menuBar.uniqueOpened"
      :collapse="$store.getters.isCollapse"
      :router="menuBar.router">
      <sidebar-item :routes="allRouters"></sidebar-item>
    </el-menu>
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      width="500px"
      @close="hidePasswordDialog"
      :visible.sync="passwordDialogVisible">
      <el-form
        ref="passwordForm"
        :model="passwordForm"
        label-width="100px">
        <el-form-item label="账号：">{{$store.getters.name}}</el-form-item>
        <el-form-item label="手机号：">{{$store.getters.phone}}</el-form-item>
        <el-form-item label="验证码：">
            <el-input v-model="passwordForm.verifyCode" placeholder="请输入验证码" style="width: 200px;"/>
            <verifyCodeButton type="primary" text="获取验证码" style="margin-left: 20px;" :phone="$store.getters.phone"></verifyCodeButton>
        </el-form-item>
        <el-form-item label="密码："><el-input type="password" v-model="passwordForm.password" placeholder="请输入密码" style="width: 200px;"></el-input></el-form-item>
        <el-form-item label="重复密码："><el-input type="password" v-model="passwordForm.passwordAgain" placeholder="请再次输入相同密码" style="width: 200px;"></el-input></el-form-item>
        <p style="height: 40px; color: red; text-align: center;">{{passwordForm.errorMessage}}</p>
        <el-row type="flex" justify="center">
          <el-button @click="passwordDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="changePassword" style="margin-left: 20px;">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </el-aside>
</template>
<script>

import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { menuBar } from '@/menuBar'
import DialogForm from '@/components/Dialog/form'
import * as Api from '@/api/user.js'
import verifyCodeButton from '@/components/VerifyCodeButton'

let passwordMessageArray = ['保存失败！需大于6位，至少包含数字&字母', '验证码错误', '两次密码不一致']

export default {
  name: 'Siderbar',
  components: { DialogForm, SidebarItem, verifyCodeButton },
  computed: {
    ...mapGetters([
      'allRouters'
    ])
  },
  data () {
    return {
      isCollapse: false,
      themeColor: '#409EFF',
      passwordDialogVisible: false,
      passwordForm: {
        verifyCode: '',
        password: '',
        passwordAgain: '',
        errorMessage: ''
      },
      menuBar
    }
  },
  methods: {
    handleCommand (command) {
      this[`${command}Handler`]();
    },
    passwordHandler () {
      this.passwordDialogVisible = true
    },
    logoutHandler () {
      this.$confirm('确认退出？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('Logout')
          .then(() => {
            location.reload()
          })
      })
    },
    changeFormVisibleStatus (bool) {
      this.passwordDialogVisible = bool;
    },
    changePassword () {
      let data = {}
      let formData = this.passwordForm
      if (formData.password.length <= 6) {
        formData.errorMessage = passwordMessageArray[0]
        return
      }
      if (/^([0-9]|[a-zA-Z])$/.test(formData.password)) {
        formData.errorMessage = passwordMessageArray[0]
        return
      }
      if (formData.password !== formData.passwordAgain) {
        formData.errorMessage = passwordMessageArray[2]
        return
      }
      data.phone = this.$store.getters.phone
      data.password = formData.password
      data.repassword = formData.passwordAgain
      data.verifyCode = formData.verifyCode
      Api.changePassword(data).then((res) => {
        if (res.code === 300000) {
          formData.errorMessage = ''
          this.$message('修改成功，系统将自动退出，请重新登陆')
          setTimeout(() => {
            this.$store.dispatch('Logout')
              .then(() => {
                location.reload()
              })
          }, 1000);
        } else {
          formData.errorMessage = res.msg
        }
      })
    },
    hidePasswordDialog () {
      this.passwordForm.errorMessage = ''
      this.passwordForm = {
        verifyCode: '',
        password: '',
        passwordAgain: '',
        errorMessage: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .container-siderbar {
    height: 100%;
  }
  .user-info {
    margin: 30px auto 10px;
    @include base(170px, 110px);
    text-align: center;
  }
  .user-avatar {
    display: block;
    margin: 0 auto 10px;
    @include base(64px, 64px);
    border-radius: 50%;
  }
  // 侧边栏收起
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
  }
  .aside-collapse {
    width: 64px !important;
    transition: width .2s ease-in;
    border-right: 1px solid #e0e0e0;
    .user-info {
      @extend %hide;
    }
  }
  .slogan {
    padding: 18px 0;
    background: #fff;
    @include fontStyle(16px, #000, 20px, center);
    font-weight: 600;
    border-bottom: 1px solid #e0e0e0;
  }
</style>
