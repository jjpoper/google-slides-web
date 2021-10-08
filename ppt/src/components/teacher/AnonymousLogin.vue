<template>
  <div class="page">
    <img src="../../assets/picture/invate_icon.png" width="316" height="178" />
    <div class="login_right">
      <img
        src="../../assets/picture/close_icon.png"
        style="
          width: 30px;
          height: 30px;
          margin-top: 10px;
          margin-left: 93%;
          cursor: pointer;
        "
        @click="closeBtn"
      />

      <span class="title_1">Invite students to study</span>
      <span class="title_2">Join at join.classcipe.com</span>
      <div class="class_number">{{ getPass }}</div>

      <div class="opt--item" style="margin-top: 30px">
        <span class="opt--text">Option</span>
        <div class="opt--value"></div>
      </div>

      <div class="opt--item">
        <span class="opt--text">Time</span>
        <div class="opt--value"></div>
      </div>

      <div class="opt--item">
        <span class="opt--text"></span>
        <div class="opt--value"></div>
      </div>

      <div class="opt--item">
        <span class="opt--text"></span>
        <div style="display: flex; width: 300px; align-items: center">
          <div style="flex: 1"></div>
          <div class="anonymous">Anonymous logins</div>
          <div
            class="anonymous--switch"
            :style="
              canAnonymous
                ? 'background-color: #15c39a;'
                : 'background-color: #afafaf;'
            "
            @click="anonymousBtnClicked"
          >
            <div
              class="white--flag"
              style="margin-left: 3px"
              v-if="!canAnonymous"
            ></div>
            <div style="flex: 1"></div>

            <div
              class="white--flag"
              style="margin-right: 3px"
              v-if="canAnonymous"
            ></div>
          </div>
        </div>
      </div>

      <div class="link--area">
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          "
          @click="copyLink(canAnonymous)"
        >
          <img
            src="../../assets/picture/link_icon.png"
            style="width: 40px; height: 40px"
          />
          <div class="link--text">copy link</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link--text {
  height: 27px;
  font-size: 16px;
  margin-top: 5px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #989da1;
  opacity: 1;
}
.link--area {
  width: 390px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
}
.white--flag {
  height: 22px;
  width: 22px;
  background-color: white;
  border-radius: 11px;
}
.anonymous--switch {
  width: 60px;
  height: 30px;
  background-color: #15c39a;
  border-radius: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.anonymous {
  width: 131px;
  font-size: 16px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #989da1;
  opacity: 1;
}
.opt--item {
  display: flex;
  align-items: center;
  height: 50px;
}
.opt--value {
  height: 40px;
  width: 300px;
  flex: 1;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
}
.opt--text {
  height: 21px;
  font-size: 19px;
  font-family: Arial;
  font-weight: 400;
  line-height: 22px;
  color: #000000;
  opacity: 1;
  width: 90px;
}
.page {
  width: 937px;
  height: 770px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 16px;
}
.login_right {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.title_1 {
  height: 30px;
  font-size: 24px;
  font-family: Trebuchet MS;
  font-weight: 400;
  line-height: 30px;
  color: #070707;
  opacity: 1;
  margin-left: 90px;
}
.title_2 {
  height: 22px;
  font-size: 16px;
  font-family: Arial;
  font-weight: 400;
  line-height: 23px;
  color: #070707;
  opacity: 1;
  margin-left: 90px;
}
.close {
  position: fixed;
  right: 60px;
  height: 40px;
}
.class_number {
  height: 71px;
  font-size: 50px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #15c39a;
  margin-top: 40px;
  margin-left: 150px;
  margin-bottom: 20px;
  opacity: 1;
}
</style>

<script>
export default {
  props: {
    copyLink: {
      type: Function,
    },
    url: {
      type: String,
      default: "",
    },
    enterClassroom: {
      type: Function,
    },
    closeBtn: {
      type: Function,
    },
  },
  data() {
    return {
      canAnonymous: false,
      show_url: "",
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
  computed: {
    getPass() {
      return this.show_url.substring(this.show_url.lastIndexOf("/") + 1);
    },
  },
  methods: {
    anonymousBtnClicked() {
      this.canAnonymous = !this.canAnonymous;
    },
  },
};
</script>
