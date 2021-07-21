/* eslint-disable no-lonely-if */
/* 白板实例 */
import { showToast } from "@/utils/loading";
// @ts-ignore
import Text from './drawText'

export enum DrawTypeData {
  line = 'line',
  draw = 'draw',
  text = 'text',
  marker = 'marker',
  circle = "circle",
  rect = "rect",
  polygon = "polygon"
}

type DrawType = 'line' | 'draw' | 'text' | 'marker' | 'rect' | 'circle' | 'polygon'
type onDrawBack = (data: any) => void
window.canvasPool = []
window.drawPool = []
window.textPool = []

export default class Draw {
  private el: any
  private strokeColor = "#02a3ee";
  private lineWidth = 2
  private canvas: any
  private cxt: any
  private stage_info = {
    left: 20,
    top: 20
  }
  private fontFamily = "Microsoft YaHei"
  private textString = ""
  private polygonStartPoint = {//记录多边形的起始点
    beginX: -1,
    beginY: -1,
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
  private beginTime: any;

  //当前被选中的text
  private currentSelectEditableDiv: any;


  private drawType: DrawType = 'draw'
  private onDrawBack: onDrawBack = () => null
  private imageData: any
  private canTextarea = true;
  private canvasParant: any
  private textPostion = {
    x: 0,
    y: 0
  }
  private lastImageData = ''
  private currentIndex = -1;

  //为了防止双击的时候先执行mouse down 和mouse up，定义两个timer，延时up down的操作，当双击时取消timer就可以屏蔽up down的操作了。
  private timerDown: any;
  private timerUp: any;
  private event: any;
  // private lastMouseDownTime = 0;
  // private lastMouseUpTime = 0;

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

    this.cxt.lineCap = "round";
    this.cxt.lineJoin = "round";
    // this.cxt.shadowBlur = 10;
    this.canvas.onmousedown = () => {

      this.event = event;
      clearTimeout(this.timerDown);
      //如果是绘制多边形，则需要判断是否是双击，所以需要执行延时操作。
      if (this.drawType == 'polygon') {
        let _this = this;
        this.saveImageData();
        this.pointer.beginX = this.pointer.endX;
        this.pointer.beginY = this.pointer.endY;
        this.timerDown = setTimeout(function () {
          _this.onMouseDown();
        }, 300);
      } else {
        this.onMouseDown();
      }
    };
    this.canvas.onmouseup = () => {
      clearTimeout(this.timerUp);
      if (this.drawType == 'polygon') {
        let _this = this;
        this.timerUp = setTimeout(function () {
          _this.onMouseUp()
        }, 300);
      } else {
        this.onMouseUp();
      }


    };
    let _this = this;
    this.canvas.addEventListener('dblclick', function () {
      clearTimeout(_this.timerDown);
      clearTimeout(_this.timerUp);
      if (_this.drawType == "polygon") {//双击结束多边形的绘制
        _this.isDrawing = false
        _this.drawEnd();
        _this.polygonStartPoint.beginY = -1;
        _this.polygonStartPoint.beginX = -1;
      }
    }, true);
    document.onmouseup = () => {
      // console.log('========= 2')
      // this.drawEnd()
      // ws.send('stop')
    };
    // 绘制缓存数据
    if (initUrl) {
      this.initByBase64(initUrl);
      //  window.drawPool.splice(++this.currentIndex, 0, initUrl);
    } else {
      this.saveImageData()
    }
    if (this.currentIndex == -1) {
      window.drawPool = [];
      const base64Url = this.canvas.toDataURL("image/png");
      window.drawPool.splice(++this.currentIndex, 0, base64Url);
    }

  }

  onMouseDown() {
    //  console.log(this.polygonStartPoint.beginX, 'onmousedown', this.drawType)
    if (this.drawType == "polygon" && this.polygonStartPoint.beginX != -1 && this.polygonStartPoint.beginY != -1) {
      if (Math.abs(this.polygonStartPoint.beginX - this.pointer.endX) < 5 && Math.abs(this.polygonStartPoint.beginY - this.pointer.endY) < 5) {
        this.isDrawing = false
        this.drawEnd();
        this.polygonStartPoint.beginY = -1;
        this.polygonStartPoint.beginX = -1;
      }
    } else {
      this.drawBegin(this.event);
    }

  }

  onMouseUp() {
    //   console.log('========= onmouseup')
    if (this.drawType != "polygon") {//多边形的结束判断方式和其他方式不一样。
      this.isDrawing = false
      this.drawEnd();
    }

    // ws.send('stop')

  }

  initByBase64(base64Url: string) {
    const img = new Image();
    img.src = base64Url;
    this.cxt.globalCompositeOperation = "source-over";
    img.onload = () => {
      this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.cxt.drawImage(img, 0, 0);
      this.saveImageData()
      if (this.isEarse) {
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

  //可以使用两层 canvas
  //上面一层当drawType是text时才显现，用来保存图片的
  createDom() {
    let fontSize = Math.max(18, this.lineWidth) + "px";
    const textarea = document.createElement('textarea');
    textarea.id = 'textarea';
    textarea.setAttribute("contenteditable", "true");
    textarea.setAttribute("placeholder", "Please insert text");
    textarea.setAttribute("rows", "3");
    // textarea.autofocus = true;
    //   textarea.placeholder = 'Please insert text';
    textarea.style.position = 'absolute';
    textarea.style.left = `${this.pointer.beginX}px`;
    textarea.style.top = `${this.pointer.beginY}px`;
    textarea.style.zIndex = '11';
    textarea.style.fontSize = Math.max(18, this.lineWidth) + "px";
    textarea.style.fontFamily = this.fontFamily;
    textarea.style.background = "00000000";
    textarea.style.color = this.strokeColor;
    textarea.style.lineHeight = this.getLineHeight();
    textarea.style.outline = "0";
    textarea.style.minWidth = "20px";
    textarea.style.minHeight = "auto";

    //  textarea.style.border = "2px solid #c2d4fd";
    textarea.style.textAlign = "left";
    this.cxt.font = `${fontSize}px ${this.fontFamily}`;
    this.canvasParant.appendChild(textarea);
    this.textPostion = { x: this.pointer.beginX, y: this.pointer.beginY }
    //   textarea.focus();
    return textarea;
  }

  //创建一个可以编辑的div
  createEditableDiv() {

    var editableDiv = document.createElement('div');
    editableDiv.setAttribute("contenteditable", "true");

    editableDiv.id = "editable_div_" + window.textPool.length;

    editableDiv.style.position = 'absolute';
    editableDiv.style.left = `${this.pointer.beginX}px`;
    editableDiv.style.top = `${this.pointer.beginY}px`;
    editableDiv.style.zIndex = '11';
    editableDiv.style.fontSize = Math.max(18, this.lineWidth) + "px";
    editableDiv.style.fontFamily = this.fontFamily;
    editableDiv.style.background = "00000000";
    editableDiv.style.color = this.strokeColor;
    editableDiv.style.lineHeight = this.getLineHeight();
    editableDiv.style.outline = "0";
    editableDiv.style.minWidth = "20px";
    editableDiv.style.height = "auto";
    editableDiv.style.minHeight = this.getLineHeight();
    editableDiv.style.padding = '10px 5px 10px 5px'
    editableDiv.style.border = "2px solid #c2d4fd";
    editableDiv.style.borderRadius = '2px';
    editableDiv.style.textAlign = "left";
    let _this = this;
    editableDiv.onmousedown = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }
      if (_this.currentSelectEditableDiv) {
        if (_this.currentSelectEditableDiv == editableDiv) {
          editableDiv.setAttribute("contenteditable", "true");
        } else {
          _this.currentSelectEditableDiv.style.border = "2px solid #00000000";
          editableDiv.setAttribute("contenteditable", "false");
        }
      }
      _this.currentSelectEditableDiv = editableDiv;
      editableDiv.style.border = "2px solid #c2d4fd";
    }

    editableDiv.onmouseenter = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }
      editableDiv.style.cursor = 'move';
    }
    editableDiv.onmouseleave = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }

      // editableDiv.setAttribute("contenteditable", "false");

    }
    editableDiv.onmousemove = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }
      var e = ev || event;
      // editableDiv.style.left = `${e.clientX}px`;
      // editableDiv.style.top = `${e.clientY}px`;
    }

    editableDiv.onmouseup = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }
    }
    editableDiv.addEventListener('input', function () {
      console.log(editableDiv.innerText)
    })

    let fontSize = Math.max(18, this.lineWidth) + "px";
    this.cxt.font = `${fontSize}px ${this.fontFamily}`;
    this.canvasParant.appendChild(editableDiv);
    this.textPostion = { x: this.pointer.beginX, y: this.pointer.beginY }

    window.textPool.push(editableDiv);
    return editableDiv.id;



  }

  getLineHeight() {
    console.log(Math.max(18, this.lineWidth) + "px")
    return Math.max(18, this.lineWidth) + "px";
  }
  drawBegin(e: any) {
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
    this.cxt.strokeStyle = this.strokeColor;
    // console.log(this.cxt.lineWidth)

    this.pointer.beginX = e.clientX - this.stage_info.left
    this.pointer.beginY = e.clientY - this.stage_info.top
    if (this.drawType === 'draw' || this.drawType === 'marker') {
      this.cxt.beginPath();
      this.cxt.moveTo(
        this.pointer.beginX,
        this.pointer.beginY
      );
    }
    if (this.drawType == "polygon") {
      this.polygonStartPoint.beginX = this.pointer.beginX;
      this.polygonStartPoint.beginY = this.pointer.beginY;
    }

    if (['draw', 'line', 'rect', 'circle', 'polygon', 'marker'].indexOf(this.drawType) > -1) {
      this.canvas.onmousemove = () => {
        this.drawing(event)
      }
      this.canvas.onmouseout = () => {
      };
    } else if (this.drawType === 'text') {
      this.drawText()
    }
    this.beginTime = new Date().getTime();

  }

  // 保留当前画布ImageData
  saveImageData() {
    this.imageData = this.cxt.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // 把上一步保留的ImageData绘制到画布上
  restoreImageData(imageData: string) {
    this.cxt.putImageData(imageData, 0, 0);
  }

  setFontFamily(font: string) {
    this.fontFamily = font;
  }

  drawText() {

    this.createEditableDiv();
    // if (this.canTextarea) {

    //   // 添加textarea文本框
    //   const textarea = this.createDom();
    //   // @ts-ignore
    //   document.getElementById('textarea').focus();
    //   this.canTextarea = false;
    // } else {
    //   // 绘制textarea文本
    //   const textarea = document.getElementById('textarea');
    //   // @ts-ignore
    //   const tValue = textarea.value
    //   if (tValue) {
    //     console.log('text end draw!!')
    //     this.addHistory();
    //     const text = new Text(this.textPostion, tValue, this.lineWidth, this.strokeColor, this.fontFamily);
    //     text.draw(this.cxt);
    //     //  this.drawEnd() 防止重复调用
    //   }
    //   this.canvasParant.removeChild(textarea);
    //   this.canTextarea = true;
    // }
  }

  drawTextDirect(event: any) {
    console.log(event.key);
    if (this.drawType != "text") {
      this.textString = "";
      return;
    }
    let keyStr = event.key;
    if (event.keyCode == 8 || event.keyCode == 46) {//删除
      if (this.textString.length > 0) {
        this.textString = this.textString.substring(0, this.textString.length - 1);
      }
    } else if (event.keyCode == 13) {//回车
      this.textString += "\n";
    } else {
      this.textString += keyStr;
    }
    this.restoreImageData(this.imageData)
    this.textPostion = { x: this.pointer.beginX, y: this.pointer.beginY }
    const text = new Text(this.textPostion, this.textString, this.lineWidth, this.strokeColor, this.fontFamily);
    text.draw(this.cxt);

  }

  drawing(e: any) {
    if (!this.isDrawing) {
      this.addHistory()
    }
    this.isDrawing = true
    this.pointer.endX = e.clientX - this.stage_info.left
    this.pointer.endY = e.clientY - this.stage_info.top
    if (this.drawType === 'draw') {
      this.drawPath()
    } else if (this.drawType === 'line') {
      this.drawLine()
    } else if (this.drawType === 'rect') {
      this.drawRect()
    } else if (this.drawType == "circle") {
      this.drawCircle();
    } else if (this.drawType == "polygon") {
      this.drawPolygon();
    } else if (this.drawType == "marker") {
      this.drawMarker();
    }
  }

  canUndo() {
    return this.currentIndex > 0;
  }
  canRedo() {
    return this.currentIndex < window.drawPool.length - 1;
  }


  //画多边形
  drawPolygon() {

    if (Math.abs(this.polygonStartPoint.beginX - this.pointer.endX) < 5 && Math.abs(this.polygonStartPoint.beginY - this.pointer.endY) < 5) {
      this.pointer.endX = this.polygonStartPoint.beginX;
      this.pointer.endY = this.polygonStartPoint.beginY;
    }

    this.drawLine();
    // let current = new Date().getTime();
    // if (current - this.beginTime < 800) {
    //   this.beginTime = current;
    // } else {
    //   this.saveImageData();
    //   this.beginTime = current;
    //   this.pointer.beginX = this.pointer.endX;
    //   this.pointer.beginY = this.pointer.endY;
    // }
  }

  // 画椭圆
  drawCircle() {

    this.restoreImageData(this.imageData)
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.lineWidth = this.lineWidth;

    let xR = (this.pointer.endX - this.pointer.beginX) / 2
    let yR = (this.pointer.endY - this.pointer.beginY) / 2
    if (xR < 0) {
      this.cxt.moveTo(
        this.pointer.beginX,
        this.pointer.beginY + yR
      );
    } else {
      this.cxt.moveTo(
        this.pointer.beginX + 2 * xR,
        this.pointer.beginY + yR
      );
    }

    let xPoint = this.pointer.beginX + xR;
    let yPoint = this.pointer.beginY + yR;

    if (this.cxt.ellipse) {
      this.cxt.ellipse(xPoint, yPoint, Math.abs(xR), Math.abs(yR), 0, 0, Math.PI * 2);
    } else {
      //使用三次贝塞尔曲线模拟椭圆2
      this.bezierEllipse2(xPoint, yPoint, Math.abs(xR), Math.abs(yR));
    }


    this.cxt.stroke();
    this.cxt.restore();

  }

  bezierEllipse2(x: any, y: any, a: any, b: any) {
    var k = .5522848,
      ox = a * k, // 水平控制点偏移量
      oy = b * k; // 垂直控制点偏移量</p> <p> ctx.beginPath();
    //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
    this.cxt.moveTo(x - a, y);
    this.cxt.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
    this.cxt.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
    this.cxt.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
    this.cxt.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
    this.cxt.closePath();
    this.cxt.stroke();
  };

  //画矩形
  drawRect() {

    this.restoreImageData(this.imageData)
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.lineWidth = this.lineWidth;
    this.cxt.moveTo(
      this.pointer.beginX,
      this.pointer.beginY
    );
    this.cxt.strokeRect(this.pointer.beginX, this.pointer.beginY, this.pointer.endX - this.pointer.beginX, this.pointer.endY - this.pointer.beginY);
    this.cxt.stroke();
    this.cxt.restore();

  }

  // 画直线
  drawLine() {
    this.restoreImageData(this.imageData)
    this.cxt.save();
    this.cxt.beginPath();
    this.cxt.lineWidth = this.lineWidth;
    this.cxt.moveTo(
      this.pointer.beginX,
      this.pointer.beginY
    );
    this.cxt.lineTo(
      this.pointer.endX,
      this.pointer.endY
    );

    this.cxt.stroke();
    this.cxt.restore();
  }

  // 画线
  drawPath() {
    this.cxt.save();
    this.cxt.lineTo(
      this.pointer.endX,
      this.pointer.endY
    );

    // this.cxt.shadowColor = this.strokeColor;
    this.cxt.lineWidth = this.lineWidth;
    this.cxt.stroke();
    this.cxt.restore();
  }

  // 画标记
  drawMarker() {

    this.restoreImageData(this.imageData)
    this.cxt.strokeStyle = this.strokeColor + "65";
    this.cxt.save();
    this.cxt.lineTo(
      this.pointer.endX,
      this.pointer.endY
    );

    // this.cxt.shadowColor = this.strokeColor;
    this.cxt.lineWidth = this.lineWidth;

    this.cxt.stroke();
    this.cxt.restore();


  }

  addHistory() {
    // console.log('====== addHistory')
    const base64Url = this.canvas.toDataURL("image/png");
    window.canvasPool.push(base64Url);
  }

  drawEnd() {
    console.log('========= drawEnd', this.canTextarea);

    // if (this.drawType == "marker") {
    //   this.cxt.stroke();
    //   this.cxt.restore();
    // }

    this.canvas.onmousemove = null;
    // // console.log();
    const base64Url = this.canvas.toDataURL("image/png");
    this.callBackData(base64Url)
    // this.lastImageData = base64Url;
    // this.canvas.onmousemove = null
    window.drawPool.splice(++this.currentIndex, 0, base64Url);
  }

  clearCanvas() {
    // btn.onclick = () => {
    //     this.cxt.clearRect(0, 0, 500, 500)
    //     // ws.send('clear')
    // }
    this.addHistory();
    this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawEnd();
    this.polygonStartPoint.beginY = -1;
    this.polygonStartPoint.beginX = -1;
  }

  earse() {
    // this.strokeColor = 'pink'
    // this.lineWidth = 20;
    this.isEarse = true
    this.drawType = 'draw'
    this.cxt.globalCompositeOperation = "destination-out";
  }

  //更改undo的逻辑，不采用进出栈的方式，而是采用工作指针的方式
  //这样可以方便的进行撤销操作和撤销撤销的操作
  //
  undo() {
    //  console.log(window.canvasPool, '=========');
    // if (window.canvasPool.length > 0) {
    //   const current = window.canvasPool.pop() || ''
    //   this.initByBase64(current);
    //   this.callBackData(current);
    //   window.drawPool.push(current);
    // } else {
    //   showToast("this is last step");
    // }
    console.log(window.drawPool.length, this.currentIndex, "---");
    if (this.currentIndex <= 0) {
      showToast("this is last step");
    } else {
      const current = window.drawPool[--this.currentIndex] || ''
      this.initByBase64(current);
      this.callBackData(current);
    }
  }
  redo() {
    console.log(window.drawPool.length, this.currentIndex, "++++");
    if (this.currentIndex == window.drawPool.length - 1) {
      showToast("this is last step");
    } else {
      const current = window.drawPool[++this.currentIndex] || ''
      this.initByBase64(current);
      this.callBackData(current);
    }
  }

  callBackData(str: string) {
    this.onDrawBack(str);
    this.saveImageData()
  }
}
