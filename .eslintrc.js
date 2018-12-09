// https://eslint.org/docs/user-guide/configuring

module.exports = {
  // 告诉eslint找当前配置文件规则而不能往父级查找
  root: true, 
  parserOptions: {
    // 指eslint解析器，解析器必须符合规则，babel-eslint解析器对babel解析器的包装使其与ESlint解析
    parser: 'babel-eslint'
  },
  // 指定环境的全局变量，此处指定为浏览器环境
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // 此项用来配置标准的js风格为标准风格
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md 中文地址
    'standard'
  ],
  // required to lint *.vue files
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  plugins: [
    'vue'
  ],
  // add your custom rules here
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  //"error" -> 2 开启错误规则
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': 0,
    // 'one-var': [2, { var: 'always', let: 'always' }],
    'indent': [2, 2],
    'eqeqeq': [0, 'always'],
    'no-undef': [0, 'always'],
    // 'no-sparse-arrays': [0, 'always']
    'semi': [0, 'always'],
    'camelcase': [2, {properties: 'never'}],
    // error; jsx 中的属性必须用双引号
    'jsx-quotes': [2, 'prefer-double'],
    // error; generator 的 * 前面禁止有空格，后面必须有空格
    'generator-star-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    // error; yield* 后面必须加空格
    'yield-star-spacing': [2, 'after'],
    // 禁用不必要的转义
    'no-useless-escape': 0
    
  }
}
