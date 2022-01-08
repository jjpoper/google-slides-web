<template>
  <div class="waiting-start">
    <div class="wait-title">
      <div class="wait-icon">
        <img  src="../../assets/picture/clock.png" />
      </div>
      <div class="wait-title-text">
        <img  src="../../assets/picture/wait_time.png" />
      </div>
    </div>
    <div class="wait-img">
      <img  src="../../assets/picture/wait.png" />
    </div>
    <div class="wait-seconds">
      <div class="wait-title-first"><img  src="../../assets/picture/please_wait.png" /></div>
      <div class="wait-title-mid">the session will start in </div>
      <div class="wait-seconds" v-if="displayTime"> ({{displayTime}})</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "waitingStart",
  props: {
    waitingStartSeconds: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      displayTime: ''
    }
  },
  watch: {
    waitingStartSeconds (v) {
      console.log('waitingStartSeconds change ' + v)
      if(this.waitingStartSeconds > 3600) {
        let hour = Math.floor(this.waitingStartSeconds / 3600);
        let minute = Math.floor((this.waitingStartSeconds - hour * 3600) / 60);
        let seconds = this.waitingStartSeconds - hour * 3600 - minute * 60;
        this.displayTime = `${hour}h ${minute}m ${seconds}s`;
      }else if(this.waitingStartSeconds > 60) {
        let minute = Math.floor(this.waitingStartSeconds / 60);
        let seconds = this.waitingStartSeconds - minute * 60;
        this.displayTime = `${minute}m ${seconds}s`;
      }else {
        this.displayTime = this.waitingStartSeconds + 's';
      }
    }
  },
  created() {
    console.log('waitingStart ' + this.waitingStartSeconds)
  },
}
</script>

<style scoped>
.waiting-start {
  background: #fff;
  border-radius: 5px;
  width: 100%;
  height: 500px;
  padding: 20px;
  text-align: center;
}

.wait-title {
  margin-top: 50px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  color: #070707;
  font-weight: bold;
  padding-bottom: 20px;
}

.wait-icon img {
  height: 30px;
}

.wait-title-text {
  padding-left: 15px;
}

.wait-title-text img {
  height: 30px;
}

.wait-img img {
  height: 300px;
}

.wait-seconds {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.wait-title-first img {
  height: 35px;
}

.wait-title-mid, .wait-seconds {
  font-size: 25px;
  padding-left: 10px;
  color: #070707;
  font-weight: bold;
  font-family: Trebuchet MS;
}

.wait-seconds {
  color: rgba(21, 195, 154, 1);
}

</style>
