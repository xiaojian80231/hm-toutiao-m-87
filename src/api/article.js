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
