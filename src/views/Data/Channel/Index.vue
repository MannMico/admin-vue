<template>
  <div>
    <!-- 筛选区域 -->
    <div class="filter-box">
      <h3 class="filter-title ">筛选条件</h3>
      <el-radio-group
        size="small"
        v-model="filter.fastSelectTime"
        @change="selectTimeChangeHandler">
        <el-radio-button :label="0">今天</el-radio-button>
        <el-radio-button :label="-1">昨天</el-radio-button>
        <el-radio-button :label="7">最近7天</el-radio-button>
        <el-radio-button :label="30">最近30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="filter.time"
        type="daterange"
        unlink-panels
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="dataChangeHandler"
        :picker-options="pickerOptions"
        ref="datePicker">
      </el-date-picker>
    </div>
    <!-- 模块筛选区域 -->
    <el-tabs
      class="tabs-box"
      type="border-card"
      v-model="activeName"
      @tab-click="handleClick">
      <el-tab-pane label="渠道流量情况分析" name="0">
        <channel-flows
          v-permission="'v1.channel.channel.flows'"
          :filter="filter"
          :channels="channels"
          :showPrev="showPrev"
          :module="activeName"
        ></channel-flows>
      </el-tab-pane>
      <el-tab-pane label="渠道注册用户数分析" name="1">
        <channel-registrations
          v-permission="'v1.channel.channel.registrations'"
          :filter="filter"
          :channels="channels"
          :showPrev="showPrev"
          :module="activeName"
        ></channel-registrations>
      </el-tab-pane>
      <el-tab-pane label="渠道线索收集分析" name="2">
        <channel-clues
          v-permission="'v1.channel.channel.clues'"
          :filter="filter"
          :channels="channels"
          :showPrev="showPrev"
          :module="activeName"
        ></channel-clues>
      </el-tab-pane>
      <el-tab-pane label="渠道详细数据" name="3">
        <channel-details
          v-permission="'v1.channel.channel.details'"
          :filter="filter"
          :module="activeName">
        </channel-details>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

import * as _collection from 'lodash/collection'

import Flows from './Flows'
import Registrations from './Registrations'
import Clues from './Clues'
import Details from './Details'
export default {
  name: 'ChannelData',
  // 组件
  components: {
    'channel-flows': Flows,
    'channel-registrations': Registrations,
    'channel-clues': Clues,
    'channel-details': Details
  },
  data () {
    return {
      // 各模块公用的筛选参数
      filter: {
        // 昨天: -1, 今天: 0, 7天: 7, 30天: 30， 手动收入日期: ''
        fastSelectTime: 0,
        time: []
      },
      // 展示的模块 0-3
      activeName: '0',
      // 所有渠道
      channels: [],
      // 当前时间日期选择器特有的选项
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const time = new Date();
              time.setTime(time.getTime());
              picker.$emit('pick', [time, time]);
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              const time = start.getTime() - 3600 * 1000 * 24 * 1
              start.setTime(time);
              end.setTime(time);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近7天',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近30天',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    }
  },
  computed: {
    // 是否显示“对比前一日”
    showPrev () {
      let isShow = true
      let { fastSelectTime, time } = this.filter
      time = time || []
      // 不是选择的昨日
      if (fastSelectTime != -1) {
        isShow = false
      } else {
        isShow = true
      }
      // 完整的开始 / 结束日期
      if (time.length > 0) {
        time = _collection.map(time, (v) => {
          return Number(v.replace(/-/g, ''))
        })
        if (time[1] - time[0] !== 0) {
          isShow = false
        } else {
          isShow = true
        }
      }
      return isShow
    }
  },
  created () {
    // this.setYesterdayTime()
  },
  mounted () {
    this.$nextTick(() => {
      // 默认选择‘今天’
      this.selectTimeChangeHandler(0)
    })
  },
  methods: {
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // 设置默认时间段（昨天）
    setYesterdayTime () {
      let yesterdayTime = new Date().getTime() - 3600 * 1000 * 24 * 1
      this.filter.time = [ yesterdayTime, yesterdayTime ]
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    // 获取“昨天”、“最近7天”、“最近30天”对应的时间格式
    getSelectTimeArr (val) {
      val = Math.abs(val)
      const end = new Date();
      const start = new Date();
      const time = start.getTime() - 3600 * 1000 * 24 * val
      start.setTime(time);
      if (val == 1) {
        // 昨天
        end.setTime(time);
      }
      return [start, end]
    },
    // 选择了时间段选择
    selectTimeChangeHandler (newVal) {
      this.$refs.datePicker.emitInput(this.getSelectTimeArr(newVal))
    },
    // 日期选择有变化
    dataChangeHandler (checkTimeArr) {
      // 选择了日期
      if (checkTimeArr && checkTimeArr.length) {
        this.filter.fastSelectTime = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .filter-box {
    padding: 20px;
    border: 1px dashed #ebeef5;
    .el-date-editor {
      vertical-align: -1px;
    }
  }
  .filter {
    margin-top: 24px;
  }
  .filter-title {
    margin-bottom: 10px;
    font-weight: 400;
  }
  .tabs-box {
    margin-top: 20px;
  }
</style>
