<!--用户底部的控制面板-->

<template>
  <div :class="`panel ${isDashboard ? 'dash-control' : ''}`">
    <template v-if="!isDashboard">
      <button class="control-bar__button">
        <div class="control-bar__icon left" @click="lastPage()"></div>
      </button>
      <div>{{ currentPage }}/{{ totalPage }}</div>
      <button class="control-bar__button">
        <div class="control-bar__icon right" @click="nextPage()"></div>
      </button>
    </template>

    <template v-if="isDashboard">
      <div
        :class="
          dashTipsModalVisiable ? 'button_area back_focus' : 'button_area'
        "
        style="margin-right: 20px"
      >
        <div class="meterialimage" @click="showDashTips">
          <div class="fullbgimg dash-tip"></div>
        </div>
      </div>
      <!-- <div
        :class="isResponseShow ? 'button_area back_focus' : 'button_area'"
        style="margin-right: 20px"
      >
        <div class="meterialimage">
          <div class="fullbgimg more-pop"></div>
        </div>
      </div> -->
    </template>
    <UploadEnter v-if="meterialVisiable"/>

    <!-- 提交pro 暂时隐藏-->

    <!-- <div class="button_area" @click="addprompt()">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 63.99 60.08"
      >
        <title>icon-extension-question</title>
        <path d="M195.45,6.24" transform="translate(0 -2.08)"></path>
        <path
          d="M60.08,2.08H3.92A4,4,0,0,0,0,6V46.21a4,4,0,0,0,3.92,3.92H40.62L52.37,61.87a.92.92,0,0,0,.7.29.61.61,0,0,0,.39-.1,1,1,0,0,0,.61-.9V50.22h6A4,4,0,0,0,64,46.31V6.1A4,4,0,0,0,60.08,2.08Zm-16.44,27H34.83v8.81a2.94,2.94,0,0,1-5.87,0V29.1H20.14a2.94,2.94,0,1,1,0-5.87H29V14.42a2.94,2.94,0,1,1,5.87,0v8.81h8.81a2.94,2.94,0,1,1,0,5.87Z"
          transform="translate(0 -2.08)"
        ></path>
      </svg>
      <strong class="button_text">Add prompt</strong>
    </div> -->

    <div :class="isClosed ? 'info_area' : 'info_area'">
      <div class="with-outer" v-if="!isDashboard">
        <i :class="`icon-circle ${current_response === 0 && 'red-icon'}`"></i>
        <strong
          >{{
            current_response == 0 ? "No" : current_response
          }}
          Response</strong
        >
      </div>

      <div
        class="button_area"
        v-if="!isClosed && current_model === 'Student-Paced'"
        @click="closeStudentPaced()"
      >
        <svg
          t="1620464177484"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2600"
          width="30"
          height="30"
        >
          <path
            d="M561.17013333 509.06026667L858.02666667 213.73973333c14.03733333-13.968 14.1088-36.60053333 0.1408-50.63786666-13.99893333-14.06826667-36.592-14.10773333-50.62933334-0.1408L510.6048 458.31466667 216.256 163.06986667c-13.9328-13.96693333-36.59733333-14.03733333-50.63466667-0.07146667-14.00426667 13.96586667-14.03733333 36.63146667-0.0704 50.6688l294.27733334 295.1744-296.71466667 295.14026667c-14.0384 13.968-14.1088 36.59733333-0.14293333 50.63786666a35.7216 35.7216 0 0 0 25.3856 10.56c9.13066667 0 18.26666667-3.4688 25.25013333-10.4192l296.78613333-295.2128L807.4304 857.48266667c6.9824 7.02186667 16.15253333 10.53013333 25.35253333 10.53013333a35.72906667 35.72906667 0 0 0 25.28213334-10.45973333c13.99893333-13.96586667 14.03733333-36.592 0.07146666-50.62933334L561.17013333 509.06026667z m0 0"
            p-id="2601"
            fill="#36425A"
          />
        </svg>

        <strong class="button_text">Stop Student-Paced</strong>
      </div>

      <div class="with-outer" v-else>
        <i :class="`icon-circle ${!isClosed && 'green-icon'}`"></i>
        <strong>{{ isClosed ? "Closed" : current_model === 'Insturctor-Paced' ? 'Teacher-Paced' :  current_model}}</strong>
      </div>
    </div>


    <!--lock-->
    <div
      :class="
        isLoked()
          ? 'button_area back_focus'
          : isLokeEnable()
          ? 'button_area'
          : 'button_area buttondisable'
      "
      v-if="
        shouldShowPageAnswer &&
        !isClosed &&
        current_model != 'Student-Paced'
      "
      @click="dolockPage()"
    >
      <svg v-if="isLoked()" t="1639140165265" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2590" width="64" height="64"><path d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z" p-id="2591" fill="#36425A"></path></svg>
      <svg v-else t="1639140104627" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2341" width="64" height="64"><path d="M768.25422 0q48.810328 0 94.061569 18.303873t80.333664 50.33565 56.436941 74.740814 21.354518 91.519364l0 150.49851-123.042701 0 0-122.025819q0-64.063555-36.099305-99.654419t-97.112214-35.590864q-54.911619 0-88.468719 35.590864t-33.5571 99.654419l0 124.059583-128.12711 0 0-152.532274q0-48.810328 19.320755-91.519364t53.386296-74.740814 80.333664-50.33565 101.179742-18.303873zM766.220457 693.513406l0 87.451837 0 47.793446q0 27.455809-9.660377 51.860973t-26.438928 41.692155-39.658391 27.455809-50.33565 10.168818l-514.542205 0q-27.455809 0-49.82721-9.660377t-38.641509-26.438928-24.913605-39.14995-8.643496-47.793446l0-323.368421q0-28.472691 19.829196-47.793446t46.268123-19.320755l629.449851 0q28.472691 0 47.793446 19.320755t19.320755 47.793446l0 179.988083z" p-id="2342" fill="#36425A"></path></svg>
      <strong class="button_text"
        >{{ isLoked() ? "Unlock " : "Lock " }} Screens</strong
      >
    </div>

    <div
      :class="`${isResponseShow ? 'button_area back_focus' : 'button_area'} ${showFullAnswer ? '' : 'buttondisable'}`"
      style="margin-right: 20px"
      @click="showRes()"
      v-if="!isClosed && isDashboard && shouldShowPageAnswer && current_model != 'Student-Paced'"
    >
      <div class="meterialimage">
        <div class="fullbgimg res-show"></div>
      </div>
      <strong class="button_text"
        >{{ isResponseShow ? "Hide " : "Show " }} Response(s)</strong
      >
    </div>
    <!--material-->
    <div
      v-if="current_model !== 'Student-Paced'"
      :class="`${meterialVisiable ? 'button_area back_focus' : 'button_area'} ${showFullAnswer ? 'buttondisable' : ''}`"
      style="margin-right: 20px"
      @click="changeMeterial"
    >
      <div class="meterialimage">
        <div
          :class="`fullbgimg ${meterialVisiable ? 'me-show' : 'me-hide'}`"
        ></div>
        <i v-if="filterAddedMediaList.length > 0" class="metarialnums">{{filterAddedMediaList.length}}</i>
      </div>
      <strong class="button_text">{{
        meterialVisiable ? "Material Hiding" : "Display Material(s)"
      }}</strong>
    </div>

    <!-- <el-popover
      placement="top"
      width="400"
      trigger="hover"
      class="dropdown-icon"
    >
      <dashboardMenu
        v-if="classRoomInfo"
        :current_model="current_model"
        :turnModel="turnModel"
        :isDashboard="isDashboard"
        :slide_id="slide_id"
        :endLesson="endLesson"
        :isClosed="isClosed"
        :classRoomInfo="classRoomInfo"
        v-bind="$attrs"
      />
      <svg
        t="1619161258814"
        slot="reference"
        viewBox="0 0 20 30"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6029"
        height="40px"
      >
        <circle cx="10" cy="8" r="2" fill="#36425A" />
        <circle cx="10" cy="16" r="2" fill="#36425A" />
        <circle cx="10" cy="24" r="2" fill="#36425A" />
      </svg>
    </el-popover> -->
    <!--end-->
    <!-- <div class="end_button" @click="endLesson()" v-if="!isDashboard">
      <strong>{{ isClosed ? "EXIT" : "END" }}</strong>
    </div> -->
  </div>
</template>


<script>
import { ClassRoomModelEnum, ModalEventsNameEnum } from "@/socket/socketEvents";
import dashboardMenu from "./teacherDashboardMenu";
import UploadEnter from "@/components/uploadFile/uploadEnter.vue";
import {mapState, mapGetters, mapActions} from 'vuex'
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    slide_id: {
      type: String,
      default: "",
    },
    // reopenClass: {
    //   type: Function,
    // },
    classRoomInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    totalPage: {
      type: Number,
      default: 3,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    current_model: {
      type: String,
      default: "Insturctor-Paced",
    },

    current_response: {
      type: Number,
      default: 0,
    },

    // open: {
    //   type: Function,
    // },
    turnModel: {
      type: Function,
    },
    isDashboard: {
      type: Boolean,
      default: false,
    },
    dashTipsModalVisiable: {
      type: Boolean,
      default: false,
    },
    changePage: {
      type: Function,
    },
    showDashTips: {
      type: Function,
    },
    turnOff: {
      type: Function,
    },
    // open: {
    //   type: Function,
    // },
    isResponseShow: {
      type: Boolean,
      default: false,
    },
    // openProject: {
    //   type: Function,
    // },
    endLesson: {
      type: Function,
    },
    lockPage: {
      type: Function,
    },
    slides: {
      type: Array,
      default: [],
    },
    currentItemData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showresAction: {
      type: Function,
    },
    addprompt: {
      type: Function,
    },
    changeShowMetrial: {
      type: Function,
    },
    meterialVisiable: {
      type: Boolean,
      default: false,
    },
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  computed: {
    ...mapState({
      showFullAnswer: state => state.teacher.showDashFullResponse,
    }),
    ...mapGetters({
      shouldShowPageAnswer: 'student/shouldShowPageAnswer'
    })
  },
  components: {
    dashboardMenu,
    UploadEnter,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    ...mapActions("teacher", [
      "setDashFullPageResponse",
    ]),
    changeMeterial() {
      if(!this.showFullAnswer) {
        this.changeShowMetrial(!this.meterialVisiable);
      }
    },
    lastPage() {
      // console.log(this.currentPage);
      if (this.currentPage > 1) {
        let page = this.currentPage - 1;
        this.changePage(page);
      }
    },
    isLokeEnable() {
      //锁定操作是否可行。
      if (!this.slides || !this.slides[this.currentPage - 1]) {
        return true;
      }
      let items = this.slides[this.currentPage - 1].items;
      // lock screen 和 choice是否有正确答案 无关
      // if (items && items[0]) {
      //   if (items[0].type == "choice") {
      //     let opts = items[0].data.options;
      //     for (let i = 0; i < opts.length; i++) {
      //       if (opts[i].isAnswer) {
      //         return false;
      //       }
      //     }
      //   } else if (items[0].type == "text") {
      //     if (items[0].data.answer && items[0].data.answer.length > 0) {
      //       return false;
      //     }
      //   }
      // }

      return true;
    },
    isLoked() {
      if (
        !this.classRoomInfo.lock_page ||
        !this.slides ||
        !this.slides[this.currentPage - 1]
      ) {
        return false;
      } else {
        if (!this.isLokeEnable()) {
          return false;
        }
        for (let i = 0; i < this.classRoomInfo.lock_page.length; i++) {
          if (
            this.classRoomInfo.lock_page[i] ===
            this.slides[this.currentPage - 1].page_id
          ) {
            return true;
          }
        }
      }
      return false;
    },
    nextPage() {
      if (this.currentPage < this.totalPage) {
        let page = this.currentPage + 1;
        // console.log(page)
        this.changePage(page);
      }
    },
    closeStudentPaced() {
      // console.log("colse student");
      // this.current_model = ClassRoomModelEnum.TEACHER_MODEL;
      this.turnOff();
    },
    showRes() {
      if(this.showFullAnswer) {
        this.showresAction()
      }
    },
    dolockPage() {
      if (this.isLokeEnable()) {
        this.lockPage();
      }
    },
  },
};
</script>

<style scoped>
strong {
  color: #36425a;
  font-size: 14px;
}
.panel {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #d9dfe4;
  box-sizing: border-box;
  padding-left: 21px;
}
.dash-control {
  padding-right: 50px;
}
.svg_right {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.control-bar__button,
.control-bar__button--large,
.control-bar__button--lock {
  display: block;
  position: relative;
  height: auto;
  padding: 0.5em;
  background-color: transparent;
  border: 0px solid transparent;
  opacity: 1;
  text-align: center;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
  cursor: pointer;
}
.control-bar__icon {
  width: 13.34px;
  height: 24px;
  background-size: contain;
  background-position: 0 0;
  background-repeat: no-repeat;
}
.control-bar__icon.left {
  background-image: url(../../assets/picture/arrow-r.png);
}
.control-bar__icon.right {
  background-image: url(../../assets/picture/arrow-l.png);
}
.dash-tip {
  background-image: url(../../assets/picture/dash-tip.png);
}
.more-pop {
  background-image: url(../../assets/picture/more-pop.png);
}

.control-bar__icon:hover {
  fill: #c0c0c0;
}

.control-bar__button--large {
  min-width: 4.375em;
  min-height: 50px;
}

.control-bar__label {
  position: relative;
  display: none;
  font-size: 13px;
  color: #36425a;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.icon {
  fill: #36425a;
  cursor: pointer;
}
.icon:hover {
  fill: antiquewhite;
}
.icon_left {
  margin-left: 20px;
}
.pageIndex {
  color: #36425a;
  font-size: 20px;
  height: 50px;
  display: flex;
  align-items: center;
}

.dropdown-icon {
  width: 20px;
  height: 40px;
  display: flex;
  bottom: 10px;
  line-height: 40px;
  overflow: hidden;
  margin-right: 10px;
  margin-left: 20px;
}
.end_button {
  width: 40px;
  height: 40px;
  display: flex;
  bottom: 10px;
  line-height: 40px;
  overflow: hidden;
  margin-right: 20px;
  color: #36425a;
  cursor: pointer;
  font-size: 14px;
}

.info_area {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}
.hide_area {
  visibility: hidden;
}
.button_area {
  height: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #36425a;
  overflow: hidden;
  cursor: pointer;
  padding: 3px 15px;
}

.button_grey {
  background-color: #cfcfcf;
}
.back_focus {
  background-color: red;
  border-radius: 8px;
}
.button_text {
  line-height: 20px;
  font-size: 14px;
}
.readchat {
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.comment {
  background: #fff;
  height: 40px;
  padding: 0 5px;
  margin-top: 5px;
  border-radius: 4px;
}
.meterialimage {
  width: 30px;
  height: 30px;
  position: relative;
}
.me-show {
  background-image: url(../../assets/picture/m-show.png);
}
.me-hide {
  background-image: url(../../assets/picture/m-hide.png);
}
.res-show {
  background-image: url(../../assets/picture/hide-res.png);
}
.icon-circle {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  display: inline-block;
  margin-right: 3px;
  background-color: #36425a;
}
.icon-circle.red-icon {
  background-color: #ff1a0e;
}
.icon-circle.green-icon {
  background-color: rgba(21, 195, 154, 1);
}
.with-outer {
  padding: 3px 13px;
  border-radius: 16px;
  background-color: rgba(54, 66, 90, 0.1);
  margin-right: 20px;
}
.buttondisable{
  opacity: 0.4;
}
</style>
