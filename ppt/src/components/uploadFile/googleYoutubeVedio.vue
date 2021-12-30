<template>
  <div class="page" id="app">
    <div class="open-google" @click="openYoutube">
      open youtube
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style="margin-left: 10px"
        width="14"
        height="14.001"
        viewBox="0 0 14 14.001"
        fill="#fff"
      >
        <path
          id="打开"
          d="M44.133,45.937H33.867A1.867,1.867,0,0,1,32,44.07V33.8a1.867,1.867,0,0,1,1.867-1.867h5.6V33.8H34.8a.933.933,0,0,0-.933.933v8.4a.933.933,0,0,0,.933.933h8.4a.933.933,0,0,0,.933-.933V38.47H46v5.6A1.867,1.867,0,0,1,44.133,45.937Zm.933-9.334a.933.933,0,0,1-.933-.933v-.546l-5.871,5.87a.933.933,0,1,1-1.323-1.316h0L42.813,33.8h-.546a.933.933,0,0,1,0-1.867h2.8a.933.933,0,0,1,.933.933v2.8A.933.933,0,0,1,45.067,36.6Z"
          transform="translate(-32 -31.936)"
        />
      </svg>
    </div>

    <div class="input-class">
      <el-input
        class="input"
        placeholder="input youtube video url"
        v-model="url"
        @input="onUrlInputed()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 26 26.001"
          style="margin-top: 10px"
          fill="#808191"
          slot="prefix"
        >
          <path
            id="lianjie_icon"
            d="M92.492,87.13A1.9,1.9,0,1,1,89.8,84.436l2.69-2.692a7.616,7.616,0,1,1,10.77,10.77l-2.692,2.692a1.9,1.9,0,1,1-2.694-2.692l2.694-2.692a3.808,3.808,0,1,0-5.386-5.386Zm0,10.768a1.9,1.9,0,0,1,2.692,2.694l-2.692,2.692a7.616,7.616,0,1,1-10.77-10.772l2.692-2.692a1.9,1.9,0,1,1,2.694,2.692l-2.694,2.694a3.808,3.808,0,0,0,5.386,5.386Zm4.038-9.424a1.9,1.9,0,0,1,0,2.694l-5.384,5.384a1.9,1.9,0,1,1-2.692-2.692l5.384-5.384a1.9,1.9,0,0,1,2.692,0Z"
            transform="translate(-79.491 -79.513)"
          />
        </svg>

        <!-- <template slot="prepend">https://</template> -->

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 26 26.001"
          fill="#15c39a"
          slot="suffix"
          :style="`margin-top: 10px; cursor: pointer; opacity: ${url ? 1 : 0.2}`"
          @click="refreshVideo"
        >
          <path
            id="刷新"
            d="M24.046,67.74l-4.351-5.392a1.127,1.127,0,0,0-1.8,0L13.558,67.74a.662.662,0,0,0,.45,1.05h1.65c0,3.151,0,7.19-5.7,10.486-.15.15,0,.3.15.3,10.638-1.65,11.538-8.837,11.538-10.785h1.8a.672.672,0,0,0,.6-1.05ZM10.407,69.09h-1.8c0-3.151,0-7.19,5.7-10.486.15-.15,0-.3-.15-.3C3.505,59.954,2.605,67.141,2.605,69.089H.82a.6.6,0,0,0-.45,1.05l4.336,5.392a1.127,1.127,0,0,0,1.8,0l4.351-5.392a.662.662,0,0,0-.45-1.05Zm0,0"
            transform="translate(-0.163 -58.304)"
          />
        </svg>
      </el-input>
    </div>

    <iframe
      v-if="videoUrl"
      id="yt-add-player"
      width="560"
      height="315"
      :src="videoUrl"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;allow-presentation"
      allowfullscreen
    ></iframe>
    <div style="width: 560px; height: 315px" v-else>
    </div>
    <!-- <el-button v-if="showVideo" class="btn" @click="insert">Insert Video</el-button> -->

    <div class="time--set">
      <div class="time">
        Starting time(s):
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 26 26.001"
          fill="#15c39a"
          style="margin-top: 5px; margin-left: 5px; cursor: pointer"
          @click="refreshStartTime()"
        >
          <path
            id="刷新"
            d="M24.046,67.74l-4.351-5.392a1.127,1.127,0,0,0-1.8,0L13.558,67.74a.662.662,0,0,0,.45,1.05h1.65c0,3.151,0,7.19-5.7,10.486-.15.15,0,.3.15.3,10.638-1.65,11.538-8.837,11.538-10.785h1.8a.672.672,0,0,0,.6-1.05ZM10.407,69.09h-1.8c0-3.151,0-7.19,5.7-10.486.15-.15,0-.3-.15-.3C3.505,59.954,2.605,67.141,2.605,69.089H.82a.6.6,0,0,0-.45,1.05l4.336,5.392a1.127,1.127,0,0,0,1.8,0l4.351-5.392a.662.662,0,0,0-.45-1.05Zm0,0"
            transform="translate(-0.163 -58.304)"
          />
        </svg>

        <div class="time-number-div">
          <el-input class="el-input--inner" v-model="startTime" @input="setStartTime"></el-input>

          <!-- <div class="time-btn-div">
                        <i class="el-icon-caret-top time-btn-flag" @click="numberUp(0)"></i>
                        <i class="el-icon-caret-bottom time-btn-flag" @click="numberDown(0)"></i>
          </div>-->
        </div>
        /{{ endTime }}seconds
      </div>

      <!-- <div class="time" style="margin-left: 80px;">
                End time(s):
                <div class="time-number-div">

                    <el-input class="el-input--inner" v-model="endTime" @input="setEndTime"></el-input>

                    <div class="time-btn-div">
                        <i class="el-icon-caret-top time-btn-flag" @click="numberUp(1)"></i>
                        <i class="el-icon-caret-bottom time-btn-flag" @click="numberDown(1)"></i>
                    </div>

                </div>
      </div>-->
    </div>

    <div class="btn" @click="insert">next</div>
  </div>
</template>



<!--        :youtubeurl="youtubeurl"
        :withKeyUrl="withKeyUrl"
        :starttime="starttime"
        :endtime="endtime"-->

<script>
export default {
  props: {
    nextYoutube: {
      type: Function
    }
    // url: {
    //   type: String,
    //   default: "",
    // },
    // videoUrl: {
    //   type: String,
    //   default: "",
    // },
    // startTime: {
    //   type: Number,
    //   default: 0,
    // },
    // endTime: {
    //   type: Number,
    //   default: 0,
    // },
  },
  data() {
    return {
      loading: false,
      showVideo: false,
      videoLength: 0,
      videoId: "",
      ytPlayer: null,
      timerDown: "",
      startTime: 0,
      endTime: 0,
      url: "",
      videoUrl: "",
      ytPalyer: null
    };
  },

  created() {},
  watch: {
    videoId() {
      var tag = document.createElement("script");
      tag.src = `https://www.youtube.com/iframe_api?v=${Math.random()}`;
      tag.id = 'youtube-script'
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        this.ytPalyer = new YT.Player("yt-add-player", {
          events: {
            onReady: this.onYTReady,
            onStateChange: this.onYTStateChange
          }
        });
        console.log(this.ytPalyer, "onYouTubeIframeAPIReady");
      };
      // this.ytPalyer = new YT.Player("yt-add-player", {
      //     events: {
      //       onReady: this.onYTReady,
      //       onStateChange: this.onYTStateChange
      //     }
      //   });
      //   console.log(this.ytPalyer, "onYouTubeIframeAPIReady");

    }
  },
  beforeDestroy() {
    // const youtubeScript = document.getElementById('youtube-script')
    // youtubeScript.parentNode.removeChild(youtubeScript);
    // window.onYouTubeIframeAPIReady = null
  },
  mounted() {
    console.log(this.videoId, "watch videoId");
    let _this = this;
  },
  methods: {
    onYTReady(event) {
        console.log(event);
        this.endTime = this.ytPalyer.getDuration();
    },
    onYTStateChange(event) {
        console.log(event, "onYTStateChange");
        if (event.data == 5 && this.setTimePaly) {
            this.ytPalyer.mute();
            this.ytPalyer.playVideo();
        }
        if (event.data == 1 && this.setTimePaly) {
            this.ytPalyer.pauseVideo();
            this.setTimePaly = false;
            this.ytPalyer.unMute();
        }
        let _this = this;
    },
    stopVideo() {
        this.ytPalyer.pauseVideo();
    },
    setStartTime() {
      this.ytPalyer.cueVideoByUrl(this.videoUrl, this.startTime);
      this.ytPalyer.mute();
      this.setTimePaly = true;
    },

    //显示提示
    slideAlert: function(msg, _type) {
      this.$message({
        message: msg,
        type: _type
      });
    },
    openYoutube() {
      window.open("https://www.youtube.com/");
    },
    onUrlInputed() {
      //    this.refreshVideo();
    },
    refreshVideo() {
      if(!this.url) return
      this.showVideo = true;
      //https://youtu.be/hCVHjyjh3WI   https://www.youtube.com/watch?v=hCVHjyjh3WI&t=2187s˝
      this.getTime(this.url.split("?v=")[1].split("&")[0]);
      let url = ''
      if (this.url.indexOf("https://youtu.be/") > -1) {
        let ss = this.url.split("/");
        this.videoId = this.url.split("?v=")[1].split("&")[0];
        url =
          "https://www.youtube.com/embed/" +
          this.url.split("?v=")[1].split("&")[0] +
          "?enablejsapi=1&rel=0";
        this.videoUrl = url + "&start=" + this.startTime;
      } else if (this.url.indexOf("https://www.youtube.com") > -1) {
        this.videoId = this.url.split("?v=")[1].split("&")[0];
        url =
          "https://www.youtube.com/embed/" +
          this.url.split("?v=")[1].split("&")[0] +
          "?enablejsapi=1&rel=0";
      }
      this.videoUrl = url + "&start=" + this.startTime;
      console.log(this.videoUrl);
    },
    refreshStartTime() {
      this.startTime = 0;
    },
    getTime() {
      let _this = this;
    },
    insert() {
      console.log(this.url);
      if (!this.url || this.url.indexOf("youtube") < 0) {
        return;
      }
      if (!this.videoUrl) {
        this.refreshVideo();
      }

      this.nextYoutube(this.videoUrl);
      this.url = "";
      this.startTime = 0;
      this.endTime = 0;
      this.videoUrl = "";
    }
  }
};
</script>

<style>
.el-input--inner {
  width: 100px;
}

.el-input__inner {
  border: 0px solid #15c39a;
  background-color: transparent !important;
}

.time-number-div {
  margin-left: 10px;
  display: flex;
  background-color: #efefef;
  border-radius: 2px;
  min-width: 60px;
  align-items: center;
  height: 35px;
}

.time-btn-div {
  display: flex;
  flex-direction: column;
}

.time--set {
  display: flex;
  height: 40px;
}

.time {
  color: #7e7e7e;
  font-size: 14px;
  font-family: Inter-Bold;
  display: flex;
  align-items: center;
}

.time-btn-flag {
  cursor: pointer;
  margin-right: 3px;
  margin-left: 3px;
}

.page {
  width: 99%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

iframe {
  border: 1px solid #15c39a;
}

.open_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  color: #15c39a;
  font-size: 18px;
  cursor: pointer;
}

.el-select .el-input {
  width: 100%;
}

.input-class {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
}

.open-google {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 14px;
  font-family: Inter-Bold;
  background-color: #15c39a;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
}

.input {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 80%;
  border: 1px solid #15c39a;
  border-radius: 6px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
}

iframe {
  margin-top: 20px;
  margin-bottom: 20px;
}

.btn {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 14px;
  font-family: Inter-Bold;
  background-color: #15c39a;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
}
</style>


