// auth 是认证意思    token目的：进行身份认证
// 提供用户信息(token，refresh_token)的  获取   设置   删除

// 导出三个操作
const KEY = 'hm-toutiao-m-87-user'

// 获取用户信息
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(KEY) || '{}')
}

// 设置用户信息 user是对象
export const setUser = (user) => {
  window.localStorage.setItem(KEY, JSON.stringify(user))
}

// 删除用户信息
export const delUser = () => {
  window.localStorage.removeItem(KEY)
}
