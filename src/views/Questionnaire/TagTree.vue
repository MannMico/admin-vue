<template>
  <div class="tagTree" @click.stop>
    <div class="tag-btn">重工业</div>
    <ul class="tag-list">
      <li v-for="(list, index) in tagData"
        :key="index"
        :class="{last: index == tagData.length-1}"
        v-show="showTag == true"
        @mousedown="selectIndex = index"
      >
        <span>{{ list.key }}</span>
        <ul class="tag-list right">
          <li v-for="(item, dex) in list.value"
            :key="dex"
             @mouseup="closeTag(index,dex)"
            v-show="index == selectIndex"
            :class="{last: dex == list.value.length-1}">
            {{item}}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'tagTree',
  data () {
    return {
      showTag: false,
      selectIndex: null
    }
  },
  props: {
    tagData: {
      type: Array,
      default () {
        return [
          {
            key: '水果',
            value: ['苹果', '香蕉']
          },
          {
            key: '蔬菜',
            value: ['白菜', '青菜', '南瓜']
          }
        ]
      }
    },
    treePosition: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    let _this = this
    document.onclick = function () {
      _this.showTag = false
      _this.selectIndex = null
    }
  },
  methods: {
    closeTag (index, dex) {
      this.showTag = false
      this.selectIndex = null
      this.$emit('tagValue', {value: this.tagData[index].value[dex], pos: this.treePosition})
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
  @import 'src/styles/mixin.scss';
  .tagTree {
    position: relative;
    .tag-btn {
      width: 60px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #ccc;
      font-size: 12px;
      color: #101010;
      margin: 7px 10px;
      text-align: center;
    }
    .tag-list {
      position: absolute;
      right: -51px;
      top: 0;
      z-index: 10;
      list-style: none;
      background-color: #fff;
      .right {
        right: -61px;
      }
      li {
        width: 60px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        border: 1px solid #ccc;
        border-bottom: none;
        &.last {
          border-bottom: 1px solid #ccc;
        }
      }
    }
  }

</style>
