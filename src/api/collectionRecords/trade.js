/**
 * 收款流水管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/collection-records'
// const baseURL = 'http://feature-order-2-1.admin.api.test.lkker.cn'
/**
 * 查询收款流水列表
 */
export function getTradeList (params) {
  return request({
    url: `${PREFIX}`,
    method: 'get',
    params
  })
}

/**
 * 导出收款流水列表
 */
export function exportTradeList (params) {
  return request({
    url: `${PREFIX}/exports`,
    method: 'get',
    params
  })
}

/**
 * 处理收款流水通过或者作废
 */
export function deleteTradeList (data) {
  return request({
    url: `${PREFIX}/statuses`,
    method: 'post',
    data
  })
}

/**
 * 查询收款流水作废原因列表
 */
export function searchDeleteReason (params) {
  return request({
    url: `${PREFIX}/cancel-reasons`,
    method: 'get',
    params
  })
}

/**
 * 查询订单付款号
 */
export function getOrderInfo (params) {
  return request({
    url: `/v1/order/payments`,
    method: 'get',
    params
  })
}

/**
 * 上传数据展示
 */
export function getUploadData (params) {
  return request({
    url: `${PREFIX}/uploads`,
    method: 'get',
    params
  })
}

/**
 * 上传数据展示
 */
export function importData (data) {
  return request({
    url: `${PREFIX}/imports`,
    method: 'post',
    data
  })
}

/**
 * 合计数据
 */
export function getTotalData () {
  return request({
    url: `${PREFIX}/statistics`,
    method: 'get'
  })
}
