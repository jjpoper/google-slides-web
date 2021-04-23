<template>
  <div class="parent">
    <el-input type="number" @keyup.ctrl.enter.native="send()" v-model="arrList[0].value"></el-input>
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
import { saveStudentsDataList, getStudentsDataList,getNumberList } from "../../utils/store";
import { SocketEventsEnum } from "../../socket/socketEvents";
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
      arrList: getNumberList(this.data.page_id, SocketEventsEnum.NUMBER_INPUT)
    };
  },
  created(){
     
  },
  computed: {
    
  },
  methods: {
    send: function() {
      console.log("pageid==", this.data.page_id);
      saveStudentsDataList(
        this.data.page_id,
        this.arrList,
        SocketEventsEnum.NUMBER_INPUT
      );
      this.method(0, this.arrList[0].value);
    }
  }
};
</script>