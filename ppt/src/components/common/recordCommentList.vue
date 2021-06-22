<template>
  <div class="studentComment" :style="`height: ${webHeight}px;`">
    <div v-for="(item, index) in list" :key="index.toString()">
      <div class="rightcomment">
        <div
          class="section"
          :style="`background-color: ${selectedIndex === index ? '#a0e667' :'#fff'}`"
          :ref="selectedIndex === index ? 'activeRef': ''"
          :tabindex="selectedIndex === index ? '0' : ''"
        >
          <p v-if="item.user_name">{{ item.user_name }}</p>
          <p>{{ getTimeStr(item.time) }}</p>
          <!-- <p>{{item.value}}</p> -->
          <video
            v-if="item.type === 'video'"
            controlslist="nodownload"
            controls=""
            :src="item.link"
            style="width:100%;"
          />
          <audio
            v-else-if="item.type === 'audio'"
            controlslist="nodownload"
            controls=""
            :src="item.link"
            style="width:100%;"
          />
          <p v-else-if="item.type === 'text'">{{item.link}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array
    },
    selectedIndex: {
      type: Number
    }
  },
  watch: {
    'selectedIndex'() {
      console.log('1====')
      this.$nextTick(() => {
        this.$refs.activeRef[0].focus();
      });
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
</style>