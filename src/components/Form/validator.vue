<template>
  <div class="form-box">
    <el-form
    class="search-form-box"
    v-if="formData"
    :inline="true"
    :model="formData"
    label-width="100px"
    v-show="showPackUpBtn">
      <el-form-item
        v-for="(value, key, index) in formData"
        :key="index"
        :label="value.label">
        <template
          v-if="value.type == 'input'">
          <!-- input -->
          <el-input
            v-model="formData.form[key]"
            :placeholder="value.placeholder"></el-input>
        </template>
        <template
          v-else-if="value.type == 'password'">
          <!-- input -->
          <el-input
            type="password"
            v-model="formData.form[key]"
            :placeholder="value.placeholder"></el-input>
        </template>
        <template
          v-else-if="value.type == 'select'">
          <!-- select -->
          <el-select
            v-model="formData.form[key]"
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
          <el-button type="primary" @click="onSubmit" v-text="value.btnText"></el-button>
        </template>
        <template
          v-else-if="value.type == 'date'">
          <el-date-picker
          v-model="formData.form[key]"
          type="datetimerange"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          :default-time="['12:00:00']">
        </el-date-picker>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['searchform'],
  data () {
    return {
      formData: this.searchform || ''
    }
  },
  methods: {
    onSubmit () {
      console.log(JSON.stringify(this.formData))
      this.$emit('queryData')
    }
  }
}
</script>
<style lang="scss">
  .form-box {
    position: relative;
    margin-top: 40px;
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
