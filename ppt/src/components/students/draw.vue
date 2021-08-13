<template>
  <div id="canvasouter">
    <div style="position: relative">
      <canvas id="canvas" :style="`background-image:url(${url})`"></canvas>

      <canvas id="textCanvas"></canvas>
    </div>

    <!-- 颜色，多边形图形，直线，画笔，荧光笔，text box, 橡皮，朝左undo朝右恢复（参考classdojo), 清除键。 -->
    <!-- <colorPanel style="width:100%;height:50px"></colorPanel> -->

    <div class="footer--contenter">
      <div class="canvasfooter">
        <el-popover placement="top" width="200" trigger="hover" class="dropdown-icon">
          <div class="shape_area">
            <svg
              t="1619161258814"
              slot="reference"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6029"
              height="35px"
              width="35px"
              viewBox="0 0 1024 1024"
              :fill="currentShape == 0 ? color : 'rgb(171, 178, 218)'"
              @click="drawRect"
            >
              <rect x="162" y="162" height="700" width="700" />
            </svg>
            <svg
              t="1619161258814"
              slot="reference"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6029"
              height="35px"
              width="35px"
              viewBox="0 0 1024 1024"
              :fill="currentShape == 1 ? color : 'rgb(171, 178, 218)'"
              @click="drawCircle"
            >
              <circle cx="516" cy="516" r="350" />
            </svg>

            <svg
              t="1619161258814"
              slot="reference"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6029"
              height="35px"
              width="35px"
              viewBox="0 0 1024 1024"
              :fill="currentShape == 2 ? color : 'rgb(171, 178, 218)'"
              @click="drawPolygon"
            >
              <polygon
                points="512,162 208.89,337 208.89,687 512,862 815.11,687 815.11,337 512,162"
              />
            </svg>
          </div>

          <div class="eraser" slot="reference">
            <svg
              t="1619161258814"
              slot="reference"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6029"
              width="35px"
              height="35px"
              viewBox="0 0 1024 1024"
              :fill="currentTab == 6 ? color : 'rgb(171, 178, 218)'"
              class="shape_icon"
              @click="drawShape"
              style="margin-top:-10px"
            >
              <circle v-if="currentShape == '1'" cx="516" cy="516" r="350" />
              <rect v-if="currentShape == '0'" x="162" y="162" height="700" width="700" />
              <polygon
                v-if="currentShape == '2'"
                points="512,162 208.89,337 208.89,687 512,862 815.11,687 815.11,337 512,162"
              />
            </svg>
          </div>
        </el-popover>
        <div class="eraser" @click="drawLine">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26.499"
            viewBox="0 0 26 26.499"
          >
            <g id="直线" transform="translate(-665 -885.502)">
              <path
                id="路径_609"
                data-name="路径 609"
                :fill="currentTab == 2 ? color : 'rgb(171, 178, 218)'"
                d="M201.482,174.776H172.721a2.054,2.054,0,0,1,0-4.109h28.761a2.054,2.054,0,1,1,0,4.109Z"
                transform="matrix(0.695, -0.719, 0.719, 0.695, 423.889, 913.358)"
              />
              <rect
                id="矩形_176"
                data-name="矩形 176"
                fill="none"
                width="26"
                height="26"
                transform="translate(665 886)"
              />
            </g>
          </svg>
        </div>
        <div class="eraser" @click="drawPath" slot="reference">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
            <g id="钢笔" transform="translate(10333 6109)">
              <g id="组_1664" data-name="组 1664" transform="translate(-10332.255 -6112.5)">
                <path
                  id="路径_747"
                  data-name="路径 747"
                  :fill="currentTab == 1 ? color : 'rgb(171, 178, 218)'"
                  d="M297.327,469.917a2.616,2.616,0,0,0-5.213-.31l0,0s-.31,1.955-.711,2.267l1.176,1.176s2.141-.516,2.534-.514l-.029-.029a2.615,2.615,0,0,0,2.246-2.587Zm-1.773.135a.818.818,0,0,1-.781.7l0,0c-.121,0-1.019,0-1.019,0,.038-.1.13-.649.173-.9a.129.129,0,0,1,0-.029c0-.016.009-.031.011-.047,0-.031.009-.049.009-.049l0,0a.817.817,0,0,1,1.6.319Z"
                  transform="translate(-283.634 -451.437)"
                />
                <path
                  id="路径_748"
                  data-name="路径 748"
                  :fill="currentTab == 1 ? color : 'rgb(171, 178, 218)'"
                  d="M110.05,676.309l.175-.155,4-3.878-1.176-1.176-3.658,3.878-.294.328C108.7,676,109.173,676.695,110.05,676.309Z"
                  transform="translate(-105.284 -650.663)"
                />
                <path
                  id="路径_749"
                  data-name="路径 749"
                  :fill="currentTab == 1 ? color : 'rgb(171, 178, 218)'"
                  d="M18.393,190.089a.9.9,0,0,0-1.057.662l-.53,2.094c-.518,1.921-1.674,2.7-3.613,3.142L4.968,198.42l-.2.061c-.891.316-1.187-.3-.949-1.005l.1-.355,2.361-8.229a5.376,5.376,0,0,1,4.013-3.768l5.352-1.012-.759-.824a.85.85,0,0,1-.112-.987l-4.872.922A7.109,7.109,0,0,0,4.6,188.2L1.339,199.553c-.314.931.285,1.629,1.257,1.329l11.142-3.294c2.565-.583,4.093-1.616,4.778-4.156l.568-2.24A.9.9,0,0,0,18.393,190.089Z"
                  transform="translate(0 -172.833)"
                />
                <path
                  id="路径_750"
                  data-name="路径 750"
                  :fill="currentTab == 1 ? color : 'rgb(171, 178, 218)'"
                  d="M607.826,8.826l-2.48-2.693a1.975,1.975,0,0,0-2.783-.114l-3.521,3.238a.864.864,0,0,0-.049,1.2l.759.824,2.646,2.873.6.649a.852.852,0,0,0,1.061.153.979.979,0,0,0,.137-.1l3.517-3.241a1.976,1.976,0,0,0,.117-2.785Z"
                  transform="translate(-584.108 0)"
                />
              </g>
              <!-- <rect
                  id="矩形_262"
                  data-name="矩形 262"
                  fill
                  width="26"
                  height="26"
                  transform="translate(-10333 -6109)"
              />-->
            </g>
          </svg>
        </div>
        <div class="eraser" @click="drawMark" slot="reference">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
            <g id="画笔" transform="translate(-724 -883)">
              <g id="组_1163" data-name="组 1163" transform="translate(715.353 875.508)">
                <path
                  id="路径_607"
                  data-name="路径 607"
                  :fill="currentTab == 5 ? color : 'rgb(171, 178, 218)'"
                  d="M340.278,25.122a1.022,1.022,0,0,1,.211,1.369,1.022,1.022,0,0,1-1.369-.211l-3.054-2.949a1.022,1.022,0,0,1-.211-1.369,1.022,1.022,0,0,1,1.369.211ZM350.809,9.746a1.666,1.666,0,0,0-1.9.105c-.948.737-7.793,7.372-10.742,10.426-.316.527-.632.843,1.158,2.633,1.474,1.474,2.212,1.369,2.949.737,1.264-1.264,6.53-8.636,8.531-11.479.316-.421.948-1.79,0-2.422Z"
                  transform="translate(-318.479 0)"
                />
                <path
                  id="路径_608"
                  data-name="路径 608"
                  :fill="currentTab == 5 ? color : 'rgb(171, 178, 218)'"
                  d="M16.217,607.573s-2.949,1.58-3.159,4.213a5.78,5.78,0,0,1-3.37,4.634c-.843.211,11.9.737,10.953-4.739Z"
                  transform="translate(0 -584.241)"
                />
              </g>
              <!-- <rect
                id="矩形_175"
                data-name="矩形 175"
                class="cls-2"
                width="26"
                height="26"
                transform="translate(724 883)"
              />-->
            </g>
          </svg>
        </div>
        <div class="eraser" @click="earse">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
            <g id="橡皮擦" transform="translate(-797 -882)">
              <g id="组_1162" data-name="组 1162" transform="translate(20 -1)">
                <path
                  id="路径_606"
                  data-name="路径 606"
                  :fill="currentTab==3 ? '#ef4e4e' : 'rgb(255, 255, 255)'"
                  d="M-10033.332-6461.843l-4.425,3.772,5.368,5.948h4.643l1.958-1.813Z"
                  transform="translate(10817 7357)"
                />
                <path
                  id="路径_604"
                  data-name="路径 604"
                  :fill="currentTab==3 ? '#36425a' : 'rgb(171, 178, 218)'"
                  d="M95.317,109.056l-7.122-6.72a2.524,2.524,0,0,0-3.556.087L73.3,114.338a2.521,2.521,0,0,0,0,3.529l4.083,4.085a3.78,3.78,0,0,0,2.672,1.109H93.665a1.26,1.26,0,1,0,0-2.521h-6.3l7.98-7.84.077-.077,0,0A2.523,2.523,0,0,0,95.317,109.056ZM84.5,119.771a2.512,2.512,0,0,1-1.766.718H80.063a1.257,1.257,0,0,1-.895-.365l-4.083-4.083,2.936-3.013,6.63,6.643-.151.1Z"
                  transform="translate(705.425 783.354)"
                />
              </g>
            </g>
          </svg>
        </div>

        <el-popover placement="top" width="300" trigger="hover">
          <div v-for="(item, index) in fontFamilies" :key="index">
            <div class="text_area" @click="changeTextFont(index)">
              <p
                class="text-font"
                :style="`color:${
                  currentFont == index ? color : 'rgb(171, 178, 218)'
                }; font-family:${item}`"
              >AaBbCcDd1234</p>
            </div>
          </div>
          <div class="eraser" @click="edit" slot="reference">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="21.417"
              viewBox="0 0 24 21.417"
              style="cursor: pointer;"
            >
              <g id="文本" transform="translate(-838.159 -814)">
                <path
                  id="路径_602"
                  data-name="路径 602"
                  :fill="currentTab==4 ? '#36425a' : 'rgb(171, 178, 218)'"
                  d="M10.594,21.479A1.483,1.483,0,0,1,9.111,20V2.713H3.187a1.235,1.235,0,0,1,0-2.469H18.043a1.276,1.276,0,1,1,0,2.552H12.075V20a1.482,1.482,0,0,1-1.483,1.482Z"
                  transform="translate(836.171 813.756)"
                />
                <path
                  id="路径_605"
                  data-name="路径 605"
                  :fill="currentTab==4 ? '#ef4e4e' : 'rgb(171, 178, 218)'"
                  d="M22.035,17.446H17.1l-1.387,3.4a1.022,1.022,0,0,1-.946.636h-.631a.877.877,0,0,1-.81-1.216L18.152,8.692a1.022,1.022,0,0,1,.944-.629h.714a1.022,1.022,0,0,1,.933.6L25.909,20.2a.907.907,0,0,1-.828,1.277h-.712a1.023,1.023,0,0,1-.947-.636l-1.386-3.4ZM19.483,10.78l-1.975,4.938h3.869L19.483,10.78Z"
                  transform="translate(836.171 813.937)"
                />
              </g>
            </svg>
          </div>
        </el-popover>

        <el-popover placement="top" width="600" trigger="hover">
          <div class="colorList">
            <span
              v-for="item in colors"
              :key="item"
              @click="changeColor(item)"
              :style="`background-color: ${item}`"
              class="colors"
            ></span>
          </div>
          <div class="eraser" slot="reference">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              class="color_flag"
              style="cursor: pointer;"
            >
              <g id="吸管" transform="translate(9316 6241)">
                <path
                  id="路径_603"
                  data-name="路径 603"
                  class="color-1-svg"
                  d="M-9314.008-6219.452s-.334,1.841,1.9,1.562c.893-.781,2.214-2.137,2.558-2.309a4.6,4.6,0,0,0,2.619-.944,72.537,72.537,0,0,0,5.415-6.313s-3.334,1.651-5.415,1.717a7.235,7.235,0,0,0-4.207,1.42C-9311.87-6223.762-9314.008-6219.452-9314.008-6219.452Z"
                />
                <path
                  id="路径_600"
                  data-name="路径 600"
                  class="color-2-svg"
                  d="M22.68,1.411a4.816,4.816,0,0,0-6.812,0L11.951,5.327l-1.62-1.62a.851.851,0,0,0-.615-.257A.875.875,0,0,0,9.1,4.943l2.236,2.233.21.2L3.069,15.866a3.634,3.634,0,0,0-1.035,3.158L.7,20.361a2.156,2.156,0,0,0,0,3.016A2.138,2.138,0,0,0,2.214,24a2.077,2.077,0,0,0,1.5-.626l1.335-1.328a3.526,3.526,0,0,0,.6.053A3.672,3.672,0,0,0,8.23,21.032l8.477-8.486.2.2s.015,0,.015.009l2.221,2.23a.878.878,0,0,0,1.245-1.238l-1.62-1.62L22.68,8.215a4.825,4.825,0,0,0,0-6.8ZM6.985,19.8a1.9,1.9,0,0,1-1.846.486.867.867,0,0,0-.885.1l-.09.074-1.68,1.686a.38.38,0,0,1-.27.111.4.4,0,0,1-.36-.237.392.392,0,0,1,.09-.417l1.62-1.631a.983.983,0,0,0,.15-.173.45.45,0,0,0,.075-.132.914.914,0,0,0,.06-.141,1.1,1.1,0,0,0,.03-.15.953.953,0,0,0-.06-.41,1.862,1.862,0,0,1,.48-1.861l8.477-8.485,2.686,2.692Z"
                  transform="translate(-9315.083 -6241)"
                />
              </g>
            </svg>
          </div>
        </el-popover>

        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="30" viewBox="0 0 1 30">
          <line
            id="分割线"
            y2="30"
            transform="translate(0.5)"
            fill="none"
            stroke="#707070"
            stroke-dasharray="2"
          />
        </svg>

        <div class="do_btn">
          <el-tooltip content="undo" placement="top">
            <div class="eraser" @click="undo">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
                <g id="撤销1" transform="translate(-933 -883)">
                  <path
                    id="路径_592"
                    data-name="路径 592"
                    :fill="draw && draw.canUndo() ? '#36425a' : 'rgb(171, 178, 218)'"
                    d="M107.021,26.251a6.312,6.312,0,0,0,2.965-7.38,5.277,5.277,0,0,0-4.127-3.78,12.979,12.979,0,0,0-2.965-.35c-.35,0-.466.059-.466.466v3.9c-.291-.059-.35-.231-.466-.35-2.209-2.206-4.362-4.359-6.511-6.567-.116-.116-.406-.291-.116-.581,2.325-2.325,4.708-4.652,7.092-7.036V7.593c0,.466.059.64.64.64a14.523,14.523,0,0,1,5.408,1.106,8.093,8.093,0,0,1,5.058,7.617,9.293,9.293,0,0,1-5.874,9.239c-.059,0-.116.059-.231.059-.294.113-.409.172-.409,0Zm0,0"
                    transform="translate(841.789 880.432)"
                  />
                </g>
              </svg>
            </div>
          </el-tooltip>
          <el-tooltip content="redo" placement="top">
            <div class="eraser" @click="redo">
              <svg
                id="撤销2"
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
              >
                <path
                  id="路径_592"
                  data-name="路径 592"
                  :fill="draw && draw.canRedo() ? '#36425a' : 'rgb(171, 178, 218)'"
                  d="M101.74,26.251a6.312,6.312,0,0,1-2.965-7.38,5.277,5.277,0,0,1,4.127-3.78,12.979,12.979,0,0,1,2.965-.35c.35,0,.466.059.466.466v3.9c.291-.059.35-.231.466-.35,2.209-2.206,4.362-4.359,6.511-6.567.116-.116.406-.291.116-.581-2.325-2.325-4.708-4.652-7.092-7.036V7.593c0,.466-.059.64-.64.64a14.523,14.523,0,0,0-5.408,1.106,8.093,8.093,0,0,0-5.058,7.617A9.293,9.293,0,0,0,101.1,26.2c.059,0,.116.059.231.059.294.113.409.172.409,0Zm0,0"
                  transform="translate(-91.55 -2.568)"
                />
                <!-- <rect id="矩形_172" data-name="矩形 172" class="cls-2" width="26" height="26" /> -->
              </svg>
            </div>
          </el-tooltip>
        </div>

        <el-tooltip content="clear" placement="top">
          <div class="eraser" @click="clear">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              class="cls-1-delete"
            >
              <g id="删除" transform="translate(-1090 -880)">
                <g id="组_631" data-name="组 631" transform="translate(1040.632 859.391)">
                  <path
                    id="路径_433"
                    data-name="路径 433"
                    d="M62.54,21.609a4.441,4.441,0,0,0-4.437,4.3H52.5a1.132,1.132,0,0,0,0,2.264h1.249V40.832c0,2.377,1.611,4.32,3.6,4.32H67.5c1.988,0,3.6-1.932,3.6-4.32V28.178h1.132a1.132,1.132,0,0,0,0-2.264H66.969a4.428,4.428,0,0,0-4.429-4.3Zm-2.317,4.3a2.319,2.319,0,0,1,4.629,0ZM57.348,43.036c-.706,0-1.483-.906-1.483-2.2V28.178H68.98V40.843c0,1.294-.777,2.2-1.483,2.2H57.348Zm0,0"
                    transform="translate(0 0)"
                  />
                  <path
                    id="路径_434"
                    data-name="路径 434"
                    d="M325.931,436.017a1.032,1.032,0,0,0,.908-1.122v-6.4a.929.929,0,1,0-1.816,0v6.4A1.027,1.027,0,0,0,325.931,436.017Zm3.287,0a1.032,1.032,0,0,0,.908-1.122v-6.4a.929.929,0,1,0-1.816,0v6.4A1.034,1.034,0,0,0,329.218,436.017Zm3.458,0a1.032,1.032,0,0,0,.908-1.122v-6.4a.929.929,0,1,0-1.816,0v6.4A1.024,1.024,0,0,0,332.676,436.017Zm0,0"
                    transform="translate(-266.932 -395.813)"
                  />
                </g>
              </g>
            </svg>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudentCurrentPageAnswerList } from "@/model/store.student";
import Draw, { DrawTypeData } from "@/utils/draw";
import colorSelector from "@/utils/color";
import drawLineWidthPanel from "./drawLineWidthPanel.vue";
import colorPanel from "./colorPanel.vue";

export default {
  components: { drawLineWidthPanel, colorPanel },
  props: {
    sendCanvas: { type: Function },
    sendDrawText: { type: Function },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    url: {
      type: String,
      default: ""
    },
    slide_id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalVisable: false,
      draw: null,
      color: "#00A4FC",
      widthValue: 3,
      currentTab: 1,
      currentShape: 0,
      currentFont: 0,
      fontFamilies: [
        "Microsoft YaHei",
        "Arial",
        "Kirang Haerang",
        "Dancing Script"
      ],
      colors: [
        "#FF8D87",
        "#676EF9",
        "#FF6B5B",
        "#BB6EA9",
        "#FFCE00",
        "#D67A00",
        "#B4C817",
        "#FF9300",
        "#35B363",
        "#00A4FC",
        "#010001",
        "#FFFFFF"
      ],
      showColor: true
    };
  },
  created() {},
  mounted() {
    let outer = document.getElementById("canvasouter");
    outer.style.width = document.documentElement.clientWidth - 40 + "px";
    outer.style.height = document.documentElement.clientHeight - 40 + "px";
    this.draw = new Draw("canvas", "textCanvas");
    const initData = getStudentCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    this.$nextTick(() => {
      this.draw.init(
        this.onDrawBack,
        this.onDrawTextBack,
        initData && initData[0] ? initData[0].content : "",
        this.data.page_id,
        this.slide_id,
        this.data.elements
      );
    });
    const _this = this;
    window.onbeforeunload = function(event) {
      event = event || window.event;
      event.returnValue = "您输入的内容尚未保存，确定离开此页面吗？";
      _this.draw.commitTextItem();
    };

    // const selector = document.getElementById("diycolor_comment");
    // colorSelector.init(selector);
    // const _this = this;
    // document.onkeydown = function (e) {
    //   let key = window.event.key;
    //   _this.draw.drawTextDirect(window.event);
    // };
  },
  beforeDestroy() {
    // colorSelector.destory();
    // document.getElementById("diycolor_comment").innerHTML = ''
    console.log("beforeDestroy");
  },
  destroyed() {},
  methods: {
    doKeyDown(e) {
      console.log(e);
    },
    changeColor(color) {
      this.color = color;
      this.draw.changeColor(color);
    },
    beforeunloadFn(e) {
      // ...
      console.log("close page!!!");
      this.draw.commitTextItem();
    },
    changeWidth(w, tabIndex) {
      this.widthValue = w;
      this.draw.changeLineWitdh(w);
      if (tabIndex) {
        this.currentTab = tabIndex;
      }
      if (tabIndex == 1) {
        this.draw.changeDrawType(DrawTypeData.draw);
      }
      switch (tabIndex) {
        case 1:
          this.draw.changeDrawType(DrawTypeData.draw);
          break;
        case 2:
          this.draw.changeDrawType(DrawTypeData.line);
          break;
        case 3:
          this.draw.earse();
          break;
        case 4:
          this.draw.changeDrawType(DrawTypeData.text);
          break;
        case 5:
          this.draw.changeDrawType(DrawTypeData.marker);
          break;
      }
    },
    drawMark() {
      this.currentTab = 5;
      this.draw.changeDrawType(DrawTypeData.marker);
      this.showModal();
    },
    drawPath() {
      this.currentTab = 1;
      this.draw.changeDrawType(DrawTypeData.draw);
      this.showModal();
    },
    drawLine() {
      this.currentTab = 2;
      this.draw.changeDrawType(DrawTypeData.line);
      this.showModal();
    },
    edit() {
      this.currentTab = 4;
      this.draw.changeDrawType(DrawTypeData.text);
      this.showModal();
    },
    earse() {
      this.currentTab = 3;
      this.draw.earse();
      this.hideModal();
    },
    undo() {
      this.draw.undo();
      this.hideModal();
    },
    redo() {
      this.draw.redo();
      this.hideModal();
    },
    clear() {
      this.draw.clearCanvas();
      this.hideModal();
    },
    onDrawBack(dataStr, str) {
      this.sendCanvas(dataStr, str);
    },
    onDrawTextBack(stringContent) {
      this.sendDrawText(stringContent);
    },
    showModal() {
      //   this.modalVisable = true;
    },
    hideModal() {
      this.modalVisable = false;
    },
    showDiy() {
      colorSelector.show(this.color, rgb => {
        // console.log(d)
        const selectorColor = colorSelector.utils.rgb2txt(rgb);
        console.log(selectorColor);
        this.changeColor(selectorColor);
      });
    },
    drawShape() {
      if (this.currentShape == 0) {
        this.drawRect();
      } else if (this.currentShape == 1) {
        this.drawCircle();
      } else if (this.currentShape == 2) {
        this.drawPolygon();
      }
    },
    drawCircle() {
      this.currentShape = 1;
      this.currentTab = 6;
      this.draw.changeDrawType(DrawTypeData.circle);
    },

    drawRect() {
      this.currentShape = 0;
      this.currentTab = 6;
      this.draw.changeDrawType(DrawTypeData.rect);
    },
    drawPolygon() {
      this.currentShape = 2;
      this.currentTab = 6;
      this.draw.changeDrawType(DrawTypeData.polygon);
    },
    changeTextFont(index) {
      this.currentFont = index;
      this.draw.setFontFamily(this.fontFamilies[index]);
      this.edit();
    },
    clickColor() {
      this.currentTab = 7;
    }
  }
};
</script>
<style scoped>
@import url("../../assets/css/color.css");

@import url("https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap");

@import url("https://fonts.googleapis.com/css2?family=Kirang+Haerang&display=swap");
</style>
<style scoped>
#diycolor {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: none;
  opacity: 0;
  transition: opacity 150ms linear;
}
#canvasouter {
  cursor: default;
  width: 100%;
  position: relative;
  margin: 20px;
}
#canvas {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: absolute;
  left: 0;
  top: 0;
}

.color_flag {
  fill: rgb(171, 178, 218);
}

.color-1-svg {
  fill: rgb(171, 178, 218);
}
.color-2-svg {
  fill: rgb(171, 178, 218);
}
.color_flag:hover .color-1-svg {
  fill: #ef4e4e;
}
.color_flag:hover .color-2-svg {
  fill: #36425a;
}

.cls-1-delete {
  fill: rgb(171, 178, 218);
}
.cls-1-delete:hover {
  fill: #36425a;
}

.colorList {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.colors {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #999;
  margin: 5px;
  cursor: pointer;
}
.footer--contenter {
  width: 80%;
  height: 100px;
  position: fixed;
  bottom: 50px;
  left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.canvasfooter {
  width: 50%;
  height: 60px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  align-items: center;
  justify-content: space-around;
  border: 1px solid rgb(244, 244, 244);
  border-radius: 6px;
  box-shadow: 0px 6px 5px 1px rgba(126, 126, 126, 1);
}
.canvasfooter > div {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  cursor: pointer;
  line-height: 30px;
}
.red-pencial {
  border: 1px solid #999;
}
.eraser {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#keyword-box {
  margin: 10px 0;
}
.canvasmodal {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  line-height: 20px;
}

.closemodal {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.dropdown-icon {
  width: 40px;
  height: 40px;
  display: flex;
  bottom: 10px;
  line-height: 40px;
  overflow: hidden;
}
.shape_area {
  display: flex;
  justify-content: space-around;
}
.shape_icon {
  cursor: pointer;
}

.do_btn {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.color_btn {
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-font {
  font-size: 20px;
}
.text_area {
  display: flex;
  height: 50px;
  align-items: center;
  cursor: pointer;
}
</style>