import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入vue-quill富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入vue-quill对应的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 导入nprogress
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 在response拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册为全局组件
Vue.component('tree-table', TreeTable)
// 将vue-quill注册为全局引用
Vue.use(VueQuillEditor)

// 全局时间格式转换
Vue.filter('dateFormat', originVal => {
  const dateTime = new Date(originVal)
  // 年
  const year = dateTime.getFullYear()
  // 月
  const month = (dateTime.getMonth() + 1 + '').padStart(2, '0')
  // 日
  const day = (dateTime.getDate() + '').padStart(2, '0')
  // 时
  const hh = (dateTime.getHours() + '').padStart(2, '0')
  // 分
  const mm = (dateTime.getMinutes() + '').padStart(2, '0')
  // 秒
  const ss = (dateTime.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
