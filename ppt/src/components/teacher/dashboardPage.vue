<template>
  <div class="dashboard">
    <div class="dashboardpage" :style="`height:${height - 110}px`">
      <dash-top-ppt-list v-show="showPPTList"/>
      <div :class="`dash-second ${showFullAnswer && 'dash-border'} ${((showResponse && shouldShowPageAnswer) || isLockPage) && 'red-dash-border'}`" >
        <div :class="`dash-second-left ${!showFullAnswer && 'dash-border'}`">
          <template v-if="showFullAnswer && shouldShowPageAnswer">
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
          </template>
          <template v-else>
            <pptcontent :url="slides[currentPageIndex].thumbnail_url"/>
          </template>
          <dashboard-meterial
            v-if="!showFullAnswer || !shouldShowPageAnswer"
            :pptUrl="currentItemData.thumbnail_url"
            :filterAddedMediaList="filterAddedMediaList"
            :meterialVisiable="meterialVisiable"
          />
        </div>
        <div v-if="shouldShowPageAnswer"
          v-show="!showFullAnswer || studentList.length > 0"
          :class="`dash-second-right ${showFullAnswer && 'dash-students'}`">
          <dash-res-and-students
            v-if="!showFullAnswer"
            :showResponse="showResponse"
            :responseList="responseContentList"/>
          <DashGroupStudents />
        </div>
        <dashboard-meterial
          v-if="showFullAnswer"
          :pptUrl="currentItemData.thumbnail_url"
          :filterAddedMediaList="filterAddedMediaList"
          :meterialVisiable="meterialVisiable"
        />
        <dash-switch-header :showres="showres" :showResponse="showResponse" v-if="shouldShowPageAnswer"/>
      </div>
      <tips-list v-if="overviewModalVisiable" :filterTips="filterTips"/>
      <div :class="`shouqi ${!showPPTList && 'zhankai'}`" @click="togglePPTList"></div>
    </div>
  </div>
</template>


<script>
import TipsList from '../common/tipsList.vue';
import pptcontent from "../pptcontent.vue";
import DashboardMeterial from './dashboardMeterial.vue';
import DashResAndStudents from './dashResAndStudents.vue';
import teacherIndexItem from "./Index.vue";
import dashTopPptList from "./dash/dashTopPptList.vue";
import DashSwitchHeader from './dash/dashSwitchHeader.vue'
import DashGroupStudents from './dashGroupStudents.vue'
import {mapState, mapGetters,mapActions} from 'vuex'
export default {
  components: { DashSwitchHeader, pptcontent, teacherIndexItem, DashboardMeterial, TipsList, DashResAndStudents, dashTopPptList, DashGroupStudents},
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
    isLockPage: {
      type: Boolean,
      default: false,
    },
    showres: {
      type: Function
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
    responsePercentage: {
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
      height: window.winHeight,
      showPPTList: true,
    };
  },
  computed: {
    ...mapState({
      currentPageIndex: state => state.student.currentPageIndex,
      showFullAnswer: state => state.teacher.showDashFullResponse,
      studentList: state => state.teacher.studentList || [],
    }),
    // 互动题型
    shouldShowPageAnswer() {
      const itemData = this.slides[this.currentPageIndex]
      const type = itemData.items[0] ? itemData.items[0].type : null
      // if(!type) {
      //    console.log(this.currentPageAnswerType, '====')
      //   this.setDashFullPageResponse(false)
      // }
      console.log(type)
      return type && type !== null && type !== 'website'
    }
  },
  created() {},
  mounted() {
    // console.log(this.currentItemData);
  },
  methods: {
    ...mapActions("teacher", [
      "setDashFullPageResponse",
    ]),
    showCurrentStudent() {
      // console.log("studeng!!!");
    },
    togglePPTList() {
      this.showPPTList = !this.showPPTList
    },
  },
};
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(247, 248, 255, 1);
  flex-direction: column;
  padding: 0 10px;
  box-sizing: border-box;
}
.dashboardpage {
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: rgba(247, 248, 255, 1);
  position: relative;
  flex-direction: column;
  padding-bottom: 5px;
}
.student_flag {
  background-color: rgba(74, 172, 213, 0.9);
  width: 40px;
  height: 40px;
  border-top-right-radius: 5px;
  margin-top: 90px;
  cursor: pointer;
  fill: white;
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


.divider {
  height: auto;
  min-height: 100%;
  background-color: #e0e0e0;
  width: 1px;
  position: fixed;
  top: 0px;
  left: 250px;
}
.top {
  background-color: #67c23a;
  height: 6px;
}

.control_panel {
  width: 100%;
}
.dash-second{
  flex: 1;
  overflow: hidden;
  display: flex;
  margin-top: 10px;
  position: relative;
}
.dash-border{
  border: 1px solid #707070;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
}
.red-dash-border{
  border: 2px solid red;
  border-radius: 10px;
}
.dash-second-left{
  background-color: #fff;
  position: relative;
  flex: 1;
  overflow: hidden;
  /* display: flex; */
}
.dash-second-left.dash-border{
  box-shadow: 0px 10px 12px rgba(126, 126, 126, 0.16);
}
.dash-second-right{
  width: 300px;
  height: 100%;
  background-color: #fff;
  margin-left: 10px;
  box-sizing: border-box;
}
.dash-second-right.dash-students{
  /* margin-left: 0;
  width: 300px; */
}
.shouqi{
  width: 30px;
  height: 10px;
  position: absolute;
  top: 105px;
  left: calc(50% - 5px);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url(../../assets/picture/shouqi.png);
  cursor: pointer;
  z-index: 99;
}
.shouqi.zhankai{
  top: 0;
  background-image: url(../../assets/picture/zhankai.png);
}
</style>