/**
 * 公共数据模块
 */
import Code from '@/utils/code'
import { getCitys, getAllIdentifys, getAllOrganizes, getAllRoles, getAllDepartments, getAllPermissions } from '@/api/common'

const common = {
  state: {
    citys: [],
    identifys: [],
    organizes: [],
    userGroup: [],
    departments: [],
    permissions: []
  },
  mutations: {
    SET_CITYS: (state, citys = []) => {
      state.citys = citys
    },
    SET_IDENTIFYS: (state, identifys = []) => {
      state.identifys = identifys
    },
    SET_ORGANIZES: (state, organizes = []) => {
      state.organizes = organizes
    },
    SET_USERGROUP: (state, userGroup = []) => {
      state.userGroup = userGroup
    },
    SET_DEPARTMENTS: (state, departments = []) => {
      state.departments = departments
    },
    SET_PERMISSIONS: (state, permissions = []) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 获取/设置省市
    GetCitys ({ commit }) {
      // 因为数据不会改变，所以只要有数据，就不需要再次请求了
      if (common.state.citys.length > 0) {
        return;
      }
      return new Promise((resolve, reject) => {
        getCitys()
          .then(data => {
            if (data.code === 300000) {
              commit('SET_CITYS', data.data)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 获取/设置身份
    GetIdentifys ({ commit }) {
      return new Promise((resolve, reject) => {
        getAllIdentifys()
          .then(data => {
            if (data.code === 300000) {
              commit('SET_IDENTIFYS', data.data)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 获取/设置 运营中心
    GetOrganizes ({ commit }) {
      return new Promise((resolve, reject) => {
        getAllOrganizes()
          .then(data => {
            if (data.code === 300000) {
              commit('SET_ORGANIZES', data.data)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 获取/设置 用户组
    GetUserGroup ({ commit }) {
      return new Promise((resolve, reject) => {
        getAllRoles()
          .then(data => {
            if (data.code === 300000) {
              commit('SET_USERGROUP', data.data)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 获取部门列表
    GetDepartments ({ commit }) {
      return new Promise((resolve, reject) => {
        getAllDepartments()
          .then(data => {
            if (data.code === 300000) {
              commit('SET_DEPARTMENTS', data.data)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => { reject(err) })
      })
    },
    // 获取所有权限
    GetAllPermissions ({ commit }) {
      return new Promise((resolve, reject) => {
        getAllPermissions()
          .then(data => {
            if (data.code === 300000) {
              commit('SET_PERMISSIONS', data.data)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => { reject(err) })
      })
    }
  }
}

export default common
