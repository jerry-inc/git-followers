import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '../src/assets/theme.less'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  render: h => h(App)
}).$mount('#app')
