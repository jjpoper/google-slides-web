<template>
  <div class="dashboard">
    <div class="page">
      <div class="left" v-if="slides">
        <div v-for="(item, index) in slides" :key="index" class="ppt_content">
          <div
            v-bind:class="
              isFocus[index]
                ? 'image_parent image_parent_focus'
                : 'image_parent '
            "
            @click="giveFocus(index)"
          >
            <img :src="item.thumbnail_url" />
          </div>

          <div class="response_flag">
            <div
              class="top"
              :style="'width:' + responsePercentage[index] + '%'"
            ></div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="content_parent">
        <div class="content_main">
          <teacherIndexItem
            v-if="currentItemData && currentItemData.items[0]"
            :data="currentItemData"
            :type="currentItemData.items[0].type"
            :flag_1="true"
            :currentAnswerCount="currentAnswerCount"
            :textList="responseContentList"
            :pptUrl="currentItemData.thumbnail_url"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #edf0f4;
  flex-direction: column;
}
.page {
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left {
  min-height: 100%;
  width: 250px;
  overflow: scroll;
  padding: 10px;
}

.left::-webkit-scrollbar {
  display: none;
}
.ppt_content {
  display: flex;
  flex-direction: column;
  width: 250px;
  overflow: hidden;
  margin-bottom: 10px;
}

.divider {
  height: auto;
  min-height: 100%;
  background-color: #e0e0e0;
  width: 1px;
  position: fixed;
  top: 0px;
  left: 250px;
}

.content_parent {
  display: flex;
  flex: 1;
  overflow-x: hidden;
}

.content_main {
  height: auto;
  width: 100%;
  background-color: white;
  display: flex;
  padding-left: 5px;
  padding-right: 10px;
  /* justify-content: center;
  align-items: center;
  flex-wrap: wrap; */
}

.image_parent {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid white;
  width: 230px;
  height: 130px;
}
.image_parent_focus {
  border: 1px solid #409eff;
}
image {
  width: 228px;
  height: auto;
  display: block;
}
.response_flag {
  width: 230px;
  height: 6px;
  background-color: white;
  border: 1px solid #909090;
}
.top {
  background-color: #67c23a;
  height: 6px;
}

.control_panel {
  width: 100%;
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
    slides: {
      type: Array,
      function() {
        return [];
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
    giveFocus: {
      type: Function,
    },
    responsePercentage: {
      type: Array,
      function() {
        return [];
      },
    },
    isFocus: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    console.log(this.currentItemData);
  },
};
</script>