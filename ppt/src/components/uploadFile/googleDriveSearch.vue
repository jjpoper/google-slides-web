<template></template>

<style scoped>
</style>

<script>
import GooglePicker from "@/utils/googlePicker";
export default {
  data() {
    return {};
  },
  mounted() {
    GooglePicker.init((type, res) => {});
  },
};
</script>
