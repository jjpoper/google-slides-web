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
    <UploadEnter v-if="meterialVisiable" />

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

      <div class="with-outer">
        <i :class="`icon-circle ${!isClosed && 'green-icon'}`"></i>
        <strong>{{ isClosed ? "Closed" : current_model }}</strong>
      </div>
    </div>
    <div
      :class="isResponseShow ? 'button_area back_focus' : 'button_area'"
      style="margin-right: 20px"
      @click="showRes()"
      v-if="
        currentItemData &&
        currentItemData.items &&
        currentItemData.items[0] &&
        currentItemData.items[0].type != 'website' &&
        !isClosed &&
        !isDashboard
      "
    >
      <div class="meterialimage">
        <div class="fullbgimg res-show"></div>
      </div>
      <strong class="button_text"
        >{{ isResponseShow ? "Hide " : "Show " }} Response</strong
      >
    </div>
    <!--material-->
    <div
      :class="meterialSwitchVisiable ? 'button_area back_focus' : 'button_area'"
      style="margin-right: 20px"
      @click="changeMeterial"
    >
      <div class="meterialimage">
        <div
          :class="`fullbgimg ${meterialSwitchVisiable ? 'me-show' : 'me-hide'}`"
        ></div>
      </div>
      <strong class="button_text">{{
        meterialSwitchVisiable ? "Material hiding" : "Display material"
      }}</strong>
    </div>
    <!--lock-->
    <div
      :class="
        isLoked()
          ? 'button_area back_focus'
          : isLokeEnable()
          ? 'button_area'
          : 'button_area button_grey'
      "
      v-if="!isClosed && current_model != 'Student-Paced'"
      @click="dolockPage()"
    >
      <svg
        t="1620829350317"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1431"
        width="25"
        height="25"
      >
        <path
          d="M216.1664 438.852267V292.5568C216.1664 131.003733 348.603733 0 512 0c163.362133 0 295.8336 131.003733 295.8336 292.5568v146.295467h1.604267A146.295467 146.295467 0 0 1 955.733333 585.147733v292.5568A146.295467 146.295467 0 0 1 809.437867 1024H214.562133A146.295467 146.295467 0 0 1 68.266667 877.704533v-292.5568a146.295467 146.295467 0 0 1 146.295466-146.295466h1.604267z m73.966933 0h443.733334V292.5568c0-121.173333-99.328-219.409067-221.866667-219.409067S290.133333 171.349333 290.133333 292.522667v146.295466z m221.047467 219.4432a73.147733 73.147733 0 1 0 0 146.261333h1.6384a73.147733 73.147733 0 0 0 0-146.261333h-1.6384z"
          p-id="1432"
          fill="#36425A"
        />
      </svg>
      <strong class="button_text"
        >{{ isLoked() ? "UnLock " : "Lock " }} Screens</strong
      >
    </div>
    <!--student paced-->
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

    <el-popover
      placement="top"
      width="400"
      trigger="hover"
      class="dropdown-icon"
      style="display: none"
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
    </el-popover>
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
    showResponse: {
      type: Function,
    },
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
  },
  watch: {
    meterialSwitchVisiable() {
      // EventBus.$emit(ModalEventsNameEnum.MEDIA_MODAL_VISIBLE, this.meterialVisiable)
      this.changeShowMetrial(this.meterialSwitchVisiable);
    },
  },
  created() {
    this.meterialSwitchVisiable = this.meterialVisiable;
  },
  components: {
    dashboardMenu,
    UploadEnter,
  },
  data() {
    return {
      dialogVisible: false,
      meterialSwitchVisiable: false,
    };
  },
  methods: {
    changeMeterial() {
      this.meterialSwitchVisiable = !this.meterialSwitchVisiable;
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
      if (items && items[0]) {
        if (items[0].type == "choice") {
          let opts = items[0].data.options;
          for (let i = 0; i < opts.length; i++) {
            if (opts[i].isAnswer) {
              return false;
            }
          }
        } else if (items[0].type == "text") {
          if (items[0].data.answer && items[0].data.answer.length > 0) {
            return false;
          }
        }
      }

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
      this.showResponse();
      //    this.isResponseShow = !this.isResponseShow;
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
  background-color: #fff;
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
</style>
