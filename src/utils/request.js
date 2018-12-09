import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, clearToken, inspectToken } from '@/utils/auth'
import * as Interface from './interface'
// import pathToRegexp from 'path-to-regexp'
// import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000
})

// TODO
// const CancelToken = axios.CancelToken;

// 需要认证的接口
/* const VERSION = '/v1';

const BearerLists = [
  '/user/show', // 获取个人信息
  '/common/menulist', // 获取菜单
  '/common/permissions', // 获取用户权限
  '/user/logout', // 退出
  '/user/password', // 修改密码
  '/award/prizes', // 创建奖项
  '/award/prizes/:id' // 更新奖项
];

// 判断请求头Authorization中是否需要Bearer 认证
function isBelongBearerLists (url) {
  let flag = false;
  for (let item of BearerLists) {
    if (pathToRegexp(VERSION + item).test(url)) {
      flag = true;
      break;
    }
  }
  return flag;
} */

service.interceptors.request.use(config => {
  if (config.url === '/v1/user/login' || config.url === '/v1/common/refresh') {
    config.headers['Authorization'] = 'Basic OTo5Yk5NVnI4eTdKdEZMMEI4U3JOODdzNVdLMnNOendha0NHUURaZUs5'
  } else {
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }

  config.headers['X-Nonce'] = Interface.getRandomStr();
  config.headers['X-Time'] = Interface.getUnixtime();
  config.headers['X-Sign'] = Interface.getSignData(config, process.env.NODE_ENV === 'production' ? 'nTBMFzvVKVL2keCsrzaNeUUC' : 'lkker');

  return config
}, error => {
  // do something for err
  Message({
    message: error.message,
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})

let verifyCode = {
  '300023': '账户被禁用',
  '300024': '您尚未登录，是否登录？'
}
let verifyCodeArr = Object.keys(verifyCode)
// respone interceptoe
service.interceptors.response.use(response => {
  // do something before response is arrvied
  if (response.status === 200) {
    // 300023->被禁用；300024->未登录
    if (verifyCodeArr.indexOf(String(response.data.code)) !== -1) {
      clearToken()
      if (response.config.url.indexOf('/v1/user/logout') !== -1) {
        // 退出
        return location.reload()
      }
      // not login
      return MessageBox({
        title: '提示',
        message: verifyCode[response.data.code],
        type: 'info',
        showClose: true,
        lockScroll: true,
        showCancleButton: true,
        showConfirmButton: true,
        callback: function (event) {
          store.dispatch('Logout')
            .then(() => {
              location.reload()
            })
        }
      })
    }
    return response.data
  }
  return response
}, error => {
  // do something for err
  Message({
    message: error.message,
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})

// TODO config cancelToken
/* service.cancelToken = new CancelToken(function (cancel) {
}) */

setInterval(() => {
  // console.log('检测token是否过期');
  if (inspectToken()) {
    // console.log('快要过期了-RefreshToken');
    store.dispatch('RefreshToken')
  }
}, 1000 * 60 * 5)
export default service
