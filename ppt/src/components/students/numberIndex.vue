<template>
  <div class="parent">
    <el-input type="number" @keyup.ctrl.enter.native="send()" v-model="numberValue"></el-input>
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
import { SocketEventsEnum } from "../../socket/socketEvents";
import { getCurrentPageStudentAnswerList } from '@/model/data.student';
export default {
  props: {
    method: { type: Function },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      numberValue: ''
    };
  },
  created(){
     const list = getCurrentPageStudentAnswerList(this.data.page_id, SocketEventsEnum.NUMBER_INPUT) || []
     if(list.length > 0) {
       this.numberValue = list[0].content
     }
  },
  computed: {
    
  },
  methods: {
    send: function() {
      console.log("pageid==", this.data.page_id);
      // saveStudentsDataList(
      //   this.data.page_id,
      //   this.arrList,
      //   SocketEventsEnum.NUMBER_INPUT
      // );
      this.method(0, this.numberValue);
    }
  }
};
</script>