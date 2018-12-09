<template>
  <div class="welcome-box">
    <div class="welcome-icon"></div>
    <h2 class="title">欢迎使用洛客管理后台</h2>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  created () {
    this.$store.dispatch('GetCitys')
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .welcome-box {
    @extend %ab-center;
    width: 500px;
  }
  .welcome-icon {
    margin: -80px auto 0;
    @include base(260px, 260px, url(../assets/images/welcome.png) no-repeat center);
    background-size: 100% 100%;
  }
  .title {
    margin-top: 60px;
    @include fontStyle(50px, #409eff, 1, center);
    font-weight: 400;
  }
</style>
