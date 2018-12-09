/**
 * 用户信息相关
 */
import request from '@/utils/request';

export function getUserInfo (params) {
  return request({
    url: '/v1/user/info',
    method: 'get',
    params
  })
}

export function getVerifyCode (data) {
  return request({
    url: '/v1/user/verify-code',
    method: 'post',
    data
  })
}

export function changePassword (data) {
  return request({
    url: '/v1/user/password',
    method: 'post',
    data
  })
}
