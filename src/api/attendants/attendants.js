/**
 *  服务身份
 */
import request from '@/utils/request'

/**
 * eg
 */
// 获取服务列表
export function getAttendants (params) {
  return request({
    url: `/v1/quotation/attendants`,
    method: 'get',
    params
  })
}

// 创建服务人
export function addServicePerson (data) {
  return request({
    url: `/v1/quotation/attendants`,
    method: 'post',
    data
  })
}

// 更新服务人
export function eidtServicePerson (id, data) {
  return request({
    url: `/v1/quotation/attendants/${id}`,
    method: 'put',
    data
  })
}
// 开启/关闭服务人
export function toggleServicePerson (id, data) {
  return request({
    url: `/v1/quotation/attendants/${id}/toggle`,
    method: 'put',
    data
  })
}
