<template>
  <div class="page">
    <div class="url_copy">
      <div class="url_text">{{ url }}</div>

      <div class="white_btn" @click="copyLink()">Copy</div>
    </div>

    <div class="btn_class" @click="enterClassroom()">
      {{ isDashboard ? "Enter dashboard" : "Enter classroom" }}
    </div>

    <div class="bottom_div">
      <div class="online_text">
        {{ getStudentOnLineCount() }} student online
      </div>

      <div
        class="white_btn lengther"
        @click="setTimeDialogShow()"
        v-if="currentMode == 'Student-Paced'"
      >
        Set feedback failure
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 40px;
  width: 150px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1296db;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}
.btn_class:hover {
  background-color: #3087b7;
}

.bottom_div {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 30px;
  align-items: center;
}
.online_text {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}
</style>

<script>
export default {
  props: {
    getStudentOnLineCount: {
      type: Function,
    },
    url: {
      type: String,
      default: "",
    },
    copyLink: {
      type: Function,
    },
    enterClassroom: {
      type: Function,
    },
    setTimeDialogShow: {
      type: Function,
    },
    currentMode: {
      type: String,
      default: "",
    },
    isDashboard: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>