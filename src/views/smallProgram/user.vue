<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">用户列表</span>
        <el-input
                placeholder="请输入用户名"
                v-model="searchContent"
                clearable style="width: 20%;margin-bottom: 15px">
        </el-input>
        <el-button type="primary"  @click="search()">提交</el-button>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
          <el-table-column
                  prop="name"
                  label="用户名"
                  width="100">
          </el-table-column>
          <el-table-column
                  prop="head_image"
                  label="头像"
                  width="200">
            <template slot-scope="obj">
              <img :src="obj.row.head_image" alt="" width="150" height="150">
            </template>
          </el-table-column>
          <el-table-column
                  prop="sex"
                  label="性别"
                  width="100">
            <template slot-scope="scope">
              {{scope.row.sex==1 ?'男':''}}
              {{scope.row.sex==2 ?'女':''}}
              {{scope.row.sex==0 ?'保密':''}}
            </template>
          </el-table-column>
          <el-table-column
                  prop="first_login_time"
                  label="首次登录完成时间"
                  width="300">
          </el-table-column>
          <el-table-column
                  prop="last_login_time"
                  label="最后登录完成时间"
                  width="300">
          </el-table-column>
          <el-table-column
                  prop="paint_num"
                  label="作品数"
                  width="200">
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
                      @click="Shield(scope.row.id)"
                      type="primary"
                      size="small">
                屏蔽
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
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">屏蔽列表</span>
        <el-input
                placeholder="请输入用户名"
                v-model="searchContent1"
                clearable style="width: 20%;margin-bottom: 15px">
        </el-input>
        <el-button type="primary"  @click="search2()">提交</el-button>
        <el-table
                :data="tableDataEr"
                border
                style="width: 100%">
          <el-table-column
                  prop="name"
                  label="用户名"
                  width="200">
          </el-table-column>
          <el-table-column
                  prop="first_login_time"
                  label="首次登录完成时间"
                  width="200">
          </el-table-column>
          <el-table-column
                  prop="last_login_time"
                  label="最后登录完成时间"
                  width="200">
          </el-table-column>
          <el-table-column
                  prop="paint_num"
                  label="作品数"
                  width="200">
          </el-table-column>
          <el-table-column
                  prop="like_num"
                  label="被喜欢"
                  width="150">
          </el-table-column>
          <el-table-column
                  label="操作"
                  width="150">
            <template slot-scope="scope">
              <el-button
                      v-permission="'v1.draw.user.update'"
                      @click="Cancellshield(scope.row.id)"
                      type="primary"
                      size="small">
                解除屏蔽
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top:20px;">
          <el-pagination
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page="currentPage1"
                  :page-sizes="[10]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="list.total1">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import * as SowingMap from '@/api/miniProgram/sowingMap'
export default {
  data () {
    return {
      // 搜索框
      searchContent: '',
      searchContent1: '',
      tableData: [],
      tableDataEr: [],
      currentPage4: 1,
      currentPage1: 1,
      list: {
        loading: true,
        total: 1,
        total1: 1,
        page: 1,
        limit: 10,
        related_type: 0
      }
    }
  },
  created () {
    this.getListinvalid1()
    this.getListinvalid2()
  },
  methods: {
    Shield (id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '点击屏蔽',
        message: h('p', null, [
          h('span', null, '点击屏蔽，该用户进入屏蔽列表'),
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
                SowingMap.popShield(id, {invalid: '1'})
                  .then(data => {
                    if (data.code === 300000) {
                      this.list.page = 1
                      this.getListinvalid1()
                      this.getListinvalid2()
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
          message: '屏蔽: ' + '成功'
        });
      });
    },
    Cancellshield (id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '解除屏蔽',
        message: h('p', null, [
          h('span', null, '解除屏蔽，解除后进入用户列表'),
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
                SowingMap.popShield(id, {invalid: '0'})
                  .then(data => {
                    if (data.code === 300000) {
                      this.list.page = 1
                      this.getListinvalid1()
                      this.getListinvalid2()
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
          message: '解除屏蔽 ' + '成功'
        });
      });
    },
    search () {
      this.list.page = 1
      this.getListinvalid1()
    },
    search2 () {
      this.list.page = 1
      this.getListinvalid2()
    },
    getListinvalid1 () {
      this.list.loading = true
      SowingMap.getUsers({page: this.list.page, limit: this.list.limit, invalid: 0, name: this.searchContent})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            this.tableData = data.data.data
            this.list.total = data.data.total
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(this.errHandler)
    },
    getListinvalid2 () {
      this.list.loading = true
      SowingMap.getUsers({page: this.list.page, limit: this.list.limit, invalid: 1, name: this.searchContent1})
        .then(data => {
          this.list.loading = false
          if (data.code === 300000) {
            this.tableDataEr = data.data.data
            this.list.total1 = data.data.total
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
      this.getListinvalid1(this.list.page)
    },
    handleSizeChange1 (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange1 (val) {
      this.list.page = val
      this.getListinvalid2(this.list.page)
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
