/**
 * 权限相关
 */
import * as _array from 'lodash/array'
import _isArray from 'lodash/isArray'
import { baseRouter, asyncRouterMap } from '@/router'
import { getMenuList, getPermissons } from '@/api/common'

/**
 * 根据后台返回的菜单栏，获取有权限的路由
 * 条件：1. 后台返回的与前台对应； 2. is_show == 1
 * TOCFM 现在最多写到二级列表
 * @param {Array} permissions 返回的权限数组
 * @return {Array} accessedRouters 有权限的路由
 */
function getHasPermissonRouters (permissions) {
  // 处理返回的权限列表数据
  let hasPermissions = {}
  for (let item of permissions) {
    if (item.is_show === 1 && item.childs && item.childs.length > 0) {
      let { name } = item
      hasPermissions[name] = []
      for (let elem of item.childs) {
        if (elem.is_show === 1) {
          hasPermissions[name].push(elem.name)
        }
      }
    }
  }
  let topLevelNames = Object.keys(hasPermissions)
  let accessedRouters = []
  let notFoundRouter = _array.last(asyncRouterMap)
  _array.pullAt(asyncRouterMap, asyncRouterMap.length - 1)
  for (let itemRouter of asyncRouterMap) {
    if (itemRouter.meta && (topLevelNames.indexOf(itemRouter.meta.rule) !== -1)) {
      // 有一级权限
      let obj = {...itemRouter}
      obj.children = []
      for (let elem of itemRouter.children) {
        if (elem.meta && ((hasPermissions[itemRouter.meta.rule].indexOf(elem.meta.rule) !== -1) || elem.meta.rule === '')) {
          // 有二级权限
          obj.children.push(elem)
        }
      }
      accessedRouters.push(obj)
    }
  }
  accessedRouters.push(notFoundRouter)
  return accessedRouters
}

function getGoodProductAccess (data) {
  var newObj = null
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === 'v1.goodProduct') {
      newObj = JSON.parse(JSON.stringify(data[i]))
    }
  }
  return newObj
}

// 处理当前登录人权限数据
function getMyPermissions () {
  let parentArr = arguments[0]
  let childArr = arguments[1]
  if (childArr && childArr.length > 0) {
    let tempArr = []
    for (let item of childArr) {
      // 如果是数组
      if (_isArray(item)) {
        for (let elem of item) {
          parentArr.push(elem.name)
          if (elem.childs && elem.childs.length > 0) {
            tempArr.push(elem.childs)
          }
        }
      } else {
        parentArr.push(item.name)
        if (item.childs && item.childs.length > 0) {
          tempArr.push(item.childs)
        }
      }
    }
    return getMyPermissions(parentArr, tempArr)
  } else {
    return parentArr;
  }
}

const permission = {
  state: {
    allRouters: baseRouter,
    // 根据登录的用户动态获取有权限的路由
    addRouters: [],
    myPermissions: [],
    goodProductRouter: null
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.allRouters = baseRouter.concat(routers)
    },
    SET_MY_PERMISSION: (state, myPermissions) => {
      state.myPermissions = myPermissions
    },
    SET_GOOD_PRODUCT_ROUTER: (state, router) => {
      state.goodProductRouter = router
    }
  },
  actions: {
    // 获取权限对应的菜单栏
    GetMenulists ({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuList()
          .then(data => {
            if (data.code == 300000) {
              let accessedRouters = []
              let goodProductInfo = null
              accessedRouters = getHasPermissonRouters(data.data)
              goodProductInfo = getGoodProductAccess(data.data)
              commit('SET_ROUTERS', accessedRouters)
              commit('SET_GOOD_PRODUCT_ROUTER', goodProductInfo)
              resolve()
            } else {
              reject(data.msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 获取当前登录人的权限
    GetMyPermissons ({ commit }) {
      return new Promise((resolve, reject) => {
        getPermissons()
          .then(data => {
            if (data.code == 300000) {
              let myPermissions = getMyPermissions([], data.data)
              commit('SET_MY_PERMISSION', myPermissions)
              resolve()
            } else {
              reject(data.msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 重置router数据
    ResetRouters ({ commit }) {
      commit('SET_ROUTERS', [])
    }
  }
}

export default permission
