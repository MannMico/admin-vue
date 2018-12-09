<template>
  <div>
    <el-checkbox
      class="checkbox-item"
      v-model="multistage.checkAll"
      :indeterminate="multistage.values.length > 0 && multistage.values.length < multistage.childs.length"
      @change="handleCheckAllChange">
      <!-- multistage.id + '-' +  -->
      {{multistage.display_name}}
      <el-button
        type="text"
        v-if="multistage.childs && multistage.childs.length"
        :class="{unfold: !multistage.isShow, fold: multistage.isShow}"
        style="margin-left: 40px;"
        @click="multistage.isShow = !multistage.isShow">
        <span v-text="multistage.isShow ? '收起': '展开'"></span>
        <i class="el-icon-d-arrow-left"></i></el-button>
    </el-checkbox>
    <el-checkbox-group
      v-model="multistage.values"
      @change="handleCheckItemChange">
        <!-- ele.id + '=' +  -->
        <el-checkbox
        v-for="(ele, subIndex) in multistage.childs"
        :label="ele.id"
        :data-label="ele.id"
        v-show="multistage.isShow"
        :key="subIndex + 'third'"
        class="checkbox-group-item"
        >{{ele.display_name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>

export default {
  name: 'SubPermission',
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
    handleCheckAllChange (isChecked) {
      if (isChecked) {
        // 全选
        for (let item of this.multistage.childs) {
          this.multistage.values.push(item.id)
        }
      } else {
        // 取消全选
        this.multistage.values = []
      }
    },
    handleCheckItemChange (value) {
      let checkedCount = value.length
      this.multistage.checkAll = checkedCount === this.multistage.childs.length
      // this.handlerEmit()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .multistage-title {
    // 409EFF
    @include base(100%, 40px, #ccc);
    @include fontStyle(15px, #fff, 40px);
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
