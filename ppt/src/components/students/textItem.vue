<template>
  <div class="parent">
    <div class="input_parent" v-for="(item,index) in arrList" :key="index">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="Please input somthing"
        v-model="item.content"
        @input="onInputText(index)"
        :disabled="showCorrect"
      ></el-input>
      <div class="el-input__icon" v-if="item.textSended">
        <i class="el-icon-edit-outline"></i>
      </div>
    </div>

    <div v-if="tipText&&tipText.length>0" class="tipArea">
      <img
        v-if="!showTips"
        src="../../assets/icon/tip_close.png"
        width="30"
        height="30"
        style="cursor:pointer"
        @click="showTip()"
      />
      <img
        v-if="showTips"
        src="../../assets/icon/tip_open.png"
        width="30"
        height="30"
        style="cursor:pointer"
        @click="showTip()"
      />
      <span v-if="showTips" class="textArea">{{tipText}}</span>
    </div>

    <div v-if="showCorrect" class="answer_text">{{data.items[0].data.answer}}</div>
    <el-switch
      v-if="hasAnswer()"
      v-model="showCorrect"
      :disabled="showCorrect"
      active-color="#13ce66"
      inactive-color="#999"
      @change="changeLocked('text')"
      active-text="show answer"
    />
    <el-button
      type="text"
      @click="addInput()"
      v-if="data.items[0].data.isMulti"
      :disabled="addDisable||showCorrect"
    >+Add Other One</el-button>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.textArea {
  display: flex;
  width: 100%;
  justify-content: start;
  margin-top: 10px;
}
.tipArea {
  display: flex;
  flex-direction: column;
  line-height: 20px;
}
.el-input__icon {
  position: relative;
  line-height: 25px;
  margin-top: -22px;
  margin-left: 93%;
}
.el-input__icon > i {
  cursor: pointer;
}
.input_parent {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}
.answer_text {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  line-height: 20px;
  background-color: #efefef;
  border: 1px solid #5f5f5f;
  border-radius: 5px;
  text-align: left;
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
import { getCurrentPageStudentAnswerList } from "@/model/data.student";
import { mapState } from "vuex";
export default {
  props: {
    method: { type: Function },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    answer: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      addDisable: false,
      maxCount: 3,
      inputCount: 1,
      arrList: getCurrentPageStudentAnswerList(
        this.data.page_id,
        SocketEventsEnum.TEXT_INPUT
      ),
      sendDelay: null,
      showCorrect: false,
      tipText: null,
      showTips: false
    };
  },
  computed: {
    ...mapState({
      elements: state => state.student.elements
    })
  },
  created() {
    if (!this.arrList || this.arrList.length == 0) {
      this.arrList.push({ content: "" });
    } else {
      for (let i = 0; i < this.arrList.length; i++) {
        if (this.arrList[i].locked) {
          this.showCorrect = true;
        }
      }
    }
    this.inputCount = this.arrList.length;
    if (this.elements) {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].type == "tip") {
          this.tipText = this.elements[i].tip;
        }
      }
    }
  },
  beforeDestroy() {
    this.clearDelay();
  },
  methods: {
    showTip() {
      this.showTips = !this.showTips;
    },
    addInput: function() {
      this.inputCount++;
      var item = { content: "", id: this.inputCount, textSended: false };
      this.arrList.push(item);
      this.addDisable = this.inputCount >= this.maxCount;
    },
    send: function(index) {
      this.arrList[index].textSended = true;
      var text = this.arrList[index].content;
      this.method(index, text, this.showCorrect);
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
      if (this.sendDelay) {
        clearTimeout(this.sendDelay);
        this.sendDelay = null;
      }
    },
    onInputText(index) {
      this.clearDelay();
      this.sendDelay = setTimeout(() => {
        this.send(index);
      }, 200);
    },
    changeLocked(type) {
      this.answer("text", true, type);
      let index = 0;
      for (let i = 0; i < this.arrList.length; i++) {
        if (this.arrList[i].content.length > 0) {
          index = i;
          break;
        }
      }
      this.send(index);
    },
    hasAnswer() {
      let answered = false;
      for (let i = 0; i < this.arrList.length; i++) {
        if (this.arrList[i].content.length > 0) {
          answered = true;
        }
      }
      return (
        this.data.items[0].data.answer &&
        this.data.items[0].data.answer.length > 0 &&
        answered
      );
    }
  }
};
</script>