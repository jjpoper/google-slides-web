<template>
  <div>
    <div id="canvasouter" v-for="item in imgUrls" :key="item.user_id">
      <img :src="item.content" />
    </div>
  </div>  
</template>

<script>
import { getCurrentPageAnswerList } from '@/model/store.teacher'

export default {
    props: {
      sendCanvas: {type: Function },
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        imgUrls: []
      }
    },
    mounted() {
      this.imgUrls = getCurrentPageAnswerList(this.data.page_id, this.data.items[0].type)
      EventBus.$on('draw', (data)=>{
        // 通知展示当前pageid，当前itemid的评论框
        this.draw(data)
      })
    },
    methods: {
      draw({user_id, content}) {
        // console.log(data)
        // const cxt = this.cxt
        const index = this.imgUrls.findIndex((item) => item.user_id === user_id)
        if(index > -1) {
          this.imgUrls[index].content = content
        } else {
          this.imgUrls.push({user_id, content})
        }

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