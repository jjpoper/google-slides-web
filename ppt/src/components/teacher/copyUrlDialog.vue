<template>
  <div class="copy_page">
    <img
      src="../../assets/icon/close_btn.png"
      width="20"
      height="20"
      style="padding:5px;margin-left:95%;margin-top:15px;cursor: pointer;"
      @click="closeBtn()"
    />

    <div class="content_1">
      <div class="content_2">
        <div class="title">{{ show_url }}</div>
        <div class="password">{{getPass()}}</div>
        <div class="btn_class" @click="enterClassroom()">
          <img
            src="../../assets/icon/wait_icon.png"
            v-if="getBtnString().indexOf('Waiting')>-1"
            width="15"
            height="20"
            style="margin-right:10px"
          />
          {{ getBtnString() }}
        </div>
      </div>
    </div>

    <div style="flex:1"></div>

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

      <img
        width="12px"
        height="12px"
        src="../../assets/icon/link_icon.png"
        style="margin-right:10px;margin-left:20%;"
      />
      <span class="bottom_text" style="cursor:pointer" @click="copyLink()">Share link to students</span>

      <img
        width="12px"
        height="12px"
        src="../../assets/icon/open_icon.png"
        style="margin-right:10px;margin-left:15%;"
      />
      <span
        class="bottom_text"
        style="cursor:pointer"
        @click="setTimeDialogShow()"
      >Set feedback failure</span>
    </div>
    <!-- <div class="url_copy">
      getStudentCountString().indexOf('No')==-1
      <div class="url_text">{{ url }}</div>

      <div class="white_btn" @click="copyLink()">Copy</div>
    </div>

    <div class="btn_class" @click="enterClassroom()">{{ getBtnString() }}</div>

    <div class="bottom_div">
      <div class="online_text" v-if="!isDashboard">{{ getStudentCountString() }}</div>

      <div
        class="white_btn lengther"
        @click="setTimeDialogShow()"
        v-if="currentMode == 'Student-Paced'"
      >Set feedback failure</div>
    </div>-->
    <img src="../../assets/share_icon.png" width="350" height="280" class="image" />
  </div>
</template>

<style scoped>
.bottom_text {
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #ffffff;
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
}
.content_2 {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.copy_page {
  width: 100%;
  height: 100%;
  background: #0f3538;
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}

.password {
  width: 60%;
  height: 140px;
  border: 1px solid #245558;
  opacity: 1;
  margin-left: 10%;
  margin-top: 40px;
  font-size: 30px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #ffffff;
  opacity: 1;
  color: #ffffff;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

.title {
  width: 60%;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #245558;
  opacity: 1;
  margin-left: 10%;
  margin-top: 7%;
  font-size: 18px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 40px;
  color: #ffffff;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
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
  width: 25%;
  height: 40px;
  background: #15c39a;
  opacity: 1;
  border-radius: 20px;
  margin-top: -20px;
  margin-left: 27%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #ffffff;
}

.bottom_div {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 30px;
  align-items: center;
  background-color: #05272a;
}
.online_text {
  display: flex;
  align-items: center;
  background-color: #0f3538;
  height: 30px;
  border-radius: 15px;
  justify-content: center;
  width: 180px;
  font-size: 12px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 19px;
  color: #ffffff;
  margin-left: 20px;
  opacity: 1;
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