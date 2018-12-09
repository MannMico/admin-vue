/**
 * 标签模块
 */
import request from '@/utils/request'

const PREFIX = '/v1/sku'
// 分类管理
// 获取一级分类管理的列表
export function getclassification (params) {
  return request({
    url: `${PREFIX}/categories/tree`,
    method: 'get',
    params
  })
}
// 删除一级列表
export function deleteOneOpuses (id, params) {
  return request({
    url: `${PREFIX}/categories/` + id,
    method: 'delete',
    params
  })
}
// 添加一级列表
export function addOneClassification (data) {
  return request({
    url: `${PREFIX}/categories/`,
    method: 'post',
    data
  })
}
// 获取弹窗里面的一级分类
export function getOneClass (params) {
  return request({
    url: `${PREFIX}/categories/head`,
    method: 'get',
    params
  })
}
// 获取二级三级分类管理的列表
export function getTwoclassification (id, params) {
  return request({
    url: `${PREFIX}/categories/` + id + '/children',
    method: 'get',
    params
  })
}
// 修改分类状态
export function putStatusClass (id, data) {
  return request({
    url: `${PREFIX}/categories/${id}/status`,
    method: 'put',
    data
  })
}
// 获取分类
export function getClassContent (id, params) {
  return request({
    url: `${PREFIX}/categories/${id}`,
    method: 'get',
    params
  })
}
// 更新分类
export function editClassContent (id, data) {
  return request({
    url: `${PREFIX}/categories/${id}`,
    method: 'put',
    data
  })
}
// 服务管理
// 获取服务列表
export function getService (params) {
  return request({
    url: `${PREFIX}/spus`,
    method: 'get',
    params
  })
}
// 更新服务状态
export function putStatusService (id, data) {
  return request({
    url: `${PREFIX}/spus/${id}/status`,
    method: 'put',
    data
  })
}
// 查看SPU
export function putService (id, params) {
  return request({
    url: `${PREFIX}/spus/${id}`,
    method: 'get',
    params
  })
}
// 获取SPU信息
export function putDetailsService (id, data) {
  return request({
    url: `${PREFIX}/spus/${id}`,
    method: 'put',
    data
  })
}
// 删除服务
export function deleteService (id, params) {
  return request({
    url: `${PREFIX}/spus/` + id,
    method: 'delete',
    params
  })
}
// 获取属性列表
export function attributesService (params) {
  return request({
    url: `${PREFIX}/attributes`,
    method: 'get',
    params
  })
}
// 创建属性值
export function attributesServicevalues (data) {
  return request({
    url: `${PREFIX}/attribute/values`,
    method: 'post',
    data
  })
}
// 获取日志
export function getjournalList (params) {
  return request({
    url: `${PREFIX}/logs`,
    method: 'get',
    params
  })
}
// 获取服务日志
export function getServiceJourna (id, params) {
  return request({
    url: `${PREFIX}/spus/${id}/logs`,
    method: 'get',
    params
  })
}
// 获取服务日志
export function getattendants (params) {
  return request({
    url: `${PREFIX}/attendants`,
    method: 'get',
    params
  })
}
// 保存，设置服务介绍
export function addSpus (data) {
  return request({
    url: `${PREFIX}/spus`,
    method: 'post',
    data
  })
}
// 更新SPU服务介绍
export function getSpus (id, params) {
  return request({
    url: `${PREFIX}/spus/${id}`,
    method: 'get',
    params
  })
}
// 更新SPU服务介绍
export function editorSpus (id, type, data) {
  return request({
    url: `${PREFIX}/spus/${id}/intro/${type}`,
    method: 'put',
    data
  })
}
// 提交属性设置
export function determine (data) {
  return request({
    url: `${PREFIX}/spus/skus`,
    method: 'post',
    data
  })
}
// 提交属性设置
export function getDetails (id, params) {
  return request({
    url: `${PREFIX}/spus/details/${id}/sku`,
    method: 'get',
    params
  })
}
// 提交属性设置
export function postDetails (id, sku, data) {
  return request({
    url: `${PREFIX}/spus/details/${id}/${sku}`,
    method: 'post',
    data
  })
}
// 更新sku状态
export function putStatusServiceSku (id, data) {
  return request({
    url: `${PREFIX}/skus/${id}/status`,
    method: 'put',
    data
  })
}
// 更新sku价格
export function putPriceValue (data) {
  return request({
    url: `${PREFIX}/skus/price`,
    method: 'put',
    data
  })
}
// 判断sku细目是否完整
export function getChecking (id, data) {
  return request({
    url: `${PREFIX}/spus/${id}/checking`,
    method: 'get',
    data
  })
}
// 判断sku细目是否完整
export function urls (data) {
  return request({
    url: `/v1/common/client-urls`,
    method: 'get',
    data
  })
}
//
