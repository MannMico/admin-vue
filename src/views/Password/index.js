/**
 * 修改密码相关
 * 页面上需要配合 DialogForm 组件使用
 */
import {
  validateAccount,
  validatePhone,
  validateCoder,
  validatePassword,
  validatePasswordAgain // TODO 如何共用这个方法？
} from '@/utils/validate'

export const Password = {
  myDialogFormVisible: false,
  myNeedValidator: true,
  myDialogForm: {
    'account': {
      type: 'input',
      label: '账号',
      placeholder: '请输入账号'
    },
    'phone': {
      type: 'input',
      label: '手机号',
      placeholder: '请输入手机号'
    },
    'code': {
      type: 'input',
      label: '验证码',
      placeholder: '请输入验证码'
    },
    'password': {
      type: 'password',
      label: '输入密码',
      placeholder: '请输入密码'
    },
    'passwordAgain': {
      type: 'password',
      label: '重复密码',
      placeholder: '请再次输入密码'
    },
    form: {
      account: '',
      phone: '',
      code: '',
      password: '',
      passwordAgain: ''
    }
  },
  myDialogRules: {
    account: [
      { validator: validateAccount, trigger: 'blur' }
    ],
    phone: [
      { validator: validatePhone, trigger: 'blur' }
    ],
    code: [
      { validator: validateCoder, trigger: 'blur' }
    ],
    password: [
      { validator: validatePassword, trigger: 'blur' }
    ],
    passwordAgain: [
      { validator: validatePasswordAgain, trigger: 'blur' }
    ]
  }
}

export const PwdEventHanlder = {
  changeFormVisibleStatus (bool) {
    this.myDialogFormVisible = bool;
  },
  getPasswordAgain () {
    return this.myDialogForm.form.password;
  }
}
