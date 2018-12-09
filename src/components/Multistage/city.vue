<template>
  <div class="multistage-item">
   <el-checkbox
      class="checkbox-item"
      :indeterminate="formatData.value.length > 0 && formatData.value.length < multistage.citys.length"
      :key="multistage.id + 30"
      :data-key="multistage.id + 30"
      :label="multistage.id"
      v-model="formatData.checkAll"
      @change="handleCheckAllChange"
      >
      {{multistage.name}}
      （已选择：<span class="red">{{formatData.value.length}}</span>/{{multistage.citys && multistage.citys.length}}）
      <el-button
        type="text"
        :class="{unfold: !multistage.isShow, fold: multistage.isShow}"
        @click="multistage.isShow = !multistage.isShow">
        <span v-text="multistage.isShow == 1 ? '收起': '展开'"></span>
        <i class="el-icon-d-arrow-left"></i></el-button>
    </el-checkbox>
    <el-checkbox-group
      :key="multistage.level + 20"
      :data-key="multistage.level + 20"
      v-model="formatData.value"
      v-show="multistage.isShow == 1"
      @change="handleCheckItemChange">
      <el-checkbox
        v-for="(ele, i) in multistage.citys"
        :label="ele.id"
        :key="i"
        :data-key="i"
        class="checkbox-group-item">
        {{ele.name}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>

import * as _ from 'lodash/array'

export default {
  name: 'MultistageCity',
  props: {
    // 每条数据
    multistage: {
      type: Object,
      required: true
    },
    // 处理后的数据
    formatData: {
      type: Object,
      required: true
    },
    // 已经选中的城市的id
    hasCheckAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // formatCityData: this.formatData
    }
  },
  watch: {
    hasCheckAreas () {
      this.selectedItem()
    }
  },
  created () {
    this.selectedItem()
  },
  methods: {
    // 根据this.hasCheckAreas选中相应的checkbox
    selectedItem () {
      // 将this.hasCheckAreas转化成一维数组
      let areasArr = []
      for (let item of this.hasCheckAreas) {
        areasArr.push(item.value)
      }
      // 选中的城市如果存在该省份中，则变为选中状态
      for (let item of this.multistage.citys) {
        // this.hasCheckAreas.value
        if ((areasArr.indexOf(item.id) !== -1)) {
          let pos = this.formatData.value.indexOf(item.id)
          if (pos === -1) {
            this.formatData.value.push(item.id)
          }
        }
      }
      // 获取公共的即为format的值
      this.formatData.value = _.intersection(areasArr, this.formatData.value)
      // 判断该省份是否全选
      if (this.formatData.value.length === this.multistage.citys.length) {
        this.formatData.checkAll = true
      } else {
        this.formatData.checkAll = false
      }
    },
    // 选择省
    handleCheckAllChange (isChecked) {
      this.formatData.checkAll = isChecked
      this.formatData.value = []
      if (isChecked) {
        for (let city of this.multistage.citys) {
          this.formatData.value.push(city.id)
        }
        this.multistage.indeterminate = false
        // 打开省下的市
        this.multistage.isShow = true
      }
      this.handlerEmit()
    },
    // 选择市
    handleCheckItemChange (value) {
      let checkedCount = value.length
      this.formatData.checkAll = checkedCount === this.multistage.citys.length
      let flag = checkedCount > 0 && checkedCount < this.multistage.citys.length
      this.multistage.indeterminate = flag
      this.handlerEmit()
    },
    handlerEmit () {
      this.formatData.parent_id = this.multistage.id
      this.$emit('checkCity', this.formatData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .multistage-box {
    margin-bottom: 20px;
    padding: 10px 20px;
    height: 300px;
    border: 1px dashed #eee;
    overflow-y: auto;
  }
  .checkbox-group-item {
    margin-right: 20px;
    margin-left: 0;
  }
  .el-checkbox-group {
    margin-right: 20px;
    padding: 0 20px;
  }
  .checkbox-item {
    width: 100%;
    margin-bottom: 10px;
  }
</style>
