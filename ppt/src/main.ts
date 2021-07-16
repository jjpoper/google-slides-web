import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import './elementUse'
import './assets/css/teacher.css'
import { Message } from 'element-ui'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import {
  BarChart
} from 'echarts/charts'
import VueDragResize from 'vue-drag-resize'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])
Vue.component('vue-drag-resize', VueDragResize)

// 挂载到$message上
Vue.prototype.$message = Message

Vue.config.productionTip = false;
window.EventBus = new Vue();
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
