<template>
  <div class="answer-box">
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
</template>

<style scoped>
.answer-box {
  width: 100%;
  height: 100%;
}
</style>

<script>
import textItem from "./textItem";
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
    choiceItem,
    draw,
    AudioItem,
    RemarkItem
  },
};
</script>