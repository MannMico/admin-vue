<template>
  <!-- 内容区 -->
  <el-container>
    <!-- 头部 -->
    <el-header class="nav-header">
      <div class="header-box clearfix">
        <i class="el-icon-menu collapse-icon" @click="collapseChange"></i>
        <!-- 面包屑导航 -->
        <app-navbar class="breadcrumb-container"></app-navbar>
        <!-- 主题更换区域 -->
        <div class="theme-box">
          <!-- TODO 更换主题颜色 -->
          <!-- <el-color-picker v-model="themeColor" @change="themeColorChange"></el-color-picker> -->
          <!-- TODO 更换主题语言 -->
        </div>
      </div>
    </el-header>
    <!-- 访问过的tag区 -->
    <app-tags-view></app-tags-view>
    <!-- 内容主题区域 -->
    <el-main height="100%" class="main-box">
      <transition name="fade" mode="out-in">
         <!-- :include="cachedViews" -->
        <keep-alive :include="cachedViews">
          <router-view/>
        </keep-alive>
      </transition>
      <slot name="content"></slot>
    </el-main>
    <!-- 回到顶部 -->
    <back-to-top></back-to-top>
    <!-- 尾部 -->
    <el-footer height="40px" class="footer-box">
      © 2018 LKKER
    </el-footer>
  </el-container>
</template>
<script>

import AppNavbar from './BreadCrumb'
import AppTagsView from './TagsView'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'Main',
  components: {
    AppNavbar,
    AppTagsView,
    BackToTop
  },
  computed: {
    cachedViews () {
      return this.$store.getters.cachedViews
    }
  },
  data () {
    return {
      themeColor: this.$store.getters.themeColor
    }
  },
  methods: {
    collapseChange () {
      this.$store.dispatch('SetCollapse', !this.$store.getters.isCollapse)
    },
    themeColorChange (newColor) {
      this.$store.dispatch('SetThemeColor', newColor)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .nav-header {
    @extend %pr;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  }
  .header-box {
    height: 100%;
    line-height: 60px;
  }
  .collapse-icon {
    @extend %pa;
    top: 16px;
    left: 20px;
    font-size: 28px;
  }
  .theme-box {
    @extend %fr;
    margin: 10px 0;
    @include base(200px, 40px);
  }
  .main-box {
    @extend %pr;
  }
  .hamburger-container {
    float: left;
    padding: 0 10px;
    height: 50px;
    line-height: 60px;
  }
  .breadcrumb-container{
    float: left;
  }
  .footer-box {
    line-height: 40px;
    font-size: 13px;
    color: #676a6c;
    text-align: right;
    border-top: 1px solid #d8dce5;
  }
</style>
