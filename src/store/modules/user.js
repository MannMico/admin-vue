/**
 * 用户模块
 */
import Code from '@/utils/code'
import { login, refreshToken, getUserInfo, logout } from '@/api/common'
import { setToken, getToken, clearToken } from '@/utils/auth'
import Constant from '@/utils/config'

const user = {
  state: {
    status: 0, // 是否获取个人信息
    token: getToken(Constant.token),
    refresh_token: getToken(Constant.refresh_token),
    name: '你好，管理员',
    avatar: '',
    phone: '',
    roles: []
  },

  mutations: {
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refresh_token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar || 'http://admin.dev.lkker.cn/styles/img/profile_small.jpg'
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, param) {
      return new Promise((resolve, reject) => {
        login(param)
          .then(data => {
            if (data.code == 300000) {
              data = data.data
              commit('SET_TOKEN', data.access_token)
              commit('SET_REFRESH_TOKEN', data.refresh_token)
              setToken(Constant.token, data.access_token, { expires: data.expires_in })
              setToken(Constant.refresh_token, data.refresh_token, { expires: 3600 * 12 })
              resolve()
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // token刷新
    RefreshToken ({ commit }, data) {
      return new Promise((resolve, reject) => {
        let token = getToken('refresh_token')
        if (!token) {
          return
        }
        refreshToken(token)
          .then(data => {
            if (data.code === 300000) {
              data = data.data
              commit('SET_TOKEN', data.access_token)
              commit('SET_REFRESH_TOKEN', data.refresh_token)
              setToken(Constant.token, data.access_token, { expires: data.expires_in })
              setToken(Constant.refresh_token, data.refresh_token, { expires: 3600 * 12 })
              resolve(data.access_token)
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(data => {
            if (data.code === 300000) {
              data = data.data
              commit('SET_STATUS', 1)
              commit('SET_ROLES', data.role)
              commit('SET_NAME', data.name)
              commit('SET_PHONE', data.phone)
              commit('SET_AVATAR', data.head_image)
              resolve()
            } else {
              reject(data.msg)
            }
          })
          .catch(err => reject(err))
      })
    },
    // 退出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(data => {
            if (data.code == 300000) {
              clearToken()
              commit('SET_STATUS', 0)
              commit('SET_AVATAR', '')
              commit('SET_NAME', '')
              commit('SET_PHONE', '')
              commit('SET_TOKEN', '')
              commit('SET_REFRESH_TOKEN', '')
              resolve()
            } else {
              reject(data.msg ? data.msg : Code[data.code].msg)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        clearToken()
        commit('SET_STATUS', 0)
        commit('SET_AVATAR', '')
        commit('SET_NAME', '')
        commit('SET_PHONE', '')
        commit('SET_TOKEN', '')
        resolve()
      })
    }
  }
}

export default user
