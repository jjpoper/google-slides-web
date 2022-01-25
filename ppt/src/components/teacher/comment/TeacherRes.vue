<template>
  <div class="tfleft-answer tfshadow" v-if="item.title">
    
    <div class="tfanswerdetail" v-if="checkType(item.title) === 'string'">
      <div class="tfanswer-media flex-center" v-if="item.title.indexOf('data:image/') > -1">
        <div class="tfinner-media" >
          <base64image :url="item.title" />
        </div>
      </div>
      <div class="tfanswer-media flex-center" v-else-if="item.title.indexOf('.mp3') > -1">
        <div class="tfinner-media" >
          <audio-player :url="item.title"/>
        </div>
      </div>
      <div class="tfanswer-media flex-center"  v-else-if="item.title.indexOf('.webm') > -1">
        <div class="tfinner-media">
          <VideoPlayer  preload="meta" controls="false" :src="item.title" style="width:100%;" />
        </div>
      </div>
      <div class="tfanswer-text" v-else-if="item.title.indexOf('[') > -1">
        <div v-for="(text, index) in getAnswer(item.title)" :key="index">{{ text }}</div>
      </div>
      <div class="tfanswer-text" v-else>
        {{item.title}}
      </div>
    </div>
    <div v-else>
      <dash-right-remark-item :item='{content: item.title}' />
    </div>
    <div class="tfuser" v-if="userData">
      <div class="tfusericon">{{userData.sname.split("")[0]}}</div>
      <div class="tfinfo">
        <p class="tfuname">{{userData.sname}}</p>
        <p class="tfutime">{{getTimeText(item.answertime)}}</p>
      </div>
    </div>
    <slot />
  </div>
</template>
<script>
import { getTimeValue } from '@/utils/help';
import base64image from "../../base64image.vue";
import AudioPlayer from '@/components/common/audioPlayer.vue';
import DashRightRemarkItem from '../dash-answer/dash-right-media-item.vue';
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
  created() {
    console.log(this.item.title)
  },
  components: { base64image, AudioPlayer, DashRightRemarkItem},
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
    },
    checkType(title) {
      return (typeof (title)).toLocaleLowerCase()
    }
  }
};
</script>
<style scoped>
*{box-sizing: border-box;}

</style>
