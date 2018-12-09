<template>
  <div class="menu-wrapper">
    <template
      v-if="!item.hidden && item.children"
      v-for="(item, index) in routes"
      >
      <!-- <router-link
        v-if="item.children.length === 1 && !item.children[0].children"
        :to="item.redirect || (item.path + '/' + item.children[0].path)"
        :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path">
          <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link> -->
      <!-- 欢迎menu单独处理 -->
      <el-menu-item
        v-if="item.type === 'welcome'"
        index="/layout/welcome"
        :key="item.type">
        <i class="icon-lkker-index"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu
        v-else
        :index="(item.children && item.children.length === 1) ? item.path : String(index + 1)"
        :key="item.name">
        <template slot="title">
          <i :class="item.meta ? item.meta.icon : 'icon-lkker-manage'"></i>
          <span v-if="item.meta && item.meta.title">{{item.meta.title}}</span>
        </template>

        <!-- <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <i class="icon-lkker-menu" :style="{'color': theme.desc.mainColor}"></i>
              <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template> -->
        <el-menu-item-group>
          <template
            v-for="child in item.children"
            v-if="!child.hidden">
            <el-menu-item
              :index="child.alias || (item.path + '/' + child.path)"
              :key="child.name">{{child.meta ? child.meta.title: child.name}}</el-menu-item>
          </template>
        </el-menu-item-group>
      </el-submenu>

    </template>
  </div>
</template>

<script>

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
  }
}
</script>
