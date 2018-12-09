/**
 * 可配置的常量
 */
const Constant = {
  // token key
  token: 'access_token',
  // refresh token key
  refresh_token: 'refresh_token',
  expires_token: 'expires_time',
  // 最高权限的roles key
  Admin: 'admin',
  // 过期时间单位(min)，表示还有${expiresTime}过期时，重新获取token
  expiresTime: 5
}

export default Constant
