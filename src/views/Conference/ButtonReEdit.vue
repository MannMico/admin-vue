<template>
  <div class="re-edit-btns">
    <el-button type="primary" size="small" @click="reEditModule">重新编辑{{name}}</el-button>
    <div class="sort-input-box">
      <label>模板排序:</label>
      <el-input
        size="small"
        :maxlength="2"
        placeholder="请输入排序"
        style="display: inline-block; width: 100px;"
        @change="sortChangeHandler"
        v-model="moduleSort">
      </el-input>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ButtonReEdit',
  props: {
    // 模板名称
    name: {
      type: String,
      required: true
    },
    // 模板排序
    sort: {
      type: Number,
      required: true,
      default: 0
    },
    // 第几条数据
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      moduleSort: this.sort
    }
  },
  methods: {
    sortChangeHandler (val) {
      this.$emit('setSort', Number(val))
    },
    reEditModule () {
      this.$emit('reEditModule', 0)
      setTimeout(() => {
        location.href = `#moduleItem${this.index}`
      }, 10)
    }
  }
}
</script>
<style lang="scss" scoped>
  // 重新编辑 & 模板排序
  .re-edit-btns {
    margin: 20px 0 10px;
    text-align: center;
  }
  .sort-input-box {
    margin: 20px 0 10px;
    label {
      padding-right: 10px;
      font-size: 14px;
    }
  }
</style>
