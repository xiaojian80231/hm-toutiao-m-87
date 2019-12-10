import Vue from 'vue'
import Vuex from 'vuex'

import * as auth from '@/utils/auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 数据共享
  state: {
    // 用户信息(token,refresh_token)
    user: auth.getUser(),
    // 用户头像
    photo: null
  },

  // 数据修改
  mutations: {
    // 设置用户头像
    setPhoto (state, photo) {
      state.photo = photo
    },
    // 修改用户信息
    setUser (state, user) {
      state.user = user// 修改state数据
      auth.setUser(user)// 修改本地数据
    },
    // 删除用户信息
    delUser (state) {
      state.user = {}// 删除state数据
      auth.delUser()// 删除本地数据
    }
  },

  actions: {
  }
})
