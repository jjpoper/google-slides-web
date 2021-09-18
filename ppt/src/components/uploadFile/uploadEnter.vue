<template>
  <div class="mediaenter">
    <el-dropdown>
      <div class="">
        <i class="media-enter-icon"></i>
        <strong class="el-dropdown-link"> Add Media </strong>
      </div>
      <el-dropdown-menu slot="dropdown" style="text-align: center">
        <el-tooltip content="my computer" placement="right">
          <el-upload
            class="upload-demo"
            action="https://dev.api.newzealand.actself.me/file/upload"
            :on-success="onSuccess"
            :show-file-list="false"
            accept="image/png, image/jpeg, image/webp, image/gif, video/mp4,"
            list-type="picture"
          >
            <el-dropdown-item
              icon="el-icon-folder-add"
              style="font-size: 30px; text-align: center; margin-bottom: 5px"
            />
          </el-upload>
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
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="youtube"
      :visible.sync="showYoutube"
      @close="closeYoutubeDialog"
      append-to-body="true"
      :destroy-on-close="distroyOnClose"
    >
      <google-youtube-vedio
        style="
          width: 100%;
          height: 600px;
          overflow: auto;
          background-color: #fff;
        "
        :nextYoutube="nextYoutube"
      />
      <!-- :url="youtubeurl":
        :videoUrl="withKeyUrl"
        :startTime="starttime"
        :endTime="endtime" -->
      <!-- <div class="youtubecontaier">
        <el-button type="primary" @click="openYoutube">open youtube</el-button>
        <el-input
          v-model="youtubeurl"
          placeholder="https://... Paste a youtube url here"
        >
          <el-button
            slot="append"
            icon="el-icon-refresh"
            style="color: green"
            @click="youtubePreview"
          ></el-button>
        </el-input>
        <div v-if="showIframe" class="iframeyoutube">
          <iframe
            width="400"
            height="300"
            :src="withKeyUrl"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div class="time">
          <el-input v-model="starttime" placeholder="start" type="number" />
          <el-input
            v-model="endtime"
            placeholder="end"
            type="number"
            style="margin-left: 10px"
          />
        </div>
        <el-button type="primary" @click="nextYoutube">next</el-button>
      </div> -->

      <!-- :append-to-body="true" -->
    </el-dialog>
    <el-dialog
      title="Google image search"
      :visible.sync="showImageSearch"
      @close="closeImageSearch"
      width="70%"
      append-to-body="true"
      :destroy-on-close="distroyOnClose"
    >
      <google-image-search
        style="width: 100%; height: 600px; overflow: auto"
        :doneSelect="doneSelect"
      />
      <!-- <div class="showImageSearchcontaier">
        <div style="width: 50%">
          <el-input placeholder="Google image search" v-model="imageName">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchImage"
            ></el-button>
          </el-input>
        </div>
        <ul class="infinite-list" style="overflow: auto">
          <li
            @click="selectImage(index)"
            v-for="(item, index) in imagesList"
            :class="`infinite-list-item ${
              index === imageSelectedIndex ? 'imageSelected' : ''
            }`"
            :key="index"
          >
            <div
              class="innerImage"
              :style="`background-image:url('${item.link}')`"
            ></div>
          </li>
        </ul>
        <el-button-group style="margin-top: 10px">
          <el-button
            type="primary"
            :disabled="imageSelectedIndex === -1"
            @click="doneSelect"
            >select</el-button
          >
          <el-button
            type="info"
            style="margin-left: 10px"
            @click="closeImageSearch"
            >cancel</el-button
          >
        </el-button-group>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { ModalEventsNameEnum } from "@/socket/socketEvents";
import GooglePicker from "@/utils/googlePicker";
import { hideLoading, showLoading, showToast } from "@/utils/loading";
import { getOnlineImage } from "@/model";
import googleImageSearch from "./googleImageSearch.vue";
import GoogleYoutubeVedio from "./googleYoutubeVedio.vue";
export default {
  components: {
    googleImageSearch,
    GoogleYoutubeVedio,
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
      starttime: 0,
      endtime: 0,
      distroyOnClose: true,
    };
  },
  mounted() {},
  methods: {
    onSuccess(response, file, fileList) {
      // console.log(response.data, file, fileList);
      const name = file.name;
      let type = "image";
      if (name.indexOf("mp4") > -1) {
        type = "video";
      }
      EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
        type,
        url: response.data,
      });
    },
    addyoutube() {
      this.showYoutube = true;
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
    closeYoutubeDialog() {
      this.youtubeurl = null;
      this.withKeyUrl = null;
      this.showIframe = false;
      this.endtime = 0;
      this.starttime = 0;
    },
    addDrive() {
      GooglePicker.init((type, res) => {
        if (res) {
          // // console.log('===done', data, d)
          const { data } = JSON.parse(res);
          EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
            type: "image",
            url: data,
          });
          hideLoading();
        }
      });
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

      getOnlineImage(imageUrl).then((url) => {
        hideLoading();
        this.closeImageSearch();
        // console.log(url)
        EventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
          type: "image",
          url,
        });
      });
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
</style>