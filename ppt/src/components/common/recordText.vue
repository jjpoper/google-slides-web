<template>
<div>
  <textarea
    class="textarea"
    v-model="commentValue"
    placeholder="Leave a message for this comment..."
  ></textarea>
  <el-button type="primary" style="width: 100%" @click="sendMessage">send</el-button>
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
.textarea {
  background-color: #fff;
  width: 200px;
  height: 120px;
  border: 1px solid #999;
}
</style>