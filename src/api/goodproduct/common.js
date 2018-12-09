/**
 * 评论管理
 */
import request from '@/utils/request'
/**
 * 获取洛可可列表数据
 */
export function getLkkProductList (params) {
  return request({
    url: '/v1/good-product/lkk',
    method: 'get',
    params
  })
}

/**
 * 获取洛可可详情数据
 */
export function getLkkChildProductData (id) {
  return request({
    url: '/v1/good-product/lkk/' + id,
    method: 'get'
  })
}

/**
 * 获取洛可可好产品列表筛选所需信息
 */

export function getLkkFilterData () {
  return request({
    url: '/v1/good-product/lkk/filterData',
    method: 'get'
  })
}

/**
 * 获取洛可可关联 取消关联
 */

export function doRelative (data) {
  return request({
    url: '/v1/good-product/lkk/relation',
    method: 'patch',
    data
  })
}

/**
 * 获取洛可可关联子产品搜索列表
 */

export function getLkkRelationSearchData (params) {
  return request({
    url: '/v1/good-product/lkk/product',
    method: 'get',
    params
  })
}

/**
 * 洛可可编辑主产品
 */

export function editLkkMainProduct (id, data) {
  return request({
    url: '/v1/good-product/lkk/main/' + id,
    method: 'put',
    data
  })
}

/**
 * 洛可可编辑子产品
 */

export function editLkkChildProduct (id, data) {
  return request({
    url: '/v1/good-product/lkk/' + id,
    method: 'put',
    data
  })
}

/**
 * 删除产品
 */
export function detaleProduct (params) {
  return request({
    url: '/v1/good-product/' + params,
    method: 'delete'
  })
}

/**
 * 获取洛客好产品列表筛选所需信息
 */

export function getLkkerFilterData () {
  return request({
    url: '/v1/good-product/lkker/filterData',
    method: 'get'
  })
}

/**
 * 获取洛客好产品列表筛选所需信息
 */

export function getLkkerProductList (params) {
  return request({
    url: '/v1/good-product/lkker/',
    method: 'get',
    params
  })
}

/**
 * 获取洛客详情数据
 */
export function getLkkerChildProductData (id) {
  return request({
    url: '/v1/good-product/lkker/' + id,
    method: 'get'
  })
}

/**
 * 洛可可编辑主产品
 */

export function editLkkerMainProduct (id, data) {
  return request({
    url: '/v1/good-product/lkker/main/' + id,
    method: 'put',
    data
  })
}

/**
 * 洛可可编辑子产品
 */

export function editLkkerChildProduct (id, data) {
  return request({
    url: '/v1/good-product/lkker/' + id,
    method: 'put',
    data
  })
}

/**
 * 获取洛可可关联 取消关联
 */

export function dolkkerRelative (data) {
  return request({
    url: '/v1/good-product/lkker/relation',
    method: 'patch',
    data
  })
}

/**
 * 获取洛可可关联子产品搜索列表
 */

export function getLkkerRelationSearchData (params) {
  return request({
    url: '/v1/good-product/lkker/product',
    method: 'get',
    params
  })
}

/**
 * 洛可可导出
 */

export function exportLkk (params) {
  return request({
    url: '/v1/good-product/lkk/export',
    method: 'get',
    params
  })
}

/**
 * 洛可可批量导入
 */

export function bulkImport (data) {
  return request({
    url: '/v1/good-product/lkk/import',
    method: 'post',
    data
  })
}

/**
 * 洛客创建主产品
 */

export function addLkkerMainProduct (data) {
  return request({
    url: '/v1/good-product/lkker/main',
    method: 'post',
    data
  })
}

/**
 * 洛客创建子产品
 */

export function addLkkerChildProduct (data) {
  return request({
    url: '/v1/good-product/lkker/',
    method: 'post',
    data
  })
}

/**
 * 洛客创建子产品
 */

export function searchLkkerTask (params) {
  return request({
    url: '/v1/good-product/lkker/search-task',
    method: 'get',
    params
  })
}

/**
 * 洛客创建更新产品时确认是否重名
 */

export function checkRepeatName (params) {
  return request({
    url: '/v1/good-product/lkker/check-name/',
    method: 'get',
    params
  })
}

/**
 * 洛客导出
 */

export function exportLkker (params) {
  return request({
    url: '/v1/good-product/lkker/export',
    method: 'get',
    params
  })
}
