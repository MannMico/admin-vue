/**
 * 验证方法
 */
import RegExps from '@/utils/regExps'

// 验证账号
export function validateAccount (rule, value, callback) {
  if (!value) {
    return callback(new Error('请填写账号'));
  } else {
    if (!RegExps.phoneReg.test(value) && !RegExps.emailReg.test(value)) {
      return callback(new Error('账号格式不正确'));
    }
  }
  callback();
};

// 验证手机号
export function validatePhone (rule, value, callback) {
  if (!value) {
    return callback(new Error('请填写手机号'));
  } else {
    if (!RegExps.phoneReg.test(value)) {
      return callback(new Error('手机号格式不正确'));
    }
  }
  callback();
}

// 验证邮箱
export function validateEmail (rule, value, callback) {
  if (!value) {
    return callback(new Error('请填写邮箱'));
  } else {
    if (!RegExps.emailReg.test(value)) {
      return callback(new Error('邮箱格式不正确'));
    }
  }
  callback();
}

// 验证码
export function validateCoder (rule, value, callback) {
  if (!value) {
    return callback(new Error('请填写验证码'));
  } else {
    if (!RegExps.codeReg.test(value)) {
      return callback(new Error('验证码格式不正确'));
    }
  }
  callback();
}

// 校验密码
export function validatePassword (rule, value, callback) {
  if (!value) {
    return callback(new Error('请填写密码'));
  } else {
    if (!RegExps.pwdReg.test(value)) {
      return callback(new Error('密码格式不正确'));
    }
  }
  callback();
}

// 再次校验密码，包括格式和第一次是否一样
export function validatePasswordAgain (rule, value, callback) {
  console.log('rule->' + JSON.stringify(rule));
  console.log('value->' + value);
  console.log('this->' + JSON.stringify(this));
  if (!value) {
    return callback(new Error('请再次填写密码'));
  } else {
    if (!RegExps.pwdReg.test(value)) {
      return callback(new Error('密码格式不正确'));
    } else if (value !== this.getPasswordAgain()) {
      return callback(new Error('两次输入密码不一致'));
    }
  }
  callback();
}
