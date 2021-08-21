<template>
  <div v-if="currentAnswerCount > 0" class="answer-box">
    <choiceItem v-if="type === 'choice'" v-bind="$attrs" :flag_1="flag_1" />
    <textItem
      v-else-if="type === 'text' || type === 'number'"
      v-bind="$attrs"
      :flag_1="flag_1"
    />
    <draw v-else-if="type === 'draw'" v-bind="$attrs" :flag_1="flag_1" />
    <remark-item v-else-if="type === 'comment'" v-bind="$attrs" :flag_1="flag_1" />

    <AudioItem v-else-if="type === 'media'" v-bind="$attrs" :flag_1="flag_1" />
  </div>
  <div class="page center" v-else-if="type!='website'">
    <div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>Waiting For Responses
  </div>
</template>

<style scoped>
.answer-box {
  width: 100%;
  height: 100%;
}
.center {
  height: 100%;
  justify-content: center;
  align-items: center;
}
.item {
  width: 90%;
  height: 100%;
  display: flex;
}
.loadEffect {
  width: 60px;
  height: 60px;
  margin: 10px auto;
  position: relative;
}
.loadEffect span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #409eff;
  position: absolute;
  -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
  0% {
    -webkit-transform: scale(1);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(0.5);
    opacity: 0.5;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  /* margin-top: -10px; */
  -webkit-animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14%;
  top: 14%;
  -webkit-animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  /* margin-left: -10px; */
  -webkit-animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14%;
  right: 14%;
  -webkit-animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  /* margin-top: -10px; */
  -webkit-animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14%;
  bottom: 14%;
  -webkit-animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  /* margin-left: -10px; */
  -webkit-animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14%;
  left: 14%;
  -webkit-animation-delay: 1.04s;
}
</style>

<script>
import textItem from "./textItem";
import radioItem from "./radioItem";
import choiceItem from "./choiceItem";
import draw from "./draw";
import AudioItem from "./AudioItem";
import RemarkItem from './remarkItem.vue';
export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    currentAnswerCount: {
      type: Number,
      default: 0
    },
    flag_1: {
      type: Boolean,
      default: false
    }
  },
  components: {
    textItem,
    radioItem,
    choiceItem,
    draw,
    AudioItem,
    RemarkItem
  }
};
</script>