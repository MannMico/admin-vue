<template>
  <div>
    <el-dialog
    :visible.sync="dialogVisible">
      <img class="big-image-src" :src="bigImageSrc" alt="big image">
    </el-dialog>
    <el-collapse v-model="activeItem">
      <el-collapse-item name="1" title="基本信息">
        <div>用户ID：{{data.id}}</div>
        <div>真实姓名：{{data.realName}}</div>
        <div>昵称：{{data.name}}</div>
        <div>头像：</div>
        <div><img class="head-image" :src="data.headImage"></div>
        <div>邦德等级：{{data.bondLevel}}</div>
        <div>手机号码：{{data.phone}}</div>
        <div>邮箱：{{data.email}}</div>
        <div>所在地区：{{data.location}}</div>
        <div>设计范围：{{data.designRange}}</div>
        <div>擅长领域：{{data.goodField}}</div>
        <div>工作年限：{{data.workYear}}</div>
        <div>作品数：{{data.opusNum}}</div>
        <div>个人签名：{{data.personalDesc}}</div>
        <div>设计观点：{{data.viewPoint}}</div>
        <div>申请时间：{{data.enrollTime}}</div>
        <div>入驻时间：{{data.bondVerifyTime}}</div>
      </el-collapse-item>
      <el-collapse-item name="2" title="工作经历">
        <div v-for="(v, k) in data.workHistory" :key="k">{{v.start_time}} 至 {{v.end_time}}: {{v.company}} | {{v.position}}</div>
      </el-collapse-item>
      <el-collapse-item name="3" title="项目经历">
        <div v-for="(v, k) in data.projectHistory" :key="k">
          <div>{{v.start_time}} 至 {{v.end_time}}: {{v.project_name}} | {{v.project_role}} | 获奖: <span v-for="(vv, k) in v.award" :key="k">{{decodeAwardName(vv)}} </span></div>
          <div>作品展示: </div>
          <div><img @click="zoomOut(vv)" class="opus-image" v-for="(vv, k) in v.image" :key="k" :src="vv" alt="opus"></div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" title="教育经历">
        <div v-for="(v, k) in data.college" :key="k">{{v.start_time}} 至 {{v.end_time}}: {{v.college_name}} | {{v.major}}</div>
      </el-collapse-item>
      <el-collapse-item name="5" title="获奖经历">
        <div v-for="(v, k) in data.award" :key="k">{{v.got_time}}: <span v-for="(vv, k) in v.award" :key="k">{{decodeAwardName(vv)}} </span> | {{v.detail}}</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {
      dialogVisible: false,
      bigImageSrc: '',
      activeItem: ['1', '2', '3', '4', '5'],
      data: {}
    }
  },
  methods: {
    decodeAwardName (type) {
      let awardName = ''
      switch (type) {
      case '1':
        awardName = '红点奖'
        break
      case '2':
        awardName = 'IF'
        break
      case '3':
        awardName = 'IDEA'
        break
      case '4':
        awardName = 'G-Mark'
        break
      case '5':
        awardName = '红星奖'
        break
      case '6':
        awardName = '中国好设计奖'
        break
      case '7':
        awardName = 'A-design'
        break
      case '8':
        awardName = '金点'
        break
      case '9':
        awardName = '金投赏'
        break
      case '10':
        awardName = '其他'
        break
      case '11':
        awardName = '博朗工业设计大赛'
        break
      case '12':
        awardName = '深圳环球设计大奖'
        break
      case '13':
        awardName = 'TOKYO TDC'
        break
      case '14':
        awardName = 'K-design'
        break
      case '15':
        awardName = '靳埭强设计奖'
        break
      case '16':
        awardName = 'GOOD DESIGN AWARD'
        break
      }
      return awardName
    },
    zoomOut (src) {
      this.dialogVisible = true
      this.bigImageSrc = src
    }
  },
  mounted () {
    var id = this.$route.params.id
    request({
      url: '/v1/designer/' + id + '/user-info',
      method: 'get'
    }).then((data) => {
      if (data.code == 300000) {
        this.data = data.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.head-image {
  width: 180px;
  height: 180px;
}
.opus-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.big-image-src {
  max-width: 100%;
  max-height: 100%;
}
</style>
