/**
 * 标签模块
 */
import request from '@/utils/request'

const PREFIX = '/v1/tag'

// 获取标签列表
export function getTagsList (params) {
  return request({
    url: `${PREFIX}/dimensions`,
    method: 'get',
    params
  })
}

// 创建标签维度
export function createTagDimension (data) {
  return request({
    url: `${PREFIX}/dimensions`,
    method: 'post',
    data
  })
}

// 修改标签维度
export function editTagDimension (data) {
  return request({
    url: `${PREFIX}/dimensions/${data.id}`,
    method: 'post',
    data
  })
}

// 批量创建标签值
export function createTagsList (data) {
  return request({
    url: `${PREFIX}/tags`,
    method: 'post',
    data
  })
}

// 修改标签值
export function editTag (data) {
  return request({
    url: `${PREFIX}/tags/${data.id}`,
    method: 'post',
    data
  })
}

// 查询标签值
export function getTagsValuesList (params) {
  return request({
    url: `${PREFIX}/tags`,
    method: 'get',
    params
  })
}

// 批量修改标签值排序值
export function editTagsValuesSort (data) {
  return request({
    url: `${PREFIX}/tags/ranks`,
    method: 'post',
    data
  })
}

// 拉取全部的应用对象
export function getAllAppliedObjects (params) {
  return request({
    url: `${PREFIX}/dimensions/object-categories`,
    method: 'get',
    params
  })
}

// 拉取单个的应用对象
export function getAppliedObjects (params) {
  return request({
    url: `${PREFIX}/dimensions/${params.dimensionId}/object-categories`,
    method: 'get',
    params
  })
}

// 保存配置应用对象
export function saveAppliedObjects (data) {
  return request({
    url: `${PREFIX}/dimensions/${data.id}/categories`,
    method: 'post',
    data: data.data
  })
}

export function upgradeTag (data) {
  return request({
    url: `${PREFIX}/tags/${data.id}`,
    method: 'post',
    data: data
  })
}
