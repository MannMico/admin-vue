<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="审核状态">
        <el-select v-model="formData.verifyStatus">
          <el-option
            v-for="(v, k) in verifyStatus"
            :key="k"
            :value="v.value"
            :label="v.label"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-button @click="getData">搜索</el-button>
    </el-form>
    <el-table
      :data="tableData">
      <el-table-column
        prop="id"
        label="作品编号">
      </el-table-column>
      <el-table-column
        prop="title"
        label="作品名">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="image"
        label="作品">
        <template slot-scope="ss">
          <img :src="ss.row.image[0]" alt="" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column
        prop="designerName"
        label="设计师昵称">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="设计描述">
      </el-table-column>
      <el-table-column
        prop="bondLevel"
        label="设计师等级">
      </el-table-column>
      <el-table-column
        prop="verify_status"
        label="审核状态">
        <template slot-scope="ss">
          <div>{{getVerifyStatusText(ss.row.verify_status)}}</div>
          <div>操作者：{{ss.row.verify_user}}</div>
          <div>{{ss.row.updated_at}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="ss">
          <el-button type="text" v-if="ss.row.verify_status == 0" @click="showDialog(ss.row)">30强</el-button>
          <el-button type="text" v-if="ss.row.verify_status == 0" @click="denyAward(ss.row)">剔除30强</el-button>
          <el-button type="text" @click="toDetail(ss.row)">设计师详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" width="20%">
      <el-form>
        <el-form-item label="选择入围者奖项">
          <el-select v-model="awardLevel">
            <el-option label="一等奖（4万）" :value="1"></el-option>
            <el-option label="二等奖（2万）" :value="2"></el-option>
            <el-option label="三等奖（8千）" :value="3"></el-option>
            <el-option label="优秀奖（1千）" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <slot name="footer">
          <el-button @click="passAward">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </slot>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data () {
    return {
      dialogVisible: false,
      awardLevel: '',
      row: {},
      formData: {
        verifyStatus: -1
      },
      verifyStatus: [
        {
          label: '剔除30强',
          value: 0
        },
        {
          label: '30强',
          value: 1
        },
        {
          label: '待审核',
          value: 2
        },
        {
          label: '全部',
          value: -1
        }
      ],
      tableData: [{
        id: 0,
        created_at: '',
        updated_at: '',
        task_id: 0,
        designer_id: '',
        title: '',
        image: [],
        describe: '',
        verify_user: '',
        verify_status: 0,
        award_level: 0,
        designerName: '',
        bondLevel: 0,
        image_num: 0
      }]
    }
  },
  methods: {
    toDetail (obj) {
      this.$router.push('/design-power/designer/' + obj.designer_id)
    },
    getData () {
      let params = {}
      params.verifyStatus = this.formData.verifyStatus
      params.taskId = this.$route.params.id
      request({
        url: '/v1/designer/partner-opus-list',
        method: 'get',
        params: params
      }).then(data => {
        if (data.code == 300000) {
          this.tableData = data.data.data
        }
      })
    },
    showDialog (obj) {
      this.dialogVisible = true
      this.row = obj
    },
    passAward () {
      request({
        url: '/v1/designer/' + this.row.id + '/partner-opus-update',
        method: 'patch',
        data: {
          awardLevel: this.awardLevel,
          verifyStatus: 1
        }
      }).then(data => {
        if (data.code == 300000) {
          this.$router.go()
        }
      })
    },
    denyAward (obj) {
      request({
        url: '/v1/designer/' + obj.id + '/partner-opus-update',
        method: 'patch',
        data: {
          awardLevel: 0,
          verifyStatus: 2
        }
      }).then(data => {
        if (data.code == 300000) {
          this.$router.go()
        }
      })
    },
    getVerifyStatusText (num) {
      var str
      switch (num) {
      case 0:
        str = '未审核'
        break
      case 1:
        str = '审核通过'
        break
      case 2:
        str = '未通过审核'
        break
      }
      return str
    }
  },
  mounted () {
    request({
      url: '/v1/designer/partner-opus-list',
      method: 'get',
      params: {
        taskId: this.$route.params.id
      }
    }).then(data => {
      if (data.code == 300000) {
        this.tableData = data.data.data
      }
    })
  }
}
</script>
