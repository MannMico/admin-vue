/**
 * @description 渠道管理 && 渠道数据
 */
import request from '@/utils/request'

const PREFIX = '/v1/channel'
// const baseURL = 'http://feature-channel-analysis.admin.api.test.lkker.cn'

/**
 * @description 查看渠道
 * @param {Object} params
 * @param {String} name 渠道管理
 * @param {String} start_at 添加起始时间
 * @param {String} end_at 添加结束时间
 * @param {String} utm_source 渠道utm_source
 * @param {Number} page 页码
 * @param {Number} size 每页条数
 */
export function getChannelList (params) {
  return request({
    url: `${PREFIX}/channels`,
    method: 'get',
    params
  })
}

/**
 * 当utm_souce 为 ''时 默认搜索前十个渠道
 * */

export function getChannelListNoInput (params) {
  return request({
    url: `${PREFIX}/channels/top/10`,
    method: 'get',
    params
  })
}

// 批量导出
export function exportChannelList (params) {
  return request({
    responseType: 'blob',
    url: `${PREFIX}/channels/exports`,
    method: 'get',
    params,
    timeout: 60000
  })
}

/**
 * @description 添加渠道
 * @param {Object} data
 * @param {String} channel_type_id 渠道类型（营销->1）
 * @param {String} name 渠道名称
 * @param {String} owner 渠道负责人
 * @param {String} remark 备注
 */
export function addChannel (data) {
  return request({
    url: `${PREFIX}/channels`,
    method: 'post',
    data
  })
}

/**
 * @description 编辑渠道
 * @param {Number} id 渠道id
 * @param 其他param同上
 */
export function editChannel (data) {
  return request({
    url: `${PREFIX}/channels/${data.id}`,
    method: 'post',
    data
  })
}

/**
 * @description 渠道注册用户统计
 * @param {String} utm_source 渠道utm_source
 * @param {String} begin_at 起始时间（yyyy-mm-dd）
 * @param {String} end_at 截止时间（yyyy-mm-dd）
 */
export function channelRegisterCount (params) {
  return request({
    url: `${PREFIX}/channels/registrations/stats`,
    method: 'get',
    params
  })
}

/**
 * @description 渠道收集线索统计
 * @param {String} utm_source 渠道utm_source
 * @param {String} begin_at 起始时间（yyyy-mm-dd）
 * @param {String} end_at 截止时间（yyyy-mm-dd）
 */
export function channelCluesCount (params) {
  return request({
    url: `${PREFIX}/channels/clues/stats`,
    method: 'get',
    params
  })
}

/**
 * @description 渠道流量情况分析
 * @param {NUmber} type 查询类型：pv->1;uv->2
 * @param {String} begin_at 起始时间（yyyy-mm-dd）
 * @param {String} end_at 截止时间（yyyy-mm-dd）
 * @param {String} utm_source 渠道utm_source（默认查询全部渠道）
 */
export function channelFlowsCount (params) {
  return request({
    url: `${PREFIX}/channels/flows/stats`,
    method: 'get',
    params
  })
}

/**
 * @description 渠道详细数据分析
 * @param {String} begin_at 起始时间（yyyy-mm-dd）
 * @param {String} end_at 截止时间（yyyy-mm-dd）
 * @param {String} utm_source 渠道utm_source（默认查询全部渠道）
 * @param {String} sort_column 排序名称 pv_num：pv统计;
 *                                     uv_num：uv统计;
 *                                     register_num：注册用户统计;
 *                                     clue_num：线索统计;
 *                                     visitor_num：访客统计
 * @param {String} sort_type 排序类型：asc:升序：desc:降序
 * @param {Nmuber} page 页码
 * @param {Number} size 每页条数
 */
export function channelDetailsCount (params) {
  return request({
    url: `${PREFIX}/channels/details/stats`,
    method: 'get',
    params
  })
}

/**
 * @description 渠道详细数据导出
 * @param {String} begin_at 起始时间（yyyy-mm-dd）
 * @param {String} end_at 截止时间（yyyy-mm-dd）
 */
export function channelDetailExport (params) {
  return request({
    url: `${PREFIX}/channels/details/stats`,
    method: 'get',
    params
  })
}

/**
 * @description 渠道详情
 * @param {Number} id
 */
export function getDetail (params) {
  return request({
    url: `${PREFIX}/channels/utm-source/${params.utm_source}`,
    method: 'get',
    params
  })
}

/**
 * @description 查询渠道注册记录
 */
export function getRegDetail (params) {
  return request({
    url: `${PREFIX}/channels/registrations`,
    method: 'get',
    params
  })
}

/**
 * @description 查询渠道线索记录
 */
export function getClueDetail (params) {
  return request({
    url: `${PREFIX}/channels/clues`,
    method: 'get',
    params
  })
}
const env = require('../../config/' + (process.env.NODE_ENV === 'development' ? 'dev' : process.env.NODE_ENV) + '.env')
export const envVariate = `${env.BASE_API}`.replace(/"/g, '')
