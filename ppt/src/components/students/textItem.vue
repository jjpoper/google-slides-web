<template>
  <div class="parent">
    <div class="input_parent" v-for="(item, index) in arrList" :key="index">
      <el-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 5 }"
        placeholder="Please input answer(s)"
        v-model="item.content"
        @input="onInputText(index)"
        @focus="onFocusIndex(index)"
        @blur="onBlurText"
        :disabled="showCorrect"
        :class="`${focusIndex !== index ? 'textblur' : ''}`"
        ref="inputText"
      ></el-input>
      <div class="el-input__icon" v-if="item.textSended">
        <i class="el-icon-edit-outline"></i>
      </div>
    </div>

    <div v-if="showCorrect" class="answer_text">{{ data.items[0].data.answer }}</div>
    <el-switch
      v-if="hasAnswer()"
      v-model="showCorrect"
      :disabled="showCorrect"
      active-color="#13ce66"
      inactive-color="#999"
      @change="changeLocked('text')"
      active-text="show answer"
    />
    <el-button v-if="showMore" type="text" @click="addInput()" :disabled="addDisable || showCorrect">+Add another option</el-button>
  </div>
</template>
<style>

.textblur textarea{
  background: rgba(153,153,153, 0.3) !important;
}
</style>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
  padding: 20px;
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
.textblur{
  cursor: pointer;
}
.textblur:hover{
  background-image: url(../../assets/picture/bianji.png);
  background-position:bottom 4px right 10px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
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
      maxCount: 5,
      inputCount: 1,
      arrList: getCurrentPageStudentAnswerList(
        this.data.page_id,
        SocketEventsEnum.TEXT_INPUT
      ),
      sendDelay: null,
      showCorrect: false,
      focusIndex: -1
    };
  },
  computed: {
    showMore () {
      if(this.arrList.length === 5) return false
      const item = this.arrList[this.arrList.length - 1]
      return item.content
    }
  },
  created() {
    if (!this.arrList || this.arrList.length == 0) {
      this.focusIndex = 0
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
  mounted() {
    if(this.focusIndex === 0) {
      setTimeout(() => {
        console.log(this.$refs.inputText[0])
        this.$refs.inputText[0].focus()
      }, 500)
    }
  },
  beforeDestroy() {
    this.clearDelay();
  },
  methods: {
    onBlurText() {
      this.focusIndex = -1
    },
    onFocusIndex(index) {
      this.focusIndex = index
    },
    addInput() {
      this.inputCount++;
      var item = { content: "", id: this.inputCount, textSended: false };
      this.arrList.push(item);
      this.addDisable = this.inputCount >= this.maxCount;
      this.onFocusIndex(this.inputCount - 1)
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
      }, 500);
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