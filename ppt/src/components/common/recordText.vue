<template>
<!-- <div>
  <textarea
    class="textarea"
    v-model="commentValue"
    placeholder="Leave a message for this comment..."
  ></textarea>
  
  <el-button type="primary" style="width: 100%" @click="sendMessage">send</el-button>
</div> -->
<div class="edit-area shadow">
  <div class="textarea-box">
    <textarea
      class="textarea"
      v-model="commentValue"
      placeholder=""
    ></textarea>
    <div class="text-placeholder" v-show="showPlaceholder">
      Lonve feedback for this ppt
    </div>
  </div>
  <div class="footer-button" @click="sendMessage">
    <div :class="`send-button ${!showPlaceholder && 'active'}`">Send</div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    onSend: {
      type: Function,
      default: () => null
    }
  },
  computed: {
    showPlaceholder() {
      return !this.commentValue
    }
  },
  data() {
    return {
      commentValue: ''
    }
  },
  methods: {
    sendMessage() {
      if (!this.commentValue) {
        this.$message.warning("Please input your comment");
        return;
      }
      this.onSend(this.commentValue, 'text')
    }
  }
}
</script>
<style scoped>
.shadow{
  box-shadow: 0px 1px 3px 3px rgb(0 0 0 / 16%);
  border-radius: 8px;
}
.textarea-box{
  width: 100%;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #D8D8D8;
  opacity: 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.textarea {
  background-color: transparent;
  width: 100%;
  height: 120px;
  padding: 5px;
  border: none;
  box-sizing: border-box;
  outline: none;
  resize: none
}
.edit-area{
  height: 220px;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  position: relative;
  margin-bottom: 5px;
}
.text-placeholder{
  position: absolute;
  top: 50%;
  height: 22px;
  transform: translateY(-11px);
  left: 20px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #828282;
  padding-right: 30px;
  text-align: right;
  background-image: url(../../assets/picture/pencial.png);
  background-size: 22px 22px;
  background-position: bottom 0 right 0;
  background-repeat: no-repeat;
  pointer-events: none;
}
.footer-button{
  margin-top: 19px;
  height: 40px;
  display: flex;
  justify-content: center;
}
.send-button{
  width: 160px;
  height: 40px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #F6F7F7;
  border: 1px solid #E5E5E5;
  line-height: 40px;
  font-size: 14px;
  font-family: Inter-Bold;
  color: #000000;
  background-image: url(../../assets/picture/send-disable.png);
  background-size: 22px 18.33px;
  background-position: bottom 9px right 37px;
  background-repeat: no-repeat;
  cursor: pointer;
}
.send-button.active{
  background: #15C39A;
  color: #FFFFFF;
  background-image: url(../../assets/picture/send.png);
  background-size: 22px 18.33px;
  background-position: bottom 9px right 20px;
  background-repeat: no-repeat;
}
</style>