<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :width='dialogWidth'
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'>
      <template
        v-if="dialogForm && !needValidator">
        <el-form
          :model="dialogForm">
          <el-form-item
            v-for="(item, key, index) in dialogForm"
            :key="index"
            :label="item.label"
            :label-width="formLabelWidth">
            <template
              v-if="item.type == 'input'">
              <!-- input text -->
              <el-input
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
                auto-complete="off">
              </el-input>
            </template>
            <template
              v-else-if="item.type == 'password'">
              <!-- input password -->
              <el-input
                type="password"
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
                auto-complete="off">
              </el-input>
            </template>
            <template
              v-else-if="item.type == 'coder'">
              <!-- input && count-down -->
              <el-input
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
                auto-complete="off">
              </el-input>
            </template>
            <template
              v-else-if="item.type == 'select'">
              <!-- select -->
              <el-select
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="(ele, i) in item.list"
                  :key="i"
                  :label="ele.label"
                  :value="ele.item"></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.type == 'date'">
              <el-date-picker
              v-model="dialogForm.form[key]"
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
      </template>
      <template
        v-else-if="dialogForm && needValidator">
        <!-- 验证规则 -->
        <el-form
          :model="dialogForm.form"
          :rules="dialogRules"
          ref="dialogForm"
          status-icon>
          <el-form-item
            v-for="(item, key, index) in dialogForm"
            :key="index"
            :label="item.label"
            :label-width="formLabelWidth"
            :prop="key"
            :aaa="key">
            <template
              v-if="item.type == 'input'">
              <!-- input text -->
              <el-input
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
                auto-complete="off">
              </el-input>
            </template>
            <template
              v-else-if="item.type == 'password'">
              <!-- input password -->
              <el-input
                type="password"
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
                auto-complete="off">
              </el-input>
            </template>
            <template
              v-else-if="item.type == 'coder'">
              <!-- input && count-down -->
              <el-input
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
                auto-complete="off">
              </el-input>
            </template>
            <template
              v-else-if="item.type == 'select'">
              <!-- select -->
              <el-select
                v-model="dialogForm.form[key]"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="(ele, i) in item.list"
                  :key="i"
                  :label="ele.label"
                  :value="ele.item"></el-option>
              </el-select>
            </template>
            <template
              v-else-if="item.type == 'date'">
              <el-date-picker
              v-model="dialogForm.form[key]"
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
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeStatus(false)">取 消</el-button>
        <el-button type="primary" @click="changeStatus(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DialogInputForm',
  props: {
    // 宽度
    dialogWidth: {
      type: String,
      default: '50%'
    },
    // 显示的title
    title: {
      type: String,
      default: '',
      required: true,
      validator (value) {
        return value.length > 0
      }
    },
    // 弹窗显示 or 隐藏
    dialogFormVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    // form label的宽度
    formLabelWidth: {
      type: String,
      default: '120px'
    },
    // form表单
    dialogForm: {
      type: Object,
      required: true
    },
    // 是否需要校验form中的字段
    needValidator: {
      type: Boolean,
      default: false
    },
    // 验证规则
    dialogRules: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 更改父组件的值
    changeStatus (bool) {
      this.$emit('changeStatus', bool)
    },
    // TODO 为了验证password是否一致
    getPasswordAgain () {
      return this.dialogForm.form.passwordAgain
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer {
    margin-top: -10px;
  }
</style>
