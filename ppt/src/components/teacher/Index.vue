<template>
  <div v-if="currentAnswerCount > 0" class="page">
    <choiceItem v-if="type === 'choice'" v-bind="$attrs" />
    <textItem
      v-else-if="type === 'text' || type === 'number'"
      v-bind="$attrs"
      :textList="textList"
    />
    <draw v-else-if="type === 'draw'" v-bind="$attrs" />
  </div>
  <div class="page center" v-else>
    <div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    Waiting For Responses
  </div>
</template>

<style scoped>
.page {
  display: flex;
  width: 100%;
  height: auto;
}
.center {
  height: 100%;
  justify-content: center;
  align-items: center;
}
.loadEffect {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  position: relative;
 
}
.loadEffect span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #409EFF;
  position: absolute;
  -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
  0% {
    -webkit-transform: scale(1.2);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(0.3);
    opacity: 0.5;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -10px;
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
  margin-left: -10px;
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
  margin-top: -10px;
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
  margin-left: -10px;
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
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    currentAnswerCount: {
      type: Number,
      default: 0,
    },
    textList: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  components: {
    textItem,
    radioItem,
    choiceItem,
    draw,
  },
};
</script>