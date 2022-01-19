<template>
  <div class="dashboard">
    <div class="dashboardpage" :style="`height:${height - 110}px`">
      <dash-top-ppt-list v-show="showPPTList" :changePage="changePage"/>
      <div :class="`dash-second ${showFullAnswer && 'dash-border'} ${((showResponse && shouldShowPageAnswer && !isStudentPacedMode) || isLockPage) && 'red-dash-border'}`" >
        <div :class="`dash-second-left ${!showFullAnswer && 'dash-border'}`">
          <template v-if="showFullAnswer && shouldShowPageAnswer">
            <template
              :class="
                showResponse &&
                currentItemData &&
                currentItemData.items &&
                currentItemData.items[0] &&
                currentItemData.items[0].type != 'website' &&
                !isStudentPacedMode
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
            <pptcontent :url="slides[currentPageIndex].thumbnail_url" :showLogo="true"/>
          </template>
          <dashboard-meterial
            v-if="!showFullAnswer || !shouldShowPageAnswer"
            :pptUrl="currentItemData.thumbnail_url"
            :filterAddedMediaList="filterAddedMediaList"
            :meterialVisiable="meterialVisiable"
          />
        </div>
        <template v-if="shouldShowPageAnswer">
          <div
            v-if="!showFullAnswer"
            class="dash-second-right">
            <dash-res-and-students
              :showResponse="showResponse"
              :responseList="responseContentList"/>
          </div>
          <div :class="`dash-second-right dash-students dash-pad-students ${padTab === 2 && 'dash-pad-hidden' }`"
            v-else-if="studentList.length > 0">
            <DashGroupStudents />
          </div>
        </template>
        <!-- <dashboard-meterial
          v-if="showFullAnswer"
          :pptUrl="currentItemData.thumbnail_url"
          :filterAddedMediaList="filterAddedMediaList"
          :meterialVisiable="meterialVisiable"
        /> -->
        <dash-switch-header
          :showres="showres"
          :showResponse="showResponse"
          :padTab="padTab"
          :changePadTab="changePadTab"
          v-if="shouldShowPageAnswer"/>
      </div>
      <tips-list v-if="overviewModalVisiable" :filterTips="filterTips"/>
      <div :class="`shouqi ${!showPPTList && 'zhankai'} ppt-shouqi`" @click="togglePPTList"></div>
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
    isStudentPacedMode: {
      type: Boolean,
      default: false,
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
    changePage: {
      type: Function,
    },
  },
  data() {
    return {
      height: window.winHeight,
      showPPTList: true,
      padTab: 2
    };
  },
  computed: {
    ...mapState({
      currentPageIndex: state => state.student.currentPageIndex,
      showFullAnswer: state => state.teacher.showDashFullResponse,
      studentList: state => state.teacher.studentList || [],
    }),
    ...mapGetters({
      shouldShowPageAnswer: 'student/shouldShowPageAnswer'
    })
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
    changePadTab(index) {
      this.padTab = index
    }
  },
};
</script>

<style>
@import url(../../assets/css/dashpage.css);
</style>