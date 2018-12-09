<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      transitionName: ''
    }
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  html, body {
    @include base(100%, 100%);
  }
  .nav-absolute {
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
