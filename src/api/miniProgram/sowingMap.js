/**
 * 标签模块
 */
import request from '@/utils/request'

const PREFIX = '/v1/draw'

// 获取轮播图的列表
export function getSowingMap (params) {
  return request({
    url: `${PREFIX}/banners`,
    method: 'get',
    params
  })
}
// 获取主题列表
export function getThemes (params) {
  return request({
    url: `${PREFIX}/themes`,
    method: 'get',
    params
  })
}
// 获取轮播详情页
export function getSowingMapDetail (id) {
  return request({
    url: `${PREFIX}/banner/${id}`,
    method: 'get'
  })
}
// 编辑轮播详情页
export function getDetail (id, data) {
  return request({
    url: `${PREFIX}/banner/${id}`,
    method: 'patch',
    data
  })
}
// 新增轮播详情页
export function getmapDetail (data) {
  return request({
    url: `${PREFIX}/banner/`,
    method: 'post',
    data
  })
}
// 获取轮播图内容的列表
export function getcontents (params) {
  return request({
    url: `${PREFIX}/contents`,
    method: 'get',
    params
  })
}
// 获取轮播图内容详情页
export function getPagedetailspage (id) {
  return request({
    url: `${PREFIX}/content/${id}`,
    method: 'get'
  })
}
// 编辑轮播图内容详情页
export function EditPagedetailspage (id, data) {
  return request({
    url: `${PREFIX}/content/${id}`,
    method: 'patch',
    data
  })
}
// 新增轮播图内容详情页
export function addedPagedetailspage (data) {
  return request({
    url: `${PREFIX}/content/`,
    method: 'post',
    data
  })
}
// 获取主题内容的列表
export function gettheme (params) {
  return request({
    url: `${PREFIX}/themes`,
    method: 'get',
    params
  })
}
// 获取主题内容详情页
export function getthemesDetails (id) {
  return request({
    url: `${PREFIX}/theme/${id}`,
    method: 'get'
  })
}
// 编辑主题内容详情页
export function Edittheme (id, data) {
  return request({
    url: `${PREFIX}/theme/${id}`,
    method: 'patch',
    data
  })
}
// 新增主题内容详情页
export function addedtheme (data) {
  return request({
    url: `${PREFIX}/theme/`,
    method: 'post',
    data
  })
}
// 新增作品内容详情页
export function getopuses (params) {
  return request({
    url: `${PREFIX}/opuses/`,
    method: 'get',
    params
  })
}
// 删除作品
export function deleteOpuses (id, params) {
  return request({
    url: `${PREFIX}/opus/${id}`,
    method: 'delete',
    params
  })
}
// 删除作品
export function getUsers (params) {
  return request({
    url: `${PREFIX}/users/`,
    method: 'get',
    params
  })
}
// 屏蔽
export function popShield (id, data) {
  return request({
    url: `${PREFIX}/user/${id}`,
    method: 'patch',
    data
  })
}
