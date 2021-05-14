<template>
  <div id="canvasouter">
    <canvas id="canvas" :style="`background-image:url(${url})`"></canvas>
    <div class="canvasmodal" v-show="modalVisable">
      <i class="el-icon-circle-close closemodal" style="font-size: 30px" @click="hideModal"></i>
      <div class="widthlist">
        <div class="item">
          <span class="icon" :style="`width: 30px;height: 30px; background-color: ${widthValue === 30 ? 'red': color}`" @click="changeWidth(30)"></span>
          <span class="icontext">30</span>
        </div>
        <div class="item">
          <span class="icon" :style="`width: 25px;height: 25px; background-color: ${widthValue === 20 ? 'red' : color}`" @click="changeWidth(20)"></span>
          <span class="icontext">20</span>
        </div>
        <div class="item">
          <span class="icon" :style="`width: 20px;height: 20px; background-color: ${widthValue === 10 ? 'red' : color}`" @click="changeWidth(10)"></span>
          <span class="icontext">10</span>
        </div>
        <div class="item">
          <span class="icon" :style="`width: 15px;height: 15px; background-color: ${widthValue === 5 ? 'red' : color}`" @click="changeWidth(5)"></span>
          <span class="icontext">5</span>
        </div>
        <div class="item">
          <span class="icon" :style="`width: 10px;height: 10px; background-color: ${widthValue === 3 ? 'red' : color}`" @click="changeWidth(3)"></span>
          <span class="icontext">3</span>
        </div>
      </div>
      <div class="colorList">
        <span v-for="item in colors" :key="item" @click="changeColor(item)" :style="`background-color: ${item}`" class="colors"></span>
      </div>
    </div>
    <div class="canvasfooter">
      <div class="red-pencial" :style="`background-color: ${color}`"  @click="showModal"></div>
      <div class="eraser" @click="drawPath">
        <i class="el-icon-edit" :style="`font-size: 30px; color: ${currentTab == 1 ? 'red' : '#333'}`"></i>
      </div>
      <div class="eraser" @click="drawLine">
        <i class="el-icon-minus" :style="`font-size: 30px; color: ${currentTab == 2 ? 'red' : '#333'}`"></i>
      </div>
      <div class="eraser" @click="edit">
        <i class="el-icon-edit-outline" :style="`font-size: 30px; color: ${currentTab == 4 ? 'red' : '#333'}`"></i>
      </div>
      <div class="eraser" @click="earse">
        <i class="el-icon-circle-close" :style="`font-size: 30px; color: ${currentTab == 3 ? 'red' : '#333'}`"></i>
      </div>
      <div class="eraser" @click="undo">
        <i class="el-icon-refresh-left" style="font-size: 30px"></i>
      </div>
      <div class="eraser" @click="clear">
        <i class="el-icon-delete" style="font-size: 30px"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getStudentCurrentPageAnswerList } from "@/model/store.student";
import Draw, {DrawTypeData} from '@/utils/draw'
export default {
  props: {
    sendCanvas: { type: Function },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalVisable: false,
      draw: null,
      color: '#000',
      colors: ['#000', '#ec808d', '#facd91', '#ffff80', '#caf982', '#80ffff', '#81d3f8', '#8080ff', '#c280ff'],
      widthValue: 3,
      currentTab: 1
    };
  },
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
      this.draw.init(this.onDrawBack, initData ? initData[0].content : '');
    });
  },
  methods: {
    changeColor(color) {
      this.color = color
      this.draw.changeColor(color);
    },
    changeWidth(w) {
      this.widthValue = w
      this.draw.changeLineWitdh(w);
    },
    drawPath() {
      this.currentTab = 1
      this.draw.changeDrawType(DrawTypeData.draw);
    },
    drawLine() {
      this.currentTab = 2
      this.draw.changeDrawType(DrawTypeData.line);
    },
    edit() {
      this.currentTab = 4
      this.draw.changeDrawType(DrawTypeData.text);
    },
    earse() {
      this.currentTab = 3
      this.draw.earse();
    },
    undo() {
      this.draw.undo();
    },
    clear() {
      this.draw.clearCanvas();
    },
    onDrawBack(dataStr) {
      this.sendCanvas(dataStr)
    },
    showModal() {
      this.modalVisable = true
    },
    hideModal() {
      this.modalVisable = false
    }
  }
};
</script>

<style>
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
.canvasfooter {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 50px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border:1px solid rgba(0, 0, 0, 0.5);
  background-color: #fff;
}
.canvasfooter > div {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin: 0 30px;
  cursor: pointer;
  line-height: 30px;
}
.red-pencial {
  border: 1px solid #999;
}
.eraser {
}
#keyword-box {
  margin: 10px 0;
}
.canvasmodal{
  width: 100%;
  height: 200px;
  position: fixed;
  bottom: 100px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border:1px solid rgba(0, 0, 0, 0.5);
  background-color: #fff;
  line-height: 20px;
}
.widthlist{
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}
.widthlist .item{
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: auto;
  position: relative;
}
.widthlist .icon{
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid #999;
}
.icontext{
  position: absolute;
  right: -20px;
}
.colorList{
  width: 150px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 100px;
}
.colorList .colors{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #999;
  margin: 5px;
  cursor: pointer;
}
.closemodal{
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>