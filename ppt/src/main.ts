import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import './elementUse'
import './assets/css/teacher.css'

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
