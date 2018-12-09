const getters = {
  status: state => state.user.status,
  token: state => state.user.token,
  refresh_token: state => state.user.refresh_token,
  roles: state => state.user.roles,
  name: state => state.user.name,
  phone: state => state.user.phone,
  avatar: state => state.user.avatar,
  addRouters: state => state.permisson.addRouters,
  allRouters: state => state.permisson.allRouters,
  myPermissions: state => state.permisson.myPermissions,
  goodProductRouter: state => state.permisson.goodProductRouter,
  citys: state => state.common.citys,
  identifys: state => state.common.identifys,
  organizes: state => state.common.organizes,
  userGroup: state => state.common.userGroup,
  departments: state => state.common.departments,
  permissions: state => state.common.permissions,
  isCollapse: state => state.behavior.isCollapse,
  themeColor: state => state.behavior.themeColor,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}

export default getters
