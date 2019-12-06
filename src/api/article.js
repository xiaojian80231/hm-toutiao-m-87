// 提供文章相关API函数
import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Integer} channelId  - 频道的ID
 * @param {Integer} timestamp  - 时间戳
 */
export const getArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

/**
 * 对文章不喜欢
 * @param {String} articleId  - 文章的ID
 */
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}

/**
 * 对文章进行举报
 * @param {String} articleId - 文章ID
 * @param {Integer} type - 举报类型
 */
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}
