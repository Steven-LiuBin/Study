import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局css样式
import './assets/css/global.css'

// 引入icon图库样式文件
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入element-ui组件库
import ElementUI from 'element-ui'
// 注册组件
Vue.use(ElementUI)

// axios配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

axios.interceptors.request.use(function (config) {
  console.dir(axios)
  console.dir(config)
  // 给axios配置token
  var token = window.sessionStorage.getItem('token')
  if (token !== null) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.prototype.$http = axios
// Vue.config.productionTip = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
