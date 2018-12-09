/**
 *  报价
 */
import request from '@/utils/request'
const DEV_PREFIX = '/v1/quotation'
const SKU_PREFIX = '/v1/sku'
/**
 * eg
 */
// 获取服务列表
export function getServiceList (params) {
  return request({
    url: `${DEV_PREFIX}/service-list`,
    method: 'get',
    params
  })
}

// 创建报价单
export function createQuote (data) {
  return request({
    url: `${DEV_PREFIX}/quotations`,
    method: 'post',
    data,
    timeout: 20000
  })
}

// 获取客户信息
export function getCustomer (params) {
  return request({
    url: `${DEV_PREFIX}/customer`,
    method: 'get',
    params
  })
}

// 获取报价单首页列表
export function getQuoteHomeList (params) {
  return request({
    url: `${DEV_PREFIX}/quotations`,
    method: 'get',
    params
  })
}
// 获取报价单详情
export function getQuoteInfo (id) {
  return request({
    url: `${DEV_PREFIX}/quotations/${id}`,
    method: 'get'
  })
}

// 复制一份报价单
export function copyQuoteInfo (id, data) {
  return request({
    url: `${DEV_PREFIX}/quotations/${id}`,
    method: 'put',
    data
  })
}

// 获取服务人列表
export function getAttendants () {
  return request({
    url: `${SKU_PREFIX}/attendants`,
    method: 'get'
  })
}

// 获取报价单草稿箱列表
export function getQuoteDrafts (params) {
  return request({
    url: `${DEV_PREFIX}/drafts`,
    method: 'get',
    params
  })
}

// 获取报价单操作记录
export function getQuoteLogs (id, params) {
  return request({
    url: `${DEV_PREFIX}/quotations/${id}/logs`,
    method: 'get',
    params
  })
}

// 批量删除草稿
export function deleteDrafts (data) {
  return request({
    url: `/v1/quotation/drafts`,
    method: 'delete',
    data
  })
}

// 作废报价单
export function dropQuotation (id, data) {
  return request({
    url: `/v1/quotation/quotations/${id}/drop`,
    method: 'put',
    data
  })
}

// 导出报价单
export function exportQuotation (params) {
  return request({
    url: `/v1/quotation/quotations/export`,
    method: 'get',
    params
  })
}

// 更新报价单项目
export function updateQuote (id, data) {
  return request({
    url: `/v1/quotation/projects/${id}`,
    method: 'put',
    data
  })
}

// 获取csrf-token
export function getCsrfToken (params) {
  return request({
    url: `/v1/common/csrf-token`,
    method: 'get',
    params
  })
}

// 获取报价单优惠价格
export function getDiscountPrice (data) {
  return request({
    url: `/v1/quotation/quotations/discounts`,
    method: 'post',
    data
  })
}

// 获取查看订单html
export function getViewQuote (id) {
  return request({
    url: `/v1/quotation/quotations/${id}/html`,
    method: 'get'
  })
}
