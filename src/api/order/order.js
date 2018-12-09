/**
 * 订单管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/order'
// const baseURL = 'http://feature-optimize-quotation.admin.api.test.lkker.cn'

/**
 * 获取订单管理list数据
 */
export function getOrderList (params) {
  return request({
    url: `${PREFIX}/orders`,
    method: 'get',
    params
  })
}
/**
 * 查看详情
 */
export function getDetailList (id) {
  return request({
    url: `${PREFIX}/orders/${id}`,
    method: 'get'
  })
}
/**
 * 获取支付对公列表数据
 */
export function getPaymentsList (params) {
  return request({
    url: `${PREFIX}/payments`,
    method: 'get',
    params
  })
}

/**
 * 获取支付详情
 */
export function getPaymentDetail (id) {
  return request({
    url: `${PREFIX}/payments/${id}`,
    method: 'get'
  })
}

/**
 * 驳回支付
 */
export function rejectPay (id, data) {
  return request({
    url: `${PREFIX}/payments/${id}/reject`,
    method: 'put',
    data
  })
}

/**
 * 确认订单支付
 */
export function successPay (id, data) {
  return request({
    url: `${PREFIX}/payments/${id}/confirmed`,
    method: 'put',
    data
  })
}

/**
 * 导出订单列表
 */
export function exportOrderList (id, params) {
  return request({
    url: `${PREFIX}/orders/export`,
    method: 'get',
    params
  })
}

/**
 * 导出支付列表
 */
export function exportPaymentList (id, params) {
  return request({
    url: `${PREFIX}/payments/export`,
    method: 'get',
    params
  })
}

/**
 * 创建邦女郎任务
 */
export function creatBondTask (id, data) {
  return request({
    url: `${PREFIX}/tasks/${id}`,
    method: 'post',
    data
  })
}

/**
 * 获取category分级列表
 */

export function getSubFilterData () {
  return request({
    url: `${PREFIX}/product-category`,
    method: 'get'
  })
}

/**
 * 获取邦女郎
 */

export function getBondsList (params) {
  return request({
    url: `${PREFIX}/ladies`,
    method: 'get',
    params
  })
}

/**
 * 创建订单合同
 */

export function creatAgreement (id, data) {
  return request({
    url: `${PREFIX}/orders/${id}/contracts`,
    method: 'post',
    data
  })
}

/**
 * 获取产品包
 */

export function getPackage (id, params) {
  return request({
    url: `${PREFIX}/service-packages`,
    method: 'get',
    params
  })
}

/**
 * 获取操作记录
 */

export function getOperate (id, params) {
  return request({
    url: `${PREFIX}/orders/${id}/logs`,
    method: 'get',
    params
  })
}
