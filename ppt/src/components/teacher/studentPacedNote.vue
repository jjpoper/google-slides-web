<template>
  <div class="fullPage">
    <!-- <div class="content">
      <strong class="title_text">Your Students are in Student-Paced Mode</strong>

      <img src="../../assets/share_icon.png" height="200px" width="220px" />

      <p class="content_text">
        Navigating through slides in Student-Paced Mode will not affect the
        Projector or Student displays. To bring everyone back together, turn off
        Student-Paced.
      </p>

      <p class="content_text" style="margin-top:30px">
        To assign this for homework,send your students to
        <br />https://dev.classcipe.com/
      </p>

      <div class="opt_area">
        <div class="confirm_btn" @click="confirmModeChange()">
          <strong>Okay,Got It!</strong>
        </div>

        <div class="cancel_btn" @click="cancelModeChange()">
          <strong>Undo</strong>
        </div>
      </div>
    </div> -->

    <!-- <div class="lock-modal">
      <img
        src="../../assets/icon/dash-close.png"
        width="20"
        height="20"
        class="close-btn"
        @click="cancelModeChange()"
      />
      <p class="info title">Your Students are in Student-Paced Mode</p>
      <div class="detail">
        <img src="../../assets/picture/student-paced.png" class="teacher-lock"/>
        <p class="info">
          Navigating through slides in Student-Paced Mode will ont 
          affectthe Projector or Student displays.To bring everyone 
          back together,turn off Student-Paced.
           <br />
           To assign this for homework,send your students to
           <br />
           <span class="link">https://dev.classcipe.com/</span>
        </p>
      </div>
      <div class="bottom">
        <div class="confirm_btn" @click="confirmModeChange()">
          <strong>Okay,Got It!</strong>
        </div>

        <div class="confirm_btn cancel" @click="cancelModeChange()">
          <strong>Undo</strong>
      </div>
      </div>
    </div> -->

    <div class="lock-modal">
      <img
        src="../../assets/icon/dash-close.png"
        width="20"
        height="20"
        class="close-btn"
        @click="cancelModeChange()"
      />
      <p class="info title">Use Student-Paced Mode</p>
      <div class="detail">
        <img
          src="../../assets/picture/student-paced.png"
          class="teacher-lock"
        />
        <p class="info">
          <!-- Navigating through slides in Student-Paced Mode will ont affectthe
          Projector or Student displays.To bring everyone back together,turn off
          Student-Paced.
          <br />
          To assign this for homework,send your students to
          <br />
          <span class="link">https://dev.classcipe.com/</span> -->
        </p>
      </div>
      <div class="bottom">
        <div class="confirm_btn" @click="confirmModeChange()">
          <strong>Confirm</strong>
        </div>

        <div class="confirm_btn cancel" @click="cancelModeChange()">
          <strong>Cancel</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullPage {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 999999;
  position: fixed;
  top: 0;
}
.lock-modal {
  width: 90%;
  height: 510px;
  position: relative;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 20px;
}
.detail {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}
.close-btn {
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
}
.teacher-lock {
  width: 30%;
  /* height: 306px; */
  margin-right: 20px;
}
.info {
  font-size: 22px;
  font-family: FZCuYuan-M03S;
  font-weight: 700;
  line-height: 43px;
  color: #05272a;
  text-align: left;
}
.title {
  font-size: 34px;
  text-align: center;
}
.link {
  color: rgba(21, 195, 154, 1);
}
.bottom {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(237, 240, 243, 1);
}
.confirm_btn {
  padding: 0 30px;
  height: 50px;
  background: #15c39a;
  opacity: 1;
  border-radius: 25px;
  color: #fff;
  font-size: 18px;
  font-family: FZCuYuan-M03S;
  font-weight: 700;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}
.cancel {
  background-color: rgba(188, 188, 188, 1);
  color: rgba(17, 20, 45, 1);
  margin-left: 40px;
}
</style>

<script>
export default {
  props: {
    confirmModeChange: {
      type: Function,
    },
    cancelModeChange: {
      type: Function,
    },
  },
};
</script>