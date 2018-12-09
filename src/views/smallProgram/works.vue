<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="搜索类型" prop="themeType">
        <el-radio-group v-model="ruleForm.related_type">
          <el-radio  label="-1">无</el-radio>
          <el-radio  label="1">主题名</el-radio>
          <el-radio  label="2">用户名</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="24">
        <el-input
                placeholder="请输入内容"
                v-model="searchContent"
                clearable style="width: 20%;margin-bottom: 15px">
        </el-input>
        <el-button type="primary"  @click="search()">提交</el-button>
      </el-col>
    </el-row>
    <el-table
            :data="tableData"
            border
            style="width: 100%">
      <el-table-column
              prop="theme.title"
              label="所在主题"
              width="200">
      </el-table-column>
      <el-table-column
              prop="updated_at"
              label="完成时间"
              width="180">
      </el-table-column>
      <el-table-column
              prop="user.name"
              label="用户名"
              width="150">
      </el-table-column>
      <el-table-column
              prop="user.head_image"
              label="头像"
              width="150">
        <template slot-scope="obj">
          <img :src="obj.row.user.head_image" alt="" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column
              prop="user.sex"
              label="性别"
              width="100">
        <template slot-scope="scope">
          {{scope.row.user.sex==1 ?'男':''}}
          {{scope.row.user.sex==2 ?'女':''}}
          {{scope.row.user.sex==0 ?'保密':''}}
        </template>
      </el-table-column>
      <el-table-column
              prop="paint"
              label="图片"
              width="150">
        <template slot-scope="obj">
          <img :src="obj.row.paint" alt="" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column
              prop="view_num"
              label="浏览量"
              width="100">
      </el-table-column>
      <el-table-column
              prop="like_num"
              label="被喜欢"
              width="100">
      </el-table-column>
      <el-table-column
              label="操作"
              width="120">
        <template slot-scope="scope">
          <el-button
                  v-permission="'v1.draw.opus.delete'"
                  @click="deleteTheme(scope.row.id)"
                  type="primary"
                  size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top:20px;">
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage4"
              :page-sizes="[10]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="list.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import * as SowingMap from '@/api/miniProgram/sowingMap'
export default {
  data () {
    return {
      // 搜索框
      searchContent: '',
      tableData: [],
      currentPage4: 1,
      ruleForm: {
        related_type: '-1'
      },
      list: {
        loading: true,
        total: 0,
        page: 1,
        name: '',
        limit: 10
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    search () {
      this.list.page = 1
      this.getList()
    },
    getList () {
      this.list.loading = true
      let map = {
        limit: this.list.limit,
        page: this.list.page
      }
      let tepe = this.ruleForm.related_type
      if (tepe === '-1') {
        this.searchContent = ''
      } else {
        if (this.searchContent.length == 0) {
          this.$message.error('请输入搜索类型')
          this.ruleForm.related_type = '-1'
        } else {
          map = Object.assign(map, {type: this.ruleForm.related_type, value: this.searchContent})
        }
      }
      SowingMap.getopuses(map)
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            this.tableData = data.data.data
            this.list.total = Number(data.data.total)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.list.page = val
      this.getList(this.list.page)
    },
    deleteTheme (id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '删除作品',
        message: h('p', null, [
          h('span', null, '当作品被删除后，该作品与喜欢一起被删除,同时删除其他用户喜欢列表中的该作品'),
          h('i', { style: 'color: #606266' }, '')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
                SowingMap.deleteOpuses(id)
                  .then(data => {
                    if (data.code === 300000) {
                      this.list.page = 1
                      this.getList()
                    } else {
                      this.$message.error(data.msg)
                    }
                  })
                  .catch(this.errHandler)
              }, 100);
            }, 1000);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: '删除: ' + '成功'
        });
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .container-main {
    position: absolute;
    top: 0;
    left: 0;
    @include base(100%, 100%);
  }
  .container {
    height: 100%;
    border: 1px solid #eee;
  }
</style>
