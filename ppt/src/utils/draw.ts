/* 白板实例 */
import { showToast } from "@/utils/loading";

export enum DrawTypeData {
  line = 'line',
  draw = 'draw',
  text = 'text'
}

type DrawType = 'line' | 'draw' | 'text'
type onDrawBack = (data: any) => void

export default class Draw {
  private el: any
  private strokeColor = "#000";
  private lineWidth = 2
  private canvas: any
  private cxt: any
  private canvasPool: string[] = []
  private stage_info = {
    left: 20,
    top: 20
  }

  private pointer = {
    beginX: 0,
    beginY: 0,
    endX: 0,
    endY: 0
  }

  private canvasWidth = document.documentElement.clientWidth - 40;
  private canvasHeight = document.documentElement.clientHeight - 40;

  private drawType: DrawType = 'line'
  private onDrawBack: onDrawBack = () => null
  private imageData: any

  constructor(el: string) {
    // // console.log(el)
    this.el = el;
    this.canvas = document.getElementById(this.el);
    this.cxt = this.canvas.getContext("2d");
    // // console.log(this.stage_info.left, this.stage_info.top)
  }

  // throttle(fn: any, wait: number) {
  //   const pre = Date.now();
  //   return function () {
  //     var context = this;
  //     var args = arguments;
  //     var now = Date.now();
  //     if (now - pre >= wait) {
  //       fn.apply(context, args);
  //       pre = Date.now();
  //     }
  //   };
  // }

  init(onDrawBack: onDrawBack, initUrl: string) {
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    // // console.log(this.cxt.globalCompositeOperation, 'this.cxt.globalCompositeOperation')
    this.onDrawBack = onDrawBack;
    this.canvas.onmousedown = () => {
      this.addHistory();
      this.drawBegin(event);
    };
    this.canvas.onmouseup = () => {
      // console.log('========= 1')
      this.drawEnd();
      // ws.send('stop')
    };
    document.onmouseup = () => {
      // console.log('========= 2')
      // this.drawEnd()
      // ws.send('stop')
    };
    // 绘制缓存数据
    if(initUrl) {
      this.initByBase64(initUrl);
    }
  }

  initByBase64(base64Url: string) {
    const img = new Image();
    img.src = base64Url;
    img.onload = () => {
      this.cxt.clearRect(0, 0, 400, 400);
      this.cxt.drawImage(img, 0, 0);
    };
  }

  changeDrawType(drawType: DrawType) {
    this.drawType = drawType
  }

  changeLineWitdh(width: number) {
    this.lineWidth = width
  }

  changeColor(color: string) {
    this.strokeColor = color;
    this.lineWidth = 2;
    this.cxt.globalCompositeOperation = "source-over";
  }

  drawBegin(e: any) {
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
    this.cxt.strokeStyle = this.strokeColor;
    // console.log(this.cxt.lineWidth)

    this.pointer.beginX = e.clientX - this.stage_info.left
    this.pointer.beginY = e.clientY - this.stage_info.top

    if(this.drawType === 'draw') {
      this.cxt.beginPath();
      this.cxt.moveTo(
        this.pointer.beginX,
        this.pointer.beginY
      );
    }
    // // console.log(this.path.beginX, this.path.beginY)
    // console.log('drawBegin')
    this.canvas.onmousemove = () => {
      this.drawing(event)
    }
    // document.onmouseup = this.drawEnd
    // this.canvas.onmousemove = () => {
    //     // console.log('onmousemove')
    // }
    this.canvas.onmouseout = () => {
      setTimeout(() => {
        // console.log('========= 1')
        this.drawEnd();
      }, 100);
      // ws.send('stop')
    };
  }

  // 保留当前画布ImageData
  saveImageData() {
    this.imageData = this.cxt.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // 把上一步保留的ImageData绘制到画布上
  restoreImageData(imageData: string) {
    this.cxt.putImageData(imageData, 0, 0);
  }

  drawing(e: any) {
    this.pointer.endX = e.clientX - this.stage_info.left
    this.pointer.endY = e.clientY - this.stage_info.top
    if(this.drawType === 'draw') {
      this.drawPath()
    } else if(this.drawType === 'line') {
      this.drawLine()
    }
  }

  drawLine() {
    this.restoreImageData(this.imageData)
    this.cxt.beginPath();
    this.cxt.moveTo(
      this.pointer.beginX,
      this.pointer.beginY
    );
    this.cxt.lineTo(
      this.pointer.endX,
      this.pointer.endY
    );

    this.cxt.lineWidth = this.lineWidth;
    this.cxt.stroke();
  }

  drawPath() {
    this.cxt.lineTo(
      this.pointer.endX,
      this.pointer.endY
    );
    this.cxt.lineWidth = this.lineWidth;
    this.cxt.stroke();
  }

  addHistory() {
    const base64Url = this.canvas.toDataURL("image/png");
    this.canvasPool.push(base64Url);
  }

  drawEnd() {
    // // console.log('========= 2')
    this.canvas.onmousemove = null;
    // // console.log();
    const base64Url = this.canvas.toDataURL("image/png");
    this.callBackData(base64Url)
    // this.canvas.onmousemove = null
  }

  clearCanvas() {
    // btn.onclick = () => {
    //     this.cxt.clearRect(0, 0, 500, 500)
    //     // ws.send('clear')
    // }
    this.addHistory();
    this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawEnd();
  }

  earse() {
    // this.strokeColor = 'pink'
    this.lineWidth = 20;
    this.cxt.globalCompositeOperation = "destination-out";
  }

  undo() {
    if(this.canvasPool.length > 0) {
      const current = this.canvasPool.pop() || ''
      console.log(current);

      this.initByBase64(current);
      this.callBackData(current)
    } else {
      showToast("this is last step");
    }
  }

  callBackData(str: string) {
    this.onDrawBack(str);
    this.saveImageData()
  }
}
