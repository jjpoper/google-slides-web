<template>
<div class="edit-area">
  <div class="textarea-box">
    <textarea
      ref="textareaRecord"
      class="textarea"
      v-model="commentValue"
      placeholder=""
      :autofocus="true"
      spellcheck="false"
      @blur="onInputText"
      @change="changeInput"
    ></textarea>
    <!-- <div class="text-placeholder" v-show="showPlaceholder">
      Lonve feedback for this ppt
    </div> -->
  </div>
  <!-- <div class="footer-button" @click="sendMessage">
    <div :class="`send-button ${!showPlaceholder && 'active'}`">Send</div>
  </div> -->
</div>
</template>
<script>
export default {
  props: {
    onSend: {
      type: Function,
      default: () => null
    },
    cancel: {
      type: Function,
      default: () => null
    },
    defaultText: {
      type: String,
      default: ''
    }
  },
  computed: {
    showPlaceholder() {
      return !this.commentValue
    }
  },
  data() {
    return {
      commentValue: '',
      sendDelay: null,
    }
  },
  created() {
    this.commentValue = this.defaultText
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    focusInput() {
      this.$refs.textareaRecord.focus()
      window.remarkInputStatus = false
    },
    sendMessage() {
      if (!this.commentValue) {
        // this.$message.warning("Please input your comment");
        this.cancel()
        return;
      }
      this.onSend(this.commentValue, 'text')
    },
    clearDelay() {
      if (this.sendDelay) {
        clearTimeout(this.sendDelay);
        this.sendDelay = null;
      }
    },
    onInputText() {
      this.clearDelay();
      this.sendDelay = setTimeout(() => {
        // 换颜色时候不进行提交
        if(window.remarkInputStatus) {
          this.focusInput()
        } else {
          this.sendMessage();
        }
      }, 500);
    },
    changeInput() {
      window.remarkInputStatus = false
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
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #D8D8D8;
  opacity: 1;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  outline:none;
}
.textarea {
  background-color: transparent;
  width: 100%;
  height: 30px;
  padding: 5px;
  border: none;
  box-sizing: border-box;
  outline: none;
  resize: none
}
.edit-area{
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
  width: 80px;
  height: 30px;
  border-radius: 25px;
  box-sizing: border-box;
  background-color: rgba(208, 210, 223, 1);
  line-height: 30px;
  font-size: 12px;
  font-family: Inter-Bold;
  font-weight: bolder;
  color: rgba(255, 255, 255, 1);
  background-image: url(../../assets/picture/new-send.png);
  background-size: 14px 14px;
  background-position: bottom 8px right 16px;
  background-repeat: no-repeat;
  cursor: pointer;
  text-align: left;
  padding-left: 15px;
}
.send-button.active{
  background-color: #15C39A;
}
</style>