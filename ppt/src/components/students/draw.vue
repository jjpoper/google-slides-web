<template>
  <div id="canvasouter">
    <canvas id="canvas" :style="`background-image:url(${url})`"></canvas>
    <div class="canvasfooter">
      <div class="red-pencial" @click="changeColor('red')"></div>
      <div class="blue-pencial" @click="changeColor('blue')"></div>
      <div class="eraser" @click="earse">
        <i class="el-icon-circle-close" style="font-size: 30px"></i>
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
      draw: null
    };
  },
  mounted() {
    let outer = document.getElementById("canvasouter");
    outer.style.width = document.documentElement.clientWidth - 40 + "px";
    outer.style.height = document.documentElement.clientHeight - 40 + "px";
    let outerWitdh = outer.clientWidth;
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
      this.draw.changeColor(color);
    },
    earse() {
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
  background-color: red;
}
.blue-pencial {
  background-color: blue;
}
.eraser {
}
#keyword-box {
  margin: 10px 0;
}
</style>