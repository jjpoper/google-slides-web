<template>
  <div class="index_page">
    <numberIndex v-if="type === 'number'" v-bind="$attrs" />
    <textItem v-else-if="type === 'text'" v-bind="$attrs" />
    <choice v-else-if="type === 'choice'" v-bind="$attrs" />
    <website v-else-if="type === 'website'" v-bind="$attrs" />
    <draw v-else-if="type === 'draw'" v-bind="$attrs" />
    <studentAudioItem v-else-if="type=='media'" v-bind="$attrs" />
    <studentRemark v-else-if="type=='comment'" v-bind="$attrs" />
  </div>
</template>

<style scoped>
.index_page {
  width: 100%;
  height: 100%;
}
</style>

<script>
import numberIndex from "./numberIndex";
import textItem from "./textItem";
import choice from "./choice";
import website from "./website";
import draw from "./draw";
import studentAudioItem from "./studentAudioItem";
import studentRemark from "./studentRemark";
export default {
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  components: {
    numberIndex,
    textItem,
    choice,
    website,
    draw,
    studentAudioItem,
    studentRemark
  }
};
</script>