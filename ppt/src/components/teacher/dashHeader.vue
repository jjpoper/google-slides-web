<template>
  <div class="header">
    <div class="left-area">
      <i class="online"  :style="`background-color: ${onLine ? 'green' : 'rgba(255, 26, 14, 1);'}`"></i>
      <p>课程标题：{{className}}</p>
      <div class="more-icon"><i></i><i></i><i></i></div>
    </div>
    <div class="invite-button" @click="share">
      <img src="../../assets/picture/invite.png" class="invite"/>
      <span>Invite</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    share: {
      type: Function,
      default: null
    },
    onLine: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: false,
    },
  }
}
</script>
<style scoped>
.header{
  width: 100%;
  height: 50px;
  background-color: #fff;
  position: fixed;
  top: 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 100px;
}
.invite-button{
  width: 120px;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(21, 195, 154, 1);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #FFFFFF;
  cursor: pointer;
}
.invite{
  width: 23px;
  height: 25px;
  margin-right: 10px;
}
.left-area{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 19px;
  color: #36425A;
}
.online{
  width: 18px;
  height: 18px;
  border-radius: 9px;
  margin-right: 10px;
}
.more-icon{
  margin-left: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  cursor: pointer;
}
.more-icon >i{
  margin: 0 2.5px;
  background: #92B2D1;
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
</style>