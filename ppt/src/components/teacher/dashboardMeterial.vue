<template>
  <div class="meterial" v-if="meterialVisiable">
    <pptcontent
      :url="pptUrl"
      :teacher="true"
      :filterAddedMediaList="filterAddedMediaList"
      :meterialVisiable="meterialVisiable"
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
  data() {
    return {
      meterialVisiable: false
    };
  },
  mounted() {
    EventBus.$on(ModalEventsNameEnum.MEDIA_MODAL_VISIBLE, (status) => {
      this.meterialVisiable = status
      console.log(status)
    })
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
}
</style>