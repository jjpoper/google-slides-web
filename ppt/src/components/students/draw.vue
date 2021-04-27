<template>
    <div id="canvasouter" >
      <canvas id="canvas" width="400" height="400" ></canvas>
      <div class="canvasfooter">
        <div class="red-pencial" @click="changeColor('red')"></div>
        <div class="blue-pencial"  @click="changeColor('blue')"></div>
        <div class="eraser" @click="earse">
          <i class="el-icon-circle-close" style="font-size: 30px"></i>
        </div>
      </div>
    </div>
</template>

<script>
import { getStudentCurrentPageAnswerList } from '@/model/store.student'
'use strict'

class Draw {
    constructor(el) {
      console.log(el)
        this.el = el
        this.strokeColor = '#000'
        this.lineWidth = 2
        this.canvas = document.getElementById(this.el)
        this.cxt = this.canvas.getContext('2d')
        console.log(canvas.getBoundingClientRect())
        this.stage_info = canvas.getBoundingClientRect()
        // this.stage_info = {
        //   left: 0,
        //   top: 0
        // }
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        }

        // console.log(this.stage_info.left, this.stage_info.top)
    }

    throttle(fn, wait){
        var pre = Date.now();
        return function(){
            var context = this;
            var args = arguments;
            var now = Date.now();
            if( now - pre >= wait){
                fn.apply(context,args);
                pre = Date.now();
            }
        }
    }

    init(ws, btn, outerWitdh, sendCanvas, initData) {
        // this.canvas.width = outerWitdh
        this.sendCanvas = sendCanvas
        this.canvas.onmousedown = () => {
          this.drawBegin(event)
        }
        this.canvas.onmouseup = () => {
            console.log('========= 1')
            this.drawEnd()
            // ws.send('stop')
        }
        document.onmouseup = () => {
            console.log('========= 2')
            // this.drawEnd()
            // ws.send('stop')
        }
        this.clearCanvas(ws, btn)

        // 绘制缓存数据
        if(initData && initData[0] && initData[0].content) {
          const img = new Image();
          img.src = initData[0].content;
          img.onload = () => {
            this.cxt.drawImage(img, 0, 0);
          }
        }
    }

    changeColor(color) {
      this.strokeColor = color
      this.lineWidth = 2
    }

    drawBegin(e, ws) {
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
        this.cxt.strokeStyle = this.strokeColor
        console.log(this.cxt.lineWidth)

        this.cxt.beginPath()
        this.cxt.moveTo(
            e.clientX - this.stage_info.left,
            e.clientY - this.stage_info.top
        )

        // this.path.beginX = e.clientX - this.stage_info.left
        // this.path.beginY = e.clientY - this.stage_info.top
        // console.log(this.path.beginX, this.path.beginY)
        console.log('drawBegin')
        document.onmousemove = this.throttle(() => {
          // console.log('onmousemove')
          this.drawing(event)
        }, 5)
        // document.onmouseup = this.drawEnd

        // this.canvas.onmousemove = () => {
        //     console.log('onmousemove')
        // }


        this.canvas.onmouseout = () => {
            setTimeout(() => {
              console.log('========= 1')
              this.drawEnd()
            }, 100)
            // ws.send('stop')
        }
    }
    drawing(e) {
        this.cxt.lineTo(
            e.clientX - this.stage_info.left,
            e.clientY - this.stage_info.top
        )
        // console.log(e.clientX, e.clientY)

        // this.path.endX = e.clientX - this.stage_info.left
        // this.path.endY = e.clientY - this.stage_info.top

        
        // ws.send(this.path.beginX + '.' + this.path.beginY + '.' + this.path.endX + '.' + this.path.endY)
        // console.log(this.path.beginX , '====', this.path.beginY ,'====', this.path.endX ,'====', this.path.endY)

        this.cxt.lineWidth = this.lineWidth
        this.cxt.stroke()
    }
    drawEnd() {
      // console.log('========= 2')
        document.onmousemove = null
        // console.log();
        const base64Url = this.canvas.toDataURL('image/png')
        this.sendCanvas(base64Url)
        // this.canvas.onmousemove = null
    }
    clearCanvas(ws, btn) {
        // btn.onclick = () => {
        //     this.cxt.clearRect(0, 0, 500, 500)
        //     // ws.send('clear')
        // }
    }
    earse() {
        this.strokeColor = 'pink'
        this.lineWidth = 20
    }
}

export default {
    props: {
      sendCanvas: {type: Function },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    data() {
      return {
        draw: null
      }
    },
    mounted() {
      let outer = document.getElementById('canvasouter')
      let outerWitdh = outer.clientWidth
      this.draw = new Draw('canvas')

      const initData = getStudentCurrentPageAnswerList(this.data.page_id, this.data.items[0].type)

      this.$nextTick(() => {
        this.draw.init(()=> null, 1, outerWitdh, this.sendCanvas, initData)
      })

    },
    methods: {
      changeColor(color) {
        this.draw.changeColor(color)
      },
      earse() {
        this.draw.earse()
      },
    }
}
</script>

<style >
    #canvasouter {
        cursor: default;
        width: 100%;
        height: 500px;
        position: relative;
    }
    #canvas{
      /* position: absolute; */
      background: pink;
      /* left: 0;
      top:0 */
    }
    .canvasfooter{
      width: 100%;
      height: 100px;
      line-height: 50px;
      position: absolute;
      top: 400px;
      left: 0;
      display: flex;
      justify-content: center;
    }
    .canvasfooter >div{
      width: 30px;
      height: 30px;
      border-radius: 15px;
      margin: 30px;
      cursor: pointer;
      line-height: 30px;
    }
    .red-pencial{
      background-color: red;
    }
    .blue-pencial{
      background-color: blue;
    }
    .eraser{
      
    }
    #keyword-box {
        margin: 10px 0;
    }
</style>