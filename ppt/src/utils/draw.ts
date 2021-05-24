/* eslint-disable no-lonely-if */
/* 白板实例 */
import { showToast } from "@/utils/loading";
// @ts-ignore
import Text from './drawText'

export enum DrawTypeData {
  line = 'line',
  draw = 'draw',
  text = 'text'
}

type DrawType = 'line' | 'draw' | 'text'
type onDrawBack = (data: any) => void
window.canvasPool = []

export default class Draw {
  private el: any
  private strokeColor = "#000";
  private lineWidth = 2
  private canvas: any
  private cxt: any
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
  private isEarse = false // 橡皮擦

  private drawType: DrawType = 'draw'
  private onDrawBack: onDrawBack = () => null
  private imageData: any
  private canTextarea = true;
  private canvasParant: any
  private textPostion = {
    x: 0,
    y: 0
  }

  private isDrawing = false

  constructor(el: string) {
    // // console.log(el)
    this.el = el;
    this.canvas = document.getElementById(this.el);
    this.cxt = this.canvas.getContext("2d");
    this.canvasParant = this.canvas.parentNode
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
      this.drawBegin(event);
    };
    this.canvas.onmouseup = () => {
      // console.log('========= 1')
      this.isDrawing = false
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
    } else {
      this.saveImageData()
    }
  }

  initByBase64(base64Url: string) {
    const img = new Image();
    img.src = base64Url;
    this.cxt.globalCompositeOperation = "source-over";
    img.onload = () => {
      this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.cxt.drawImage(img, 0, 0);
      this.saveImageData()
      if(this.isEarse) {
        this.cxt.globalCompositeOperation = "destination-out";
      }
    };
  }

  changeDrawType(drawType: DrawType) {
    this.isEarse = false
    this.drawType = drawType
    this.cxt.globalCompositeOperation = "source-over";
  }

  changeLineWitdh(width: number) {
    this.lineWidth = width
  }

  changeColor(color: string) {
    this.strokeColor = color;
    // this.cxt.globalCompositeOperation = "source-over";
  }

  createDom() {
    const textarea = document.createElement('textarea');
    textarea.id = 'textarea';
    textarea.rows = 3;
    textarea.autofocus = true;
    textarea.placeholder = '请输入回车键换行..';
    textarea.style.position = 'absolute';
    textarea.style.left = `${this.pointer.beginX}px`;
    textarea.style.top = `${this.pointer.beginY}px`;
    textarea.style.zIndex = '11';
    return textarea;
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

    if(this.drawType !== 'text') {
      this.canvas.onmousemove = () => {
        this.drawing(event)
      }
      this.canvas.onmouseout = () => {
        // setTimeout(() => {
        //   // console.log('========= 1')
        //   this.isDrawing = false
        //   this.drawEnd();
        // }, 100);
        // ws.send('stop')
      };
    } else {
      this.drawText()
    }

  }

  // 保留当前画布ImageData
  saveImageData() {
    this.imageData = this.cxt.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // 把上一步保留的ImageData绘制到画布上
  restoreImageData(imageData: string) {
    this.cxt.putImageData(imageData, 0, 0);
  }

  drawText() {
    if(this.canTextarea) {
      this.textPostion = {x: this.pointer.beginX, y: this.pointer.beginY}
      // 添加textarea文本框
      const textarea = this.createDom();
      this.canvasParant.appendChild(textarea);
      // @ts-ignore
      document.getElementById('textarea').focus();
      this.canTextarea = false;
    } else {
      // 绘制textarea文本
      const textarea = document.getElementById('textarea');
      // @ts-ignore
      const tValue = textarea.value
      if(tValue) {
        this.addHistory();
        const text = new Text(this.textPostion, tValue, this.lineWidth, this.strokeColor);
        text.draw(this.cxt);
        this.drawEnd()
      }
      this.canvasParant.removeChild(textarea);
      this.canTextarea = true;
    }
  }

  drawing(e: any) {
    if(!this.isDrawing) {
      this.addHistory()
    }
    this.isDrawing = true
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
    this.cxt.save();
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
    this.cxt.restore();
  }

  drawPath() {
    this.cxt.save();
    this.cxt.lineTo(
      this.pointer.endX,
      this.pointer.endY
    );
    this.cxt.lineWidth = this.lineWidth;
    this.cxt.stroke();
    this.cxt.restore();
  }

  addHistory() {
    console.log('====== addHistory')
    const base64Url = this.canvas.toDataURL("image/png");
    window.canvasPool.push(base64Url);
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
    // this.lineWidth = 20;
    this.isEarse = true
    this.drawType = 'draw'
    this.cxt.globalCompositeOperation = "destination-out";
  }

  undo() {
    console.log(window.canvasPool.length, '=========');
    if(window.canvasPool.length > 0) {
      const current = window.canvasPool.pop() || ''
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
