<template>
  <div class="input-counter" style="color: #999">
    <span :style="sty">{{ content.length }}</span>/<span>{{ maxlength }}</span>
  </div>
</template>
<script>
export default {
  props: ['maxlength', 'content'],
  computed: {
    sty () {
      if (this.content.length == this.maxlength) {
        return {color: '#f00'}
      } else {
        return {color: '#000'}
      }
    }
  }
}
</script>
<style>
  .input-counter {
    position: absolute;
    bottom: 0;
    right: 10px;
  }
</style>
