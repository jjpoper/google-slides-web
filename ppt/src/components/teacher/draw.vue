<template>
  <div class="drawlist">
    <template v-for="item in imgUrls">
      <div :key="item.user_id">
        <p class="uname" v-if="data.flag">{{item.user_name}}</p>
        <div id="canvasouter" >
          <img :src="item.content" :style="`width: ${width}px; height: ${height}px; background-image:url(${url})`"/>
        </div>
      </div> 
    </template>
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
        imgUrls: [],
        width: 0,
        height: 0
      }
    },
    mounted() {
      this.imgUrls = getCurrentPageAnswerList(this.data.page_id, this.data.items[0].type)
      EventBus.$on('draw', (data)=>{
        // 通知展示当前pageid，当前itemid的评论框
        this.draw(data)
      })
      // let outer = document.getElementById('canvasouter')
      this.width = document.documentElement.clientWidth - 40;
      this.height = document.documentElement.clientHeight - 40 ;
    },
    methods: {
      draw({user_id, content, user_name}) {
        // console.log(data)
        // const cxt = this.cxt
        const index = this.imgUrls.findIndex((item) => item.user_id === user_id)
        if(index > -1) {
          this.imgUrls[index].content = content
        } else {
          this.imgUrls.unshift({user_id, content, user_name})
        }
      }
    }
}
</script>

<style >
    .drawlist{
      width: 100%;
      position: relative;
      margin: 20px;
    }
    #canvasouter {
        cursor: default;
        width: 450px;
        height: 450px;
        position: relative;
        background: pink;
        margin: 10px auto;
    }
    .uname{
      line-height: 20px;
      text-align: center;
    }
    #canvasouter>img {
      width: 100%;
      height: 100%;
    }
    #canvas{
      background-color: blue;
    }
</style>