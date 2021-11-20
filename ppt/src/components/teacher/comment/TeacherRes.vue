<template>
  <div class="tfleft-answer tfshadow" v-if="item.title">
    <div class="tfanswerdetail">
      <div class="tfanswer-media flex-center" v-if="item.title.indexOf('data:image/') > -1">
        <div class="inner-media" >
          <base64image :url="item.title" />
        </div>
      </div>
      <div class="tfanswer-media flex-center" v-else-if="item.title.indexOf('.mp3') > -1">
        <div class="tfinner-media" >
          <audio-player :url="item.title"/>
        </div>
        <!-- <div class="transformmask"></div> -->
      </div>
      <div class="tfanswer-media flex-center"  v-else-if="item.title.indexOf('.webm') > -1">
        <div class="tfinner-media">
          <video  preload="meta" controls="false" :src="item.title" style="width:100%;" />
        </div>
        <!-- <div class="transformmask"></div> -->
      </div>
      <div class="tfanswer-text" v-else-if="item.title.indexOf('[') > -1">
        <div v-for="(text, index) in getAnswer(item.title)" :key="index">{{ text }}</div>
      </div>
      <div class="tfanswer-text" v-else>
        {{item.title}}
      </div>
    </div>
    <div class="tfuser">
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

</style>
