<template>
  <div class="mediaenter">
    <el-dropdown>
      <div class="">
        <i class="media-enter-icon"></i>
        <strong class="el-dropdown-link"> Add Material </strong>
      </div>
      <el-dropdown-menu slot="dropdown" style="text-align: center">
        <el-tooltip content="Record Audio" placement="right">
          <div style="position: relative; cursor: pointer;">
            <div class="remark-button-outer">
              <img @click="audio" src="../../assets/picture/voice-button.png" class="remark-button" />
            </div>
          </div>
        </el-tooltip>
        <el-tooltip content="Record Video" placement="right">
          <div style="position: relative; cursor: pointer;">
            <div class="remark-button-outer">
              <img @click="video" src="../../assets/picture/video.png" class="remark-button" />
            </div>
          </div>
        </el-tooltip>
        <el-tooltip content="my computer" placement="right">
          <div style="position: relative; cursor: pointer;">
            <el-dropdown-item
              icon="el-icon-folder-add"
              style="font-size: 30px; text-align: center; margin-bottom: 5px; margin-left: 5px"
            />
            <common-upload accept="image/*,video/*,audio/*" :onSuccess="onSuccess"/>
          </div>
        </el-tooltip>
        <el-tooltip content="google drive" placement="right">
          <el-dropdown-item
            style="font-size: 30px; text-align: center; margin-bottom: 5px"
          >
            <svg
              @click="addDrive"
              t="1625364926290"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2091"
              width="32"
              height="32"
            >
              <path
                d="M678 629.8L350.8 64h322.4l327.2 565.8H678z m-275 47.2L241.8 960h621L1024 677H403zM308.2 134.8L0 677 161.2 960 474 417.6 308.2 134.8z"
                p-id="2092"
              ></path>
            </svg>
          </el-dropdown-item>
        </el-tooltip>
        <el-tooltip content="google image search" placement="right">
          <el-dropdown-item
            style="font-size: 30px; text-align: center; margin-bottom: 5px"
          >
            <svg
              @click="addGoogleImage"
              t="1625784979980"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2421"
              width="32"
              height="32"
            >
              <path
                d="M746.666667 597.333333a235.093333 235.093333 0 0 1-192 167.68 262.4 262.4 0 0 1-298.666667-232.533333A256 256 0 0 1 512 256a261.12 261.12 0 0 1 96.853333 18.773333 21.333333 21.333333 0 0 0 27.306667-8.96l61.44-113.066666a22.186667 22.186667 0 0 0-9.813333-29.866667A426.666667 426.666667 0 0 0 85.333333 524.373333 431.786667 431.786667 0 0 0 493.653333 938.666667 426.666667 426.666667 0 0 0 938.666667 534.186667v-85.333334a21.76 21.76 0 0 0-21.333334-21.333333h-384a21.333333 21.333333 0 0 0-21.333333 21.333333v128a21.333333 21.333333 0 0 0 21.333333 21.333334h213.333334"
                p-id="2422"
              ></path>
            </svg>
          </el-dropdown-item>
        </el-tooltip>
        <el-tooltip content="youtube" placement="right">
          <el-dropdown-item
            style="font-size: 30px; text-align: center; margin-bottom: 5px"
          >
            <svg
              @click="addyoutube"
              t="1625312338794"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2405"
              width="32"
              height="32"
            >
              <path
                d="M624.99264 710.848l0 120.576q0 38.272-22.272 38.272-13.152 0-25.728-12.576l0-172q12.576-12.576 25.728-12.576 22.272 0 22.272 38.272zM818.14464 711.424l0 26.272-51.424 0 0-26.272q0-38.848 25.728-38.848t25.728 38.848zM266.14464 586.848l61.152 0 0-53.728-178.272 0 0 53.728 60 0 0 325.152 57.152 0 0-325.152zM430.72064 912l50.848 0 0-282.272-50.848 0 0 216q-17.152 24-32.576 24-10.272 0-12-12-0.576-1.728-0.576-20l0-208-50.848 0 0 223.424q0 28 4.576 41.728 6.848 21.152 33.152 21.152 27.424 0 58.272-34.848l0 30.848zM675.87264 827.424l0-112.576q0-41.728-5.152-56.576-9.728-32-40.576-32-28.576 0-53.152 30.848l0-124-50.848 0 0 378.848 50.848 0 0-27.424q25.728 31.424 53.152 31.424 30.848 0 40.576-31.424 5.152-15.424 5.152-57.152zM868.99264 821.728l0-7.424-52 0q0 29.152-1.152 34.848-4 20.576-22.848 20.576-26.272 0-26.272-39.424l0-49.728 102.272 0 0-58.848q0-45.152-15.424-66.272-22.272-29.152-60.576-29.152-38.848 0-61.152 29.152-16 21.152-16 66.272l0 98.848q0 45.152 16.576 66.272 22.272 29.152 61.728 29.152 41.152 0 61.728-30.272 10.272-15.424 12-30.848 1.152-5.152 1.152-33.152zM521.56864 300l0-120q0-39.424-24.576-39.424t-24.576 39.424l0 120q0 40 24.576 40t24.576-40zM932.41664 729.152q0 133.728-14.848 200-8 33.728-33.152 56.576t-58.272 26.272q-105.152 12-317.152 12t-317.152-12q-33.152-3.424-58.56-26.272t-32.864-56.576q-14.848-64-14.848-200 0-133.728 14.848-200 8-33.728 33.152-56.576t58.848-26.848q104.576-11.424 316.576-11.424t317.152 11.424q33.152 4 58.56 26.848t32.864 56.576q14.848 64 14.848 200zM362.14464 0l58.272 0-69.152 228 0 154.848-57.152 0 0-154.848q-8-42.272-34.848-121.152-21.152-58.848-37.152-106.848l60.576 0 40.576 150.272zM573.56864 190.272l0 100q0 46.272-16 67.424-21.152 29.152-60.576 29.152-38.272 0-60-29.152-16-21.728-16-67.424l0-100q0-45.728 16-66.848 21.728-29.152 60-29.152 39.424 0 60.576 29.152 16 21.152 16 66.848zM764.99264 97.728l0 285.152-52 0 0-31.424q-30.272 35.424-58.848 35.424-26.272 0-33.728-21.152-4.576-13.728-4.576-42.848l0-225.152 52 0 0 209.728q0 18.848 0.576 20 1.728 12.576 12 12.576 15.424 0 32.576-24.576l0-217.728 52 0z"
                p-id="2406"
              ></path>
            </svg>
          </el-dropdown-item>
        </el-tooltip>
        <!-- <el-tooltip content="website" placement="right">
          <el-dropdown-item
            style="font-size: 30px; text-align: center; margin-bottom: 5px"
          >
            <img @click="addwebsite"  src="../../assets/picture/websiteicon.png" style="width: 32px; height: 32px"/>
          </el-dropdown-item>
        </el-tooltip> -->
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="youtube"
      :visible.sync="showYoutube"
      @close="closeYoutubeDialog"
      :append-to-body="true"
      :destroy-on-close="false"
      width="85%"
    >
      <google-youtube-vedio
        ref="googleyoutubevideo"
        style="
          width: 100%;
          height: 600px;
          overflow: auto;
          background-color: #fff;
        "
        :nextYoutube="nextYoutube"
      />
    </el-dialog>
    <el-dialog
      title="website"
      :visible.sync="showWebSite"
      :append-to-body="true"
    >
      <metarial-web-site
        style="
          width: 100%;
          height: 300px;
          overflow: auto;
          background-color: #fff;
        "
        :nextWebSite="nextWebSite"
      />
    </el-dialog>
    <el-dialog
      title="Google image search"
      :visible.sync="showImageSearch"
      @close="closeImageSearch"
      width="70%"
      :append-to-body="true"
      :destroy-on-close="distroyOnClose"
    >
      <google-image-search
        style="width: 100%; height: 600px; overflow: auto"
        :doneSelect="doneSelect"
      />
    </el-dialog>
    <div style="position: absolute">
      <record-video
        v-if="recordType === ModalEventsTypeEnum.VIDEO"
        :onSend="onSendVideo"
        :cancel="cancelRecord"
      />
      <record-audio
        v-else-if="recordType === ModalEventsTypeEnum.AUDIO"
        :onSend="onSendAudio"
        :cancel="cancelRecord"
        :autoDone="true"
      />
      <common-progress :progress="driveUpLoadProgress" :cancel="cancelUpDrive"/>
    </div>
  </div>
</template>
<script>
import { ModalEventsNameEnum, ModalEventsTypeEnum } from "@/socket/socketEvents";
import GooglePicker from "@/utils/googlePicker";
import { hideLoading, showLoading, showToast } from "@/utils/loading";
import { upLoadImageToFireBaseByUrl } from "@/model";
import googleImageSearch from "./googleImageSearch.vue";
import GoogleYoutubeVedio from "./googleYoutubeVedio.vue";
import {videoTypes, audioTypes} from '@/utils/constants'
import MetarialWebSite from './metarialWebSite.vue';
import CommonUpload from '../common/commonUpload.vue';
import RecordAudio from '../common/recordAudio.vue';
import RecordVideo from '../common/recordVideo.vue';
import CommonProgress from '../common/commonProgress.vue';
export default {
  components: {
    googleImageSearch,
    GoogleYoutubeVedio,
    MetarialWebSite,
    CommonUpload,
    RecordAudio,
    RecordVideo,
    CommonProgress
  },
  data() {
    return {
      fileList: [],
      showYoutube: false,
      youtubeurl: "",
      withKeyUrl: "",
      showIframe: false,
      showImageSearch: false,
      imagesList: [],
      imageName: "",
      imageSelectedIndex: -1,
      distroyOnClose: true,
      showWebSite: false,
      recordType: null,
      ModalEventsTypeEnum,
      driveUpLoadProgress: 0
    };
  },
  mounted() {},
  methods: {
    onSuccess(file, result) {
      console.log(file.name);
      const nameList = file.type.split('/')
      const fileNameList = file.name.split(".")
      let name = ''
      try {
        name = fileNameList[fileNameList.length - 1] || nameList[1]
      } catch(e) {}
      // if (!name) {
      //   showToast('upload error')
      //   return false
      // }
      name = name.toLocaleLowerCase();
      let type = "image";
      if (videoTypes.indexOf(name) > -1) {
        type = "video";
      } else if(audioTypes.indexOf(name) > -1) {
        type = 'audio'
      }

      EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
        type,
        url: result,
      });
    },
    addyoutube() {
      this.showYoutube = true;
    },
    addwebsite() {
      this.showWebSite = true
    },
    openYoutube() {
      window.open("https://www.youtube.com");
    },
    youtubePreview() {
      if (this.youtubeurl) {
        this.showIframe = false;
        this.$nextTick(() => {
          const tvid = this.youtubeurl.split("?v=")[1].split("&")[0];
          this.withKeyUrl = "https://www.youtube.com/embed/" + tvid;
          this.showIframe = true;
        });
      }
    },
    nextYoutube(videoUrl) {
      console.log(this.withKeyUrl);
      // if (this.withKeyUrl) {
      //   const url = `${this.withKeyUrl}?start=${this.starttime}`;
      //   EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
      //     type: "iframe",
      //     url: this.endtime > 0 ? `${url}&end=${this.endtime}` : url,
      //   });
      //   this.showYoutube = false;
      // }
      if (videoUrl) {
        EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
          type: "iframe",
          url: videoUrl,
        });
        this.showYoutube = false;
      }
    },
    nextWebSite(url) {
      if(url) {
        EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
          type: "website",
          url,
        });
        this.showWebSite = false;
      }
    },
    closeYoutubeDialog() {
      this.youtubeurl = null;
      this.withKeyUrl = null;
      this.showIframe = false;
      this.$refs.googleyoutubevideo.closeYoutubeVideo()
    },
    addDrive() {
      GooglePicker.init((driveUpLoadProgress) => {
        hideLoading();
        this.driveUpLoadProgress = driveUpLoadProgress
      },(type, url, mediaType) => {
        if (url) {
          console.log('===done', url, mediaType)
          EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
            type: mediaType.indexOf('image') > -1 ? "image" : 'video',
            url: url,
          });
          hideLoading();
        }
        this.$nextTick(() => {
          this.driveUpLoadProgress = 0
        })
      });
    },
    cancelUpDrive() {
      GooglePicker.cancelUpDrive()
      this.driveUpLoadProgress = 0
      console.log('onProgressUpLoad')
    },
    searchImage() {
      if (this.imageName) {
        this.load();
      }
    },
    load() {
      showLoading();
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=AIzaSyBwZ7igOKSCZ8nitWRvR_oZIO198pBs7jQ&cx=f0726c917433f216e&q=${this.imageName}&fileType=png,jpg&searchType=image&alt=json`,
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      )
        .then((response) => {
          // // console.log(d)
          return response.json();
        })
        .then((d) => {
          hideLoading();
          // console.log(d.items)
          if (d.items.length > 0) {
            this.imagesList = d.items;
          }
        })
        .catch(() => {
          hideLoading();
          showToast("search failed", "error");
        });
    },
    selectImage(index) {
      this.imageSelectedIndex = index;
    },
    doneSelect(imageUrl) {
      showLoading();
      // const item = this.imagesList[this.imageSelectedIndex];

      upLoadImageToFireBaseByUrl(imageUrl).then((url) => {
        hideLoading();
        this.closeImageSearch();
        // console.log(url)
        EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
          type: "image",
          url,
        });
      }).catch(() => {
        hideLoading();
        this.closeImageSearch();
        showToast('upload error, please try later', 'error')
      })
    },
    closeImageSearch() {
      this.imageSelectedIndex = -1;
      this.showImageSearch = false;
      this.imagesList = [];
      this.imageName = "";
    },
    addGoogleImage() {
      this.showImageSearch = true;
    },
    audio() {
      this.recordType = ModalEventsTypeEnum.AUDIO;
    },
    video() {
      this.recordType = ModalEventsTypeEnum.VIDEO;
    },
    cancelRecord() {
      this.recordType = null
    },
    onSendAudio(url) {
      console.log(url)
      EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
        type: "audio",
        url,
      });
      this.recordType = null
    },
    onSendVideo(url) {
      EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
        type: "video",
        url,
      });
      this.recordType = null
    },
  },
};
</script>
<style scoped>
.mediaenter {
  color: #36425a;
  margin-left: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}
.media-enter-icon {
  width: 24.64px;
  height: 22.12px;
  background-size: 24.64px 22.12px;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-image: url(../../assets/picture/media-add.png);
  display: block;
  position: relative;
  margin: 0 auto;
}
.youtubecontaier {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.youtubecontaier > button,
.youtubecontaier > div {
  margin-bottom: 10px;
}
.iframeyoutube {
  width: 400px;
  height: 300px;
}
.showImageSearchcontaier {
  height: 437px;
}
.infinite-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 350px;
  margin-top: 10px;
}
.infinite-list .infinite-list-item {
  list-style: none;
  width: 150px;
  height: 150px;
  padding: 10px;
  box-sizing: border-box;
}
.imageSelected {
  background-color: #4285f4;
}
.innerImage {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.time {
  display: flex;
  flex-direction: row;
  width: 200px;
  align-items: center;
}
.remark-button{
  width: 32px;
  height: 32px;
}
</style>