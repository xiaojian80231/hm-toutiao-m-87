// 提供频道相关的API函数
import request from '@/utils/request'

/**
 * 获取我的频道列表 - (未登录：获取的是系统默认给的频道列表)
 */
export const getMyChannels = () => {
  return request('/app/v1_0/user/channels', 'get')
}
