import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { MessageBox } from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'

//导入全局样式表
import './assets/css/global.css'

//配置全局基准路径，方便接口的调用
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截器添加token，保证拥有获得数据的权限
axios.interceptors.request.use(config => {
  //为请求头对象 添加token验证的 Authorization 字段（后端自定义）
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  // 最后必须要return config 
  return config
})
//将全局的axios对象挂载在vue的原型对象上，方便全局调用
//在别的组件中可以直接使用这个 this.$http 发起ajax请求数据  this 的指向问题?
Vue.prototype.$http = axios
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
