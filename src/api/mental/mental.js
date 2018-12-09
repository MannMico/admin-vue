import request from '@/utils/request'

const mentalUrl = '/v1/points/'

export function mentalList (params) {
  return request({
    url: `${mentalUrl}points-list`,
    method: 'get',
    params
  })
}

export function mentalEvery (params) {
  return request({
    url: `${mentalUrl}log`,
    method: 'get',
    params
  })
}

export function mentalEveryDetail (params) {
  return request({
    url: `${mentalUrl}user-points`,
    method: 'get',
    params
  })
}

export function mentalExport (params) {
  return request({
    url: `${mentalUrl}export`,
    method: 'get',
    params
  })
}
