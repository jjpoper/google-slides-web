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
const draw = () => import("./draw");
const numberIndex = () => import("./numberIndex");
const textItem = () => import("./textItem");
const choice = () => import("./choice");
const website = () => import("./website");
const studentAudioItem = () => import("./studentAudioItem");
const studentRemark = () => import("./studentRemark");
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