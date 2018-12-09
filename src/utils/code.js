/**
 * 接口中的code对应
 */
module.exports = {
  300000: {
    type: 'SUCCESS_CODE',
    msg: '请求成功'
  },
  300001: {
    type: 'EX_COMMON',
    msg: '出错了' // 默认通用异常
  },
  300002: {
    type: 'EX_SIGN_FAILED',
    msg: '签名校验错误'
  },
  300003: {
    type: 'EX_PARAM_VALID',
    msg: '请求参数验证失败'
  },
  300004: {
    type: 'EX_NOT_AUTH',
    msg: '未授权'
  },
  300005: {
    type: 'EX_NOT_FOUND',
    msg: '未找到'
  },
  300006: {
    type: 'EX_VERIFY_CODE',
    msg: '验证码错误'
  },
  300007: {
    type: 'EX_REQUEST_OUT',
    msg: '请求过期'
  },
  300008: {
    type: 'EX_REQUEST_REFUSE',
    msg: '拒绝访问'
  },
  300010: {
    type: 'EX_NOT_SUPPORT_VERSION',
    msg: '版本暂不支持'
  },
  300011: {
    type: 'EX_NOT_SUPPORT_PROTOCOL',
    msg: '协议不支持'
  },
  300012: {
    type: 'EX_ERROR_SERVER',
    msg: '服务器内部错误'
  },
  300013: {
    type: 'EX_ERROR_PORT',
    msg: '接口暂时无法访问'
  },
  300014: {
    type: 'EX_ERROR_PHONE',
    msg: '错误的手机号格式'
  },
  300015: {
    type: 'EX_ERROR_BANK_CARD',
    msg: '错误的银行卡格式'
  },
  300016: {
    type: 'EX_ERROR_ID_CARD',
    msg: '错误的身份证号格式'
  },
  300017: {
    type: 'EX_NOT_USER',
    msg: '无此用户'
  },
  300018: {
    type: 'EX_NOT_ENOUGH_POINTS',
    msg: '积分不足'
  },
  300019: {
    type: 'EX_HAS_FOUNDED',
    msg: '用户已存在'
  },
  300020: {
    type: 'EX_LOGIC_ERROR',
    msg: '逻辑错误'
  },
  300021: {
    type: 'EX_USER_NOT_FOUND',
    msg: '用户未找到'
  },
  300022: {
    type: 'EX_USER_ACCOUNT_ERROR_OR_PWD_ERROR',
    msg: '账号或密码错误'
  },
  300023: {
    type: 'EX_USER_LOCKED',
    msg: '用户被禁用'
  },
  300024: {
    type: 'EX_NOT_LOGIN',
    msg: '未登录'
  }
}
