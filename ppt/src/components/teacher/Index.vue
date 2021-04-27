<template>
<<<<<<< HEAD
  <div v-if="currentAnswerCount > 0" class="page">
    <choiceItem v-if="type === 'choice'" v-bind="$attrs" />
    <textItem
      v-else-if="type === 'text' || type === 'number'"
      v-bind="$attrs"
    />
=======
  <div v-if="currentAnswerCount > 0 || type === 'draw'">
    <radioItem v-if="type === 'choice'" v-bind="$attrs"/>
    <textItem v-else-if="type === 'text' || type === 'number'" v-bind="$attrs"/>
    <draw v-else-if="type === 'draw'"  v-bind="$attrs"/>
>>>>>>> 18344d01f78d1c1b157bbe77db47c10cf42af230
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
<<<<<<< HEAD
import textItem from "./textItem";
import radioItem from "./radioItem";
import choiceItem from "./choiceItem";
=======
import textItem from './textItem'
import radioItem from './radioItem'
import draw from './draw'
>>>>>>> 18344d01f78d1c1b157bbe77db47c10cf42af230
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
<<<<<<< HEAD
    choiceItem,
  },
};
=======
    draw
  }
}
>>>>>>> 18344d01f78d1c1b157bbe77db47c10cf42af230
</script>