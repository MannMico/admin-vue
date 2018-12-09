/**
 * 话题
 */
import request from '@/utils/request'

const PREFIX = '/v1/topic'

/**
 * 获取话题广场列表
 * @param {String} userName
 * @param {String} content
 * @param {Number} display 1显示 0隐藏
 * @param {Number} hot 1热门 0不热门
 * @param {String} startTime
 * @param {String} endTime
 * @param {Number} page
 * @param {Number} limit
 */
export function getTopicList (params) {
  return request({
    url: PREFIX + '/index',
    method: 'get',
    params
  })
}
/**
 * 切换评论状态是否开启
 * @param {Number} topicId
 * @param {String} type 1表示打开评论 0表示关闭评论
 */
export function switchCommentStatus (data) {
  return request({
    url: PREFIX + '/switch-comment-status',
    method: 'post',
    data
  })
}
/**
 * 切换显示状态是否显示
 * @param {Number} topicId
 * @param {String} userId（隐藏话题必须有）
 * @param {String} title（隐藏话题必须有）
 * @param {String} reason 拒绝理由,（隐藏话题必须有）
 */
export function switchDisplay (data) {
  return request({
    url: PREFIX + '/switch-display',
    method: 'post',
    data
  })
}
/**
 * 切换是否热门
 * @param {Number} topicId
 * @param {String} userId
 * @param {String} title（隐藏话题必须有）
 * @param {String} type  1表示切换热门 0表示切换非热门
 */
export function switchHot (data) {
  return request({
    url: PREFIX + '/switch-hot',
    method: 'post',
    data
  })
}
/**
 * 话题列表操作记录
 * @param {Number} id
 * @param {String} type
 */
export function getOperate (params) {
  return request({
    url: PREFIX + '/operate-log',
    method: 'get',
    params
  })
}
/**
 * 话题类型列表
 * @param {String} title
 * @param {String} userId
 * @param {Number} display
 * @param {Number} hot
 * @param {String} startTime
 * @param {String} endTime
 * @param {Number} page
 * @param {Number} limit
 */
export function topicType (params) {
  return request({
    url: PREFIX + '/type-list',
    method: 'get',
    params
  })
}
/**
 * 切换类型是否显示
 * @param {Number} topicTypeId 话题类型ID
 * @param {String} reason
 */
export function switchTypeDisplay (data) {
  return request({
    url: PREFIX + '/switch-type-display',
    method: 'post',
    data
  })
}
/**
 * 切换类型是否热门
 * @param {Number} topicTypeId 话题类型ID
 * @param {Number} type
 * @param {String} startTime
 * @param {String} endTime
 */
export function switchTypeHot (data) {
  return request({
    url: PREFIX + '/switch-type-hot',
    method: 'post',
    data
  })
}
/**
 * 编辑简介
 * @param {Number} topicTypeId 话题类型ID
 * @param {String} content
 */
export function editTypeContent (data) {
  return request({
    url: PREFIX + '/edit-type-content',
    method: 'post',
    data
  })
}
/**
 * 编辑封面
 * @param {Number} topicTypeId 话题类型ID
 * @param {String} image
 */
export function editTypeImage (data) {
  return request({
    url: PREFIX + '/edit-type-image',
    method: 'post',
    data
  })
}
/**
 * 话题类型对应话题列表
 * @param {Number} topicTypeId 话题类型ID
 * @param {Number} display
 * @param {Number} top
 * @param {String} startTime
 * @param {String} endTime
 * @param {Number} page
 * @param {Number} limit
 */
export function typeTopicList (params) {
  return request({
    url: PREFIX + '/type-topic-list',
    method: 'get',
    params
  })
}
/**
 * 话题类型置顶
 * @param {Number} topicTypeId 话题类型ID
 * @param {Number} topicId
 * @param {Number} type 0取消置顶 1置顶
 */
export function typeTopicTop (data) {
  return request({
    url: PREFIX + '/switch-type-topic-top',
    method: 'post',
    data
  })
}
/**
 * 用户推荐列表
 * @param {String} userName 用户名
 * @param {String} userId
 * @param {String} phone 手机号
 * @param {Number} minTopicNum
 * @param {Number} maxTopicNum
 * @param {Number} isRecommend 1不推荐 2推荐
 * @param {Number} page
 * @param {Number} limit
 */
export function userRecommendList (params) {
  return request({
    url: PREFIX + '/user-recommend-list',
    method: 'get',
    params
  })
}
/**
 * 切换用户推荐状态
 * @param {String} userName 用户名
 * @param {String} type
 */
export function switchUserRecommend (data) {
  return request({
    url: PREFIX + '/switch-user-recommend',
    method: 'post',
    data
  })
}

/**
 * 批量点赞
 * @param {String} num 点赞数
 * @param {Array} arrTopicId 话题idArr
 */
export function batchLike (data) {
  return request({
    url: `${PREFIX}/batch-topic-like`,
    method: 'post',
    data
  })
}

/**
 * 批量导入话题
 * @param {Object} file 文件对象
 */
const env = require('../../../config/' + (process.env.NODE_ENV === 'development' ? 'dev' : process.env.NODE_ENV) + '.env')
export const batchAddUrl = `${env.BASE_API}${PREFIX}/batch-topic-add`.replace(/"/g, '')
