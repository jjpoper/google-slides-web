<template>
  <div class="parent">
    <div class="input_parent" v-for="(item,index) in arrList" :key="index">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="Please input somthing(Press Ctrl+Enter to send)"
        v-model="item.content"
        @input="onInputText(index)">
        </el-input>
        <div class="el-input__icon" v-if="item.textSended">
          <i class="el-icon-edit-outline"></i>
        </div>
    </div>
    <el-button type="text" @click="addInput()" :disabled="addDisable">+Add Other One</el-button>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.el-input__icon{
  position: relative;
  line-height: 25px;
  margin-top: -22px;
  margin-left: 93%;
}
.el-input__icon>i{
  cursor: pointer;
}
.input_parent {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}
/* .grid-content {
        border-radius: 4px;
        min-height: 100px;
        padding: 10px;
        border: 1px solid #e5e9f2;
    } */
el-input {
  color: #303133;
  font-family: "PingFang SC";
}
el-button {
  font-family: "Microsoft YaHei";
  font-size: large;
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
      addDisable: false,
      maxCount: 3,
      inputCount: 0,
      arrList: getCurrentPageStudentAnswerList(this.data.page_id, SocketEventsEnum.TEXT_INPUT),
      sendDelay: null
    };
  },
  created() {
    console.log("text template created!!"+this.arrList.length);
    if(!this.arrList||this.arrList.length==0){
        this.arrList.push({content:''})
    }
    this.inputCount = this.arrList.length;
  },
  beforeDestroy() {
    this.clearDelay()
  },
  methods: {
    addInput: function() {
      this.inputCount++;
      var item = { content: "", id: this.inputCount ,textSended:false};
      this.arrList.push(item);
      this.addDisable = this.inputCount >= this.maxCount;
    },
    send: function(index) {
      this.arrList[index].textSended = true
      var text = this.arrList[index].content;
      this.method(index, text);
      // if (text) {
      //   this.method(index, text);
      // } else {
        // this.$alert("Input some words!", "Note", {
        //   confirmButtonText: "Ok",
        //   callback: action => {}
        // });
      // }
    },
    clearDelay() {
      if(this.sendDelay) {
        clearTimeout(this.sendDelay)
        this.sendDelay = null
      }
    },
    onInputText(index) {
      this.clearDelay()
      this.sendDelay = setTimeout(() => {
        this.send(index)
      }, 200)
    }
  }
};
</script>