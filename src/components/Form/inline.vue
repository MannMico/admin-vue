<template>
  <div
    class="search-form-wrap"
    :style="{ marginTop: showFilterBtn ? '40px': '0' }">
    <el-form
      class="search-form-box"
      v-if="formData"
      :inline="true"
      :model="formData"
      :label-width=labelWidth
      v-show="showPackUpBtn"
      >
      <el-form-item
        v-for="(value, key, index) in formData"
        :key="index"
        :label="value.label">
        <template
          v-if="value.type == 'input'">
          <!-- input -->
          <el-input
            v-model="formData.form[key]"
            :style="{ width: widgetWidth }"
            :placeholder="value.placeholder"></el-input>
        </template>
        <template
          v-else-if="value.type == 'password'">
          <!-- input -->
          <el-input
            type="password"
            :style="{ width: widgetWidth }"
            v-model="formData.form[key]"
            :placeholder="value.placeholder"></el-input>
        </template>
        <template
          v-else-if="value.type == 'select'">
          <!-- select -->
          <el-select
            v-model="formData.form[key]"
            :style="{ width: widgetWidth }"
            :placeholder="value.placeholder"
            >
            <el-option
              v-for="(ele, i) in value.list"
              :key="i"
              :label="ele.label"
              :value="ele.value"></el-option>
          </el-select>
        </template>
        <template
          v-else-if="value.type == 'button'">
          <el-button
            type="primary"
            @click="onSubmit"
            v-text="value.btnText"
            style="margin-left: 20px;"></el-button>
        </template>
        <template
          v-else-if="value.type == 'primaryButton'">
          <el-button
            type="primary"
            @click="primaryEvent"
            v-text="value.btnText"
            style="margin-left: 20px;"></el-button>
        </template>
        <template
          v-else-if="value.type == 'date'">
          <el-date-picker
          v-model="formData.form[key]"
          value-format="yyyy-MM-dd"
          type="datetimerange"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          :default-time="['12:00:00']">
        </el-date-picker>
        </template>
        <template
          v-else-if="value.type == 'autocomplete'">
          <el-autocomplete
            v-model="formData.form[key]"
            :style="{ width: widgetWidth }"
            :placeholder="value.placeholder"
            :fetch-suggestions="value.fetchSuggestions"
            @select="value.handleSelect"
            :trigger-on-focus="false"
            :value="value.autocompleteValue"
            :value-key="value.autocompleteValueKey"
          >
          </el-autocomplete>
        </template>
      </el-form-item>
    </el-form>
    <el-button
      v-if="showFilterBtn"
      :type="showPackUpBtn ? 'primary' : ''"
      class="packup-btn"
      size="small"
      @click="showPackUpBtn = !showPackUpBtn">
      <span v-text="showPackUpBtn ? '收起搜索' : '展开搜索'"></span>
      <i class="el-icon--right"
        :class="{'el-icon-arrow-down': showPackUpBtn, 'el-icon-arrow-up': !showPackUpBtn}"></i>
    </el-button>
  </div>
</template>
<script>

export default {
  name: 'searchForm',
  props: {
    // 数据
    searchform: {
      type: Object,
      required: true
    },
    // label 宽度
    labelWidth: {
      type: String,
      default: '100px'
    },
    // 是否显示收起按钮
    showFilterBtn: {
      type: Boolean,
      default: true
    },
    // input 或者 option的宽度
    widgetWidth: {
      type: String,
      default: '160px'
    }
  },
  data () {
    return {
      formData: this.searchform || '',
      showPackUpBtn: true
    }
  },
  methods: {
    onSubmit () {
      console.log(JSON.stringify(this.formData))
      this.$emit('queryData')
    },
    primaryEvent () {
      this.$emit('primaryEvent')
    }
  }
}
</script>
<style lang="scss">
  .search-form-wrap {
    position: relative;
  }
  .search-form-box {
    padding-top: 20px;
    border: 1px dashed #ebeef5;
  }
  .packup-btn {
    position: absolute;
    top: -32px;
    right: 0;
  }
</style>
