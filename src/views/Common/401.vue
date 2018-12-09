<template>
  <div class="errPage-container">
    <el-button @click="back" icon='arrow-left' class="pan-back-btn">返回</el-button>
    <el-row>
      <el-col :span="10">
        <h1 class="text-jumbo text-ginormous">你没有权限去该页面</h1>
        <!-- <h2 class="no-permission">你没有权限去该页面</h2> -->
        <h6 class="concat-me">如有任何问题可以联系产品部张蕊(13693393948<br/>zhangrui-lk@lkkdesign.com )，7*24h竭诚为您服务。；若没解决您的问题，可以来北京洛客1楼直接暴揍。</h6>
        <ul class="list-unstyled">
          <li>或者你可以去:</li>
          <li class="link-type">
            <router-link to="/layout/welcome">回首页</router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="14">
        <img :src="errGif" width="500" alt="你来打我啊">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/images/401/401-1.gif'

export default {
  name: 'page401',
  data () {
    return {
      errGif: errGif + '?' + +new Date()
    }
  },
  methods: {
    back () {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
    .pan-back-btn {
      background: #1482f0;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
    }
    .text-jumbo {
      font-size: 34px;
      font-weight: 700;
    }
    .text-ginormous {
      margin: 30px 0;
    }
    .no-permission {
      margin-bottom: 20px;
      font-size: 24px;
    }
    .concat-me {
      font-size: 16px;
      line-height: 26px;
      color: #1482f0;
    }
    .list-unstyled {
      margin-top: 20px;
      padding-left: 20px;
      font-size: 16px;
      li {
        padding-bottom: 5px;
      }
      a {
        font-size: 14px;
        color: #1482f0;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
