// 定义用户相关的API
import request from '@/utils/request'

/**
 * 登录
 * @param {object} loginForm - 登录用户信息(mobile,code)
 */
export const login = (loginForm) => {
  return request('/app/v1_0/authorizations', 'post', loginForm)
}
