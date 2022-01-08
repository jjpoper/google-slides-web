import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import './elementUse'
import { Message } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)
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
import videoPlayer from './components/common/videoPlayer.vue'
import store from './store'

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
