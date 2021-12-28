<template>
  <div class="meterial" v-if="meterialVisiable">
    <pptcontent
      :url="pptUrl"
      :teacher="true"
      :filterAddedMediaList="filterAddedMediaList"
      :defaultShowMeterial="true"
    />
  </div>
</template>

<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import pptcontent from "../pptcontent.vue";
export default {
  components: { pptcontent },
  props: {
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
    pptUrl: {
      type: String,
      default: ''
    },
    meterialVisiable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.meterial{
  position: absolute;
  left:0;
  right: 0;
  top:0;
  bottom: 0;
  z-index: 9;
  /* background-color: #e0e0e0; */
}
</style>