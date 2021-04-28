<template>
  <div v-if="currentAnswerCount > 0 || type === 'draw'" class="page">
    <choiceItem v-if="type === 'choice'" v-bind="$attrs"/>
    <textItem v-else-if="type === 'text' || type === 'number'" v-bind="$attrs" :textList="textList"/>
    <draw v-else-if="type === 'draw'"  v-bind="$attrs"/>
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
import textItem from './textItem'
import radioItem from './radioItem'
import choiceItem from './choiceItem'
import draw from './draw'
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
    textList:{
        type:Array,
        function() {
          return []
        },
    },
  },
  components: {
    textItem,
    radioItem,
    choiceItem,
    draw
  }
}
</script>