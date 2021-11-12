<template>
  <div class="remark-item-content" style="height: 150px">
    <Base64image :url="currentPPTUrl">
      <Base64image :url="item.content">
          <Base64image :url="item.content1">
          </Base64image>
      </Base64image>
    </Base64image>
  </div>
</template>
<script>
import Base64image from '@/components/base64image.vue';
import {mapGetters} from 'vuex'
export default {
  components: { Base64image },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      currentPagePPTData: 'student/currentPagePPTData',
    }),
    currentPPTUrl() {
      return this.currentPagePPTData.thumbnail_url
    }
  },
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>