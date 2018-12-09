/**
 * 获取全局数据
 * 如：身份列表、运营中心、用户组
 */
import store from '@/store'

// 获取省市信息
export function getCitys () {
  store.dispatch('GetCitys')
}
/**
 * ! 以下是 “账号管理” 模块相关
 */
// 身份列表
export function getAllIdentifys () {
  store.dispatch('GetIdentifys')
}

// 运营中心
export function getOrganizes () {
  store.dispatch('GetOrganizes')
}

// 用户组
export function getUserGroup () {
  store.dispatch('GetUserGroup')
}

// 部门列表
export function getAllDepartments () {
  store.dispatch('GetDepartments')
}

// 全部权限
export function getAllPermissions () {
  store.dispatch('GetAllPermissions')
}
