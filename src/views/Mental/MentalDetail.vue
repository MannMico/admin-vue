<template>
<div>
        <h4 class="title-set">基础信息 - 用户脑力值详情</h4>
        <div class="border-set">
        <el-row class="table-row">
            <el-col :span="5">
                <div class="grid-content">基础信息</div>
            </el-col>
            <el-col :span="5">
                <div class="grid-content">脑力值基础数据</div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content">脑力值获取路径</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <div class="grid-content" prop="name">用户ID：<span v-text="getDetail.user_id"></span></div>
            </el-col>
            <el-col :span="5">
                <div class="grid-content">当前脑力值：<span v-text="getDetail.current_points"></span></div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content">
                    <div class="line">
                        <span>每日签到：</span>
                        <em v-text="getDetail.signCount">4</em>
                    </div>
                    <div class="line">
                        <span>参加小调查获取: </span>
                        <em v-text="getDetail.choose"></em>
                    </div>
                    <div class="line">
                        <span>是否完善资料: </span>
                        <em v-text="getDetail.infoCount==1?'是':'否'">是</em>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <div class="grid-content">用户昵称：<span v-text="getDetail.name"></span></div>
            </el-col>
            <el-col :span="5">
                <div class="grid-content">累计脑力值：<span v-text="getDetail.history_points"></span></div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content">
                    <div class="line">
                        <span>每日回复次数：</span>
                        <em v-text="getDetail.replyCount">4</em>
                    </div>
                    <div class="line">
                        <span>参加疯狂猜获取: </span>
                        <em v-text="getDetail.guess">100</em>
                    </div>
                    <div class="line">
                        <span>是否实名认证: </span>
                        <em v-text="getDetail.cardCount==1?'是':'否'">是</em>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <div class="grid-content">手机号：<span v-text="getDetail.phone"></span></div>
            </el-col>
            <el-col :span="5">
                <div class="grid-content">消费脑力值：<span v-text="getDetail.consume"></span></div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content">
                    <div class="line">
                        <span>每日点赞次数：</span>
                        <em v-text="getDetail.likeCount">4</em>
                    </div>
                    <div class="line">
                        <span>参加抢先测获取: </span>
                        <em v-text="getDetail.test">100</em>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <div class="grid-content">邮箱：<span v-text="getDetail.email"></span></div>
            </el-col>
            <el-col :span="5">
                <div class="grid-content">扣除脑力值：<span v-text="getDetail.history_points-getDetail.consume-getDetail.current_points"></span><div class="tips">注：因恶意评论而被平台扣除</div></div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content">
                    <div class="line">
                        <span>每日分享次数：</span>
                        <em v-text="getDetail.shareCount">4</em>
                    </div>
                    <div class="line">
                        <span>参加集创意获取: </span>
                        <em v-text="getDetail.speak">100</em>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <div class="grid-content"></div>
            </el-col>
            <el-col :span="5">
                <div class="grid-content"></div>
            </el-col>
            <el-col :span="14">
                <div class="grid-content">
                    <div class="line">
                        <span>参加画草图获取: </span>
                        <em v-text="getDetail.draw">100</em>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
    </div>
</template>
<script>
import * as mentalUrl from '@/api/mental/mental'
export default {
  name: 'MentalDetail',
  data () {
    return {
      getDetail: {}
      // --
    }
  },
  mounted () {
    var _this = this
    this.$nextTick(function () {
      mentalUrl.mentalEveryDetail({userId: this.$route.query.mentalDetailId})
        .then(data => {
          _this.getDetail = data.data
        })
        .catch(data => {
          _this.$message.error(data.msg)
        })
    })
  },
  methods: {

  },
  components: {

  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
  em{
      font-style: normal;
  }
  .el-row {
    margin-bottom: 20px;
    font-size: 14px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col{
    padding: 0 20px;

  }
  .table-row{
      background: #eee;
      line-height: 50px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    position: relative;
    .tips{
        position: absolute;
        color: red;
    }
    .line {
        float: left;
        margin-right: 20px;
        span {
            display: inline-block;
            vertical-align: top;
            width: 130px;
        }
    }
  }
  .border-set{
      border: 1px solid #eee;
  }
  .title-set{
      margin: 10px;
  }
</style>
