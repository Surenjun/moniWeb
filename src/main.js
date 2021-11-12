import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import './utils/errorLog' // error log

import * as filters from './filters' // global filters

// import { mockXHR } from '../mock' // simulation data
// mockXHR()

import animated from './styles/animate.min.css' // npm install animate.css --save安装，在引入
// mock api in github pages site build

// if (process.env.NODE_ENV === 'production') { mockXHR() }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(animated)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;


Vue.prototype.$EventBus = new Vue()

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
