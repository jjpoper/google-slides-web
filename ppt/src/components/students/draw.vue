<template>
  <div id="canvasouter">
    <canvas id="canvas" :style="`background-image:url(${url})`"></canvas>

    <!-- 颜色，多边形图形，直线，画笔，荧光笔，text box, 橡皮，朝左undo朝右恢复（参考classdojo), 清除键。 -->

    <div class="footer--contenter">
      <div class="colorList">
        <span
          v-for="item in colors"
          :key="item"
          @click="changeColor(item)"
          :style="`background-color: ${item}`"
          class="colors"
        ></span>
      </div>
      <div class="canvasfooter">
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="dropdown-icon"
        >
          <div class="shape_area">
            <svg
              t="1619161258814"
              slot="reference"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6029"
              height="40px"
              width="40px"
              viewBox="0 0 1024 1024"
              :fill="currentShape == 0 ? color : 'rgb(212 208 208)'"
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
              height="40px"
              width="40px"
              viewBox="0 0 1024 1024"
              :fill="currentShape == 1 ? color : 'rgb(212 208 208)'"
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
              height="40px"
              width="40px"
              viewBox="0 0 1024 1024"
              :fill="currentShape == 2 ? color : 'rgb(212 208 208)'"
              @click="drawPolygon"
            >
              <polygon
                points="512,162 208.89,337 208.89,687 512,862 815.11,687 815.11,337 512,162"
              />
            </svg>
          </div>

          <svg
            t="1619161258814"
            slot="reference"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6029"
            height="40px"
            width="40px"
            viewBox="0 0 1024 1024"
            :fill="currentTab == 6 ? color : 'rgb(212 208 208)'"
            class="shape_icon"
          >
            <circle v-if="currentShape == '1'" cx="516" cy="516" r="350" />
            <rect
              v-if="currentShape == '0'"
              x="162"
              y="162"
              height="700"
              width="700"
            />
            <polygon
              v-if="currentShape == '2'"
              points="512,162 208.89,337 208.89,687 512,862 815.11,687 815.11,337 512,162"
            />
          </svg>
        </el-popover>
        <!-- <el-tooltip content="change color" placement="right">
        <div
          class="red-pencial"
          :style="`background-color: ${color}`"
          @click="showModal"
        ></div>
      </el-tooltip>-->

        <el-popover placement="top" width="300" trigger="hover">
          <draw-line-width-panel
            :color="color"
            :changeWidth="changeWidth"
            :widthValue="widthValue"
            :tabIndex="2"
          />
          <div class="eraser" @click="drawLine" slot="reference">
            <i
              class="el-icon-minus"
              :style="`font-size: 30px; color: ${
                currentTab == 2 ? color : 'rgb(212 208 208)'
              }`"
            ></i>
          </div>
        </el-popover>

        <el-popover placement="top" width="300" trigger="hover">
          <draw-line-width-panel
            :color="color"
            :changeWidth="changeWidth"
            :widthValue="widthValue"
            :tabIndex="1"
          />
          <div class="eraser" @click="drawPath" slot="reference">
            <i
              class="el-icon-edit"
              :style="`font-size: 30px; color: ${
                currentTab == 1 ? color : 'rgb(212 208 208)'
              }`"
            ></i>
          </div>
        </el-popover>

        <el-popover placement="top" width="300" trigger="hover">
          <draw-line-width-panel
            :color="color"
            :changeWidth="changeWidth"
            :widthValue="widthValue"
            :tabIndex="5"
          />
          <div class="eraser" @click="drawMark" slot="reference">
            <svg
              t="1622035315247"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5489"
              width="32"
              height="32"
            >
              <path
                d="M197.973333 546.133333c-3.413333-3.413333-10.24-6.826667-17.066666-3.413333-6.826667 0-10.24 6.826667-10.24 13.653333-6.826667 68.266667-44.373333 150.186667-98.986667 218.453334-6.826667 6.826667-3.413333 17.066667 0 23.893333l37.546667 37.546667-105.813334 105.813333c-3.413333 6.826667-3.413333 13.653333-3.413333 17.066667 0 6.826667 6.826667 10.24 13.653333 13.653333l136.533334 34.133333h3.413333c3.413333 0 10.24-3.413333 13.653333-3.413333l54.613334-54.613333 20.48 20.48c3.413333 3.413333 6.826667 3.413333 13.653333 3.413333 3.413333 0 6.826667 0 10.24-3.413333l51.2-30.72c58.026667-37.546667 116.053333-61.44 170.666667-68.266667 6.826667 0 13.653333-6.826667 13.653333-10.24 3.413333-6.826667 0-13.653333-3.413333-17.066667L197.973333 546.133333zM993.28 116.053333l-68.266667-68.266666c-34.133333-34.133333-92.16-40.96-133.12-10.24L204.8 477.866667c-3.413333 3.413333-6.826667 6.826667-6.826667 13.653333 0 3.413333 0 10.24 3.413334 13.653333l334.506666 334.506667c3.413333 3.413333 6.826667 3.413333 13.653334 3.413333 3.413333 0 10.24-3.413333 13.653333-6.826666L1003.52 249.173333c30.72-40.96 27.306667-95.573333-10.24-133.12z"
                :fill="`${currentTab == 5 ? color : 'rgb(212 208 208)'}`"
                p-id="5490"
              />
            </svg>
          </div>
        </el-popover>

        <el-popover placement="top" width="300" trigger="hover">
          <div v-for="(item, index) in fontFamilies" :key="index">
            <div class="text_area" @click="changeTextFont(index)">
              <p
                class="text-font"
                :style="`color:${
                  currentFont == index ? color : 'rgb(212 208 208)'
                }; font-family:${item}`"
              >
                AaBbCcDd1234
              </p>
            </div>
          </div>
          <div class="eraser" @click="edit" slot="reference">
            <svg
              t="1624354530526"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2670"
              width="32"
              height="32"
              :fill="`${currentTab == 4 ? color : 'rgb(212 208 208)'}`"
            >
              <path
                d="M960 192 960 128c0-35.392-28.608-64-64-64l-64 0c-35.392 0-64 28.608-64 64L256 128c0-35.392-28.608-64-64-64L128 64C92.608 64 64 92.608 64 128l0 64c0 35.392 28.608 64 64 64l0 512c-35.392 0-64 28.608-64 64l0 64c0 35.328 28.608 64 64 64l64 0c35.392 0 64-28.672 64-64l512 0c0 35.328 28.608 64 64 64l64 0c35.392 0 64-28.672 64-64l0-64c0-35.392-28.608-64-64-64L896 256C931.392 256 960 227.392 960 192zM832 768c-35.392 0-64 28.608-64 64L256 832c0-35.392-28.608-64-64-64L192 256c35.392 0 64-28.608 64-64l512 0c0 35.392 28.608 64 64 64L832 768z"
                p-id="2671"
              />
              <path
                d="M736 320l-448 0C270.336 320 256 334.336 256 352l0 64C256 433.664 270.336 448 288 448S320 433.664 320 416L320 384l128 0 0 256L416 640C398.336 640 384 654.336 384 672S398.336 704 416 704l192 0c17.664 0 32-14.336 32-32S625.664 640 608 640L576 640 576 384l128 0 0 32C704 433.664 718.336 448 736 448S768 433.664 768 416l0-64C768 334.336 753.664 320 736 320z"
                p-id="2672"
              />
            </svg>
          </div>
        </el-popover>

        <el-popover placement="top" width="300" trigger="hover">
          <draw-line-width-panel
            color="rgb(255,16,16)"
            :changeWidth="changeWidth"
            :widthValue="widthValue"
            :tabIndex="3"
          />
          <div class="eraser" @click="earse" slot="reference">
            <svg
              t="1621859340302"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="989"
              width="32"
              height="32"
            >
              <path
                d="M604.536246 736.222443l288.794439-282.693148-287.777557-270.999007-270.999007 283.201589z m-72.70705 71.181728L264.389275 539.455809 145.922542 660.973188l164.734856 164.734856a50.844091 50.844091 0 0 0 36.099305 14.744786h107.789474a101.688183 101.688183 0 0 0 71.181728-28.981132z m109.314796 35.082423h254.220457a50.844091 50.844091 0 0 1 0 101.688183H346.248262a152.532274 152.532274 0 0 1-107.789474-44.742801l-164.734856-164.734856a101.688183 101.688183 0 0 1 0-142.363456l457.596823-480.476663a101.688183 101.688183 0 0 1 143.380337-3.559086l287.269117 270.999007a101.688183 101.688183 0 0 1 4.067527 143.888778l-3.050646 3.050646z"
                :fill="`${
                  currentTab == 3 ? 'rgb(255,16,16)' : 'rgb(212 208 208)'
                }`"
                p-id="990"
              />
            </svg>
          </div>
        </el-popover>

        <div class="do_btn">
          <el-tooltip content="undo" placement="top">
            <div class="eraser" @click="undo">
              <svg
                t="1624354938536"
                :fill="draw && draw.canUndo() ? '#000' : 'rgb(212 208 208)'"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3471"
                width="35"
                height="25"
              >
                <path
                  d="M379.776 635.904c39.36 35.968 48.32 41.344 50.496-25.856 3.968-49.152 0-103.552 0-103.552 1.408-3.072 86.464-35.008 227.072 25.856 140.544 60.928 235.456 251.008 252.16 310.528 1.344 34.368 46.144 100.736 50.432-1.344 0.576-166.656-64.512-341.12-230.336-441.152C574.976 307.072 446.4 316.608 432.192 321.472c-0.256 1.344-0.64 1.856-1.344 1.024-0.192-0.256 0.384-0.64 1.344-1.024 1.216-6.208-2.496-38.272-2.88-98.56 2.368-54.144-12.096-55.808-49.536-26.944C311.168 252.288 128 427.264 128 427.264S311.168 580.608 379.776 635.904z"
                  p-id="3472"
                />
              </svg>
            </div>
          </el-tooltip>
          <el-tooltip content="redo" placement="top">
            <div class="eraser" @click="redo">
              <svg
                t="1624355467722"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4270"
                width="25"
                height="25"
                :fill="draw && draw.canRedo() ? '#000' : 'rgb(212 208 208)'"
              >
                <path
                  d="M708.16 635.904c-39.36 35.968-48.32 41.344-50.496-25.856-3.968-49.152 0-103.552 0-103.552-1.408-3.072-86.464-35.008-227.072 25.856C290.048 593.28 195.2 783.36 178.432 842.88 177.088 877.248 132.288 943.616 128 841.472c-0.576-166.656 64.512-341.12 230.336-441.152 154.624-93.248 283.264-83.776 297.408-78.848 0.256 1.344 0.64 1.856 1.344 1.024 0.192-0.256-0.384-0.64-1.344-1.024-1.216-6.208 2.496-38.272 2.88-98.56-2.368-54.144 12.096-55.808 49.536-26.944 68.544 56.32 251.776 231.36 251.776 231.36S776.768 580.608 708.16 635.904z"
                  p-id="4271"
                />
              </svg>
            </div>
          </el-tooltip>
        </div>

        <el-tooltip content="clear" placement="top">
          <div class="eraser" @click="clear">
            <i class="el-icon-delete" style="font-size: 30px"></i>
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

export default {
  components: { drawLineWidthPanel },
  props: {
    sendCanvas: { type: Function },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modalVisable: false,
      draw: null,
      color: "#02a3ee",
      colors: [
        "#000",
        "#ec808d",
        "#facd91",
        "#ffff80",
        "#caf982",
        "#80ffff",
        "#81d3f8",
        "#8080ff",
        "#c280ff",
        "#02a3ee",
      ],
      widthValue: 3,
      currentTab: 1,
      currentShape: 0,
      currentFont: 0,
      fontFamilies: [
        "Microsoft YaHei",
        "Arial",
        "Kirang Haerang",
        "Dancing Script",
      ],
    };
  },
  created() {},
  mounted() {
    let outer = document.getElementById("canvasouter");
    outer.style.width = document.documentElement.clientWidth - 40 + "px";
    outer.style.height = document.documentElement.clientHeight - 40 + "px";
    this.draw = new Draw("canvas");
    const initData = getStudentCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    this.$nextTick(() => {
      this.draw.init(
        this.onDrawBack,
        initData && initData[0] ? initData[0].content : ""
      );
    });

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
  },
  methods: {
    doKeyDown(e) {
      console.log(e);
    },
    changeColor(color) {
      this.color = color;
      this.draw.changeColor(color);
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
    onDrawBack(dataStr) {
      this.sendCanvas(dataStr);
    },
    showModal() {
      //   this.modalVisable = true;
    },
    hideModal() {
      this.modalVisable = false;
    },
    showDiy() {
      colorSelector.show(this.color, (rgb) => {
        // console.log(d)
        const selectorColor = colorSelector.utils.rgb2txt(rgb);
        console.log(selectorColor);
        this.changeColor(selectorColor);
      });
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
  },
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
}

.colorList{
  width: 60%;
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
  border: 1px solid #9f9f9f;
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