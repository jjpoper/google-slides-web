<template>
  <div class="page">
    <div class="input-class">
      <el-input
        class="input"
        placeholder="input website url"
        v-model="url"
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
          style="margin-top: 10px; cursor: pointer"
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
      v-if="iframeUrl"
      id="player"
      width="560"
      height="315"
      :src="iframeUrl"
    ></iframe>

    <div class="btn" @click="insert">next</div>
  </div>
</template>

<script>
export default {
  props: {
    nextWebSite: {
      type: Function,
    },
  },
  data() {
    return {
      url: "",
      iframeUrl: ''
    };
  },
  methods: {
    insert() {
      this.nextWebSite(this.url)
    },
    refreshVideo() {
      this.iframeUrl = this.url
    }
  },
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


