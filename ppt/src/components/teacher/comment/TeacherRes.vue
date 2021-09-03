<template>
  <div class="left-answer shadow" v-if="item.title">
    <div class="answerdetail">
      <div class="answer-media flex-center" v-if="item.title.indexOf('data:image/') > -1">
        <div class="inner-media" >
          <base64image :url="item.title" />
        </div>
      </div>
      <div class="answer-media flex-center" v-else-if="item.title.indexOf('.mp3') > -1">
        <div class="inner-media" >
          <audio-player :url="item.title"/>
        </div>
        <!-- <div class="transformmask"></div> -->
      </div>
      <div class="answer-media flex-center"  v-else-if="item.title.indexOf('.webm') > -1">
        <div class="inner-media">
          <video  preload="meta" controls="false" :src="item.title" style="width:100%;" />
        </div>
        <!-- <div class="transformmask"></div> -->
      </div>
      <div class="answer-text" v-else-if="item.title.indexOf('[') > -1">
        <div v-for="(text, index) in getAnswer(item.title)" :key="index">{{ text }}</div>
      </div>
      <div class="answer-text" v-else>
        {{item.title}}
      </div>
    </div>
    <div class="user">
      <div class="usericon">{{userData.sname.split("")[0]}}</div>
      <div class="info">
        <p class="uname">{{userData.sname}}</p>
        <p class="utime">{{getTimeText(item.answertime)}}</p>
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
import { getTimeValue } from '@/utils/help';
import base64image from "../../base64image.vue";
import AudioPlayer from '@/components/common/audioPlayer.vue';
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    userData: {
      type: Object,
      default: () => {}
    }
  },
  components: { base64image, AudioPlayer},
  methods: {
    getAnswer(answer) {
      // console.log(JSON.parse(answer));
      return JSON.parse(answer);
    },
    getTimeText(time) {
      if(time > 0) {
        const {
          year,
          month,
          date,
          minutes,
          hours,
          seconds
        } = getTimeValue(time*1000)
        return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`
      }
      return ''
    }
  }
};
</script>
<style scoped>
*{box-sizing: border-box;}
.shadow{
  box-shadow: 0px 1px 3px 3px rgb(0 0 0 / 16%);
  border-radius: 8px;
}
.left-answer {
  width: 402px;
  background-color: #fff;
  padding: 16px 21px 30px 16px;
  box-sizing: border-box;
  margin-bottom: 20px;
  /* border: 1px solid #999; */
}
.answer-media {
  width: 360px;
  height: 180px;
  border-radius: 10px;
  background-color: rgba(228,228,228, 0.3);
  position: relative;
  /* padding: 2px; */
}
.inner-media{
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
.answer-text{
  flex: 1;
  max-height: 180px;
  min-height: 50px;
  display: flex;
  box-sizing: border-box;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  overflow-y: scroll;
}
.user{
  width: 100%;
  height: 52px;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.usericon{
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: #15C39A;
  text-align: center;
  line-height: 52px;
  font-size: 28px;
  font-family: Inter-Bold;
  margin-right: 10px;
}
.info{
  height: 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.uname{
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15C39A;
  opacity: 1;
}
.utime{
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  opacity: 1;
}
.nocontrols::-webkit-media-controls{ 
  display:none !important;
}
video{
  width: 100%; height: 100%; object-fit: cover
}
</style>
