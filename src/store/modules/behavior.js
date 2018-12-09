/**
 * 关于用户在网站上操作行为
 * 如：收起/展开侧边栏；主题颜色；访问过的页面
 */

const behavior = {
  state: {
    isCollapse: false, // 是否收起侧边栏
    themeColor: '#409EFF' // 主题风格颜色
  },
  mutations: {
    SET_COLLAPSE: (state, isCollapse = false) => {
      state.isCollapse = isCollapse
    },
    SET_THEME_COLOR: (state, themeColor = '#409EFF') => {
      state.themeColor = themeColor
    }
  },
  actions: {
    // 收起、展开侧边栏
    SetCollapse ({ commit }, isCollapse) {
      commit('SET_COLLAPSE', isCollapse)
    },
    // 主题颜色
    SetThemeColor ({ commit }, themeColor) {
      commit('SET_THEME_COLOR', themeColor)
    }
  }
}

export default behavior
