<template>
  <div class="copy_page">
    <img
      src="../../assets/icon/dash-close.png"
      width="20"
      height="20"
      class="close-btn"
      @click="closeBtn()"
    />

    <div class="content_1">
      <div class="password">
        {{getPass()}}
        <div class="copy-btn" @click="copyLink"></div>
      </div>
      <div class="title">{{ show_url }}</div>
      <div class="btn_class" @click="enterClassroom()">
        <img
          src="../../assets/picture/dash-lj.png"
          class="dash-share"
        />
        <p>Share link</p>
      </div>
       <img
        src="../../assets/picture/dash-log.png"
        class="dash-logo"
      />
    </div>

    <div class="bottom_div">
      <div class="online_text">
        <img
          v-if="getStudentCountString().indexOf('No')==-1"
          width="8px"
          height="8px"
          src="../../assets/icon/student_has.png"
          style="margin-right:5px;"
        />

        <img
          v-if="getStudentCountString().indexOf('No')!=-1"
          width="8px"
          height="8px"
          src="../../assets/icon/student_none.png"
          style="margin-right:5px;"
        />
        {{ getStudentCountString() }}
      </div>

      <div class="share-bottom">
        <img
          width="20"
          height="20"
          src="../../assets/picture/dash-lianj.png"
          style="margin-right:10px;"
        />
        <span class="bottom_text" style="cursor:pointer" @click="copyLink()">Share link to students</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom_text {
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: rgba(0, 0, 0, 1);
  opacity: 1;
}
.image {
  position: fixed;
  top: 25%;
  right: 15%;
}
.content_1 {
  display: flex;
  width: 100%;
  flex: 1;
  background-color: #fff;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.copy_page {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.close-btn{
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
}

.dash-logo{
  width: 75px;
  height: 81px;
  position: absolute;
  bottom: 0;
  left: 44px
}

.password {
  font-size: 81px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  color: #323232;
  position: relative;
  height: 95px;
}
.copy-btn{
  position: absolute;
  bottom: 0;
  right: -34px;
  width: 29px;
  height: 29px;
  background-image: url(../../assets/picture/fuzhi.png);
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: contain;
}

.title {
  background: #EDF0F3;
  border-radius: 30px;
  padding: 0 17px;
  line-height: 60px;
  box-sizing: border-box;
  font-size: 22px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  color: #15C39A;
  margin-top: 30px;
  width: 600px;
  text-align: left;
}

.url_copy {
  width: 80%;
  height: 50px;
  display: flex;
  align-items: center;
  border: 1px solid #afafaf;
  padding-left: 10px;
  padding-right: 10px;
}
.url_text {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.white_btn {
  width: 80px;
  height: 30px;
  border: 1px solid #afafaf;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
}
.white_btn:hover {
  background-color: #cfcfcf;
}

.lengther {
  width: 150px;
}
.btn_class {
  width: 200px;
  height: 60px;
  background: #15C39A;
  opacity: 1;
  border-radius: 30px;
margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btn_class >p{
font-size: 18px;
font-family: FZCuYuan-M03S;
font-weight: 400;
line-height: 24px;
color: #FFFFFF;
}

.bottom_div {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  background-color:rgba(237, 240, 243, 1);
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}
.online_text {
  display: flex;
  align-items: center;
  background-color: rgba(211, 216, 220, 1);
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  width: 180px;
  font-size: 12px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 19px;
  color: rgba(0, 0, 0, 1);
  opacity: 1;
}
.dash-share{
  width: 31px;
  height: 28px;
  margin-right: 15px;
}
.share-bottom{
  display: flex;
}
</style>

<script>
export default {
  props: {
    getStudentOnLineCount: {
      type: Function
    },
    url: {
      type: String,
      default: ""
    },
    copyLink: {
      type: Function
    },
    enterClassroom: {
      type: Function
    },
    setTimeDialogShow: {
      type: Function
    },
    currentMode: {
      type: String,
      default: ""
    },
    isDashboard: {
      type: Boolean,
      default: false
    },
    getBtnString: {
      type: Function
    },
    closeBtn: {
      type: Function
    }
  },
  data() {
    return {
      show_url: ""
    };
  },
  created() {
    let index = this.url.indexOf("?");
    if (index > -1) {
      this.show_url = this.url.substring(0, index);
    } else {
      this.show_url = this.url;
    }
  },
  methods: {
    getStudentCountString() {
      if (this.getStudentOnLineCount() == 0) {
        return "No student connected";
      } else if (this.getStudentOnLineCount() == 1) {
        return "1 student connected";
      } else {
        return this.getStudentOnLineCount() + " students connected";
      }
    },
    getPass() {
      return this.show_url.substring(this.show_url.lastIndexOf("/") + 1);
    }
  }
};
</script>