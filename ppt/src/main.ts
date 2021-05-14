import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import './elementUse'
import './assets/css/teacher.css'
import { Message } from 'element-ui'
// 挂载到$message上
Vue.prototype.$message = Message

Vue.config.productionTip = false;
window.EventBus = new Vue();
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
