/**
 * 评论管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/comment'

/**
 * 获取评论列表
 * @param {String} content
 * @param {String} name
 * @param {String} startTime
 * @param {String} endTime
 * @param {Number} isDelect
 * @param {Number} page
 * @param {Number} page_size
 */
export function getCommentList (params) {
  return request({
    url: PREFIX + '/topic-square/index',
    method: 'get',
    params
  })
}

/**
 * 删除评论
 * @param {Number} commentId
 * @param {Number} topicId
 */
export function delectComment (data) {
  return request({
    url: PREFIX + '/topic-square/delete',
    method: 'post',
    data
  })
}
