<template>
  <el-container class="container-main container">
    <app-siderbar v-if="!isAddQuotePage"></app-siderbar>
    <app-main></app-main>
  </el-container>
</template>
<script>

import AppSiderbar from './components/Siderbar'
import AppMain from './components/Main'

export default {
  name: 'layout',
  components: {
    AppSiderbar,
    AppMain
  },
  data () {
    return {
      isAddQuotePage: false,
      currentPath: ''
    }
  },
  mounted () {
    if (this.$route.path.includes(`quote/add-quote`)) {
      this.isAddQuotePage = true
    } else {
      this.isAddQuotePage = false
    }
  },
  computed: {
  },
  watch: {
    $route (to, from) {
      if (to.path.includes(`quote/add-quote`)) {
        this.isAddQuotePage = true
      } else {
        this.isAddQuotePage = false
      }
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
