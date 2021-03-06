// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui'
import Axios from 'axios'
import MintUi from 'mint-ui'
import store from './store'
import "@/assets/css/reset.css"
import "@/assets/css/commen.css"
import "@/assets/css/animate.css"
import 'element-ui/lib/theme-chalk/index.css';
import 'mint-ui/lib/style.css';
Vue.config.productionTip = false
Vue.prototype.axios=Axios
Vue.use(ElementUi)
Vue.use(MintUi)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
