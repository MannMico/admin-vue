<template>
  <div class="wrap">
    <div class="container-login">
      <h2 class="title">洛客后台管理系统</h2>
      <el-container class="main">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          status-icon
          label-width="80px">
          <el-form-item
            label="账号"
            prop="username">
            <!-- :maxlength=11 -->
            <el-input
              class="el-input"
              v-model="loginForm.username"
              placeholder="请输入账号"
              auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              auto-complete="off"
              v-model="loginForm.password"
              >
            </el-input>
          </el-form-item>
          <el-form-item class="remember-box">
            <el-radio
              value="1"
              label="1">记住我
              </el-radio>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="submitForm('loginForm')"
              >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-container>
    </div>
  </div>
</template>

<script>

import { validateAccount, validatePassword } from '@/utils/validate'

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    document.onkeydown = (event) => {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        this.submitForm('loginForm');
      }
    }
  },
  destroyed () {
    document.onkeydown = null
  },
  methods: {
    toLogin () {
      this.loading = true
      this.$store.dispatch('Login', this.loginForm)
        .then(() => {
          this.$router.push({ path: '/' });
        })
        .catch((err) => {
          this.$message.error(err); // 登录失败提示错误
          this.loading = false
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.toLogin();
        } else {
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .wrap {
    @include base(100%, 100%, url(../assets/images/bg.jpg) no-repeat center);
    background-size: 100% 100%;
  }
  .container-login {
    @extend %ab-center;
  }
  .title {
    margin-bottom: 80px;
    @include fontStyle(44px, #fff, 50px,center);
    font-weight: 400;
  }
  .main {
    width: 400px;
    form,
    .login-btn {
      width: 100%;
    }
  }
  label {
    color: #fff;
  }
  .remember-box {
    margin: -8px 0 8px;
  }
</style>
