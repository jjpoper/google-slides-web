<template>
  <div class="studentComment" :style="`height: ${webHeight}px;`">
    <div v-for="(item, index) in list" :key="item.id">
      <div class="rightcomment">
        <div
          class="section"
          :style="`background-color: ${selectedIndex === index ? '#a0e667' :'#fff'}`"
          :ref="selectedIndex === index ? 'activeRef': ''"
          :tabindex="selectedIndex === index ? '0' : ''"
          @click="selectMark(item, index)"
        >
          <p v-if="item.user_name">{{ item.user_name }}</p>
          <p>{{ getTimeStr(item.time) }}</p>
          <!-- <p>{{item.value}}</p> -->
          <VideoPlayer
            v-if="item.type === 'video'"
            controlslist="nodownload"
            controls=""
            :src="item.link"
            style="width:100%;"
            preload="auto"
          />
          <audio-player :url="item.link" v-else-if="item.type === 'audio'"/>
          <p v-else-if="item.type === 'text'">{{item.link}}</p>
          <i v-if="isStudent && item.id" class="el-icon-delete del-comment" @click.stop="del(item.id)"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import audioPlayer from './audioPlayer.vue';
export default {
  components: { audioPlayer },
  props: {
    list: {
      type: Array
    },
    selectedIndex: {
      type: Number
    },
    selectMark: {
      type: Function,
      default: () => null
    },
    del: {
      type: Function,
      default: () => null
    },
    isStudent: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'selectedIndex'() {
      // console.log('1====')
      if(this.selectedIndex > -1) {
        this.$nextTick(() => {
          if(this.$refs.activeRef) {
            this.$refs.activeRef[0].focus();
          }
        });
      }
    }
  },
  data() {
    return {
      webHeight: window.winHeight,
    };
  },
  methods: {
    getTimeStr(time) {
      var now = new Date();
      now.setTime(time * 1000);
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  },
}
</script>
<style scoped>
.studentComment{
  overflow-y: scroll;
}
.rightcomment {
  width: 100%;
  min-height: 30px;
  background-color: #fff;
  border: 1px solid #999;
  box-sizing: border-box;
  word-wrap: break-word;
  line-height: 20px;
}
.section {
  overflow: hidden;
  padding: 10px;
  position: relative;
}
.cl {
  position: absolute;
  top: 50%;
  width: 64px;
  height: 64px;
  right: 0;
  margin-top: -32px;
  cursor: pointer;
}
.del-comment{
  font-size: 15px; position: absolute; right: 5px; top: 5px;
  cursor: pointer;
}
</style>