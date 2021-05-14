<template>
  <div class="page">
    <div v-if="currentItemData && currentItemData.thumbnail_url">
      <pptcontent
        v-if="!showResponse"
        :url="currentItemData.thumbnail_url"
        :teacher="true"
      />
      <teacherIndexItem
        v-else-if="currentItemData && currentItemData.items[0]"
        :data="currentItemData"
        :type="currentItemData.items[0].type"
        :flag="false"
        :currentAnswerCount="currentAnswerCount"
        :textList="responseContentList"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>

<script>
import pptcontent from "../pptcontent.vue";
import teacherIndexItem from "./Index.vue";
export default {
  components: { pptcontent, teacherIndexItem },
  props: {
    currentItemData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showResponse: {
      type: Boolean,
      default: false,
    },
    currentAnswerCount: {
      type: Number,
      default: 0,
    },
    responseContentList: {
      type: Array,
      function() {
        return [];
      },
    },
  },

  created() {
    
  },
};
</script>