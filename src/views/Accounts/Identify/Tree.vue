<template>
  <div class="tree-wrapper" :style="{height: treeWrapperHeight + 'px'}">
    <!-- box -->
    <div v-for="(item, key) in boxArr" :bid="item.bid" :key="'box' + key" class="box" :style="{top: (item.y - 1) * (120 + 20) + 'px', left: (item.x - 1) * (180 + 20) + 'px'}">
      <div class="item">身份：{{item.name}}</div>
      <div class="item">人数：<span style="cursor: pointer; color: #409EFF;" @click="linkToAccount(item.bid)">{{item.users_count}}</span></div>
      <div>
        <el-button type="text" size="mini" @click="viewIdentity(item)">查看</el-button>
        <el-button type="text" size="mini" @click="editIdentity(item)">编辑</el-button>
        <el-button type="text" size="mini" @click="editPermission(item)">编辑权限</el-button>
        <el-button type="text" size="mini" @click="deleteIdentity(item)">删除</el-button>
        <el-button type="text" size="mini" @click="addChildIdentity(item)">增加子身份</el-button>
      </div>
    </div>
    <!-- circle -->
    <div v-for="(item, key) in circleArr" @click="toggleShow(item.bid)" :bid="item.bid" :key="'circle' + key" :class="item.showChildren ? 'el-icon-remove' : 'el-icon-circle-plus'" class="circle" :style="{top: ((item.y - 1) * (120 + 20) + 120 + 2) + 'px', left: ((item.x - 1) * (180 + 20) + (180 * 0.5) - (16 * 0.5)) + 'px'}"></div>
    <!-- lines -->
    <div v-for="(item, key) in vTopLinePositionArr" :key="'vtLine' + key" class="v-line" :style="{top: ((item.y - 1) * (120 + 20) - (20 * 0.5)) + 'px', left: ((item.x - 1) * (180 + 20) + (180 * 0.5)) + 'px', height: (20 * 0.5) + 'px'}"></div>
    <div v-for="(item, key) in circleArr" :key="'vbLine' + key" class="v-line" :style="{top: ((item.y - 1) * (120 + 20) + 120) + 'px', left: ((item.x - 1) * (180 + 20) + (180 * 0.5)) + 'px', height: (20 * 0.5) + 'px'}"></div>
    <div v-for="(item, key) in hLinePositionArr" :key="'hLine' + key" class="h-line" :style="{top: ((item.y - 2) * (120 + 20) + 120 + 20 * 0.5) + 'px', left: ((item.a[0] - 1) * (180 + 20) + (180 * 0.5)) + 'px', width: (180 + 20) * Math.abs(item.a.slice(-1) - item.a[0]) + 'px'}"></div>
  </div>
</template>

<script>
let x = 1
let y = 1
let maxY = 1

export default {
  props: {
    treeData: {
      type: Array,
      required: true
    },
    childKeyName: {
      type: String,
      required: true
    },
    boxIdName: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      treeWrapperHeight: 0,
      boxArr: [],
      circleArr: [],
      vTopLinePositionArr: [],
      hLinePositionOriginalArr: []
    }
  },
  computed: {
    _treeData () {
      let _treeData = JSON.parse(JSON.stringify(this.treeData))
      this.addProperties(_treeData)
      return _treeData
    },
    hLinePositionArr () {
      let originalArr = this.hLinePositionOriginalArr
      let arr = []
      originalArr.forEach((v) => {
        if (v.a.length > 1 && v.y > 1) {
          arr.push(v)
        }
      })
      return arr
    }
  },
  methods: {
    viewIdentity (item) {
      this.$emit('viewIdentity', item)
    },
    editIdentity (item) {
      this.$emit('editIdentity', item)
    },
    editPermission (item) {
      this.$emit('editPermission', item)
    },
    deleteIdentity (item) {
      this.$emit('deleteIdentity', item)
    },
    addChildIdentity (item) {
      this.$emit('addChildIdentity', item)
    },
    mainOperation (arr, y) {
      // h-line
      let a = []
      arr.forEach(function (v) {
        // line
        a.push(x)
        // 第一行box上面不加线
        if (y > 1) {
          this.vTopLinePositionArr.push({x, y})
        }
        if (v[this.childKeyName]) {
          // circle
          this.circleArr.push({x, y, bid: v.bid, showChildren: v.showChildren})
          // box
          this.boxArr.push({x, y, parent_id: v.parent_id, bid: v.bid, department_name: v.department_name, department_id: v.department_id, name: v.name, users_count: v.users_count})
          if (v.showChildren) {
            // recursion
            this.mainOperation(v[this.childKeyName], y + 1)
          } else {
            x++
          }
        } else {
          // box
          this.boxArr.push({x, y, parent_id: v.parent_id, bid: v.bid, department_name: v.department_name, department_id: v.department_id, name: v.name, users_count: v.users_count})
          x++
          // max height of the wrapper
          maxY = y > maxY ? y : maxY
        }
      }, this)
      // h-line
      if (y > 1) {
        this.hLinePositionOriginalArr.push({y, a})
      }
    },
    addProperties (arr) {
      arr.forEach(v => {
        // only add two property now: showChildren, bid
        v.showChildren = true
        v.bid = v[this.boxIdName]
        if (v[this.childKeyName]) {
          this.addProperties(v[this.childKeyName])
        }
      }, this)
    },
    changeShowState (arr, bid) {
      arr.forEach(v => {
        if (bid && v.bid === bid) {
          v.showChildren = !v.showChildren
        }
        if (v[this.childKeyName]) {
          this.changeShowState(v[this.childKeyName], bid)
        }
      }, this)
    },
    initData () {
      x = 1
      maxY = 1
      this.treeWrapperHeight = 0
      this.boxArr = []
      this.circleArr = []
      this.vTopLinePositionArr = []
      this.hLinePositionOriginalArr = []
    },
    toggleShow (bid) {
      this.initData()
      this.changeShowState(this._treeData, bid)
      this.mainOperation(this._treeData, 1)
      this.treeWrapperHeight = (maxY * (120 + 20)) + 20
    },
    linkToAccount (bid) {
      if (this.$store.getters.myPermissions.indexOf('v1.adminUser.user.list') == -1) {
        this.$message.error('您没有查看权限')
      } else {
        this.$router.push(`/account?identifyId=${bid}`)
      }
    }
  },
  mounted () {
    this.initData()
    this.mainOperation(this._treeData, y)
    this.treeWrapperHeight = (maxY * (120 + 20)) + 20
  }
}
</script>

<style scoped>
  .tree-wrapper {
    position: relative;
    overflow: scroll;
  }
  .circle {
    position: absolute;
    z-index: 10;
    color: #409EFF;
    cursor: pointer;
  }
  .box {
    padding: 16px;
    font-size: 12px;
    position: absolute;
    box-sizing: border-box;
    width: 180px;
    height: 120px;
    border: 1px solid rgba(230,230,230,1);
    background:rgba(248,248,248,1);
  }
  .item {
    margin-bottom: 6px;
    overflow: hidden;
    width: 146px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .v-line {
    position: absolute;
    width: 1px;
    background-color: rgba(230,230,230,1);
  }
  .h-line {
    position: absolute;
    height: 1px;
    background-color: rgba(230,230,230,1);
  }
</style>
