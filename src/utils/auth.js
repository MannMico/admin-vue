import Cookies from 'js-cookie'
import Constant from './config'

const TokenKey = Constant.token

export function getToken (key = TokenKey) {
  return Cookies.get(key)
}

export function setToken (key = TokenKey, val, obj = { path: '/', expires: 60 }) {
  // 过期时间戳
  let timestamp = new Date().getTime() + obj.expires * 1000
  let expiresTime = new Date(timestamp)
  if (key == TokenKey) {
    setToken('expires_time', timestamp, { path: obj.path || '/', expires: obj.expires })
  }
  return Cookies.set(key, val, { path: '/', expires: expiresTime })
}

export function removeToken (key = TokenKey) {
  Cookies.remove(key)
}

export function clearToken () {
  removeToken(Constant.token)
  removeToken(Constant.refresh_token)
  removeToken(Constant.expires_token)
}

/**
 * 检测cookie是否快过期
 */
export function inspectToken (key = TokenKey) {
  let flag = false
  let expiresTimestamp = getToken('expires_time')
  if (expiresTimestamp) {
    try {
      // 当前时间戳
      let currTimeStamp = new Date().getTime()
      if ((expiresTimestamp - currTimeStamp) <= (Constant.expiresTime * 1000)) {
        flag = true
      }
    } catch (e) {
      flag = true
    }
  } else {
    flag = true
  }
  return flag
}
