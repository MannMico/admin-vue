<template>
  <div class="flows-box">
    <h5 class="title">渠道线索收集数趋势</h5>
    <!-- 筛选区域 -->
    <div class="filter">
      <!-- 对比前一日 -->
      <el-checkbox
        class="checkbox-compare"
        v-show="showPrev"
        v-model="compareWithPrev"
        @change="changeSearchCompare">对比前一日</el-checkbox>
      <!-- 请选择渠道 -->
      <!-- <el-select
        v-model="param.utm_source"
        size="small"
        placeholder="请选择渠道"
        style="margin-left: 100px; width: 200px;"
        @change="changeChannel">
        <el-option
          v-for="item in allChannels"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->

      <el-autocomplete
        style="margin-left: 50px;"
        v-model="allChannelsModel"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
        size="small"
      ></el-autocomplete>
    </div>
    <!-- 折线图 -->
    <div class="echarts-item">
      <chart
        :options="line"
        :init-options="{
          width: '800px'
        }"
        auto-resize
      />
    </div>
    <!-- 饼状图 -->
    <div>
      <chart
        :options="pie"
        :init-options="{
          width: '800px'
        }"
        auto-resize
      />
    </div>
  </div>
</template>
<script>

import ECharts from '@/components/ECharts'

import * as Channels from '@/api/channels'
import * as _array from 'lodash/array'

export default {
  name: 'ChannelClues',
  components: {
    'chart': ECharts
  },
  props: {
    // 时间筛选条件
    filter: {
      type: Object,
      required: true
    },
    // 是否显示“对比前一日”
    showPrev: {
      type: Boolean,
      required: true,
      default: () => {
        return false
      }
    },
    // 所有渠道
    channels: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    // 当前模块
    module: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      param: {
        utm_source: ''
      },
      // 是否选中‘前一日比较’
      compareWithPrev: false,
      line: {},
      pie: {},
      allChannelsModel: '',
      flowsType: 1,
      utmSourceModel: '',
      getChannelSizeTenLock: true
    }
  },
  watch: {
    // 'filter.time': function (newVal, oldVal) {
    //   if (newVal && newVal.length && this.module === '2') {
    //     this.compareWithPrev = false
    //     this.serachCluesData()
    //   }
    // },
    filter: {
      handler: function (newValue, oldValue) {
        if (this.module == '2') {
          if (this.getChannelSizeTenLock) {
            if (newValue.time && newValue.time.length) {
              this.getChannelListNoInput()
            }
          } else {
            if (newValue.time && newValue.time.length) {
              this.compareWithPrev = false
              this.serachCluesData()
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    'showPrev': function (newVal, oldVal) {
      // 不显示‘前一日’比较 => 重置
      if (!newVal) {
        this.compareWithPrev = false
      }
    },
    // 'module': function (newVal, oldVal) {
    //   // 选择的模块变化
    //   if (newVal === '2') {
    //     this.serachCluesData()
    //   }
    // },
    'module': function (newVal, oldVal) {
      // 选择的模块变化
      if (newVal === '2') {
        if (this.getChannelSizeTenLock) {
          this.getChannelListNoInput()
        } else {
          this.serachCluesData()
        }
      }
    },
    allChannelsModel: {
      handler: function (newValue, oldValue) {
        if (this.module == '2') {
          if (newValue == '') {
            this.getChannelSizeTenLock = true
            this.getChannelListNoInput()
          } else {
            this.getChannelSizeTenLock = false
            this.serachCluesData()
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 所有渠道数据，添加'全部渠道'显示
    allChannels () {
      let channel = [
        {
          value: '',
          label: '全部渠道'
        }
      ]
      return channel.concat(this.channels)
    },
    // 格式化查询参数
    searchParams () {
      let result = {}
      let { filter } = this
      if (filter.time.length > 0) {
        // 选中的日期
        result = {
          begin_at: filter.time[0],
          end_at: filter.time[1]
        }
      }
      result = {
        ...result,
        type: this.flowsType,
        utm_source: this.utmSourceModel
      }
      for (let key in result) {
        if (!result[key]) {
          delete result[key]
        }
      }
      return result
    }
  },
  methods: {
    getChannelListNoInput () {
      setTimeout(() => {
        let param = {
          begin_at: this.filter.time[0],
          end_at: this.filter.time[1],
          size: 10,
          type: this.flowsType
        }
        Channels.getChannelListNoInput(param)
          .then(res => {
            if (res.code === 300000) {
              this.searchParams.utm_source = res.data[0].utm_source
              this.serachCluesData()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(this.errHandler)
      })
    },
    querySearchAsync (queryString, cb) {
      if (queryString != '' && queryString != undefined) {
        Channels.getChannelList({name: queryString, page: 1, limit: 0}).then(res => {
          if (res.code === 300000) {
            let result = []
            for (let item of res.data.data) {
              result.push({
                value: item.name,
                utm_source: item.utm_source
              })
            }
            cb(result)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(this.errHandler)
      } else {
        let param = {
          begin_at: this.filter.time[0],
          end_at: this.filter.time[1],
          size: 10,
          type: this.flowsType
        }
        Channels.getChannelListNoInput(param).then(res => {
          if (res.code === 300000) {
            let result = []
            for (let item of res.data) {
              result.push({
                value: item.name,
                utm_source: item.utm_source
              })
            }
            cb(result)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(this.errHandler)
      }
    },
    handleSelect (item) {
      this.getChannelSizeTenLock = false
      this.utmSourceModel = item.utm_source
      this.compareWithPrev = false
      this.serachCluesData()
    },
    // catch提示
    errHandler (err) {
      this.$message.error(err)
    },
    // 改变查询类型 pv/uv
    changeSearchType (newVal) {
      this.compareWithPrev = false
      this.serachCluesData()
    },
    // 查询渠道改变
    // changeChannel (newVal) {
    //   this.compareWithPrev = false
    //   this.serachCluesData()
    // },
    // 根据时间，转化为前一天日期
    getTime (time, day, separator = '-') {
      day = Math.abs(day)
      // 获取目标时间戳
      let date = new Date(time)
      let timestamp = date.getTime() - 3600 * 1000 * 24 * day
      date.setTime(timestamp)
      let month = date.getMonth() + 1
      month = month < 10 ? ('0' + month) : month
      return date.getFullYear() + separator + month + separator + date.getDate()
    },
    // 是否需要与‘前一日’对比
    changeSearchCompare (newVal) {
      if (newVal) {
        // 需要 => 获取‘前一日’的时间
        let beginAt = this.searchParams.begin_at
        beginAt = beginAt ? this.getTime(beginAt, 1) : ''
        if (!beginAt) {
          return
        }
        Channels.channelCluesCount({ ...this.searchParams, begin_at: beginAt, end_at: beginAt })
          .then(res => {
            if (res.code === 300000) {
              // 将昨日数据拼到line中
              this.getPrevDayLineOptions(res.data)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(this.errHandler)
      } else {
        // 不需要，将line中的‘昨日’数据删掉
        this.clearPrevDayLineOptions()
      }
    },
    // 在查询日期的数据基础上，获取‘前一日’数据，并显示
    getPrevDayLineOptions (result) {
      let { byTime } = result
      let lineOption = this.line
      lineOption.legend.data.push('昨天')
      lineOption.series.push({
        name: '昨天',
        type: 'line',
        data: []
      })
      for (let item of byTime) {
        lineOption.series[1].data.push(item.clue_num)
      }
    },
    // 清除‘昨日’的数据
    clearPrevDayLineOptions () {
      let lineOption = this.line
      // legend
      if (lineOption.legend.data.length > 1) {
        _array.pullAt(lineOption.legend.data, 1)
      }
      // series.data
      if (lineOption.series.length > 1) {
        _array.pullAt(lineOption.series, 1)
      }
    },
    // 查询渠道流量数据
    serachCluesData () {
      Channels.channelCluesCount(this.searchParams)
        .then(res => {
          if (res.code === 300000) {
            this.getChartsOptions(res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(this.errHandler)
    },
    // 根据返回数据设置echarts数据，byTime：折线；byChannel：饼图
    getChartsOptions (result) {
      let { byTime = [], byChannel = [] } = result
      let pieOption = this.getPieOptions()
      pieOption.title.text = '各渠道线索收集数对比'
      for (let item of byChannel) {
        pieOption.legend.data.push(item.channel_name || 'test数据')
        pieOption.series[0].data.push({
          value: item.clue_num,
          name: item.channel_name || 'test数据'
        })
      }
      this.pie = pieOption
      let lineOption = this.getLineOptions()
      lineOption.xAxis.data = []
      lineOption.legend.data.push('搜索结果')
      lineOption.series.push({
        name: '搜索结果',
        type: 'line',
        data: []
      })
      for (let item of byTime) {
        lineOption.xAxis.data.push(item.date || item.hour)
        lineOption.series[0].data.push(item.clue_num)
      }
      this.line = lineOption
    },
    // 基础的折线数据结构
    getPieOptions () {
      return {
        title: {
          text: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          itemWidth: 20, // 图例宽度
          itemHeight: 10, // 图例高度
          itemGap: 6, // 图例间隔
          top: 30,
          left: 'left',
          data: []
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['65%', '50%'],
            // {value: 335, name: '360'}
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    // 基础饼状图数据结构
    getLineOptions () {
      let time24 = [];
      for (let i = 0; i < 24; i++) {
        time24.push(i)
      }
      return {
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // '搜索结果', '前一日'
          data: []
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: time24
        },
        yAxis: {
          name: '数量',
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          /* {
            name: '昨日',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10]
          } */
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .flows-box {
    padding: 0 20px;
  }
  .title {
    margin: 10px 0;
    font-size: 16px;
    font-weight: 400;
  }
  .filter {
    margin-top: 24px;
  }
  .checkbox-compare {
    margin: 0 100px;
  }
  .echarts-item {
    border-bottom: 1px solid #e4e4e4;
  }
</style>
