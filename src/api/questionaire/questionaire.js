/**
 * 评论管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/qnr'

/**
 * 获取问卷列表
 * @param {Number} page
 * @param {Number} limit
 */
export function getQnrList (params) {
  return request({
    url: PREFIX + '/questionnaires',
    method: 'get',
    params
  })
}

/**
 * 获取问卷详情
 * @param {String} id
 */
export function getQnr (params) {
  return request({
    url: PREFIX + '/questionnaire',
    method: 'get',
    params
  })
}

/**
 * 删除问卷
 * @param {String} id
 */
export function deleteQnr (data) {
  return request({
    url: PREFIX + '/questionnaire',
    method: 'delete',
    data
  })
}

/**
 * 编辑问卷
 * @param {String} id
 * @param {String} title
 */
export function editQnr (data) {
  return request({
    url: PREFIX + '/questionnaire',
    method: 'put',
    data
  })
}

/**
 * 普通选择题
{
  "questionnaire_id": "6",
  "content": "美国是叙利亚局势恶化的恶首吗?",
  "question_type": "0",
  "random_answers_order": "0",
  "order": "1",
  "default_next_question_id": "0",
  "options": [
    {
      "option_id": "",
      "content": "是",
      "image_url": "",
      "next_question_id": "0",
      "group": "0",
      "order": "0",
      "fixed_order": "0",
      "option_type": "0",
      "tags": [
        {
          "option_tag_id": "",
          "tag_id": "151",
          "tag_name": "新建标签值1"
        }
      ]
    }
  ]
}
 */
export function normalSelect (questionID, data) {
  return request({
    url: PREFIX + `/normal-select/${questionID}`,
    method: 'put',
    data
  })
}

/**
 * 普通选择题
{
  "questionnaire_id": "5",
  "content": "叙利亚局势矩阵题目",
  "order": "2",
  "question_option_type": "0",
  "sub_questions": [
    {
      "sub_question_id": "1524794240047691",
      "content": "叙利亚矩阵题目一",
      "order": "1",
      "options": [
        {
          "option_id": "",
          "content": "选项一",
          "group": "0",
          "order": "0",
          "tags": [
            {
              "option_tag_id": "",
              "tag_id": "220",
              "tag_name": "标签444"
            }
          ]
        }
      ]
    }
  ]
}
 */
export function matrixSelect (questionID, data) {
  return request({
    url: PREFIX + `/matrix-select/${questionID}`,
    method: 'put',
    data
  })
}

/**
 * 删除问题
 * @param {String} id
 */
export function deleteQuestion (data) {
  return request({
    url: PREFIX + '/question',
    method: 'delete',
    data
  })
}

/**
 * 配置选项问题跳转
 * @param {String} id
 */
export function configJump (optionId, data) {
  return request({
    url: PREFIX + `/configure-question-skip/${optionId}`,
    method: 'put',
    data
  })
}
/**
 * 删除选项
 * @param {String} id
 */
export function deleteQption (data) {
  return request({
    url: PREFIX + '/option',
    method: 'delete',
    data
  })
}
