<template>
  <div id="canvasouter" >
    <img :src="imgUrl" v-if="imgUrl"/>
  </div>
</template>

<script>

export default {
    props: {
      sendCanvas: {type: Function }
    },
    data() {
      return {
        imgUrl: ''
      }
    },
    mounted() {
      EventBus.$on('draw', (data)=>{
        // 通知展示当前pageid，当前itemid的评论框
        this.draw(data)
      })
    },
    methods: {
      draw(base64Url) {
        // console.log(data)
        // const cxt = this.cxt
        this.imgUrl = base64Url

        // let myCanvas = document.getElementById("canvas");
        // const img = new Image();
        //   img.src=base64Url;

        // myCanvas.getContext('2d').drawImage(img,0,0);
      }
    }
}
</script>

<style >
    #canvasouter {
        cursor: default;
        width: 60%;
        height: 450px;
        position: relative;
        background: pink;
        margin: 0 auto;
    }
    #canvasouter>img {
      width: 100%;
      height: 100%;
    }
    #canvas{
      background-color: blue;
    }
</style>