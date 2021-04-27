<template>
  <div v-if="currentAnswerCount > 0" class="page">
    <choiceItem v-if="type === 'choice'" v-bind="$attrs" />
    <textItem
      v-else-if="type === 'text' || type === 'number'"
      v-bind="$attrs"
    />
  </div>
  <div v-else>Waiting For Responses</div>
</template>

<style scoped>
.page {
  display: flex;
  width: 100%;
  height: auto;
}
</style>

<script>
import textItem from "./textItem";
import radioItem from "./radioItem";
import choiceItem from "./choiceItem";
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
  },
  components: {
    textItem,
    radioItem,
    choiceItem,
  },
};
</script>