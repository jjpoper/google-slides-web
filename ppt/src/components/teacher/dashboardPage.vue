<template>
  <div class="dashboard">
    <div class="dashboardpage" :style="`height:${height - 110}px`">
      <div class="left" :style="`height:${height - 110}px`" v-if="slides">
        <div v-for="(item, index) in slides" :key="index" v-bind:class="
              isFocus[index]
                ? 'ppt_content image_parent_focus'
                : 'ppt_content '">
          <div
            class="image_parent"
            @click="giveFocus(index)"
            :style="`background-image:url(${item.thumbnail_url})`"
          >
            <!-- <img :src="item.thumbnail_url" /> -->

            <el-popover
              placement="right"
              width="100"
              trigger="hover"
              v-if="getPageStudent(index) > 0"
            >
              <div class="student_name">{{ getStudentName(index) }}</div>

              <!-- @click.stop="showCurrentStudent()" -->
              <div class="student_flag" slot="reference">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 64 64"
                  enable-background="new 0 0 64 64"
                  xml:space="preserve"
                  fill="#fff"
                >
                  <path
                    d="M58,64c0-11-7-20-16.7-23.6l0,0c-0.1-0.1-0.3-0.1-0.4-0.2c2.2-2.3,3.9-5.6,4.6-10.5c1,0.1,2.3-0.8,2.7-2.7
	c0.5-1.9,1.4-4.8,0.3-5.2c-0.3-0.1-0.6,0-0.6,0.1v-5c0-5.5-0.9-10.9-6.7-13.2c-1-2.3-1.3-3.9-1.3-3.9c-2.6,2.4-12.8,3.9-12.8,3.9
	h0.1C14.6,4.9,16,9.1,16,17v5.1c0-0.1-0.4-0.3-0.7-0.1c-1,0.3-0.5,3.2-0.2,5.1c0.4,1.7,2,3,3.1,2.8c0.8,5,2.2,8.4,4.3,10.5
	C12.9,44,6,53,6,64H58z"
                  />
                </svg>
                <div class="student_count">1</div>
              </div>
            </el-popover>
          </div>

          <!-- <div class="response_flag">
            <div
              class="top"
              :style="'width:' + responsePercentage[index] + '%'"
            ></div>
          </div> -->
        </div>
      </div>

      <div class="dash-right" :style="`height:${height - 110}px`">
        <template
          :class="
            showResponse &&
            currentItemData &&
            currentItemData.items &&
            currentItemData.items[0] &&
            currentItemData.items[0].type != 'website' &&
            page_model != 'Student-Paced'
              ? 'content_parent content_parent--border'
              : 'content_parent'
          "
        >
          <teacherIndexItem
            v-if="currentItemData && currentItemData.items[0]"
            :data="currentItemData"
            :type="currentItemData.items[0].type"
            :flag_1="true"
            :currentAnswerCount="currentAnswerCount"
            :textList="responseContentList"
            :pptUrl="currentItemData.thumbnail_url"
          />
        </template>
        <dashboard-meterial
          :pptUrl="currentItemData.thumbnail_url"
          :filterAddedMediaList="filterAddedMediaList"
          :meterialVisiable="meterialVisiable"
        />
        <tips-list v-if="overviewModalVisiable" :filterTips="filterTips"/>
      </div>
    </div>
  </div>
</template>


<script>
import TipsList from '../common/tipsList.vue';
import pptcontent from "../pptcontent.vue";
import DashboardMeterial from './dashboardMeterial.vue';
import teacherIndexItem from "./Index.vue";
export default {
  components: { pptcontent, teacherIndexItem, DashboardMeterial, TipsList },
  props: {
    currentItemData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    page_model: {
      type: String,
      default: "Insturctor-Paced",
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
    getPageStudent: {
      type: Function,
    },
    getStudentName: {
      type: Function,
    },
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
    meterialVisiable: {
      type: Boolean,
      default: false,
    },
    filterTips: {
      type: Array,
      function() {
        return [];
      },
    },
    overviewModalVisiable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      height: window.winHeight
    };
  },
  created() {},
  mounted() {
    console.log(this.currentItemData);
  },
  methods: {
    showCurrentStudent() {
      console.log("studeng!!!");
    },
  },
};
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #edf0f4;
  flex-direction: column;
}
.dashboardpage {
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-bottom: 60px;
  padding-top: 50px;
  background-color: #fff;
}
.student_flag {
  background-color: rgba(74, 172, 213, 0.9);
  width: 40px;
  height: 40px;
  border-top-right-radius: 5px;
  margin-top: 90px;
  cursor: pointer;
  fill: white;
  /* margin-top:-50px; */
}
svg {
  opacity: 0.35;
}

.student_name {
  display: flex;
  flex-wrap: wrap;
}

.student_count {
  color: black;
  opacity: 0.9;
  font-size: 20px;
  z-index: 999;
}

.left {
  height: 100%;
  width: 283px;
  overflow: scroll;
  padding: 30px;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.left::-webkit-scrollbar {
  display: none;
}
.ppt_content {
  display: flex;
  flex-direction: column;
  width: 223px;
  height: 136px;
  padding: 17px 35px;
  overflow: hidden;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: #FFFFFF;
  border: 1px solid #DCDCDC;
}

.image_parent_focus {
  border: 5px solid #21A28B;
  padding: 13px 31px;
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

.image_parent {
  /* display: flex;
  flex-direction: column; */
  overflow: hidden;
  width: 153px;
  height: 102px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
/* image {
  width: 228px;
  height: 130px;
  display: block;
} */
/* .response_flag {
  width: 230px;
  height: 6px;
  background-color: white;
  border: 1px solid #909090;
} */
.top {
  background-color: #67c23a;
  height: 6px;
}

.control_panel {
  width: 100%;
}
.dash-right{
  flex: 1;
  overflow: hidden;
}
</style>