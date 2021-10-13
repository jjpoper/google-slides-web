<template>
  <div class="page">
    <img
      src="../../assets/picture/student_login_icon.png"
      style="width: 86.22px; height: 90.09px; margin-top: 10px"
    />

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="92"
      height="29"
      viewBox="0 0 92 29"
      style="margin-top: 10px"
    >
      <text id="Lasscipe" class="cls-1" transform="translate(0 23)">
        <tspan x="0" y="0">Classcipe</tspan>
      </text>
    </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="84"
      height="19"
      viewBox="0 0 84 19"
      style="margin-top: 5px"
    >
      <text
        id="Join_in_class"
        data-name="Join in class"
        class="cls-1-content"
        transform="translate(42 15)"
      >
        <tspan x="-41.125" y="0">Join in class</tspan>
      </text>
    </svg>

    <div class="line--text" v-if="false">
      <span class="class--text">Class</span>
      <span class="class--value">Myp12</span>
    </div>

    <div class="line--item" v-if="false">
      <div class="group--text">GROUP</div>
      <el-select placeholder="--Select your group--" v-model="group"></el-select>
    </div>

    <div
      class="line--item"
      @mouseenter="onNameMouseStatus(true)"
      @mouseleave="onNameMouseStatus(false)"
    >
      <div class="group--text">NAME</div>
      <div class="name--holder" v-if="!nameMouseStatus&&!name">Enter name</div>
      <el-input placeholder="Enter name" v-model="name" v-if="nameMouseStatus||name"></el-input>
    </div>

    <div class="btn--class" @click="joinRoom(name)">Join now</div>

    <img
      src="../../assets/btn_google_signin.png"
      width="240"
      height="50"
      style="margin-top:30px;cursor: pointer;"
      @click="googleLogin"
    />
  </div>
</template>

<style scoped>
.name--holder {
  display: flex;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 16px;
  color: #808191;
  opacity: 1;
  height: 40px;
  align-items: center;
}
.btn--class {
  width: 280px;
  height: 50px;
  margin-top: 50px;
  background: #14bc95;
  opacity: 1;
  border-radius: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-family: CHei3HKS-Bold, CHei3HKS;
  font-weight: 600;
  cursor: pointer;
}
.group--text {
  width: 36px;
  height: 14px;
  font-size: 12px;
  font-family: Inter-Bold;
  line-height: 16px;
  color: #808191;
  opacity: 1;
}

.line--item {
  width: 412px;
  height: 70px;
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: column;
  justify-content: center;
  background-color: #e4e4e4;
  border: 2px solid #15c39a00;
  border-radius: 10px;
  margin-top: 10px;
}
.line--item:hover {
  width: 412px;
  height: 70px;
  background: #ffffff;
  border: 2px solid #15c39a;
  opacity: 1;
}
.class--value {
  height: 19px;
  font-size: 16px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #323232;
  opacity: 1;
  margin-left: 20px;
}
.class--text {
  width: 40px;
  height: 19px;
  font-size: 16px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #15c39a;
  opacity: 1;
}
.line--text {
  width: 412px;
  height: 70px;
  display: flex;
  align-items: center;
}

.cls-1 {
  fill: #2c2a50;
  font-size: 24px;
  font-family: FZY4JW--GB1-0, FZCuYuan-M03S;
}

.cls-1-content {
  fill: #7174a0;
  font-size: 16px;
  font-family: FZY4JW--GB1-0, FZCuYuan-M03S;
}
.page {
  width: 520px;
  height: 600px;
  background-color: white;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<script>
export default {
  props: {
    joinRoom: {
      type: Function
    },
    googleLogin: {
      type: Function
    }
  },
  data() {
    return {
      group: "",
      name: "",
      nameMouseStatus: false
    };
  },
  methods: {
    anonymousBtnClicked() {},
    onNameMouseStatus(status) {
      this.nameMouseStatus = status;
    }
  }
};
</script>
