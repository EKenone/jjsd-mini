import Vue from 'vue'
import App from './App'

import basics from './pages/basics/home.vue'
Vue.component('basics',basics)

import components from './pages/component/home.vue'
Vue.component('components',components)

import plugin from './pages/plugin/home.vue'
Vue.component('plugin',plugin)

import order from './pages/order/home.vue'
Vue.component('order',order)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false
Vue.prototype.apiHost = 'https://mini.hosiyi.com/'

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

 



