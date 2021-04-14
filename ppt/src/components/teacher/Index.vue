<template>
  <div v-if="currentAnswerCount > 0">
    <radioItem v-if="type === 'choice'" v-bind="$attrs"/>
    <textItem v-else-if="type === 'text' || type === 'number'" v-bind="$attrs"/>
  </div>
  <div v-else>Waiting For Responses</div>
</template>

<script>
import textItem from './textItem'
import radioItem from './radioItem'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    currentAnswerCount: {
      type: Number,
      default: 0
    }
  },
  components: {
    textItem,
    radioItem,
  }
}
</script>