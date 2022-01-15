import Vue from 'vue';
// eslint-disable-next-line import/order
import App from './App.vue';
import './elementUse'
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

// @ts-ignore
import lang from 'element-ui/lib/locale/lang/en'
// @ts-ignore
import locale from 'element-ui/lib/locale'
import store from './store'
import router from './router/index';
import videoPlayer from './components/common/videoPlayer.vue'

// 设置语言
locale.use(lang)

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])
Vue.component('vue-drag-resize', VueDragResize)
Vue.component('VideoPlayer', videoPlayer)

// 挂载到$message上
Vue.prototype.$message = Message

Vue.config.productionTip = false;
window.EventBus = new Vue();
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
