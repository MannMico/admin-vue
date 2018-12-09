<template>
  <div class="multistage-item">
    <h5 class="multistage-title">
      <!-- multistage.id + '~' +  -->
      {{multistage.display_name}}
      <!-- fold/unfold -->
      <el-button
      type="text"
      :class="{unfold: !multistage.isShow, fold: multistage.isShow}"
      style="margin-left: 80px; color: #333;"
      @click="multistage.isShow = !multistage.isShow">
      <span v-text="multistage.isShow ? '收起': '展开'"></span>
      <i class="el-icon-d-arrow-left"></i></el-button>
    </h5>
    <div class="multistage-inner" v-show="multistage.isShow">
      <sub-permission
        v-for="(elem, i) in multistage.childs"
        :key="i + 'second'"
        :multistage="elem">
      </sub-permission>
    </div>
  </div>
</template>
<script>

import SubPermission from '@/components/Multistage/subPermission'
// import * as _ from 'lodash/array'

export default {
  name: 'MultistagePermission',
  components: { SubPermission },
  props: {
    // 每条数据
    multistage: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .multistage-title {
    // 409EFF
    @include base(100%, 40px, #ccc);
    @include fontStyle(15px, #333, 40px);
    text-indent: 10px;
    font-weight: 400;
    button {
      padding: 0;
      color: #fff;
    }
  }
  .multistage-box {
    margin-bottom: 20px;
    padding: 10px 20px;
    height: 300px;
    border: 1px dashed #eee;
    overflow-y: auto;
  }
  .multistage-item {
    margin-bottom: 20px;
  }
  .checkbox-group-item {
    margin-right: 20px;
    margin-left: 0;
  }
  .el-checkbox-group {
    margin-right: 20px;
    padding: 0 20px;
  }
  .multistage-inner {
    padding: 8px 20px 0;
  }
  .checkbox-item {
    width: 100%;
    margin-bottom: 10px;
  }
</style>
