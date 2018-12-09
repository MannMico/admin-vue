/**
 * 常用全局过滤器方法
 */
export const filters = {
  toFixed: function (val, decimals = 2) {
    return val.toFixed(decimals)
  },
  toUpperCase: function (val) {
    return val.toUpperCase()
  },
  toLowerCase: function (val) {
    return val.toLocaleLowerCase()
  },
  formatRMB: function (val) {
    return '￥ ' + this.toFixed(val)
  }
}
