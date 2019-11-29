import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 根据屏幕宽度动态设置rem基准值
import 'amfe-flexible'

// 使用vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
