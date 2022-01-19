<template>
  <div style="width: 100%; height: 100%;"  v-if="currentItemData && currentItemData.thumbnail_url">
    <pptcontent
      v-if="!showResponse"
      :url="currentItemData.thumbnail_url"
      :teacher="true"
      :filterAddedMediaList="filterAddedMediaList"
      :meterialVisiable="meterialVisiable"
      :showLogo="true"
    />
    <div v-else-if="currentItemData && currentItemData.items[0]" :style="`height:${height - 110}px`">
      <teacherIndexItem
        :data="currentItemData"
        :type="currentItemData.items[0].type"
        :flag="false"
        :currentAnswerCount="currentAnswerCount"
        :textList="responseContentList"
        :pptUrl="currentItemData.thumbnail_url"
        :flag_1="false"
      />
    </div>
  </div>
</template>

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
    meterialVisiable: {
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
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  created() {
    
  },
  data() {
    return {
      height: window.winHeight
    };
  },
};
</script>