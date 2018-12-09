/**
 * 菜单栏配置信息
 * @param {String} defaultActive 当前激活菜单的index
 * @param {Array} defaultOpeneds 当前打开的submenu的key数组
 * @param {boolean} uniqueOpened 是否保持一个子菜单的展开
 * @param {boolean} router 是否使用vue-router模式，启用该模式会在激活导航时以index作为path进行路由跳转
 */
const menuBar = {
  defaultActive: '/main',
  defaultOpeneds: [],
  uniqueOpened: false,
  router: true
}

export {menuBar};
