/* eslint-disable no-lonely-if */
/* 白板实例 */
import { showToast } from "@/utils/loading";
// @ts-ignore
import Text from './drawText';
import DrawTextItem from './drawTextItem';
import { addElementItem, deleteElementItem, updateElementItem } from '../model/index'
import { connect } from 'echarts/core';
import copy from "copy-to-clipboard";

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
type onDrawBack = (data: any, str: any) => void
type onDrawTextBack = (data: any) => void
window.canvasPool = []
window.drawPool = []
window.textPool = []
window.textOptsPool = []

export default class Draw {
  private el: any
  private strokeColor = "#02a3ee";
  private lineWidth = 2
  private canvas: any
  private cxt: any
  private sildeId = ""

  private mouseDownPoint = {
    x: 0,
    y: 0
  }
  private mouseUpPoint = {
    x: 0,
    y: 0
  }

  private canvasText: any
  private cxtText: any
  private stage_info = {
    left: 0,
    top: 0
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

  private canvasWidth = 0;
  private canvasHeight = 0;
  private isEarse = false // 橡皮擦
  private beginTime: any;

  //当前被选中的text
  private currentSelectEditableDiv: any;
  private currentMouseOnEditableDeiv = false;
  private currentSelectEditableLeft = 0;
  private currentSelectEditableTop = 0;
  private isMouseDown = false;
  private isMouseMoved = false;


  private drawType: DrawType = 'draw'
  private onDrawBack: onDrawBack = () => null
  private onDrawTextBack: onDrawTextBack = () => null
  private imageData: any
  private canTextarea = true;
  private canvasParant: any
  private textPostion = {
    x: 0,
    y: 0
  }
  private lastImageData = ''
  private currentIndex = -1;
  private page_id = "";

  //为了防止双击的时候先执行mouse down 和mouse up，定义两个timer，延时up down的操作，当双击时取消timer就可以屏蔽up down的操作了。
  private timerDown: any;
  private timerUp: any;
  private event: any;
  // private lastMouseDownTime = 0;
  // private lastMouseUpTime = 0;

  private isDrawing = false

  private textItems = [];

  constructor(el: string, elText: string, canvasW: number, canvasH: number) {
    this.canvasWidth = canvasW
    this.canvasHeight = canvasH
    // // // console.log(el)
    this.el = el;
    this.canvas = document.getElementById(this.el);
    this.cxt = this.canvas.getContext("2d");

    this.canvasText = document.getElementById(elText);
    this.cxtText = this.canvasText.getContext("2d");

    this.canvasParant = this.canvas.parentNode
    // // // console.log(this.stage_info.left, this.stage_info.top)
  }

  resetSize(canvasW: number, canvasH: number) {
    this.canvasWidth = canvasW
    this.canvasHeight = canvasH
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight

    this.canvasText.width = this.canvasWidth
    this.canvasText.height = this.canvasHeight

    this.restoreImageData(this.imageData);
  }

  init(onDrawBack: onDrawBack, onDrawTextBack: onDrawTextBack, initUrl: string, page_id: string, sildeId: string, textItems: any) {
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight

    this.canvasText.width = this.canvasWidth
    this.canvasText.height = this.canvasHeight
    // // // console.log(this.cxt.globalCompositeOperation, 'this.cxt.globalCompositeOperation')
    this.onDrawBack = onDrawBack;
    this.onDrawTextBack = onDrawTextBack;
    this.page_id = page_id;
    this.sildeId = sildeId;
    this.textItems = textItems;

    this.initTextItems();
    this.cxt.lineCap = "round";
    this.cxt.lineJoin = "round";
    // this.cxt.shadowBlur = 10;
    this.canvas.onmousedown = () => {

      console.log("canvas on mouse down", this.isMouseMoved)
      this.isMouseMoved = false;

      this.event = event;
      console.log(this.event.layerY)
      this.mouseDownPoint.x = this.event.layerX;
      this.mouseDownPoint.y = this.event.layerY;
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
      this.event = event;
      this.mouseUpPoint.x = this.event.layerX;
      this.mouseUpPoint.y = this.event.layerY;
      console.log(this.mouseDownPoint, this.mouseUpPoint);
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
      // // console.log('========= 2')
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

      window.textOptsPool = [];
      window.textOptsPool.splice(this.currentIndex, 0, this.copyWindowTextPool());
    }

  }
  copyWindowTextPool() {
    var list = [];
    for (let i = 0; i < window.textPool.length; i++) {
      if (window.textPool[i].innerText && window.textPool[i].innerText.length > 0) {
        var item = new DrawTextItem(window.textPool[i].page_id, window.textPool[i].self_id, window.textPool[i].left,
          window.textPool[i].top, window.textPool[i].fontSize, window.textPool[i].fontFamily, window.textPool[i].innerText, window.textPool[i].color);
        item.id = window.textPool[i].id;
        list.push(item);
      }
    }
    return list;
  }

  onMouseDown() {
    if (this.drawType != "text") {
      this.currentMouseOnEditableDeiv = false;
      if (this.currentSelectEditableDiv) {
        if (!this.currentSelectEditableDiv.innerText || this.currentSelectEditableDiv.innerText.length < 1) {
          this.deleteEditableDiv(this.currentSelectEditableDiv.id);
        } else {
          this.currentSelectEditableDiv.style.border = "2px solid #00000000";
          this.currentSelectEditableDiv.setAttribute("contenteditable", false);
          var deleteImage = document.getElementById(this.currentSelectEditableDiv.id + "_close_btn");
          if (deleteImage)
            deleteImage.style.display = "none";
          this.changeEditableDiv();
        }
      }
      this.currentSelectEditableDiv = null;
    }
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
    //   // console.log('========= onmouseup')
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
    // console.log(drawType)
    if (drawType != DrawTypeData.text) {
      if (this.currentSelectEditableDiv) {
        this.currentSelectEditableDiv.setAttribute("contenteditable", false);
        this.currentSelectEditableDiv.style.border = "2px solid #00000000";
        var deleteImage = document.getElementById(this.currentSelectEditableDiv.id + "_close_btn");
        if (deleteImage) {
          // console.log('hide delete');
          deleteImage.style.display = "none";
        }

      }
    }

  }

  changeLineWitdh(width: number) {
    this.lineWidth = width
    // if (this.drawType == 'text') {
    //   if (this.currentSelectEditableDiv) {
    //     this.currentSelectEditableDiv.style.fontSize = Math.max(18, this.lineWidth) + "px";
    //     this.currentSelectEditableDiv.style.lineHeight = this.getLineHeight();
    //     this.currentSelectEditableDiv.style.minHeight = this.getLineHeight();
    //   }
    // }

  }

  changeColor(color: string) {
    this.strokeColor = color;
    if (this.drawType == 'text') {
      if (this.currentSelectEditableDiv) {
        this.currentSelectEditableDiv.style.color = color;
        this.changeEditableDiv();
      }
    }
    // this.cxt.globalCompositeOperation = "source-over";
  }



  //可以使用两层 canvas
  //上面一层当drawType是text时才显现，用来保存图片的
  //创建一个可以编辑的div
  createEditableDiv(textItem: any) {



    if (this.currentSelectEditableDiv && !textItem) {
      if (!this.currentMouseOnEditableDeiv) {
        this.currentSelectEditableDiv.setAttribute("contenteditable", "false");
        if (!this.currentSelectEditableDiv.innerText || this.currentSelectEditableDiv.innerText.length < 1) {
          this.deleteEditableDiv(this.currentSelectEditableDiv.id);
        } else {
          this.currentSelectEditableDiv.style.border = "2px solid #00000000";
          this.currentSelectEditableDiv.focus();
          this.currentSelectEditableDiv.setAttribute("contenteditable", "false");
          var deleteImage = document.getElementById(this.currentSelectEditableDiv.id + "_close_btn");
          if (deleteImage)
            deleteImage.style.display = "none";
        }
        this.changeEditableDiv();
        this.currentSelectEditableDiv = null;
        return;
      }
    }

    let editableDiv = document.createElement('div');
    this.canvasParant.appendChild(editableDiv);
    let _this = this;

    var closeImg = document.createElement('img');



    if (!textItem) {
      var divId = "editable_div_" + this.page_id + "_" + new Date().getTime();
      textItem = new DrawTextItem(this.page_id, divId, this.pointer.beginX + this.stage_info.left - 0, this.pointer.beginY + this.stage_info.top - 0,
        this.lineWidth, this.fontFamily, editableDiv.innerText + " ", this.strokeColor);

      this.currentSelectEditableDiv = editableDiv;
      editableDiv.setAttribute("contenteditable", "true");

      this.currentSelectEditableLeft = textItem.left;
      this.currentSelectEditableTop = textItem.top;

      let fontSize = Math.max(18, this.lineWidth) + "px";
      this.cxt.font = `${fontSize}px ${this.fontFamily}`;
      editableDiv.style.border = "2px solid #c2d4fd";
      closeImg.style.display = 'block';
      setTimeout(() => {
        editableDiv.focus();
      }, 50)
      this.textPostion = { x: this.pointer.beginX, y: this.pointer.beginY }
    } else {
      editableDiv.style.border = "2px solid #c2d4fd00";
      editableDiv.setAttribute("contenteditable", "false");
      closeImg.style.display = 'none';
    }

    closeImg.id = textItem.self_id + "_close_btn";
    closeImg.style.position = 'fixed';
    closeImg.style.cursor = "pointer";
    closeImg.setAttribute('src', "https://api.app.classcipe.com/upload/5e6fc987f77738c5.png");//src\assets\picture\closecom.png//C:\Users\Administrator\Desktop\google-slides-web\ppt\src\assets\picture\closecom.png
    closeImg.style.left = `${textItem.left - 20}px`;
    closeImg.style.top = `${textItem.top + 10}px`;
    closeImg.width = 20;
    closeImg.height = 20;

    closeImg.addEventListener('click', function () {
      //删除掉这个text item
      _this.changeEditableDiv();
      _this.deleteEditableDiv(editableDiv.id);
      _this.drawEnd();
    });



    window.textPool.push(textItem);
    editableDiv.id = textItem.self_id;
    editableDiv.style.position = 'fixed';
    // editableDiv.style.zIndex = '' + window.textPool.length;
    editableDiv.style.fontFamily = textItem.fontFamily;
    editableDiv.style.background = "#00000000";
    editableDiv.style.color = textItem.color;
    editableDiv.style.outline = "0";
    editableDiv.style.minWidth = "20px";
    editableDiv.style.height = "auto";
    editableDiv.style.fontSize = Math.max(18, textItem.fontSize) + "px";
    editableDiv.style.lineHeight = Math.max(18, textItem.fontSize) + "px";
    editableDiv.style.minHeight = Math.max(18, textItem.fontSize) + "px";
    // console.warn('====', editableDiv.style.width, editableDiv.style.height)
    editableDiv.style.left = `${textItem.left - 10}px`;
    editableDiv.style.top = `${textItem.top + Math.max(18, textItem.fontSize)}px`;
    editableDiv.style.padding = '10px 5px 10px 5px'
    editableDiv.style.borderRadius = '2px';
    editableDiv.style.textAlign = "left";
    editableDiv.style.userSelect = "none";
    editableDiv.innerText = textItem.innerText;

    editableDiv.setAttribute("contenteditable", "true");



    editableDiv.onmousedown = function (ev: any) {
      if (_this.drawType != 'text') {
        return;
      }
      _this.isMouseDown = true;
      if (_this.currentSelectEditableDiv) {
        if (_this.currentSelectEditableDiv == editableDiv) {
          editableDiv.setAttribute("contenteditable", "true");
        } else {
          _this.currentSelectEditableDiv.style.border = "2px solid #00000000";
          _this.currentSelectEditableDiv.setAttribute("contenteditable", "false");
          var deleteImage = document.getElementById(_this.currentSelectEditableDiv.id + "_close_btn");
          if (deleteImage)
            deleteImage.style.display = "none";
          if (!_this.currentSelectEditableDiv.innerText || _this.currentSelectEditableDiv.innerText.length < 1) {
            _this.deleteEditableDiv(_this.currentSelectEditableDiv.id);
          }
        }
      }
      let e = ev || event;
      _this.currentSelectEditableDiv = editableDiv;
      editableDiv.style.border = "2px solid #c2d4fd";
      _this.currentSelectEditableLeft = e.clientX;
      _this.currentSelectEditableTop = e.clientY;
      //  _this.currentSelectEditableDiv.setAttribute("contenteditable", "true");
      //   _this.currentSelectEditableDiv.focus();

      var deleteImage = document.getElementById(editableDiv.id + "_close_btn");

      if (deleteImage) {
        // console.log("show delete Image")
        deleteImage.style.display = "block";
      }



      editableDiv.onmousemove = function (ev: any) {
        // // console.log('onmousemove', editableDiv.id);
        if (_this.drawType != 'text' || !_this.isMouseDown || _this.currentSelectEditableDiv.id != editableDiv.id) {
          return;
        }
        //   // console.log('onmousemove', editableDiv.id);
        var e = ev || event;
        let left = parseInt(editableDiv.style.left) ? parseInt(editableDiv.style.left) : 0;
        let top = parseInt(editableDiv.style.top);

        console.log(e.clientX, e.clientY);
        left += (e.clientX - _this.currentSelectEditableLeft);
        top += (e.clientY - _this.currentSelectEditableTop);
        editableDiv.style.left = `${left}px`;
        editableDiv.style.top = `${top}px`;
        _this.currentSelectEditableLeft = e.clientX;
        _this.currentSelectEditableTop = e.clientY;

        var deleteImage = document.getElementById(editableDiv.id + "_close_btn");
        if (deleteImage) {
          deleteImage.style.left = `${left - 10}px`;
          deleteImage.style.top = `${top - 10}px`;
        }


      };
      editableDiv.onmouseup = function (ev) {
        if (_this.drawType != 'text') {
          return;
        }
        // console.log('onmouseup', editableDiv.id);
        _this.isMouseDown = false;
        editableDiv.onmousemove = null;
        editableDiv.onmouseup = null;
        // _this.changeEditableDiv();
      };
    }

    editableDiv.onmouseenter = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }
      editableDiv.style.cursor = 'move';
      _this.currentMouseOnEditableDeiv = true;
      // editableDiv.setAttribute("contenteditable", "true");
    }
    editableDiv.onmouseleave = function (ev) {
      if (_this.drawType != 'text') {
        return;
      }
      // console.log('onmouseleave', editableDiv.id);
      editableDiv.style.cursor = 'default';
      _this.currentMouseOnEditableDeiv = false;
      //   editableDiv.setAttribute("contenteditable", "false");
    }




    editableDiv.addEventListener('input', function () {
      //  _this.changeEditableDiv()
    })


    this.canvasParant.appendChild(closeImg);

    return editableDiv.id;
  }

  deleteEditableDiv(_id: any) {
    // console.log('delete', _id);
    var deleteImage = document.getElementById(_id + "_close_btn");
    if (deleteImage)
      deleteImage.style.display = "none";
    var children = this.canvasParant.children;
    for (let i = 0; i < window.textPool.length; i++) {
      if (window.textPool[i].self_id == _id) {
        window.textPool.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < children.length; i++) {
      if (children[i].id == _id) {
        children[i].style.display = "none";
        break;
      }
    }
  }

  initTextItems() {
    window.textPool = [];
    for (let i = 0; i < this.textItems.length; i++) {
      var { type, content, id } = this.textItems[i];
      if (type == "text") {
        var text = JSON.parse(content);
        text.id = id + "";
        // console.log(text);
        var result = this.createEditableDiv(text);
        // console.log(result);
      }

    }
  }

  //改变值
  changeEditableDiv() {

    if (this.currentSelectEditableDiv) {
      for (let i = 0; i < window.textPool.length; i++) {
        if (window.textPool[i].self_id == this.currentSelectEditableDiv.id) {
          // console.log("change text!!!!" + this.currentSelectEditableDiv.innerText);
          window.textPool[i].left = parseInt(this.currentSelectEditableDiv.style.left);
          window.textPool[i].top = parseInt(this.currentSelectEditableDiv.style.top);
          window.textPool[i].color = this.currentSelectEditableDiv.style.color;
          window.textPool[i].fontFamily = this.currentSelectEditableDiv.style.fontFamily;
          window.textPool[i].innerText = this.currentSelectEditableDiv.innerText;
          window.textPool[i].fontSize = this.lineWidth;
          break;
        }
      }
    }

  }

  getLineHeight() {
    // console.log(Math.max(18, this.lineWidth) + "px")
    return Math.max(18, this.lineWidth) + "px";
  }
  drawBegin(e: any) {
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty();
    this.cxt.strokeStyle = this.strokeColor;
    // // console.log(this.cxt.lineWidth)
    this.pointer.beginX = e.layerX - this.stage_info.left
    this.pointer.beginY = e.layerY - this.stage_info.top
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
    if (this.currentSelectEditableDiv) {
      this.currentSelectEditableDiv.style.fontFamily = this.fontFamily;
      this.changeEditableDiv();
    }
  }

  drawText() {

    this.createEditableDiv(null);
  }

  drawing(e: any) {
    if (!this.isDrawing) {
      this.addHistory()
    }
    this.isMouseMoved = true;
    this.isDrawing = true
    this.pointer.endX = e.layerX - this.stage_info.left
    this.pointer.endY = e.layerY - this.stage_info.top
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
    // // console.log('====== addHistory')
    const base64Url = this.canvas.toDataURL("image/png");
    window.canvasPool.push(base64Url);
    //保存当前text的
  }

  drawEnd() {
    // console.log('========= drawEnd', this.canTextarea);
    this.canvas.onmousemove = null;
    if (this.currentSelectEditableDiv) {
      this.currentSelectEditableDiv.setAttribute("contenteditable", "false");
    }

    //检查鼠标是否有移动，如果有移动说明绘制过了，则进行添加操作，否则不要添加
    if (this.drawType != "polygon" && this.drawType != 'text') {
      if (!this.isMouseMoved) {
        return;
      }
    }

    if (this.drawType == 'text') {
      var list = this.copyWindowTextPool();
      var tmp = window.textOptsPool[this.currentIndex];
      console.log(list, tmp);
      var diff = false;
      if (list.length == tmp.length) {
        for (let i = 0; i < list.length; i++) {
          if (tmp[i].innerText != list[i].innerText) {
            diff = true;
          }
        }
      } else {
        diff = true;
      }
      console.log(diff);
      if (!diff) {
        return;
      }
    }



    const base64Url = this.canvas.toDataURL("image/png");
    this.drawTextOnCanvas();
    const imageUrl = this.canvasText.toDataURL("image/png");

    this.callBackData(base64Url, imageUrl);



    window.drawPool.splice(++this.currentIndex, 0, base64Url);
    window.textOptsPool.splice(this.currentIndex, 0, this.copyWindowTextPool());
  }

  clearCanvas() {
    // btn.onclick = () => {
    //     this.cxt.clearRect(0, 0, 500, 500)
    //     // ws.send('clear')
    // }
    this.addHistory();
    this.cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.cxtText.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.hindChildren();
    window.textPool = [];


    this.drawEnd();
    this.polygonStartPoint.beginY = -1;
    this.polygonStartPoint.beginX = -1;
  }

  hindChildren() {
    var e = this.canvasParant.childNodes;
    for (let i = 0; i < e.length; i++) {
      if (e[i].id.indexOf('editable_div') > -1) {
        e[i].style.display = "none";
      }
    }
  }

  drawTextOnCanvas() {
    this.cxtText.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let i = 0; i < window.textPool.length; i++) {
      var item = window.textPool[i];
      var pointer = {
        x: item.left,
        y: item.top
      }
      if (item.innerText && item.innerText.length > 0) {
        const text = new Text(pointer, item.innerText, item.fontSize, item.color, item.fontFamily);
        text.draw(this.cxtText);
      }
    }

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
    // console.log(window.textOptsPool, window.drawPool.length, this.currentIndex, "---");
    if (this.currentIndex <= 0) {
    } else {
      const current = window.drawPool[--this.currentIndex] || ''
      this.initByBase64(current);


      this.resetTextChildren();
      this.drawTextOnCanvas();


      const imageUrl = this.canvasText.toDataURL("image/png");


      this.callBackData(current, imageUrl);
    }
  }
  redo() {
    // console.log(window.textOptsPool, window.drawPool.length, this.currentIndex, "+++");
    if (this.currentIndex == window.drawPool.length - 1) {
    } else {
      const current = window.drawPool[++this.currentIndex] || ''


      this.initByBase64(current);

      this.resetTextChildren();
      this.drawTextOnCanvas();
      const imageUrl = this.canvasText.toDataURL("image/png");


      this.callBackData(current, imageUrl);
    }
  }

  resetTextChildren() {
    //第一步把所有的text 都隐藏掉
    var e = this.canvasParant.childNodes;
    for (let i = 0; i < e.length; i++) {
      if ((e[i].id.indexOf('editable_div') > -1)) {
        e[i].style.display = 'none';
      }
    }
    window.textPool = [];

    //第二步，取出存储的text item
    var textContent = window.textOptsPool[this.currentIndex];
    // // console.log(textContent, "resetTextChildren")
    for (let i = 0; i < textContent.length; i++) {
      var copyItem = new DrawTextItem(textContent[i].page_id, textContent[i].self_id, textContent[i].left, textContent[i].top, textContent[i].fontSize, textContent[i].fontFamily,
        textContent[i].innerText, textContent[i].color);
      copyItem.id = textContent[i].id;
      window.textPool.push(copyItem);
      for (let j = 0; j < e.length; j++) {
        if (e[j].id == textContent[i].self_id) {
          var editableDiv = e[j];
          e[j].style.display = "block";
          editableDiv.style.left = `${copyItem.left}px`;
          editableDiv.style.top = `${copyItem.top}px`;
          editableDiv.style.fontFamily = copyItem.fontFamily;
          editableDiv.style.background = "#00000000";
          editableDiv.style.border = "2px solid #00000000";
          editableDiv.style.color = copyItem.color;
          editableDiv.style.fontSize = Math.max(18, copyItem.fontSize) + "px";
          editableDiv.style.lineHeight = Math.max(18, copyItem.fontSize) + "px";
          editableDiv.style.minHeight = Math.max(18, copyItem.fontSize) + "px";
          editableDiv.innerText = copyItem.innerText;
          break;
        }
      }
    }
    // // console.log(window.textPool, "resetTextChildren")

  }

  callBackData(str: string, text: string) {
    this.onDrawBack(str, text);
    this.saveImageData()
  }
  callBackDrawText(str: DrawTextItem) {
    this.onDrawTextBack(str);
    // console.log(str, 'send msg ======>>>');
  }



  addElementTextItem(content: DrawTextItem) {
    addElementItem(this.sildeId, this.page_id, "text", JSON.stringify(content)).then((res: number) => {
      content.id = res;
      //更新相关item的id
      for (let i = 0; i < window.textOptsPool.length; i++) {
        var list = window.textOptsPool[i];
        for (let j = 0; j < list.length; j++) {
          if (list[j].self_id == content.self_id) {
            list[j].id = res;
          }
        }
      }
      this.updateElementTextItem(content);
    })
  }

  deleteElementTextItem(content: DrawTextItem) {

    // console.log(content, "deleteElementTextItem")
    if (!content.id || content.id < 0) {
      // console.log('not commit');
      return;
    }
    deleteElementItem(content.id).then((res: string) => {
      // console.log(res);
    })

  }

  updateElementTextItem(content: DrawTextItem) {


    // console.log(content, "updateElementTextItem");
    if (!content.id || content.id < 0) {
      if (content.innerText && content.innerText.length > 0) {
        this.addElementTextItem(content);
      }
      return;
    }

    if (!content.innerText || content.innerText.length < 1) {
      this.deleteElementTextItem(content);
      return;
    }

    updateElementItem(content.id, JSON.stringify(content), "text").then((res) => {
      // console.log(res);
    }).catch((res) => {
      // console.log("updata element error!" + res);
      this.addElementTextItem(content);
    })

  }

  //在用户关闭或者刷新页面时进行提交操作
  //这时候，window.textOptPool的第一个元素存储了所有的已经在服务器上的text 元素
  //windwo.textPool中存储的是当前的元素，我们需要做一个对比，该更新的更新，该新添的新添，该删除的删除

  commitTextItem() {
    // console.log('do net work commit');
    var initialTexts = window.textOptsPool[0];//最开始从服务器上拉取下来的
    var currentTexts = window.textPool;//当前页面上有的
    //1 判断是否需要删除
    if (initialTexts) {
      for (let i = 0; i < initialTexts.length; i++) {
        var item = initialTexts[i];
        var find = false;
        for (let j = 0; j < currentTexts.length; j++) {
          if (item.self_id == currentTexts[j].self_id) {
            find = true;
            break;
          }
        }
        //如果没有找到说明已经被删除了。
        if (!find) {
          this.deleteElementTextItem(item);
        }
      }
    }

    for (let i = 0; i < currentTexts.length; i++) {
      this.updateElementTextItem(currentTexts[i]);
    }

  }

}
