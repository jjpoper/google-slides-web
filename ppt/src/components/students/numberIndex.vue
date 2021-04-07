<template>
  <div class="parent">
    <el-input type="number" 
    @keyup.ctrl.enter.native="send()"
    v-model="number"></el-input>
  </div>
</template>
<style scoped>
el-input {
  color: #303133;
  font-family: "PingFang SC";
}

.parent {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
<script>
//import { saveStudentsDataList, getStudentsDataList } from "../../utils/store";
import { SocketEventsEnum } from "../../socket/socketEvents";
export default {
  props: {
    method: { type: Function },
    pageId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      number: 0
    };
  },
  methods: {
    send: function() {
      this.method(0, this.number);
    }
  }
};
</script>