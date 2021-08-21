<template>
  <div class="page">
    <div class="content">
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
    </div>
  </div>
</template>



<style scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.99;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
}
.content {
  width: 80%;
  height: 90%;
  background-color: #0f3538;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title_text {
  width: 626px;
  height: 40px;
  font-size: 24px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #ffffff;
  opacity: 1;
  margin-top: 40px;
}
.image_cotent {
  width: 150px;
  height: 150px;
  margin-top: 30px;
}
.content_text {
  width: 614px;
  height: 112px;
  font-size: 18px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 30px;
  color: #ffffff;
  opacity: 1;
}
.opt_area {
  width: auto;
  display: flex;
  margin-top: 10px;
}
.confirm_btn {
  width: 120px;
  height: 40px;
  background: #15c39a;
  opacity: 1;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
}
/* .confirm_btn:hover {
  background: #1a8dbe;
} */

.cancel_btn {
  width: 120px;
  height: 40px;
  background: #d7d9d9;
  border: 1px solid #bcbcbc;
  opacity: 1;
  border-radius: 25px;
  cursor: pointer;
  margin-left: 10px;
  color: #000;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
}
/* .cancel_btn:hover {
  background: #c0c0c0;
  color: #29abe2;
} */
</style>

<script>
export default {
  props: {
    confirmModeChange: {
      type: Function
    },
    cancelModeChange: {
      type: Function
    }
  }
};
</script>